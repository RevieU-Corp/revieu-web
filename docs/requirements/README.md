# RevieU Web Frontend Requirements Matrix (Based on Current Code)

> Last Updated: 2026-02-12  
> Goal: put current frontend implementation and target requirements into one matrix for planning and integration.
> Chinese Version (CN): [README.cn.md](./README.cn.md)

## 0. Legend

### Status Definitions

- `Implemented (Real API)`: main flow is wired to backend APIs and can be E2E tested.
- `Partially Implemented`: main flow runs, but still depends on mock data, missing parameters, or fallback-only behavior.
- `Mock/Local State`: frontend demo only, mainly `localStorage` / static data / simulated delay.
- `Not Implemented`: capability does not exist in this frontend repository.

### Priority Definitions

- `P0`: critical core flow.
- `P1`: important capability for UX and operations.
- `P2`: enhancement or ops/back-office capability.

### Backend Involvement Definitions

- Scope rule: `Backend Involvement` is judged by target production-ready behavior, not by whether current frontend mock can run.
- `Frontend Only`: no project backend API required; can be completed by frontend state or third-party SDK.
- `Backend Required`: requires project backend APIs, persistence, auth, or state transitions.

### Requirement ID Rules

- `Requirement ID` is the unique key in format `<PREFIX>-<NNN>`, e.g. `AUT-001`.
- Prefixes: `AUT`/`DIS`/`REV`/`COM`/`CPV`/`PRF`/`MRC`/`MSG`/`VER`/`ADM`.
- Rules: append only, never reuse; deprecated items keep ID and add `Deprecated` in notes.

### Documentation Maintenance Rules (Mandatory)

1. `## 2. Detailed Requirements Matrix` is the single source of truth.
2. `## 1`/`## 1.1`/`## 4` are derived views and must be backfilled from `## 2`.
3. Any requirement update must also update: `Backend Involvement`, `Priority`, `Current Status`, and `Notes`.
4. Every iteration must update `## 6. Change Log`.

### New Columns in Detailed Matrix

- `Owner`: currently default to `FE`/`FE-BE`/`TBD`; replace with actual names in each iteration.
- `Status Updated`: last date when the row status changed (ISO format).
- `Acceptance Criteria (GWT)`: minimum verifiable criterion in Given/When/Then format.
- `API Contract`: backend-required rows must link to field-level contract docs; frontend-only rows use `N/A`.

## 1. Overview Matrix (Module Level)

| Module | Core Requirement | Backend Involvement | Priority | Current Status | Code Evidence | Main Gap |
| --- | --- | --- | --- | --- | --- | --- |
| Auth System | login/register/Google OAuth/session restore | Backend Required | P0 | Partially Implemented | `src/features/auth/pages/LoginPage.tsx`, `src/features/auth/pages/RegisterPage.tsx`, `src/contexts/AuthContext.tsx` | verification-code signup, email verification, refresh token flow are still missing |
| Customer Discovery | home search/filter, discover, map explore, merchant detail | Backend Required | P0 | Partially Implemented | `src/features/customer/home/pages/HomePage.tsx`, `src/features/customer/home/components/Header.tsx`, `src/features/customer/home/components/FeatureBar.tsx`, `src/features/customer/discover/pages/DiscoverPage.tsx`, `src/features/customer/explore/pages/ExplorePage.tsx` | merchant/recommendation data still largely static; home search/filter linkage is partial |
| Review System | write review, media upload, ratings, draft, publish | Backend Required | P0 | Partially Implemented | `src/features/customer/reviews/pages/WriteReviewPage.tsx`, `src/features/customer/reviews/contexts/ReviewContext.tsx`, `src/api/reviews.ts` | `merchantId/venueId` TODO remains; some interactions are UI-only |
| Community/Post System | review feed, post detail, like/comment/share | Backend Required | P1 | Mock/Local State | `src/features/customer/reviews/pages/ReviewsPage.tsx`, `src/features/customer/reviews/pages/PostPage.tsx` | static mock data; interactions not persisted via API |
| Coupon + Payment + Voucher | claim coupon, pay, voucher/QR/share | Backend Required | P0 | Partially Implemented | `src/features/customer/pages/PaymentPage.tsx`, `src/features/customer/pages/CouponPaymentSuccessPage.tsx`, `src/features/customer/shared/services/couponService.ts` | payment is simulated; coupon service still partially mock |
| User/Profile System | profile, settings, my reviews, pending reviews | Backend Required | P1 | Partially Implemented | `src/features/customer/profile/pages/ProfilePage.tsx`, `src/features/customer/profile/pages/ProfileSettingsPage.tsx` | settings/metrics still mostly static |
| Merchant Console | dashboard, marketing, store profile, replies | Backend Required | P1 | Mock/Local State | `src/features/merchant/dashboard/pages/MerchantDashboard.tsx`, `src/features/merchant/profile/pages/StoreProfile.tsx` | operational data is mostly mock |
| Merchant Messages | thread list/detail/search/group/settings | Backend Required | P1 | Mock/Local State | `src/features/merchant/messages/pages/Messages.tsx`, `src/features/merchant/messages/pages/ChatDetail.tsx` | all flows rely on local storage; no server-side messaging |
| Merchant Verification | onboarding verification workflow | Backend Required | P1 | Mock/Local State | `src/features/merchant/profile/pages/VerificationPage.tsx`, `src/features/merchant/profile/components/VerificationModal.tsx` | submission/review/status transitions are simulated |
| Admin System | restaurant/user/content admin | Backend Required | P2 | Not Implemented | - | no admin routes/modules in this frontend repo |

## 1.1 Backend Involvement Index (By Requirement IDs)

> This section is a quick navigation index only. Final truth is in `## 2` by requirement row.

| Module | Frontend-Only IDs (sample) | Backend-Required IDs (sample) | Maintenance Note |
| --- | --- | --- | --- |
| Auth System | `AUT-008`, `AUT-012`, `AUT-013` | `AUT-001`~`AUT-007`, `AUT-009`~`AUT-011` | auth-chain changes should update `AUT-001`~`AUT-007` first |
| Customer Discovery | - | `DIS-001`~`DIS-010` | target behavior is data-query/detail driven |
| Review System | `REV-001`, `REV-002`, `REV-005`, `REV-006`, `REV-008` | `REV-003`, `REV-004`, `REV-007` | publishing depends on `REV-003` + `REV-004` |
| Community/Post System | - | `COM-001`~`COM-005` | currently mock, target needs backend persistence |
| Coupon + Payment + Voucher | - | `CPV-001`~`CPV-009` | payment and voucher lifecycle are backend-driven |
| User/Profile System | `PRF-004` | `PRF-001`~`PRF-003`, `PRF-005`, `PRF-006` | user assets should come from backend |
| Merchant Console | - | `MRC-001`~`MRC-009` | all operational capabilities require CRUD APIs |
| Merchant Messages | - | `MSG-001`~`MSG-005` | list/search/settings need server-side consistency |
| Merchant Verification | `VER-003` | `VER-001`, `VER-002` | review flow and activation are backend critical |
| Admin System | - | `ADM-001`, `ADM-002` | all admin capabilities are backend-dependent |

## 2. Detailed Requirements Matrix

## Auth System

| Requirement ID | Feature | Input | Business Logic | Output | Backend Involvement | Priority | Current Status | Owner | Status Updated | Acceptance Criteria (GWT) | API Contract | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AUT-001 | User Email Login | email, password | `AuthContext.login -> /auth/login -> /auth/me` | authenticated state + user profile | Backend Required | P0 | Implemented (Real API) | FE | 2026-02-12 | Given email/password; When user logs in; Then auth state and user profile are returned with error feedback on failure. | [AUT-API](contracts/README.md#aut-api) | `src/contexts/AuthContext.tsx` |
| AUT-002 | Merchant Email Login | email, password | shared login endpoint, frontend validates `role=merchant` | merchant enters dashboard | Backend Required | P0 | Partially Implemented | FE | 2026-02-12 | Given merchant credentials; When login succeeds; Then merchant can access dashboard with role validation. | [AUT-API](contracts/README.md#aut-api) | role check partially depends on local cache |
| AUT-003 | User Registration | username, email, password | call `/auth/register`, then `/auth/me` | authenticated state + redirect | Backend Required | P0 | Implemented (Real API) | FE | 2026-02-12 | Given signup form data; When registration succeeds; Then user is logged in and redirected. | [AUT-API](contracts/README.md#aut-api) | `src/features/auth/pages/RegisterPage.tsx` |
| AUT-004 | Google Login Entry | - | redirect to backend OAuth URL | 3rd-party auth grant | Backend Required | P0 | Implemented (Real API) | FE | 2026-02-12 | Given Google login action; When OAuth starts; Then user is redirected to Google auth flow. | [AUT-API](contracts/README.md#aut-api) | `authService.getGoogleLoginUrl()` |
| AUT-005 | Google Callback Handling | query token | parse token and fetch `/auth/me` + `/user/profile` | auth session restored | Backend Required | P0 | Implemented (Real API) | FE | 2026-02-12 | Given callback token; When callback page runs; Then auth state is restored with profile data. | [AUT-API](contracts/README.md#aut-api) | `src/features/auth/pages/GoogleCallbackPage.tsx` |
| AUT-006 | Forgot Password (send email) | email | call `/auth/forgot-password` | success prompt | Backend Required | P1 | Implemented (Real API) | FE | 2026-02-12 | Given valid email; When reset request is sent; Then success prompt is shown. | [AUT-API](contracts/README.md#aut-api) | initiation only |
| AUT-007 | Session Restore on App Start | local token | verify token via `/auth/me` | auto-restore auth state | Backend Required | P0 | Implemented (Real API) | FE | 2026-02-12 | Given stored token; When app starts; Then session is restored or redirected on invalid token. | [AUT-API](contracts/README.md#aut-api) | `AuthProvider` boot logic |
| AUT-008 | Logout | current auth state | clear token + user cache | unauthenticated state | Frontend Only | P0 | Implemented (Frontend) | FE | 2026-02-12 | Given logged-in state; When logout action is triggered; Then local auth state is fully cleared. | N/A | no backend logout call yet |
| AUT-009 | Send Verification Code | email | send code + cooldown timer | code-send status | Backend Required | P1 | Not Implemented | FE | 2026-02-12 | Given email; When code request is sent; Then status and cooldown are shown. | [AUT-API](contracts/README.md#aut-api) | current signup is not code-based |
| AUT-010 | Email Verification/Activation | email, code | validate code and activate account | account activation state | Backend Required | P1 | Not Implemented | FE | 2026-02-12 | Given email/code; When verification succeeds; Then account status becomes active. | [AUT-API](contracts/README.md#aut-api) | no verification page yet |
| AUT-011 | Refresh Token | refresh token | silent access-token renewal | new access token | Backend Required | P1 | Not Implemented | FE | 2026-02-12 | Given refresh token; When access token expires; Then token refresh is attempted without user interruption. | [AUT-API](contracts/README.md#aut-api) | `apiClient` currently redirects on 401 |
| AUT-012 | Unauthenticated Write-Review Guard | write-review entry click | prompt login first, then continue flow | protected-action prompt | Frontend Only | P1 | Implemented (Frontend) | FE | 2026-02-12 | Given guest state; When write-review is clicked; Then login prompt is shown before entering flow. | N/A | `BottomNav` guard |
| AUT-013 | Merchant Route Guard | auth state + role | redirect unauthenticated/non-merchant access | protected route access control | Frontend Only | P0 | Implemented (Frontend) | FE | 2026-02-12 | Given route access attempt; When role/auth is invalid; Then user is redirected safely. | N/A | `MerchantLayout` guard |

## Customer Discovery + Merchant Detail

| Requirement ID | Feature | Input | Business Logic | Output | Backend Involvement | Priority | Current Status | Owner | Status Updated | Acceptance Criteria (GWT) | API Contract | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DIS-001 | Home Recommendation Feed | optional user context | render promo cards + merchant feed | home content feed | Backend Required | P0 | Mock/Local State | FE | 2026-02-12 | Given home load; When feed is requested; Then recommendation list is returned with fallback errors handled. | [DIS-API](contracts/README.md#dis-api) | target requires backend recommendation feed |
| DIS-002 | Home Search | keyword | header search triggers query | filtered merchant results | Backend Required | P1 | Partially Implemented | FE | 2026-02-12 | Given keyword input; When search is submitted; Then merchant results are filtered and rendered. | [DIS-API](contracts/README.md#dis-api) | needs backend query + pagination |
| DIS-003 | Home Quick Filters (Filter Bar) | filter tags (Coupons/Open Now/Top Rated/Budget) | apply filter tags | filtered merchant results | Backend Required | P1 | Partially Implemented | FE | 2026-02-12 | Given filter selection; When filter is applied; Then result list updates by selected criteria. | [DIS-API](contracts/README.md#dis-api) | needs combinational backend filtering |
| DIS-004 | Discover Category Filter | category/tags | category/tag filtering | merchant list | Backend Required | P0 | Mock/Local State | FE | 2026-02-12 | Given category/tags; When filtering runs; Then merchant list reflects selected categories. | [DIS-API](contracts/README.md#dis-api) | requires category/tag query APIs |
| DIS-005 | Discover Text Search | keyword | search and filter discover list | search result list | Backend Required | P1 | Not Implemented | FE | 2026-02-12 | Given keyword; When discover search runs; Then matching results and empty state are shown. | [DIS-API](contracts/README.md#dis-api) | backend search endpoint needed |
| DIS-006 | Explore Map Discovery | map key, search text | Google Map markers + detail drawer | map + merchant detail drawer | Backend Required | P1 | Mock/Local State | FE | 2026-02-12 | Given map viewport/query; When explore loads; Then markers and detail drawer are synced. | [DIS-API](contracts/README.md#dis-api) | map points/details should come from backend |
| DIS-007 | Explore Map Search | keyword | keyword filters map points/details | filtered map results | Backend Required | P2 | Partially Implemented | FE | 2026-02-12 | Given map search keyword; When filter runs; Then visible map points and drawer content update. | [DIS-API](contracts/README.md#dis-api) | backend geo-query/filter required |
| DIS-008 | Merchant Detail Page | merchantId | load merchant profile/deals/menu/snippets | merchant detail page | Backend Required | P0 | Mock/Local State | FE | 2026-02-12 | Given merchantId; When detail page loads; Then full merchant data is rendered with error state. | [DIS-API](contracts/README.md#dis-api) | backend detail API required |
| DIS-009 | Full Review List Page | merchantId | load rating summary + full reviews | review list page | Backend Required | P1 | Mock/Local State | FE | 2026-02-12 | Given merchantId; When reviews are requested; Then paginated review list and summary are shown. | [DIS-API](contracts/README.md#dis-api) | backend review query + pagination required |
| DIS-010 | Menu View/Zoom | optional menuImageUrl | image preview + full-screen zoom | menu detail view | Backend Required | P2 | Implemented (Frontend) | FE | 2026-02-12 | Given menu image URL; When user zooms image; Then enlarged menu is displayed correctly. | [DIS-API](contracts/README.md#dis-api) | interaction is frontend; menu data source is backend |

## Review System

| Requirement ID | Feature | Input | Business Logic | Output | Backend Involvement | Priority | Current Status | Owner | Status Updated | Acceptance Criteria (GWT) | API Contract | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| REV-001 | Review Base Form | overall score/subscores/text/tags | validate score/text/tags | submittable form | Frontend Only | P0 | Implemented (Frontend) | FE | 2026-02-12 | Given review form input; When validation runs; Then invalid fields are blocked and valid form can submit. | N/A | `WriteReviewPage` + `ReviewContext` |
| REV-002 | Image/Video Selection & Validation | local files | file type/size validation + upload state | media queue | Frontend Only | P0 | Partially Implemented | FE | 2026-02-12 | Given local media; When selected; Then validation and queue status are shown with retry errors. | N/A | up to 9 images, retry/error states |
| REV-003 | Media Upload to R2 | file list | `/media/presigned-urls` + PUT upload | uploaded `fileUrl[]` | Backend Required | P0 | Implemented (Real API) | FE | 2026-02-12 | Given media files; When upload runs; Then file URLs are returned and attached to review payload. | [REV-API](contracts/README.md#rev-api) | `mediaApi` + `uploadToR2` |
| REV-004 | Publish Review | review payload | call `/reviews` | publish success state | Backend Required | P0 | Partially Implemented | FE | 2026-02-12 | Given valid review payload; When publish is triggered; Then review is persisted and visible to user path. | [REV-API](contracts/README.md#rev-api) | `merchantId/venueId` still TODO |
| REV-005 | Draft Auto Save/Restore | form state | delayed `localStorage` save + restore | draft status | Frontend Only | P1 | Implemented (Frontend) | FE | 2026-02-12 | Given in-progress form; When user leaves/reopens; Then draft is restored safely. | N/A | `review:draft` |
| REV-006 | AI Copy Suggestion | category + context text | call Gemini prompt generation | suggestion list | Frontend Only | P2 | Partially Implemented | FE | 2026-02-12 | Given context and category; When AI suggestion runs; Then candidate copy list is returned or fallback shown. | N/A | API-key dependency / stability pending |
| REV-007 | Review Like/Comment Interaction | reviewId, text | like/comment API methods | interaction state | Backend Required | P1 | Partially Implemented | FE | 2026-02-12 | Given reviewId/text; When interaction is submitted; Then counts/state are updated and persisted. | [REV-API](contracts/README.md#rev-api) | API exists; UI loop not complete |
| REV-008 | Review Success Page | - | success messaging + navigation | success feedback page | Frontend Only | P2 | Implemented (Frontend) | FE | 2026-02-12 | Given publish success; When success page opens; Then user sees confirmation and valid next actions. | N/A | `ReviewSuccessPage` |

## Community/Post System

| Requirement ID | Feature | Input | Business Logic | Output | Backend Involvement | Priority | Current Status | Owner | Status Updated | Acceptance Criteria (GWT) | API Contract | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| COM-001 | My Review Feed Page | user route entry | render user historical review cards | review feed page | Backend Required | P1 | Mock/Local State | FE | 2026-02-12 | Given user profile route; When feed loads; Then user review timeline is fetched and displayed. | [COM-API](contracts/README.md#com-api) | target requires backend feed API |
| COM-002 | Post Detail Page | postId | fetch post detail by id | post detail page | Backend Required | P1 | Mock/Local State | FE | 2026-02-12 | Given postId; When detail page opens; Then full post detail is rendered with fallbacks. | [COM-API](contracts/README.md#com-api) | target requires backend detail API |
| COM-003 | Post Like | postId | toggle like + update counts | like result state | Backend Required | P2 | Mock/Local State | FE | 2026-02-12 | Given postId; When user likes post; Then state/count are persisted and reflected in UI. | [COM-API](contracts/README.md#com-api) | target requires persistent like state |
| COM-004 | Post Comment Input | postId, comment | collect + submit comment text | comment draft/submission state | Backend Required | P2 | Mock/Local State | FE | 2026-02-12 | Given comment text; When comment is submitted; Then new comment appears in list with status. | [COM-API](contracts/README.md#com-api) | target requires submit + fetch APIs |
| COM-005 | Post Share Action | postId | trigger share behavior | share feedback/state | Backend Required | P2 | Mock/Local State | FE | 2026-02-12 | Given share action; When share is triggered; Then share result and share metrics are handled. | [COM-API](contracts/README.md#com-api) | share button can be frontend; metrics need backend |

## Coupon + Payment + Voucher

| Requirement ID | Feature | Input | Business Logic | Output | Backend Involvement | Priority | Current Status | Owner | Status Updated | Acceptance Criteria (GWT) | API Contract | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CPV-001 | Coupon Eligibility Validation | couponId, userId | eligibility check + error fallback | eligible/ineligible result | Backend Required | P0 | Partially Implemented | FE | 2026-02-12 | Given couponId/userId; When validation runs; Then eligibility result is returned with actionable error. | [CPV-API](contracts/README.md#cpv-api) | service currently mixes real + mock |
| CPV-002 | Free Coupon Claim | couponId, userId | validate and create voucher | voucher + QR data | Backend Required | P0 | Mock/Local State | FE | 2026-02-12 | Given free coupon claim; When claim succeeds; Then voucher code and QR are generated. | [CPV-API](contracts/README.md#cpv-api) | `redeemFreeCoupon` still mock |
| CPV-003 | Paid Coupon Payment Init | couponId, userId | call `/coupons/:id/payment/initiate` | paymentData/sessionId | Backend Required | P0 | Implemented (Real API) | FE | 2026-02-12 | Given paid coupon intent; When init API succeeds; Then valid payment session data is returned. | [CPV-API](contracts/README.md#cpv-api) | backend availability required |
| CPV-004 | Payment Page | deal/coupon data | payment method selection + payment trigger | success-page navigation | Backend Required | P0 | Mock/Local State | FE | 2026-02-12 | Given payment page context; When payment is confirmed; Then status is synced and next page is deterministic. | [CPV-API](contracts/README.md#cpv-api) | target requires backend order/payment status |
| CPV-005 | Payment Success (Generic) | order info | show code/download placeholders | success feedback page | Backend Required | P1 | Mock/Local State | FE | 2026-02-12 | Given successful order; When success page opens; Then order and voucher status are accurate. | [CPV-API](contracts/README.md#cpv-api) | target requires real order/voucher state |
| CPV-006 | Payment Success (Coupon) | payment state | create/retrieve voucher via service | QR/barcode/code | Backend Required | P0 | Partially Implemented | FE | 2026-02-12 | Given paid coupon success; When voucher fetch runs; Then voucher assets are rendered and shareable. | [CPV-API](contracts/README.md#cpv-api) | depends on `/vouchers` APIs |
| CPV-007 | Voucher Display & Share | voucherId/share mode | fetch details/copy/share/export | voucher view state | Backend Required | P1 | Partially Implemented | FE | 2026-02-12 | Given voucherId; When share/export actions run; Then result state is persisted and user-visible. | [CPV-API](contracts/README.md#cpv-api) | share/export depend on backend endpoints |
| CPV-008 | My Voucher Wallet | - | render wallet list + active animations | voucher wallet page | Backend Required | P1 | Mock/Local State | FE | 2026-02-12 | Given wallet entry; When page loads; Then owned vouchers are listed with valid states. | [CPV-API](contracts/README.md#cpv-api) | `VouchersPage` static data |
| CPV-009 | Merchant Redemption (scan/manual) | couponCode | scan/manual code verify + redeem | redemption result prompt | Backend Required | P1 | Mock/Local State | FE | 2026-02-12 | Given coupon code; When redemption is requested; Then code validity and redemption status are returned. | [CPV-API](contracts/README.md#cpv-api) | built-in mock code library now |

## User/Profile System

| Requirement ID | Feature | Input | Business Logic | Output | Backend Involvement | Priority | Current Status | Owner | Status Updated | Acceptance Criteria (GWT) | API Contract | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PRF-001 | Profile Aggregation Page | auth user | render avatar/stats/recent reviews/pending items | profile home | Backend Required | P1 | Partially Implemented | FE | 2026-02-12 | Given authenticated user; When profile opens; Then aggregate assets are loaded and consistent. | [PRF-API](contracts/README.md#prf-api) | `reviewsApi.list()` connected; many stats still mock |
| PRF-002 | My Review List | implicit userId | fetch `/reviews` and map cards | review card list | Backend Required | P1 | Implemented (Real API) | FE | 2026-02-12 | Given profile context; When review list loads; Then user's reviews are shown with pagination-safe behavior. | [PRF-API](contracts/README.md#prf-api) | integrated in `ProfilePage` |
| PRF-003 | Profile Settings Page | profile fields | form edit/save flow | save feedback state | Backend Required | P1 | Mock/Local State | FE | 2026-02-12 | Given edited settings; When save is submitted; Then backend state updates and UI confirms result. | [PRF-API](contracts/README.md#prf-api) | `ProfileSettingsPage` currently static |
| PRF-004 | AI Bio Generation | user profile + interests | call Gemini for short bio | generated bio text | Frontend Only | P2 | Partially Implemented | FE | 2026-02-12 | Given profile context; When AI generation runs; Then bio suggestion is produced with fallback. | N/A | API key currently hardcoded in frontend |
| PRF-005 | Pending Review Reminder | userId | API-first with mock fallback | pending review merchant list | Backend Required | P2 | Partially Implemented | FE | 2026-02-12 | Given user activity; When pending check runs; Then pending merchants are listed reliably. | [PRF-API](contracts/README.md#prf-api) | API placeholders + mock fallback |
| PRF-006 | Following/Recent Browsing/Coupon History | userId | query relation/history data | history list data | Backend Required | P2 | Not Implemented | FE | 2026-02-12 | Given userId; When history endpoints are queried; Then lists are returned and paginated. | [PRF-API](contracts/README.md#prf-api) | no full data chain yet |

## Merchant Console (Dashboard/Marketing/Profile/Reviews)

| Requirement ID | Feature | Input | Business Logic | Output | Backend Involvement | Priority | Current Status | Owner | Status Updated | Acceptance Criteria (GWT) | API Contract | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MRC-001 | Merchant Dashboard | merchant identity | render metrics/reviews/coupon panel | dashboard view | Backend Required | P1 | Mock/Local State | FE-BE | 2026-02-12 | Given merchant login; When dashboard opens; Then key operational metrics are returned from backend. | [MRC-API](contracts/README.md#mrc-api) | mostly local state now |
| MRC-002 | Review Reply Management | reviewId, replyText | reply/edit and status update | replied review state | Backend Required | P1 | Mock/Local State | FE-BE | 2026-02-12 | Given review and reply text; When reply is submitted; Then reply persists and thread updates. | [MRC-API](contracts/README.md#mrc-api) | currently local array updates |
| MRC-003 | Coupon Management | coupon form | create/edit/enable/disable/delete | coupon list state | Backend Required | P1 | Mock/Local State | FE-BE | 2026-02-12 | Given coupon payload; When CRUD operation executes; Then list state reflects persisted result. | [MRC-API](contracts/README.md#mrc-api) | `CouponManager` local state |
| MRC-004 | Package Management | package/price/image | create/edit with discount calc | package list state | Backend Required | P1 | Mock/Local State | FE-BE | 2026-02-12 | Given package payload; When CRUD operation executes; Then package list is persisted and returned. | [MRC-API](contracts/README.md#mrc-api) | `PackageManager` local state |
| MRC-005 | Marketing Post Creation | copy/media/CTA/tags | frontend validation + publish | publish state | Backend Required | P1 | Mock/Local State | FE-BE | 2026-02-12 | Given post payload; When publish runs; Then post is persisted and visible in merchant channel. | [MRC-API](contracts/README.md#mrc-api) | `PostCreation` simulated API |
| MRC-006 | Store Profile Maintenance | store info/menu/images | edit and media preview | store profile page state | Backend Required | P1 | Mock/Local State | FE-BE | 2026-02-12 | Given store profile edits; When save runs; Then profile is persisted and reloaded accurately. | [MRC-API](contracts/README.md#mrc-api) | explicit mockStoreData in code |
| MRC-007 | Store Analytics | date range | render traffic/audience/conversion metrics | analytics dashboard | Backend Required | P2 | Mock/Local State | FE-BE | 2026-02-12 | Given date range; When analytics query runs; Then metrics and series are rendered with empty/error states. | [MRC-API](contracts/README.md#mrc-api) | fully static currently |
| MRC-008 | Ad Management | campaign settings | ad goal/material/budget management | ad management page | Backend Required | P2 | Mock/Local State | FE-BE | 2026-02-12 | Given campaign configuration; When operation runs; Then campaign state is persisted and queryable. | [MRC-API](contracts/README.md#mrc-api) | placeholder page |
| MRC-009 | Notification Center | notification payload | grouped display/listing | notification page state | Backend Required | P2 | Mock/Local State | FE-BE | 2026-02-12 | Given notifications feed; When page loads; Then notifications are grouped and actionable. | [MRC-API](contracts/README.md#mrc-api) | placeholder page |

## Merchant Messages

| Requirement ID | Feature | Input | Business Logic | Output | Backend Involvement | Priority | Current Status | Owner | Status Updated | Acceptance Criteria (GWT) | API Contract | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MSG-001 | Conversation List | keyword | load/search/create threads | conversation list | Backend Required | P1 | Mock/Local State | FE-BE | 2026-02-12 | Given message module entry; When list loads/searches; Then thread list reflects backend state. | [MSG-API](contracts/README.md#msg-api) | `chatStorage` + `localStorage` now |
| MSG-002 | Conversation Detail | chatId, message body | read/write/send attachment/update last message | message stream | Backend Required | P1 | Mock/Local State | FE-BE | 2026-02-12 | Given chatId and message; When send/read runs; Then timeline updates and persists. | [MSG-API](contracts/README.md#msg-api) | attachments are local URLs currently |
| MSG-003 | Conversation Settings | mute/pin/clear | settings persistence | conversation state update | Backend Required | P2 | Mock/Local State | FE-BE | 2026-02-12 | Given setting changes; When saved; Then settings are synced across sessions/devices. | [MSG-API](contracts/README.md#msg-api) | target requires cross-device sync |
| MSG-004 | Message Search | query | filter/highlight in message history | search results | Backend Required | P2 | Mock/Local State | FE-BE | 2026-02-12 | Given query; When search runs; Then matching server-side history results are returned. | [MSG-API](contracts/README.md#msg-api) | target requires backend history search |
| MSG-005 | Group Create / Batch Delete | group name, selected chats | create group/delete selected threads | updated list state | Backend Required | P2 | Mock/Local State | FE-BE | 2026-02-12 | Given group/delete action; When operation runs; Then thread list updates and persists correctly. | [MSG-API](contracts/README.md#msg-api) | local state + toast now |

## Merchant Verification

| Requirement ID | Feature | Input | Business Logic | Output | Backend Involvement | Priority | Current Status | Owner | Status Updated | Acceptance Criteria (GWT) | API Contract | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| VER-001 | New Merchant Verification Form | qualification docs, legal/entity info | frontend file type/size validation | submission state | Backend Required | P1 | Mock/Local State | FE-BE | 2026-02-12 | Given verification payload; When submit runs; Then verification record is created with trackable status. | [VER-API](contracts/README.md#ver-api) | submission and review countdown are simulated |
| VER-002 | Account Setup After Approval | email, password | activate merchant identity/account | dashboard access | Backend Required | P1 | Mock/Local State | FE-BE | 2026-02-12 | Given approved verification; When account setup completes; Then merchant account is activated. | [VER-API](contracts/README.md#ver-api) | local token write in `AccountSetupModal` |
| VER-003 | Verification Gate Modal | current merchant identity | block console until verified | guided modal prompt | Frontend Only | P1 | Mock/Local State | FE-BE | 2026-02-12 | Given unverified merchant; When entering console; Then blocking modal is shown with clear next action. | N/A | reads local verification key |

## Admin System

| Requirement ID | Feature | Input | Business Logic | Output | Backend Involvement | Priority | Current Status | Owner | Status Updated | Acceptance Criteria (GWT) | API Contract | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ADM-001 | Restaurant Management (CRUD) | merchant/restaurant data | admin management workflow | management operation result | Backend Required | P2 | Not Implemented | TBD | 2026-02-12 | Given admin operation payload; When CRUD action executes; Then changes persist with auditability. | [ADM-API](contracts/README.md#adm-api) | no admin frontend module yet |
| ADM-002 | Review Moderation / Report Handling | reviewId, reason | moderation and risk-control process | moderation result | Backend Required | P2 | Not Implemented | TBD | 2026-02-12 | Given review report payload; When moderation runs; Then final action is persisted and traceable. | [ADM-API](contracts/README.md#adm-api) | requirement only, no route/page yet |

## 3. Recommended Priorities to Fill

1. `P0`: close Review publish loop (`REV-003`, `REV-004`, `REV-007`)  
Ensure `merchantId/venueId`, retry handling, and post-publish data return path.

2. `P0`: unify Coupon/Payment real chain (`CPV-001`~`CPV-009`)  
Remove simulated payment path and align free/paid/voucher contracts.

3. `P1`: de-mock Profile + Merchant Console (`PRF-001`~`PRF-003`, `MRC-001`~`MRC-006`)  
Prioritize user metrics, merchant operations, and persisted marketing config.

4. `P1`: minimal backend messaging (`MSG-001`~`MSG-005`)  
At least support thread list, send message, and history query from backend.

## 4. Target Matrix v2 (Beta 4-6 Weeks)

> Beta window suggestion from 2026-02-12: `2026-02-12` to `2026-03-26`.

### 4.1 Beta Scope Boundaries

| Type | Content |
| --- | --- |
| In Scope | Review publish loop, real Coupon/Payment/Voucher chain, core Profile de-mock, core Merchant Console de-mock, minimal backendized Merchant Messages |
| Out of Scope | Admin console, advanced marketing automation, recommendation engine refactor, full analytics platformization, realtime IM push (polling first) |

### 4.2 Beta Module Target Matrix

| Module | Key Requirement IDs (Section 2) | Beta Goal | Backend Involvement | Starting Status | Beta DoD | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| Auth System | `AUT-001`~`AUT-007`, `AUT-009`~`AUT-011` | stabilize auth experience | Backend Required | Partially Implemented | login/register/OAuth/startup restore stable; unified 401 handling and error UX | P0 |
| Customer Discovery | `DIS-001`~`DIS-009` | make home search/filter and list linkage usable | Backend Required | Partially Implemented | search filters list; at least 2 real filter dimensions; usable empty/reset state | P1 |
| Review System | `REV-003`, `REV-004`, `REV-007` | complete publish-and-revisit loop | Backend Required | Partially Implemented | merchant context flows through, upload success is observable, published review visible in profile | P0 |
| Coupon + Payment + Voucher | `CPV-001`~`CPV-009` | replace simulation with real payment + voucher flow | Backend Required | Partially Implemented | paid flow reaches voucher assets; free claim no longer pure mock; recoverable failure states | P0 |
| User/Profile System | `PRF-001`, `PRF-002`, `PRF-003`, `PRF-005`, `PRF-006` | move core user assets to APIs | Backend Required | Partially Implemented | nickname/avatar/bio/review count from backend; settings save at least core fields | P1 |
| Merchant Console | `MRC-001`~`MRC-009` | enable core merchant operations for integration | Backend Required | Mock/Local State | at least one complete create/update flow for coupon/package/store profile + persisted review reply | P1 |
| Merchant Messages | `MSG-001`~`MSG-005` | deliver minimum usable messaging system | Backend Required | Mock/Local State | thread list/history/send text use backend; local storage becomes cache only | P1 |
| Merchant Verification | `VER-001`, `VER-002` | keep demo flow, lower refactor priority | Backend Required | Mock/Local State | keep demo usable; freeze API definition for GA integration | P2 |

### 4.3 Beta Suggested Phases

| Phase | Time | Goal | Milestone |
| --- | --- | --- | --- |
| Phase 1 | Week 1-2 | converge P0 data contracts | Review/Coupon/Voucher contracts frozen and integration env stable |
| Phase 2 | Week 3-4 | close P0 core loops | Review publish loop + payment voucher loop pass acceptance |
| Phase 3 | Week 5 | push P1 de-mock | Profile core fields + Merchant Console core operations integrated |
| Phase 4 | Week 6 | stabilization and regression | key-path regression passed, error/empty/retry handling completed |

### 4.4 Beta Exit Checklist

| Item | Acceptance Standard |
| --- | --- |
| Functional loops | at least 2 P0 paths are E2E and data traceable (Review, Coupon/Payment) |
| Stability | no blocker-level P0 defects on key path; failure branches are recoverable |
| Consistency | auth state, route guards, and error style are consistent |
| Testability | core modules have minimum automation or repeatable manual scripts |
| Operability | merchant can perform basic operations (issue coupon/edit profile/reply review) with persistence |

### 4.5 External Dependencies to Confirm Before Beta

| Dependency | Module | Backend Required |
| --- | --- | --- |
| Review context parameters | Review System | reliable merchant/venue ID source (route or API) |
| Payment session & callback | Coupon + Payment + Voucher | payment init, status query, callback confirmation |
| Voucher lifecycle | Coupon + Payment + Voucher | create/query/redeem/expiry state model |
| Merchant operation data | Merchant Console | CRUD for coupons/packages/review replies |
| Minimal messaging APIs | Merchant Messages | thread list/history/send message (non-realtime first) |

### 4.6 Field-Level API Contract Index

| Contract ID | Related Requirement IDs | Contract Doc |
| --- | --- | --- |
| AUT-API | `AUT-001`~`AUT-007`, `AUT-009`~`AUT-011` | `docs/requirements/contracts/README.md#aut-api` |
| DIS-API | `DIS-001`~`DIS-010` | `docs/requirements/contracts/README.md#dis-api` |
| REV-API | `REV-003`, `REV-004`, `REV-007` | `docs/requirements/contracts/README.md#rev-api` |
| COM-API | `COM-001`~`COM-005` | `docs/requirements/contracts/README.md#com-api` |
| CPV-API | `CPV-001`~`CPV-009` | `docs/requirements/contracts/README.md#cpv-api` |
| PRF-API | `PRF-001`~`PRF-003`, `PRF-005`, `PRF-006` | `docs/requirements/contracts/README.md#prf-api` |
| MRC-API | `MRC-001`~`MRC-009` | `docs/requirements/contracts/README.md#mrc-api` |
| MSG-API | `MSG-001`~`MSG-005` | `docs/requirements/contracts/README.md#msg-api` |
| VER-API | `VER-001`, `VER-002` | `docs/requirements/contracts/README.md#ver-api` |
| ADM-API | `ADM-001`, `ADM-002` | `docs/requirements/contracts/README.md#adm-api` |

## 5. Non-Functional Requirements Matrix (NFR)

> Goal: avoid “functionally runnable but not launchable” risk by defining enforceable beta/GA engineering standards.

| Dimension | Requirement | Beta Goal (4-6 weeks) | GA Target | Current Status |
| --- | --- | --- | --- | --- |
| Performance | first paint of key pages | Home/Discover/Profile usable on normal networks | stable LCP with continuous monitoring | not systematically defined |
| Performance | list/interaction smoothness | smooth scrolling and visible search/filter feedback | low-end device optimization | partially implemented |
| Reliability | API error fallback | unified error prompts + retry entries on key APIs | circuit-breaker/degrade strategy on key APIs | partially implemented |
| Reliability | idempotency & anti-dup submit | anti-double-submit for payment/review publish | align idempotency keys with backend | partially implemented |
| Security | secrets & sensitive info | remove hardcoded keys; environment variables only | managed secret policy | partially implemented |
| Security | auth boundary | unified route guards and 401 handling | token renewal and session policy maturity | partially implemented |
| Observability | frontend error monitoring | baseline error reporting (runtime/API) | module-level alerting + trend analysis | not implemented |
| Observability | key event analytics | cover login/review publish/payment/claim | funnel and conversion dashboards | not implemented |
| Testability | automation coverage | minimum regression for P0 key paths | stable regression baseline for core modules | partially implemented |
| Accessibility | baseline a11y | focusability and semantic labels on key actions | align major WCAG requirements | partially implemented |
| Compatibility | device/browser support | key paths usable on mainstream mobile/desktop | explicit support matrix + continuous validation | partially implemented |
| Maintainability | unified error/status semantics | FE-BE error mapping table in place | automated contract change checks | not implemented |

### 5.1 Current NFR Risks (Recommended Priority)

| Risk | Affected Modules | Priority |
| --- | --- | --- |
| hardcoded third-party keys in frontend | Profile/AI | P0 |
| inconsistent failure-recovery between payment and review publish | Review, Coupon/Payment | P0 |
| missing unified frontend error reporting and key analytics | Global | P1 |
| UI/data linkage gap in search/filter interactions | Customer Discovery | P1 |

### 5.2 Minimum NFR Exit Before End of Beta

1. All P0 key paths provide unified error feedback and recoverable actions (retry/back).
2. Remove hardcoded frontend secrets and move to environment variables.
3. Integrate at least one frontend error-reporting solution in production build.
4. Build minimum regression suite for `login -> review publish -> payment/claim`.

## 6. Change Log

| Date | Version | Change Type | Summary | Owner |
| --- | --- | --- | --- | --- |
| 2026-02-12 | v2.2 | structural upgrade | introduced requirement ID system; made `## 2` source of truth; changed `## 1.1` to ID index; added trace column in `## 4.2` | Wayne/Codex |
| 2026-02-12 | v2.3 | verifiability upgrade | added `owner/status-updated/GWT/API-contract` columns per requirement; added contract index and contract doc | Wayne/Codex |
| 2026-02-12 | v2.4 | bilingual delivery | created full English matrix as `README.md` and preserved CN version as `README.cn.md` | Wayne/Codex |
