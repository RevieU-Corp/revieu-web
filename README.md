# RevieU Web 🌟

RevieU Web is the frontend application for the RevieU platform, serving both customer and merchant experiences in a single React codebase.

It currently includes end-to-end flows for authentication, customer discovery, review writing/upload, coupon/payment journeys, and merchant-side operations (dashboard, profile, messaging, marketing). Some modules are already wired to backend APIs, while others still use mock/local state as the project is actively moving toward Beta.

---

## 🚀 Product Overview

### 👤 For Customers
- **Authentication**: Email login/register, Google OAuth callback handling, session restore on app start.
- **Discovery**: Home feed, Discover categories/tags, map-based Explore, merchant detail/reviews pages.
- **Review System**: Write review with ratings/tags/media, R2 upload via presigned URL, draft persistence.
- **Coupon & Payment**: Coupon validation/redeem flows, payment pages, voucher display/share flow.
- **Profile**: Personal profile, review history, settings-related pages.

### 🏪 For Merchants
- **Merchant Auth & Verification Flow**: Merchant login and onboarding/verification UX.
- **Operations Console**: Dashboard, coupon/package management, review reply workflows, store profile editing.
- **Messaging**: Chat list, chat detail, search in conversation, group creation/deletion flows.
- **Marketing & Analytics Pages**: Post creation, store analytics, ads/notifications pages (some are still placeholder-driven).

### 📌 Current Delivery Status
- **API-connected flows exist** in Auth, Review upload/submit, and parts of Coupon/Voucher logic.
- **Mock/local-state flows remain** in several customer and merchant modules and are being replaced iteratively.

---

## 📋 Requirements Matrix

The latest functional requirements matrix for this frontend project is maintained at:

- `docs/requirements/README.md`

This file is the source of truth for:
- module-by-module functional scope
- implementation status (`已实现 / 部分实现 / Mock / 未实现`)
- Beta target matrix and non-functional requirements (NFR)

---

## 🛠 Tech Stack

- **Framework**: [React](https://reactjs.org/) (v18)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **API Client**: [Axios](https://axios-http.com/)
- **Routing**: [React Router](https://reactrouter.com/)

---

## 📦 Getting Started

### Prerequisites
- Node.js (v20 or higher)
- npm

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd revieu-web

# Install dependencies
npm install
```

### Development
```bash
# Start the development server
npm run dev
```

### Build & Production
```bash
# Build the project for production
npm run build

# Preview the production build
npm run preview
```

---

## 🐳 Docker Deployment

The project includes a `Dockerfile` for production deployment using Nginx.

```bash
# Build the Docker image
docker build -t revieu-web .

# Run the container
docker run -p 80:80 revieu-web
```

---

## ⚙️ CI/CD

We use **GitHub Actions** for our automated pipeline:
- **Continuous Integration**: Every push to `dev` or `main` triggers a build and type-check.
- **Branch Strategy**: Direct pushes to `main` are restricted. All features must be developed on branches and merged into `dev` before being PR'ed into `main`.
- **Automatic Deployment**: Successful builds on `main` automatically build and push a new Docker image to **GitHub Container Registry (GHCR)**.

---

## 📂 Project Structure

This project follows a **Feature-Based Architecture**, designed for high scalability and maintainability.

### Global Directory Map
- `src/api/`: Global API client configuration (Axios instances, interceptors).
- `src/app/`: Application entry points, root providers, and main `App.tsx`.
- `src/assets/`: Static assets (images, fonts, global styles).
- `src/components/`: **Pure UI System**.
  - `ui/`: Atomic components (Button, Input, Card) - pure and state-free.
  - `layout/`: Global structure components (Navbar, Sidebar, Page Layouts).
  - `common/`: Shared business-agnostic components.
- `src/config/`: Environment-specific configurations and global constants.
- `src/contexts/`: Global state management via React Context.
- `src/features/`: **Core Business Modules**. Each feature is self-contained:
  - `api/`: Module-specific service calls and API logic.
  - `components/`: Internal components used only within this feature.
  - `pages/`: Route-level page components.
  - `types/`: Domain-specific TypeScript models.
- `src/routes/`: Routing configuration and path constants (`paths.ts`).
- `src/types/`: Global, cross-feature TypeScript definitions.

### Working with Features
When adding new functionality (e.g., a "Product Gallery"), create a new folder in `src/features/product-gallery/`. This ensures that all logic, UI, and types related to that feature are encapsulated and easy to find.

---

## 📄 License

This project is private and intended for internal use only.
