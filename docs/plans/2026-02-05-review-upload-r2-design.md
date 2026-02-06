# Review 发布与 R2 图片上传设计

> **日期**: 2026-02-05  
> **状态**: 设计中  
> **作者**: AI Assistant

## 1. 概述

### 1.1 目标

实现用户发布 Review 的完整流程：
- 前端通过 Presigned URL 直接上传图片/视频到 Cloudflare R2
- 后端接收 Review 数据并存储到数据库
- 图片 URL 指向 R2 存储

### 1.2 方案选择

采用 **Presigned URL 方案**（方案 B）：

```
┌─────────┐  1. 请求 URL   ┌─────────┐  2. 生成 URL  ┌──────┐
│ Frontend│ ──────────────→│ Backend │ ──────────────→│  R2  │
│         │                │         │                │      │
│         │  3. 返回 URL   │         │                │      │
│         │ ←──────────────│         │                │      │
│         │                │         │                │      │
│         │  4. 直接上传   │         │                │      │
│         │ ────────────────────────────────────────→ │      │
│         │                │         │                │      │
│         │  5. 提交Review │         │  6. 存储DB    │      │
│         │ ──────────────→│         │ ──────────────→│  DB  │
└─────────┘                └─────────┘                └──────┘
```

**优势**:
- 减轻后端流量压力：大文件直接上传到 R2
- 更好的上传性能：前端可并行上传多张图片
- 节省后端带宽成本

---

## 2. API 设计

### 2.1 获取 Presigned URL

现有 OpenAPI 规范中已定义 `/media/uploads`，需要补充完善：

**Endpoint**: `POST /api/v1/media/uploads`

**Request Body**:
```json
{
  "files": [
    {
      "filename": "photo1.jpg",
      "contentType": "image/jpeg",
      "size": 1048576
    },
    {
      "filename": "photo2.png", 
      "contentType": "image/png",
      "size": 2097152
    }
  ]
}
```

**Response**:
```json
{
  "uploads": [
    {
      "id": "upload_abc123",
      "filename": "photo1.jpg",
      "uploadUrl": "https://r2-bucket.account.r2.cloudflarestorage.com/reviews/abc123.jpg?...",
      "fileUrl": "https://cdn.revieu.com/reviews/abc123.jpg",
      "expiresAt": "2026-02-05T17:30:00Z"
    },
    {
      "id": "upload_def456",
      "filename": "photo2.png",
      "uploadUrl": "https://r2-bucket.account.r2.cloudflarestorage.com/reviews/def456.png?...",
      "fileUrl": "https://cdn.revieu.com/reviews/def456.png",
      "expiresAt": "2026-02-05T17:30:00Z"
    }
  ]
}
```

**字段说明**:
| 字段 | 说明 |
|------|------|
| `id` | 上传任务的唯一标识，用于追踪 |
| `uploadUrl` | Presigned URL，前端直接 PUT 上传到此 URL |
| `fileUrl` | 上传完成后的 CDN 访问 URL，存入 Review |
| `expiresAt` | Presigned URL 过期时间，建议 15-30 分钟 |

### 2.2 创建 Review

**Endpoint**: `POST /api/v1/reviews`

**Request Body**:
```json
{
  "merchantId": "merchant_xyz",
  "overallRating": 4.5,
  "detailedRatings": {
    "quality": 5,
    "environment": 4,
    "service": 4
  },
  "text": "这家餐厅的菜品非常新鲜，环境也很舒适...",
  "images": [
    "https://cdn.revieu.com/reviews/abc123.jpg",
    "https://cdn.revieu.com/reviews/def456.png"
  ],
  "tags": ["#restaurant", "#food", "#service"],
  "locationVerified": false
}
```

**Response**:
```json
{
  "id": "review_001",
  "merchantId": "merchant_xyz",
  "userId": "user_123",
  "overallRating": 4.5,
  "detailedRatings": {
    "quality": 5,
    "environment": 4,
    "service": 4
  },
  "text": "这家餐厅的菜品非常新鲜，环境也很舒适...",
  "images": [
    "https://cdn.revieu.com/reviews/abc123.jpg",
    "https://cdn.revieu.com/reviews/def456.png"
  ],
  "tags": ["#restaurant", "#food", "#service"],
  "createdAt": "2026-02-05T16:45:00Z",
  "status": "pending_moderation"
}
```

---

## 3. 数据库设计

### 3.1 Reviews 表

```sql
CREATE TABLE reviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID NOT NULL REFERENCES merchants(id),
    user_id         UUID NOT NULL REFERENCES users(id),
    overall_rating  DECIMAL(2,1) NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    rating_quality  INTEGER CHECK (rating_quality >= 1 AND rating_quality <= 5),
    rating_environment INTEGER CHECK (rating_environment >= 1 AND rating_environment <= 5),
    rating_service  INTEGER CHECK (rating_service >= 1 AND rating_service <= 5),
    review_text     TEXT,
    images          TEXT[] DEFAULT '{}',  -- Array of R2 URLs
    tags            TEXT[] DEFAULT '{}',
    location_verified BOOLEAN DEFAULT FALSE,
    ai_assisted     BOOLEAN DEFAULT FALSE,
    character_count INTEGER DEFAULT 0,
    points_earned   INTEGER DEFAULT 0,
    moderation_status VARCHAR(20) DEFAULT 'pending',  -- pending, approved, flagged, rejected
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_reviews_merchant_id ON reviews(merchant_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_reviews_moderation_status ON reviews(moderation_status);
```

### 3.2 Media Uploads 表（可选，用于追踪上传状态）

```sql
CREATE TABLE media_uploads (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    original_filename VARCHAR(255),
    content_type    VARCHAR(100),
    file_size       BIGINT,
    r2_key          VARCHAR(500) NOT NULL,  -- R2 object key
    file_url        VARCHAR(500) NOT NULL,  -- CDN URL
    upload_status   VARCHAR(20) DEFAULT 'pending',  -- pending, uploaded, failed
    review_id       UUID REFERENCES reviews(id),  -- 关联到 review
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    expires_at      TIMESTAMPTZ  -- presigned URL 过期时间
);
```

---

## 4. 前端修改

### 4.1 需修改的文件

| 文件 | 修改内容 |
|------|----------|
| [ImageUpload.tsx](file:///home/wayne/workspace/repos/revieu-web/src/features/customer/reviews/components/ImageUpload.tsx) | 添加实际上传逻辑 |
| [ReviewContext.tsx](file:///home/wayne/workspace/repos/revieu-web/src/features/customer/reviews/contexts/ReviewContext.tsx) | 添加上传 action 和提交 review 逻辑 |
| [WriteReviewPage.tsx](file:///home/wayne/workspace/repos/revieu-web/src/features/customer/reviews/pages/WriteReviewPage.tsx) | 修改 submitReview 函数调用真实 API |
| [types/index.ts](file:///home/wayne/workspace/repos/revieu-web/src/features/customer/reviews/types/index.ts) | 更新 UploadedImage 类型 |
| `src/api/` | 新增 media API 和 reviews API 客户端 |

### 4.2 上传流程

```typescript
// 伪代码示例

async function submitReview() {
  setIsSubmitting(true);
  
  try {
    // Step 1: 获取 presigned URLs
    const pendingImages = images.filter(img => img.uploadState.status === 'pending');
    
    if (pendingImages.length > 0) {
      const { uploads } = await api.media.getUploadUrls({
        files: pendingImages.map(img => ({
          filename: img.file.name,
          contentType: img.file.type,
          size: img.file.size
        }))
      });
      
      // Step 2: 并行上传到 R2
      await Promise.all(uploads.map(async (upload, index) => {
        updateImageStatus(pendingImages[index].id, 'uploading');
        
        await fetch(upload.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': pendingImages[index].file.type },
          body: pendingImages[index].file
        });
        
        updateImageUrl(pendingImages[index].id, upload.fileUrl);
        updateImageStatus(pendingImages[index].id, 'complete');
      }));
    }
    
    // Step 3: 提交 Review
    const imageUrls = images.map(img => img.fileUrl || img.url);
    
    await api.reviews.create({
      merchantId,
      overallRating,
      detailedRatings,
      text: reviewText,
      images: imageUrls,
      tags
    });
    
    navigate('/home');
  } catch (error) {
    console.error('Submit failed:', error);
  } finally {
    setIsSubmitting(false);
  }
}
```

### 4.3 上传进度显示

```typescript
// 使用 XMLHttpRequest 监听上传进度
function uploadWithProgress(url: string, file: File, onProgress: (percent: number) => void) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });
    
    xhr.addEventListener('load', () => resolve(xhr));
    xhr.addEventListener('error', () => reject(new Error('Upload failed')));
    
    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });
}
```

---

## 5. 后端实现

### 5.1 技术栈

- **Runtime**: Go
- **R2 SDK**: `@aws-sdk/client-s3` (R2 兼容 S3 API)
- **Database**: PostgreSQL

### 5.2 R2 配置

```go
// 环境变量
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=revieu-media
R2_PUBLIC_URL=https://cdn.revieu.com  // 或 R2 public bucket URL
```

### 5.3 生成 Presigned URL

```go
func (s *MediaService) GeneratePresignedURL(ctx context.Context, req *UploadRequest) (*UploadResponse, error) {
    uploads := make([]UploadInfo, 0, len(req.Files))
    
    for _, file := range req.Files {
        // 生成唯一的 object key
        ext := filepath.Ext(file.Filename)
        objectKey := fmt.Sprintf("reviews/%s%s", uuid.New().String(), ext)
        
        // 生成 presigned PUT URL
        presignClient := s3.NewPresignClient(s.s3Client)
        presignedReq, err := presignClient.PresignPutObject(ctx, &s3.PutObjectInput{
            Bucket:      aws.String(s.bucketName),
            Key:         aws.String(objectKey),
            ContentType: aws.String(file.ContentType),
        }, func(opts *s3.PresignOptions) {
            opts.Expires = 15 * time.Minute
        })
        
        if err != nil {
            return nil, err
        }
        
        uploads = append(uploads, UploadInfo{
            ID:        uuid.New().String(),
            Filename:  file.Filename,
            UploadURL: presignedReq.URL,
            FileURL:   fmt.Sprintf("%s/%s", s.publicURL, objectKey),
            ExpiresAt: time.Now().Add(15 * time.Minute),
        })
    }
    
    return &UploadResponse{Uploads: uploads}, nil
}
```

---

## 6. 安全考虑

### 6.1 Presigned URL 安全

- [x] URL 有效期限制为 15 分钟
- [x] 限制单次请求最多 9 个文件
- [x] 限制单文件最大 10MB
- [x] 只允许特定 Content-Type (image/*, video/mp4, video/webm)

### 6.2 后端校验

- [ ] 验证用户已登录
- [ ] 验证 merchantId 存在
- [ ] 验证图片 URL 确实属于 RevieU 的 R2 bucket
- [ ] 内容审核（可后置异步处理）

### 6.3 R2 Bucket 配置

```
Bucket Policy:
- 只允许通过 presigned URL 上传
- 对象默认 private，通过 CDN 或 public URL 访问
- 设置 CORS 允许前端域名
```

---

## 7. 错误处理

### 7.1 上传失败

| 错误场景 | 处理方式 |
|----------|----------|
| Presigned URL 过期 | 重新获取 URL 并重试 |
| 网络中断 | 提示用户重试，保留已上传图片 |
| 文件过大 | 前端拦截，不发起请求 |
| 格式不支持 | 前端拦截，只接受支持的格式 |
| R2 服务不可用 | 显示错误提示，建议稍后重试 |

### 7.2 Review 提交失败

- 已上传的图片保留在 R2（后续可通过定时任务清理孤儿文件）
- 前端保留草稿，用户可重新提交

---

## 8. 后续优化（Phase 2）

- [ ] **图片压缩**: 前端上传前压缩图片
- [ ] **图片裁剪**: 支持用户裁剪图片
- [ ] **缩略图生成**: 上传后自动生成缩略图（通过 R2 Transform 或 Workers）
- [ ] **AI 图片分析**: 自动提取标签、检测 PII
- [ ] **草稿自动保存**: 定期保存草稿到 localStorage 或后端
- [ ] **断点续传**: 大文件分片上传

---

## 9. 实施计划

### Phase 1 (当前)

1. **后端**
   - [ ] 实现 `POST /media/uploads` 获取 presigned URL
   - [ ] 实现 `POST /reviews` 创建 Review
   - [ ] 配置 R2 bucket 和 CORS

2. **前端**
   - [ ] 修改 ImageUpload 组件实现真实上传
   - [ ] 修改 submitReview 调用真实 API
   - [ ] 添加上传进度显示
   - [ ] 错误处理和重试逻辑

3. **测试**
   - [ ] 单元测试
   - [ ] 端到端测试

### 预估工期

| 任务 | 时间 |
|------|------|
| 后端 API | 3-4 小时 |
| R2 配置 | 1 小时 |
| 前端修改 | 3-4 小时 |
| 测试 | 2 小时 |
| **总计** | **约 1-1.5 天** |
