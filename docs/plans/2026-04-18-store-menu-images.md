# Store Menu Images Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Let merchants upload multiple menu images per store and let customers view those uploaded menu images on the store detail page.

**Architecture:** Add a dedicated `menu_images` JSON field to the backend `stores` model and expose it through the existing store create/update/detail responses. Keep the merchant UI on the existing `/merchant/profile` page, but hydrate it from the owned store API and persist only the store-backed fields needed for menu images. Replace the customer menu mock with real `store.menu_images` rendering while preserving the current empty-state behavior when no images exist.

**Tech Stack:** Go, Gin, GORM, React, TypeScript, Vitest

---

### Task 1: Add backend test coverage for `menu_images`

**Files:**
- Modify: `/home/wayne/Desktop/workspace/repos/revieu-backend/.worktrees/feat-store-menu-images/apps/core/internal/domain/store/service/service_test.go`
- Modify: `/home/wayne/Desktop/workspace/repos/revieu-backend/.worktrees/feat-store-menu-images/apps/core/internal/router/openapi_v1_test.go`

**Step 1: Write a failing service test for create/detail/update**

Add a new service test that:
- creates a store with `MenuImages: []string{"https://cdn.test/menu-1.jpg"}`
- verifies the stored `menu_images` JSON is persisted
- updates the store with a replacement slice like `[]string{"https://cdn.test/menu-a.jpg", "https://cdn.test/menu-b.jpg"}`
- reloads the store and verifies the updated JSON exactly matches the new slice

**Step 2: Run only the new backend service test and verify RED**

Run:

```bash
go test ./internal/domain/store/service -run TestStoreServiceMenuImages -v
```

Expected: fail because `menu_images` is not yet modeled in the DTO/model/service.

**Step 3: Write a failing API test for public detail + merchant patch**

Add an API test that:
- creates a merchant-owned store
- `PATCH /api/v1/merchant/stores/:id` with `menu_images`
- `POST /api/v1/merchant/stores/:id/activate`
- `GET /api/v1/stores/:id`
- asserts the response contains `menu_images` with the uploaded URLs

**Step 4: Run only the new API test and verify RED**

Run:

```bash
go test ./internal/router -run TestStoreMenuImages -v
```

Expected: fail because request/response payloads do not yet support `menu_images`.

### Task 2: Implement backend `menu_images`

**Files:**
- Modify: `/home/wayne/Desktop/workspace/repos/revieu-backend/.worktrees/feat-store-menu-images/apps/core/internal/model/store.go`
- Modify: `/home/wayne/Desktop/workspace/repos/revieu-backend/.worktrees/feat-store-menu-images/apps/core/internal/domain/store/dto/store.go`
- Modify: `/home/wayne/Desktop/workspace/repos/revieu-backend/.worktrees/feat-store-menu-images/apps/core/internal/domain/store/service/service.go`
- Modify: `/home/wayne/Desktop/workspace/repos/revieu-backend/.worktrees/feat-store-menu-images/apps/core/cmd/app/migrate.go` only if needed for migration model coverage

**Step 1: Add the model field**

Add:

```go
MenuImages string `gorm:"type:jsonb;default:'[]'" json:"menu_images"`
```

to `model.Store`.

**Step 2: Add DTO request fields**

Add:

```go
MenuImages []string `json:"menu_images"`
```

to `CreateStoreRequest` and:

```go
MenuImages *[]string `json:"menu_images"`
```

to `UpdateStoreRequest`.

**Step 3: Persist the JSON**

In `StoreService.Create` and `StoreService.Update`:
- marshal `req.MenuImages`
- write the JSON string into `menu_images`
- leave existing `images` behavior unchanged

**Step 4: Run targeted backend tests and verify GREEN**

Run:

```bash
go test ./internal/domain/store/service -run TestStoreServiceMenuImages -v
go test ./internal/router -run TestStoreMenuImages -v
```

Expected: both pass.

### Task 3: Add frontend tests for merchant profile menu image persistence

**Files:**
- Create: `/home/wayne/Desktop/workspace/repos/revieu-web/.worktrees/feat-store-menu-images/src/features/merchant/profile/pages/__tests__/StoreProfile.test.tsx`
- Create or modify: `/home/wayne/Desktop/workspace/repos/revieu-web/.worktrees/feat-store-menu-images/src/features/merchant/profile/services/storeProfileService.ts`

**Step 1: Write a failing test for loading menu images**

Test that `StoreProfile`:
- loads the first owned store from `/merchant/stores?limit=1`
- shows its `menu_images`
- renders an empty state when the store has no `menu_images`

**Step 2: Write a failing test for saving menu images**

Test that clicking save after editing menu images sends:

```json
{ "menu_images": ["https://cdn.revieu.com/menu-1.jpg", "..."] }
```

to `PATCH /merchant/stores/:id`.

**Step 3: Run the new merchant profile tests and verify RED**

Run:

```bash
npm run test:run -- src/features/merchant/profile/pages/__tests__/StoreProfile.test.tsx
```

Expected: fail because `StoreProfile` is still using local mock state only.

### Task 4: Implement merchant-side menu image persistence

**Files:**
- Modify: `/home/wayne/Desktop/workspace/repos/revieu-web/.worktrees/feat-store-menu-images/src/features/merchant/profile/pages/StoreProfile.tsx`
- Create: `/home/wayne/Desktop/workspace/repos/revieu-web/.worktrees/feat-store-menu-images/src/features/merchant/profile/services/storeProfileService.ts`
- Modify: `/home/wayne/Desktop/workspace/repos/revieu-web/.worktrees/feat-store-menu-images/src/features/merchant/profile/index.ts` only if exports are needed

**Step 1: Add a small store profile service**

Implement helpers to:
- fetch `GET /merchant/stores?limit=1`
- patch `PATCH /merchant/stores/:id`
- normalize `menu_images` into `string[]`

**Step 2: Hydrate `StoreProfile` from the API**

Replace the hard-coded `mockStoreData` initialization path with:
- loading state
- error state
- data mapped from the first owned store

Keep the rest of the screen functional, but only persist the supported store-backed fields you need now.

**Step 3: Persist menu image edits**

On save:
- send `menu_images`
- update local state from the saved response
- keep the existing add/edit/delete interactions for multiple images

**Step 4: Run the merchant profile tests and verify GREEN**

Run:

```bash
npm run test:run -- src/features/merchant/profile/pages/__tests__/StoreProfile.test.tsx
```

Expected: pass.

### Task 5: Add frontend tests for customer menu rendering

**Files:**
- Modify: `/home/wayne/Desktop/workspace/repos/revieu-web/.worktrees/feat-store-menu-images/src/features/customer/pages/MerchantDetailPage/__tests__/RestaurantDetail.test.tsx`

**Step 1: Write a failing test for menu image rendering**

Test that after the store detail response includes:

```json
"menu_images": ["https://cdn.revieu.com/menu-1.jpg", "https://cdn.revieu.com/menu-2.jpg"]
```

the menu tab:
- shows the uploaded images
- does not show the old mocked message

**Step 2: Write a failing test for empty state**

Test that when `menu_images` is empty, the menu tab shows a clear “no menu uploaded yet” state.

**Step 3: Run the customer menu tests and verify RED**

Run:

```bash
npm run test:run -- src/features/customer/pages/MerchantDetailPage/__tests__/RestaurantDetail.test.tsx
```

Expected: fail because the customer menu tab still renders the mocked placeholder.

### Task 6: Implement customer-side menu image rendering

**Files:**
- Modify: `/home/wayne/Desktop/workspace/repos/revieu-web/.worktrees/feat-store-menu-images/src/features/customer/pages/MerchantDetailPage/components/RestaurantDetail.tsx`
- Reuse if helpful: `/home/wayne/Desktop/workspace/repos/revieu-web/.worktrees/feat-store-menu-images/src/features/customer/pages/MerchantDetailPage/components/MenuUploadWidget.tsx`

**Step 1: Extend the store shape**

Parse `menu_images` from the store detail payload into `string[]`.

**Step 2: Replace the mocked menu placeholder**

Render:
- a small gallery/grid when `menu_images.length > 0`
- the existing image zoom/view behavior if `MenuUploadWidget` can be reused cleanly
- a simple empty state when there are no uploaded menu images

**Step 3: Run the customer tests and verify GREEN**

Run:

```bash
npm run test:run -- src/features/customer/pages/MerchantDetailPage/__tests__/RestaurantDetail.test.tsx
```

Expected: pass.

### Task 7: Final verification

**Files:**
- Verify only; no file edits

**Step 1: Run backend verification**

Run:

```bash
go test ./internal/domain/store/...
go test ./internal/router -run 'TestStore(MenuImages|Detail|Create|Update)' -v
```

**Step 2: Run frontend verification**

Run:

```bash
npm run test:run -- src/features/merchant/profile/pages/__tests__/StoreProfile.test.tsx src/features/customer/pages/MerchantDetailPage/__tests__/RestaurantDetail.test.tsx src/features/customer/pages/MerchantDetailPage/__tests__/MerchantReviewsPage.test.tsx
npm run build
```

**Step 3: Manual API smoke check if needed**

After the backend is running with schema changes applied, verify:

```bash
curl -sS -i http://localhost:8080/api/v1/stores/<id>
curl -sS -i http://localhost:8080/api/v1/merchant/stores?limit=1
```

Confirm `menu_images` is present in both relevant payloads.
