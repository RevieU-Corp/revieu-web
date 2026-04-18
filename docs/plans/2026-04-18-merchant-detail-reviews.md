# Merchant Detail Reviews Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Wire the merchant detail reviews surfaces to the live `GET /stores/:id/reviews` backend endpoint and remove the remaining placeholder/mock-only behavior.

**Architecture:** Extend the existing frontend reviews API layer with a store-scoped query method, map backend store review payloads into a stable frontend shape, and reuse that mapped data in both the inline merchant detail reviews tab and the dedicated reviews route. Keep the current visual language, but replace placeholder and mock content with loading, empty, and error states driven by real API responses.

**Tech Stack:** React 18, React Router, Axios, Vitest, Testing Library, TypeScript

---

### Task 1: Add store reviews API coverage

**Files:**
- Modify: `src/api/reviews.ts`
- Test: `src/api/__tests__/reviews.test.ts`

**Step 1: Write the failing test**

Add a test asserting `reviewsApi.listStoreReviews('278', { limit: 20, cursor: '11' })` calls `/stores/278/reviews` with params and maps backend review fields, including user profile, scores, comments, and cursor.

**Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/api/__tests__/reviews.test.ts`
Expected: FAIL because `listStoreReviews` does not exist yet.

**Step 3: Write minimal implementation**

Implement store review request/response types and add `listStoreReviews` to `reviewsApi`, sharing mapping helpers where possible without changing existing `list()` behavior.

**Step 4: Run test to verify it passes**

Run: `npm run test:run -- src/api/__tests__/reviews.test.ts`
Expected: PASS

### Task 2: Replace dedicated merchant reviews page mock behavior

**Files:**
- Modify: `src/features/customer/pages/MerchantDetailPage/MerchantReviewsPage.tsx`
- Modify: `src/features/customer/pages/MerchantDetailPage/components/ReviewListPage.tsx`
- Test: `src/features/customer/pages/MerchantDetailPage/__tests__/MerchantReviewsPage.test.tsx`

**Step 1: Write the failing test**

Add a page test that renders `/customer/merchant/278/reviews`, mocks `reviewsApi.listStoreReviews`, and asserts:
- loading transitions to real review content
- API receives the route store id
- empty state renders when the API returns no reviews

**Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/features/customer/pages/MerchantDetailPage/__tests__/MerchantReviewsPage.test.tsx`
Expected: FAIL because the page is still mock-only.

**Step 3: Write minimal implementation**

Refactor `ReviewListPage` to accept API-backed data props instead of hardcoded cards. Update `MerchantReviewsPage` to load store reviews, handle loading/error/empty states, and pass normalized data into the reusable list page.

**Step 4: Run test to verify it passes**

Run: `npm run test:run -- src/features/customer/pages/MerchantDetailPage/__tests__/MerchantReviewsPage.test.tsx`
Expected: PASS

### Task 3: Replace merchant detail reviews placeholder

**Files:**
- Modify: `src/features/customer/pages/MerchantDetailPage/components/RestaurantDetail.tsx`
- Test: `src/features/customer/pages/MerchantDetailPage/__tests__/RestaurantDetail.test.tsx`

**Step 1: Write the failing test**

Add a component test asserting that when the Reviews tab is selected:
- the component loads `/stores/:id/reviews` through `reviewsApi.listStoreReviews`
- review cards render from API data
- a real empty state appears when there are no reviews

**Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/features/customer/pages/MerchantDetailPage/__tests__/RestaurantDetail.test.tsx`
Expected: FAIL because the tab still renders placeholder copy.

**Step 3: Write minimal implementation**

Update `RestaurantDetail` to fetch reviews lazily when the reviews tab is opened, show a small API-backed review list, and surface loading/error/empty states in place of the placeholder text.

**Step 4: Run test to verify it passes**

Run: `npm run test:run -- src/features/customer/pages/MerchantDetailPage/__tests__/RestaurantDetail.test.tsx`
Expected: PASS

### Task 4: Verify integrated behavior

**Files:**
- Verify: `src/api/reviews.ts`
- Verify: `src/features/customer/pages/MerchantDetailPage/MerchantReviewsPage.tsx`
- Verify: `src/features/customer/pages/MerchantDetailPage/components/ReviewListPage.tsx`
- Verify: `src/features/customer/pages/MerchantDetailPage/components/RestaurantDetail.tsx`

**Step 1: Run focused test suite**

Run: `npm run test:run -- src/api/__tests__/reviews.test.ts src/features/customer/pages/MerchantDetailPage/__tests__/MerchantReviewsPage.test.tsx src/features/customer/pages/MerchantDetailPage/__tests__/RestaurantDetail.test.tsx`
Expected: PASS

**Step 2: Run build verification**

Run: `npm run build`
Expected: PASS

**Step 3: Review working tree**

Run: `git status --short`
Expected: only intended files are modified in the feature branch.
