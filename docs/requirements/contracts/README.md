# Requirements API Contracts (Field Level)

> Last Updated: 2026-02-12
> Scope: Field-level request/response contract index for `docs/requirements/README.md` Section 2.

## AUT-API

- Endpoints:
  - `POST /auth/login`
  - `POST /auth/register`
  - `GET /auth/me`
  - `POST /auth/forgot-password`
  - `POST /auth/refresh` (planned)
  - `POST /auth/verify-email` (planned)
- Request key fields:
  - `email`, `password`, `username`, `refreshToken`, `code`
- Response key fields:
  - `accessToken`, `refreshToken`, `user.id`, `user.role`, `user.email`, `expiresIn`

## DIS-API

- Endpoints:
  - `GET /discover/feed`
  - `GET /discover/search`
  - `GET /discover/map-points`
  - `GET /merchants/:merchantId`
  - `GET /merchants/:merchantId/reviews`
- Request key fields:
  - `q`, `category`, `tags[]`, `openNow`, `ratingMin`, `budget`, `lat`, `lng`, `radius`, `page`, `pageSize`
- Response key fields:
  - `items[].merchantId`, `items[].name`, `items[].rating`, `items[].distance`, `items[].isOpen`, `pagination.total`

## REV-API

- Endpoints:
  - `POST /media/presigned-urls`
  - `POST /reviews`
  - `POST /reviews/:reviewId/like`
  - `POST /reviews/:reviewId/comments`
- Request key fields:
  - `files[].mimeType`, `files[].fileName`, `merchantId`, `venueId`, `ratings`, `content`, `mediaUrls[]`, `reviewId`, `text`
- Response key fields:
  - `presignedUrls[]`, `fileUrls[]`, `review.id`, `review.status`, `likeCount`, `comment.id`, `createdAt`

## COM-API

- Endpoints:
  - `GET /posts`
  - `GET /posts/:postId`
  - `POST /posts/:postId/like`
  - `POST /posts/:postId/comments`
  - `POST /posts/:postId/share`
- Request key fields:
  - `postId`, `cursor`, `pageSize`, `comment.text`, `shareChannel`
- Response key fields:
  - `posts[]`, `post.id`, `post.likeCount`, `post.commentCount`, `comments[]`, `shareCount`

## CPV-API

- Endpoints:
  - `POST /coupons/validate`
  - `POST /coupons/:couponId/redeem-free`
  - `POST /coupons/:couponId/payment/initiate`
  - `GET /payments/:paymentId/status`
  - `POST /vouchers`
  - `GET /vouchers/:voucherId`
  - `POST /vouchers/:voucherId/share`
  - `POST /vouchers/redeem`
- Request key fields:
  - `couponId`, `userId`, `paymentMethod`, `amount`, `currency`, `voucherId`, `couponCode`
- Response key fields:
  - `eligible`, `paymentId`, `paymentStatus`, `voucher.id`, `voucherCode`, `qrCode`, `barcode`, `redeemStatus`

## PRF-API

- Endpoints:
  - `GET /user/profile`
  - `PATCH /user/profile`
  - `GET /reviews?owner=self`
  - `GET /user/pending-reviews`
  - `GET /user/history`
- Request key fields:
  - `nickname`, `avatarUrl`, `bio`, `interests[]`, `page`, `pageSize`
- Response key fields:
  - `user.id`, `nickname`, `avatarUrl`, `bio`, `stats.reviewCount`, `stats.followingCount`, `pendingReviews[]`, `history[]`

## MRC-API

- Endpoints:
  - `GET /merchant/dashboard`
  - `POST /merchant/reviews/:reviewId/reply`
  - `GET/POST/PATCH/DELETE /merchant/coupons`
  - `GET/POST/PATCH/DELETE /merchant/packages`
  - `PATCH /merchant/store-profile`
  - `GET /merchant/analytics`
- Request key fields:
  - `merchantId`, `reviewId`, `replyText`, `coupon`, `package`, `storeProfile`, `dateRange`
- Response key fields:
  - `dashboard.metrics`, `reply.id`, `coupons[]`, `packages[]`, `storeProfile`, `analytics.series[]`

## MSG-API

- Endpoints:
  - `GET /merchant/chats`
  - `GET /merchant/chats/:chatId/messages`
  - `POST /merchant/chats/:chatId/messages`
  - `PATCH /merchant/chats/:chatId/settings`
  - `GET /merchant/messages/search`
  - `POST /merchant/chats/group`
  - `DELETE /merchant/chats/batch`
- Request key fields:
  - `chatId`, `query`, `message.text`, `attachments[]`, `mute`, `pin`, `memberIds[]`, `chatIds[]`
- Response key fields:
  - `chats[]`, `messages[]`, `message.id`, `lastMessage`, `settings`, `searchResults[]`

## VER-API

- Endpoints:
  - `POST /merchant/verification/submit`
  - `GET /merchant/verification/status`
  - `POST /merchant/account/activate`
- Request key fields:
  - `businessInfo`, `licenses[]`, `ownerInfo`, `email`, `password`, `verificationId`
- Response key fields:
  - `verificationId`, `status`, `rejectReason`, `merchantAccountId`, `activationStatus`

## ADM-API

- Endpoints:
  - `GET/POST/PATCH/DELETE /admin/restaurants`
  - `GET /admin/reports/reviews`
  - `POST /admin/reviews/:reviewId/moderate`
- Request key fields:
  - `restaurant`, `reviewId`, `action`, `reason`, `operatorId`
- Response key fields:
  - `restaurant.id`, `moderationResult`, `auditLogId`, `updatedAt`
