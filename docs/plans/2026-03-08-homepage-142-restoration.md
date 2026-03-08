# Homepage 142 Restoration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restore the homepage presentation from PR `#142` while preserving the newer search-entry and merchant-navigation behavior added after it.

**Architecture:** Keep `HomePage.tsx` and `MerchantFeed.tsx` on the current `dev` behavior because their diffs versus `#142` are functional, not visual. Restore only the `Header.tsx` search-bar markup and styling to the `#142` layout, while retaining the `onSearchTap` callback wiring.

**Tech Stack:** React 18, TypeScript, Vitest, Testing Library, Vite

---

### Task 1: Lock the intended header behavior with a regression test

**Files:**
- Create: `src/features/customer/home/components/__tests__/Header.test.tsx`
- Modify: `src/features/customer/home/components/Header.tsx`

**Step 1: Write the failing test**

Add a test that renders `Header` with `onSearchTap` and asserts:
- the search input is present
- pressing on the input calls `onSearchTap`
- the header exposes only the notification button and the main mic/search action button (no extra inline action button inside the input row)

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/customer/home/components/__tests__/Header.test.tsx`
Expected: FAIL because the current header renders one extra button inside the search field.

### Task 2: Restore the #142 header layout without dropping navigation behavior

**Files:**
- Modify: `src/features/customer/home/components/Header.tsx`

**Step 1: Apply the minimal implementation**

Update `Header.tsx` so that:
- the search row matches the `#142` layout
- the input keeps `readOnly`, `onMouseDown`, and `onKeyDown` behavior when `onSearchTap` is provided
- the extra inline action button inside the input container is removed
- the outer mic CTA remains

**Step 2: Run the targeted test**

Run: `npx vitest run src/features/customer/home/components/__tests__/Header.test.tsx`
Expected: PASS

### Task 3: Verify the restoration did not break the branch

**Files:**
- Confirm unchanged: `src/features/customer/home/pages/HomePage.tsx`
- Confirm unchanged: `src/features/customer/home/components/MerchantFeed.tsx`

**Step 1: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

**Step 2: Run the full test suite used by CI**

Run: `npm run test:run`
Expected: PASS

**Step 3: Review diff**

Run: `git diff --stat`
Expected: only the new header test and the header restoration change are present.
