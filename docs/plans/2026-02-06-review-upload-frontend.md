# Review Upload Frontend Enhancements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add client-side image compression/validation (<=10MB), global upload/submit alerts, and local draft persistence for review uploads.

**Architecture:** Introduce a compression helper and a file-prep helper (image/video validation) used by `ImageUploadGrid`. Add a localStorage-backed draft helper and wire autosave/load in `ReviewContext`. Expose upload/submit error state from context and render a dismissible banner in `WriteReviewPage`.

**Tech Stack:** React 18, TypeScript, Vite, Vitest, browser-image-compression, localStorage.

---

### Task 1: Add image compression helper

**Files:**
- Create: `src/features/customer/reviews/utils/imageCompression.ts`
- Create: `src/features/customer/reviews/utils/__tests__/imageCompression.test.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

**Step 1: Write the failing test**

```ts
import { describe, expect, it, vi } from 'vitest';
import imageCompression from 'browser-image-compression';
import { compressImageToLimit } from '../imageCompression';

vi.mock('browser-image-compression', () => ({
  default: vi.fn(),
}));

describe('compressImageToLimit', () => {
  it('returns compressed file and metadata', async () => {
    const input = new File([new Uint8Array([1, 2, 3])], 'a.jpg', { type: 'image/jpeg' });
    const output = new File([new Uint8Array([4, 5])], 'a.jpg', { type: 'image/jpeg' });
    (imageCompression as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(output);

    const result = await compressImageToLimit(input, { maxSizeMB: 10 });

    expect(result.file).toBe(output);
    expect(result.originalSize).toBe(input.size);
    expect(result.compressedSize).toBe(output.size);
  });

  it('throws if compressed file still exceeds limit', async () => {
    const input = new File([new Uint8Array([1])], 'a.jpg', { type: 'image/jpeg' });
    const output = new File([new Uint8Array([2])], 'a.jpg', { type: 'image/jpeg' });
    Object.defineProperty(output, 'size', { value: 11 * 1024 * 1024 });
    (imageCompression as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(output);

    await expect(compressImageToLimit(input, { maxSizeMB: 10 })).rejects.toThrow();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/features/customer/reviews/utils/__tests__/imageCompression.test.ts`  
Expected: FAIL (helper not implemented)

**Step 3: Write minimal implementation**

```ts
import imageCompression from 'browser-image-compression';

const BYTES_PER_MB = 1024 * 1024;

export async function compressImageToLimit(
  file: File,
  options: { maxSizeMB: number; maxWidthOrHeight?: number }
) {
  const compressed = await imageCompression(file, {
    maxSizeMB: options.maxSizeMB,
    maxWidthOrHeight: options.maxWidthOrHeight ?? 1920,
    useWebWorker: true,
  });

  const maxBytes = options.maxSizeMB * BYTES_PER_MB;
  if (compressed.size > maxBytes) {
    throw new Error('Compressed image exceeds size limit');
  }

  return {
    file: compressed,
    originalSize: file.size,
    compressedSize: compressed.size,
    compressionRatio: compressed.size / file.size,
  };
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test:run -- src/features/customer/reviews/utils/__tests__/imageCompression.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add package.json package-lock.json src/features/customer/reviews/utils/imageCompression.ts src/features/customer/reviews/utils/__tests__/imageCompression.test.ts
git commit -m "feat: add image compression helper"
```

---

### Task 2: Add file preparation helper and integrate in ImageUploadGrid

**Files:**
- Create: `src/features/customer/reviews/utils/filePreparation.ts`
- Create: `src/features/customer/reviews/utils/__tests__/filePreparation.test.ts`
- Modify: `src/features/customer/reviews/components/ImageUpload.tsx`

**Step 1: Write the failing test**

```ts
import { describe, expect, it, vi } from 'vitest';
import { prepareUploadEntry } from '../filePreparation';
import * as compression from '../imageCompression';

describe('prepareUploadEntry', () => {
  it('rejects oversized videos', async () => {
    const video = new File([new Uint8Array([1])], 'a.mp4', { type: 'video/mp4' });
    Object.defineProperty(video, 'size', { value: 12 * 1024 * 1024 });

    const result = await prepareUploadEntry(video, { maxSizeMB: 10 });
    expect(result.error).toBeTruthy();
  });

  it('compresses images and returns pending entry', async () => {
    const image = new File([new Uint8Array([1, 2, 3])], 'a.jpg', { type: 'image/jpeg' });
    vi.spyOn(compression, 'compressImageToLimit').mockResolvedValue({
      file: image,
      originalSize: image.size,
      compressedSize: image.size,
      compressionRatio: 1,
    });

    const result = await prepareUploadEntry(image, { maxSizeMB: 10 });
    expect(result.entry?.uploadState.status).toBe('pending');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/features/customer/reviews/utils/__tests__/filePreparation.test.ts`  
Expected: FAIL (helper not implemented)

**Step 3: Write minimal implementation**

```ts
import { compressImageToLimit } from './imageCompression';
import { UploadedImage } from '../types';

const ALLOWED_VIDEO_TYPES = new Set(['video/mp4', 'video/webm']);

export async function prepareUploadEntry(
  file: File,
  options: { maxSizeMB: number }
): Promise<{ entry?: UploadedImage; error?: string }> {
  const maxBytes = options.maxSizeMB * 1024 * 1024;

  if (file.type.startsWith('video/')) {
    if (!ALLOWED_VIDEO_TYPES.has(file.type)) {
      return { error: 'Unsupported video type' };
    }
    if (file.size > maxBytes) {
      return { error: 'Video exceeds 10MB limit' };
    }
    return { entry: buildEntry(file) };
  }

  if (file.type.startsWith('image/')) {
    const compressed = await compressImageToLimit(file, { maxSizeMB: options.maxSizeMB });
    return { entry: buildEntry(compressed.file, compressed) };
  }

  return { error: 'Unsupported file type' };
}

function buildEntry(
  file: File,
  compression?: { originalSize: number; compressedSize: number; compressionRatio?: number }
): UploadedImage {
  return {
    id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    file,
    url: URL.createObjectURL(file),
    thumbnail: URL.createObjectURL(file),
    type: file.type.startsWith('video/') ? 'video' : 'image',
    uploadState: { status: 'pending', progress: 0, retryCount: 0 },
    originalSize: compression?.originalSize ?? file.size,
    compressedSize: compression?.compressedSize ?? file.size,
    compressionRatio: compression?.compressionRatio,
    uploadProgress: 0,
  };
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test:run -- src/features/customer/reviews/utils/__tests__/filePreparation.test.ts`  
Expected: PASS

**Step 5: Integrate into ImageUploadGrid**

- Make `handleFileSelect` async and use `prepareUploadEntry` for each file.
- Update `accept` to `image/*,video/mp4,video/webm`.
- On error, create an error entry with `uploadState.status='error'` and `uploadState.error`.

**Step 6: Commit**

```bash
git add src/features/customer/reviews/components/ImageUpload.tsx src/features/customer/reviews/utils/filePreparation.ts src/features/customer/reviews/utils/__tests__/filePreparation.test.ts
git commit -m "feat: validate and prepare uploads before adding"
```

---

### Task 3: Add draft storage helper and autosave/load

**Files:**
- Create: `src/features/customer/reviews/utils/draftStorage.ts`
- Create: `src/features/customer/reviews/utils/__tests__/draftStorage.test.ts`
- Modify: `src/features/customer/reviews/contexts/ReviewContext.tsx`
- Modify: `src/features/customer/reviews/types/index.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { clearDraft, loadDraft, saveDraft } from '../draftStorage';

describe('draftStorage', () => {
  it('saves and loads draft data', () => {
    const draft = { reviewText: 'hello', tags: ['#food'], overallRating: 4 };
    saveDraft(draft);
    const loaded = loadDraft();
    expect(loaded?.reviewText).toBe('hello');
    clearDraft();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/features/customer/reviews/utils/__tests__/draftStorage.test.ts`  
Expected: FAIL (helper not implemented)

**Step 3: Write minimal implementation**

```ts
const STORAGE_KEY = 'review:draft';

export function saveDraft(data: Record<string, unknown>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadDraft<T = Record<string, unknown>>(): T | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as T) : null;
}

export function clearDraft() {
  localStorage.removeItem(STORAGE_KEY);
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test:run -- src/features/customer/reviews/utils/__tests__/draftStorage.test.ts`  
Expected: PASS

**Step 5: Wire autosave/load**

- Add `submitError?: string` and `draftNotice?: string` to `ReviewContextState`.
- Implement `LOAD_DRAFT` reducer case to merge draft data into `reviewData` and set `draftNotice`.
- Add a debounced `useEffect` in `ReviewContext` to serialize review data (excluding local `File` objects; include only completed `fileUrl` list) using `saveDraft`.
- Load draft on mount and dispatch `LOAD_DRAFT`.

**Step 6: Commit**

```bash
git add src/features/customer/reviews/contexts/ReviewContext.tsx src/features/customer/reviews/types/index.ts src/features/customer/reviews/utils/draftStorage.ts src/features/customer/reviews/utils/__tests__/draftStorage.test.ts
git commit -m "feat: add local draft persistence"
```

---

### Task 4: Global alert banners for upload/submit errors

**Files:**
- Modify: `src/features/customer/reviews/pages/WriteReviewPage.tsx`
- Modify: `src/features/customer/reviews/contexts/ReviewContext.tsx`

**Step 1: Write the failing test**

```ts
import { render, screen } from '@testing-library/react';
import WriteReviewPage from '../WriteReviewPage';

vi.mock('../contexts/ReviewContext', () => ({
  useReviewContext: () => ({
    state: {
      reviewData: { images: [], detailedRatings: {}, tags: [] },
      validationErrors: {},
      uploadState: { status: 'error', progress: 0, retryCount: 0, error: 'Upload failed' },
      draftState: { currentDraft: null, isAutoSaving: false, lastSaved: null, hasUnsavedChanges: false },
      aiState: { isStreaming: false, currentChunk: '', accumulatedText: '', error: null, progress: 0 },
      aiAssistantState: { isGenerating: false, suggestions: [], currentSuggestion: '', error: null, isVisible: false },
      isSubmitting: false,
      submitError: 'Submit failed',
    },
    actions: {
      updateImages: vi.fn(),
      updateText: vi.fn(),
      updateRating: vi.fn(),
      updateDetailedRating: vi.fn(),
      addTag: vi.fn(),
      removeTag: vi.fn(),
      validateForm: vi.fn(),
      uploadImages: vi.fn(),
      submitReview: vi.fn(),
      retryImage: vi.fn(),
    },
  }),
  ReviewProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

test('renders upload/submit banner', () => {
  render(<WriteReviewPage />);
  expect(screen.getByText(/upload failed/i)).toBeInTheDocument();
  expect(screen.getByText(/submit failed/i)).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/features/customer/reviews/pages/__tests__/WriteReviewPage.test.tsx`  
Expected: FAIL (banner not implemented)

**Step 3: Implement banners**

- Render a dismissible banner at top of page if `uploadState.error` or `submitError` exists.
- Add a `CLEAR_SUBMIT_ERROR` action and wire it to dismiss.

**Step 4: Run test to verify it passes**

Run: `npm run test:run -- src/features/customer/reviews/pages/__tests__/WriteReviewPage.test.tsx`  
Expected: PASS

**Step 5: Commit**

```bash
git add src/features/customer/reviews/pages/WriteReviewPage.tsx src/features/customer/reviews/contexts/ReviewContext.tsx src/features/customer/reviews/pages/__tests__/WriteReviewPage.test.tsx
git commit -m "feat: show global upload/submit alerts"
```

---

### Final Verification

Run: `npm run test:run`  
Expected: PASS (with existing React Router warnings)

