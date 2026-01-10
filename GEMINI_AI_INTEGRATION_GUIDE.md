# 🤖 Gemini AI 集成完整指南

## 📋 项目概述

在 Reviews 功能中集成 Google Gemini AI，实现智能评论辅助功能。用户可以基于评分获得AI生成的评论建议。

## 🎯 功能目标

- ✅ 基于用户评分生成个性化评论建议
- ✅ 支持中英文双语
- ✅ 流式输出，实时显示生成过程
- ✅ 适配不同业务类型（餐厅、酒店、零售等）
- ✅ 用户可选择采用或修改AI建议

---

## 📦 第一步：安装依赖包

### 1.1 安装 Gemini AI SDK
```bash
npm install @google/generative-ai
```

### 1.2 安装 TypeScript 类型支持
```bash
npm install --save-dev @types/node
```

### 1.3 验证安装
检查 `package.json` 确认依赖已添加：
```json
{
  "dependencies": {
    "@google/generative-ai": "^0.x.x"
  },
  "devDependencies": {
    "@types/node": "^x.x.x"
  }
}
```

---

## 🔧 第二步：环境配置

### 2.1 创建环境变量文件
创建 `.env.local` 文件：
```env
# Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# 其他环境变量
# VITE_API_BASE_URL=http://localhost:3000
```

### 2.2 获取 Gemini API Key
1. 访问 [Google AI Studio](https://aistudio.google.com/)
2. 登录 Google 账户
3. 点击 "Get API Key"
4. 创建新的 API Key
5. 复制并替换 `.env.local` 中的 `your_gemini_api_key_here`

### 2.3 安全注意事项
- ✅ `.env.local` 不会被提交到 Git
- ✅ 使用 `VITE_` 前缀让 Vite 访问环境变量
- ❌ 不要在代码中硬编码 API Key

---

## 🛠️ 第三步：创建 AI 服务文件

### 3.1 创建服务文件
文件路径：`src/features/reviews/services/geminiService.ts`

### 3.2 基础结构
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BusinessCategory } from '../types';

// 初始化 Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
```

### 3.3 定义接口类型
```typescript
// AI 辅助请求接口
export interface AIAssistRequest {
  overallRating: number;
  detailedRatings?: {
    quality: number;
    environment: number;
    service: number;
  };
  businessCategory: BusinessCategory;
  currentText?: string;
  language?: 'en' | 'zh';
  merchantName?: string;
}

// AI 辅助响应接口
export interface AIAssistResponse {
  suggestions: string[];
  fullReview?: string;
  error?: string;
}
```

### 3.4 核心功能函数
```typescript
// 1. 生成评论建议
export const generateReviewSuggestions = async (request: AIAssistRequest): Promise<AIAssistResponse> => {
  // 实现逻辑
};

// 2. 流式生成评论
export const generateReviewStream = async (
  request: AIAssistRequest,
  onChunk: (chunk: string) => void,
  onComplete: (fullText: string) => void,
  onError: (error: string) => void
): Promise<void> => {
  // 实现逻辑
};

// 3. 验证 API Key
export const validateGeminiAPI = async (): Promise<boolean> => {
  // 实现逻辑
};
```

---

## 📝 第四步：更新类型定义

### 4.1 更新 `src/features/reviews/types/index.ts`
添加 AI 相关类型：

```typescript
// AI 辅助状态
export interface AIAssistantState {
  isGenerating: boolean;
  suggestions: string[];
  currentSuggestion: string;
  error: string | null;
  isVisible: boolean;
}

// 扩展现有的 ReviewData 接口
export interface ReviewData {
  // ... 现有字段
  aiAssisted: boolean;
  aiSuggestions?: string[];
}

// 扩展现有的 ReviewContextActions 接口
export interface ReviewContextActions {
  // ... 现有方法
  generateAISuggestions: (request: AIAssistRequest) => Promise<void>;
  selectAISuggestion: (suggestion: string) => void;
  toggleAIAssistant: () => void;
  clearAISuggestions: () => void;
}
```

---

## 🎨 第五步：创建 AI 辅助组件

### 5.1 创建 AI 按钮组件
文件路径：`src/features/reviews/components/AIAssistantButton.tsx`

```typescript
import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface AIAssistantButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  disabled?: boolean;
}

const AIAssistantButton: React.FC<AIAssistantButtonProps> = ({
  onClick,
  isGenerating,
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isGenerating}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        disabled || isGenerating
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-[#990000] to-[#770000] text-white hover:shadow-lg hover:scale-105'
      }`}
    >
      {isGenerating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Sparkles className="w-4 h-4" />
      )}
      <span>{isGenerating ? 'Generating...' : 'AI Assist'}</span>
    </button>
  );
};

export default AIAssistantButton;
```

### 5.2 创建建议列表组件
文件路径：`src/features/reviews/components/AISuggestionsList.tsx`

```typescript
import React from 'react';
import { Check, RefreshCw } from 'lucide-react';

interface AISuggestionsListProps {
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
  onRegenerate: () => void;
  isGenerating: boolean;
}

const AISuggestionsList: React.FC<AISuggestionsListProps> = ({
  suggestions,
  onSelectSuggestion,
  onRegenerate,
  isGenerating
}) => {
  if (suggestions.length === 0 && !isGenerating) {
    return null;
  }

  return (
    <div className="mt-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-700">AI Suggestions</span>
        <button
          onClick={onRegenerate}
          disabled={isGenerating}
          className="text-xs text-[#990000] hover:text-[#770000] flex items-center space-x-1"
        >
          <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>Regenerate</span>
        </button>
      </div>
      
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="p-2 bg-white rounded-lg border border-gray-200 hover:border-[#990000] cursor-pointer transition-colors group"
            onClick={() => onSelectSuggestion(suggestion)}
          >
            <div className="flex items-start justify-between">
              <p className="text-sm text-gray-700 flex-1">{suggestion}</p>
              <Check className="w-4 h-4 text-gray-400 group-hover:text-[#990000] ml-2 flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AISuggestionsList;
```

---

## 🔄 第六步：更新 ReviewContext

### 6.1 添加 AI 状态管理
在 `src/features/reviews/contexts/ReviewContext.tsx` 中：

```typescript
// 添加到初始状态
const initialAIState: AIAssistantState = {
  isGenerating: false,
  suggestions: [],
  currentSuggestion: '',
  error: null,
  isVisible: false,
};

// 添加到 ReviewContextState
export interface ReviewContextState {
  // ... 现有字段
  aiState: AIAssistantState;
}

// 添加 Action 类型
type ReviewAction =
  // ... 现有 actions
  | { type: 'AI_START_GENERATING' }
  | { type: 'AI_SUGGESTIONS_RECEIVED'; payload: string[] }
  | { type: 'AI_ERROR'; payload: string }
  | { type: 'AI_TOGGLE_VISIBILITY' }
  | { type: 'AI_SELECT_SUGGESTION'; payload: string }
  | { type: 'AI_CLEAR_SUGGESTIONS' };
```

### 6.2 添加 Reducer 处理
```typescript
// 在 reviewReducer 中添加 AI 相关 cases
case 'AI_START_GENERATING':
  return {
    ...state,
    aiState: {
      ...state.aiState,
      isGenerating: true,
      error: null,
    },
  };

case 'AI_SUGGESTIONS_RECEIVED':
  return {
    ...state,
    aiState: {
      ...state.aiState,
      isGenerating: false,
      suggestions: action.payload,
      isVisible: true,
    },
  };

// ... 其他 AI cases
```

### 6.3 添加 Actions
```typescript
// 在 ReviewContextActions 中添加
const actions: ReviewContextActions = {
  // ... 现有 actions
  
  generateAISuggestions: useCallback(async (request: AIAssistRequest) => {
    dispatch({ type: 'AI_START_GENERATING' });
    
    try {
      const response = await generateReviewSuggestions(request);
      if (response.error) {
        dispatch({ type: 'AI_ERROR', payload: response.error });
      } else {
        dispatch({ type: 'AI_SUGGESTIONS_RECEIVED', payload: response.suggestions });
      }
    } catch (error) {
      dispatch({ type: 'AI_ERROR', payload: 'Failed to generate suggestions' });
    }
  }, []),

  selectAISuggestion: useCallback((suggestion: string) => {
    dispatch({ type: 'AI_SELECT_SUGGESTION', payload: suggestion });
    dispatch({ type: 'UPDATE_TEXT', payload: suggestion });
  }, []),

  // ... 其他 AI actions
};
```

---

## 🎨 第七步：集成到 WriteReviewPage

### 7.1 导入组件和服务
```typescript
import AIAssistantButton from '../components/AIAssistantButton';
import AISuggestionsList from '../components/AISuggestionsList';
import { AIAssistRequest } from '../services/geminiService';
```

### 7.2 添加 AI 辅助功能
在文本输入区域添加：

```typescript
// 在 textarea 下方添加
<div className="flex items-center justify-between mt-2">
  <div className="flex items-center space-x-2">
    {/* 现有的字符计数器 */}
  </div>
  
  {/* AI 辅助按钮 */}
  <AIAssistantButton
    onClick={handleAIAssist}
    isGenerating={state.aiState.isGenerating}
    disabled={!isFormValid}
  />
</div>

{/* AI 建议列表 */}
{state.aiState.isVisible && (
  <AISuggestionsList
    suggestions={state.aiState.suggestions}
    onSelectSuggestion={actions.selectAISuggestion}
    onRegenerate={handleAIAssist}
    isGenerating={state.aiState.isGenerating}
  />
)}
```

### 7.3 添加处理函数
```typescript
const handleAIAssist = useCallback(() => {
  const request: AIAssistRequest = {
    overallRating: state.reviewData.overallRating || 0,
    detailedRatings: state.reviewData.detailedRatings,
    businessCategory: BusinessCategory.RESTAURANT,
    currentText: state.reviewData.reviewText,
    language: 'en',
    merchantName: 'Sample Restaurant',
  };
  
  actions.generateAISuggestions(request);
}, [state.reviewData, actions]);
```

---

## 🧪 第八步：测试和验证

### 8.1 功能测试清单
- [ ] API Key 配置正确
- [ ] AI 按钮显示和点击
- [ ] 生成建议功能正常
- [ ] 选择建议功能正常
- [ ] 错误处理正常
- [ ] 加载状态显示正确
- [ ] 多语言支持正常

### 8.2 测试步骤
1. **启动开发服务器**：`npm run dev`
2. **访问写评论页面**：`http://localhost:5174/write-review`
3. **设置评分**：选择星级评分
4. **点击 AI Assist**：测试建议生成
5. **选择建议**：测试建议应用到文本框
6. **测试错误情况**：无网络、无效 API Key 等

### 8.3 调试技巧
```typescript
// 在 geminiService.ts 中添加调试日志
console.log('Gemini Request:', request);
console.log('Gemini Response:', response);

// 在 ReviewContext.tsx 中添加状态日志
console.log('AI State:', state.aiState);
```

---

## 🚀 第九步：优化和扩展

### 9.1 性能优化
- 使用 `useCallback` 和 `useMemo` 优化渲染
- 实现请求防抖，避免频繁调用 API
- 添加本地缓存，相同请求复用结果

### 9.2 用户体验优化
- 添加加载动画和进度指示
- 实现流式输出，实时显示生成过程
- 添加键盘快捷键支持

### 9.3 功能扩展
- 支持图片分析生成评论
- 添加评论风格选择（正式/随意/幽默）
- 实现评论质量评分和建议

---

## 📚 附录

### A.1 常见问题解决

**Q: API Key 无效怎么办？**
A: 检查 `.env.local` 文件，确保 API Key 正确且有效

**Q: 生成的建议质量不好？**
A: 调整 `generatePrompt` 函数中的提示词

**Q: 请求太慢怎么办？**
A: 使用流式生成 `generateReviewStream` 函数

### A.2 相关资源
- [Google Gemini AI 文档](https://ai.google.dev/docs)
- [React Context 最佳实践](https://react.dev/reference/react/useContext)
- [TypeScript 接口设计](https://www.typescriptlang.org/docs/handbook/interfaces.html)

---

## ✅ 完成检查清单

- [x] 依赖包安装完成
- [x] 环境变量配置完成
- [x] AI 服务文件创建完成
- [x] 类型定义更新完成
- [x] ReviewContext 更新完成
- [x] AI 组件创建完成
- [x] **WriteReviewPage 集成完成** ← **刚刚完成！**
- [ ] 功能测试通过
- [ ] 错误处理完善
- [ ] 用户体验优化

---

**🎉 恭喜！你已经成功集成了 Gemini AI 到 Reviews 功能中！**