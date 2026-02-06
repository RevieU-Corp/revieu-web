# OpenAPI Spec Generation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Generate a complete OpenAPI 3.0 YAML spec for the Auth + Customer APIs defined in `openapi-design-plan.md`.

**Architecture:** Single-file `openapi.yaml` at repo root, with shared `components/schemas`, `components/responses`, and `components/securitySchemes`; paths grouped by tags (auth, users, feed, merchants, reviews, coupons, vouchers, payments, media, ai).

**Tech Stack:** OpenAPI 3.0, YAML.

---

### Task 1: Create OpenAPI base skeleton

**Files:**
- Create: `openapi.yaml`

**Step 1: Write the base skeleton**

```yaml
openapi: 3.0.3
info:
  title: RevieU API
  version: 1.0.0
  description: Auth + Customer API for RevieU
servers:
  - url: /api/v1
    description: Default API base
security:
  - bearerAuth: []
tags:
  - name: auth
  - name: users
  - name: feed
  - name: merchants
  - name: reviews
  - name: coupons
  - name: vouchers
  - name: payments
  - name: media
  - name: ai
paths: {}
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  responses:
    ErrorResponse:
      description: Error response
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
  schemas:
    Error:
      type: object
      required: [code, message]
      properties:
        code:
          type: string
        message:
          type: string
        details:
          type: object
```

**Step 2: Run lint to verify YAML parses**

Run: `npx @redocly/cli lint openapi.yaml`
Expected: PASS or only warnings about missing paths

**Step 3: Commit**

```bash
git add openapi.yaml
git commit -m "docs: add openapi base skeleton"
```

---

### Task 2: Add Auth + User Profile paths and schemas

**Files:**
- Modify: `openapi.yaml`

**Step 1: Add schemas**

```yaml
components:
  schemas:
    AuthLoginRequest:
      type: object
      required: [email, password]
      properties:
        email: { type: string, format: email }
        password: { type: string }
    AuthRegisterRequest:
      type: object
      required: [username, email, password]
      properties:
        username: { type: string }
        email: { type: string, format: email }
        password: { type: string }
    AuthTokenResponse:
      type: object
      required: [token]
      properties:
        token: { type: string }
    AuthUser:
      type: object
      required: [user_id, email, role]
      properties:
        user_id: { type: integer }
        email: { type: string, format: email }
        role: { type: string, enum: [user, merchant] }
    UserProfile:
      type: object
      properties:
        user_id: { type: integer }
        nickname: { type: string }
        avatar_url: { type: string }
        intro: { type: string }
        location: { type: string }
```

**Step 2: Add paths**

```yaml
paths:
  /auth/login:
    post:
      tags: [auth]
      summary: Login
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AuthLoginRequest'
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthTokenResponse'
        '400': { $ref: '#/components/responses/ErrorResponse' }
  /auth/register:
    post:
      tags: [auth]
      summary: Register
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AuthRegisterRequest'
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthTokenResponse'
        '400': { $ref: '#/components/responses/ErrorResponse' }
  /auth/forgot-password:
    post:
      tags: [auth]
      summary: Send reset email
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email]
              properties:
                email: { type: string, format: email }
      responses:
        '200': { description: OK }
        '400': { $ref: '#/components/responses/ErrorResponse' }
  /auth/me:
    get:
      tags: [auth]
      summary: Get current user
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthUser'
        '401': { $ref: '#/components/responses/ErrorResponse' }
  /auth/login/google:
    get:
      tags: [auth]
      summary: Get Google OAuth URL
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  url: { type: string }
  /user/profile:
    get:
      tags: [users]
      summary: Get user profile
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserProfile'
        '401': { $ref: '#/components/responses/ErrorResponse' }
    put:
      tags: [users]
      summary: Update user profile
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserProfile'
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserProfile'
        '400': { $ref: '#/components/responses/ErrorResponse' }
```

**Step 3: Run lint**

Run: `npx @redocly/cli lint openapi.yaml`
Expected: PASS or only warnings

**Step 4: Commit**

```bash
git add openapi.yaml
git commit -m "docs: add auth and user profile endpoints"
```

---

### Task 3: Add Feed + Merchants + Reviews endpoints and schemas

**Files:**
- Modify: `openapi.yaml`

**Step 1: Add schemas**

```yaml
components:
  schemas:
    FeedItem:
      type: object
      properties:
        id: { type: string }
        type: { type: string, enum: [activity, merchant] }
        title: { type: string }
        image: { type: string }
    Merchant:
      type: object
      properties:
        id: { type: string }
        name: { type: string }
        category: { type: string }
        rating: { type: number }
        reviewCount: { type: integer }
        distance: { type: string }
        tags: { type: array, items: { type: string } }
        coverImage: { type: string }
    Review:
      type: object
      properties:
        id: { type: string }
        merchantId: { type: string }
        userId: { type: string }
        rating: { type: number }
        text: { type: string }
        images: { type: array, items: { type: string } }
        tags: { type: array, items: { type: string } }
        createdAt: { type: string, format: date-time }
```

**Step 2: Add paths**

```yaml
paths:
  /feed/home:
    get:
      tags: [feed]
      summary: Home feed
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/FeedItem'
  /merchants:
    get:
      tags: [merchants]
      summary: List merchants
      parameters:
        - in: query
          name: category
          schema: { type: string }
        - in: query
          name: tags
          schema: { type: string }
        - in: query
          name: lat
          schema: { type: number }
        - in: query
          name: lng
          schema: { type: number }
        - in: query
          name: radius
          schema: { type: number }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Merchant'
  /merchants/{id}:
    get:
      tags: [merchants]
      summary: Merchant detail
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Merchant'
  /merchants/{id}/reviews:
    get:
      tags: [merchants]
      summary: Merchant reviews
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Review'
  /reviews:
    get:
      tags: [reviews]
      summary: List user reviews
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Review'
    post:
      tags: [reviews]
      summary: Create review
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Review'
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Review'
  /reviews/{id}:
    get:
      tags: [reviews]
      summary: Review detail
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Review'
  /reviews/{id}/like:
    post:
      tags: [reviews]
      summary: Like review
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        '200': { description: OK }
  /reviews/{id}/comments:
    post:
      tags: [reviews]
      summary: Comment on review
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [text]
              properties:
                text: { type: string }
      responses:
        '201': { description: Created }
```

**Step 3: Run lint**

Run: `npx @redocly/cli lint openapi.yaml`
Expected: PASS or only warnings

**Step 4: Commit**

```bash
git add openapi.yaml
git commit -m "docs: add feed, merchants, reviews endpoints"
```

---

### Task 4: Add Coupons, Vouchers, Payments, Media, AI endpoints and schemas

**Files:**
- Modify: `openapi.yaml`

**Step 1: Add schemas**

```yaml
components:
  schemas:
    Coupon:
      type: object
      properties:
        id: { type: string }
        merchantId: { type: string }
        title: { type: string }
        type: { type: string, enum: [free, paid] }
        value: { type: string }
        price: { type: number }
        expiryDate: { type: string, format: date-time }
    Voucher:
      type: object
      properties:
        id: { type: string }
        code: { type: string }
        couponId: { type: string }
        userId: { type: string }
        status: { type: string, enum: [active, used, expired] }
        expiryDate: { type: string, format: date-time }
        qrCode: { type: string }
    Payment:
      type: object
      properties:
        id: { type: string }
        amount: { type: number }
        currency: { type: string }
        status: { type: string }
        couponId: { type: string }
        merchantId: { type: string }
    MediaUpload:
      type: object
      properties:
        id: { type: string }
        uploadUrl: { type: string }
        fileUrl: { type: string }
    AISuggestionsRequest:
      type: object
      properties:
        overallRating: { type: number }
        businessCategory: { type: string }
        currentText: { type: string }
        merchantName: { type: string }
    AISuggestionsResponse:
      type: object
      properties:
        suggestions:
          type: array
          items: { type: string }
```

**Step 2: Add paths**

```yaml
paths:
  /coupons/{id}/validate:
    post:
      tags: [coupons]
      summary: Validate coupon
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        '200': { description: OK }
  /coupons/{id}/payment/initiate:
    post:
      tags: [coupons]
      summary: Initiate coupon payment
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [userId]
              properties:
                userId: { type: string }
      responses:
        '200': { description: OK }
  /coupons/{id}/redeem:
    post:
      tags: [coupons]
      summary: Redeem free coupon
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        '200': { description: OK }
  /vouchers:
    post:
      tags: [vouchers]
      summary: Create voucher
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Voucher'
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Voucher'
    get:
      tags: [vouchers]
      summary: List vouchers
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Voucher'
  /vouchers/{id}:
    get:
      tags: [vouchers]
      summary: Voucher detail
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Voucher'
  /vouchers/code/{code}:
    get:
      tags: [vouchers]
      summary: Voucher by code
      parameters:
        - in: path
          name: code
          required: true
          schema: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Voucher'
  /vouchers/{id}/use:
    patch:
      tags: [vouchers]
      summary: Mark voucher used
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        '200': { description: OK }
  /vouchers/{id}/status:
    patch:
      tags: [vouchers]
      summary: Update voucher status
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        '200': { description: OK }
  /vouchers/share/email:
    post:
      tags: [vouchers]
      summary: Share voucher via email
      responses:
        '200': { description: OK }
  /vouchers/share/sms:
    post:
      tags: [vouchers]
      summary: Share voucher via sms
      responses:
        '200': { description: OK }
  /payments:
    post:
      tags: [payments]
      summary: Create payment
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Payment'
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Payment'
  /payments/{id}:
    get:
      tags: [payments]
      summary: Payment detail
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Payment'
  /media/uploads:
    post:
      tags: [media]
      summary: Create upload URL
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MediaUpload'
  /media/{id}/analysis:
    post:
      tags: [media]
      summary: Analyze media
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        '200': { description: OK }
  /ai/reviews/suggestions:
    post:
      tags: [ai]
      summary: Generate review suggestions
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AISuggestionsRequest'
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AISuggestionsResponse'
```

**Step 3: Run lint**

Run: `npx @redocly/cli lint openapi.yaml`
Expected: PASS or only warnings

**Step 4: Commit**

```bash
git add openapi.yaml
git commit -m "docs: add coupons, vouchers, payments, media, ai endpoints"
```
