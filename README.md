# RevieU Web 🌟

RevieU is a modern, feature-rich review platform designed to bridge the gap between customers and merchants. Built with performance and user experience in mind, it provides a seamless interface for discovering, sharing, and managing reviews.

---

## 🚀 Features

### 👤 For Customers
- **Personalized Home**: Stay updated with the latest reviews and trending stores.
- **Smart Discover**: Find the best local businesses with advanced search and filtering.
- **Social Integration**: Seamless login and registration with Google Auth.
- **Rich Reviews**: Share experiences with photos, ratings, and detailed descriptions.
- **User Profiles**: Manage your contributions and follow your favorite local spots.

### 🏪 For Merchants
- **Insightful Dashboard**: Monitor store performance and customer sentiment at a glance.
- **Ad Manager**: Target the right audience with integrated advertisement campaigns.
- **Store Profile**: Customize your digital storefront to attract more customers.
- **Direct Messaging**: Engage directly with customers to resolve issues or show appreciation.
- **Instant Notifications**: Never miss a beat with real-time alerts for new reviews and messages.

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

```text
src/
├── app/            # Application entry and routing
├── components/     # Reusable UI components (Common, Customer, Merchant)
├── contexts/       # React Contexts (Auth, etc.)
├── features/       # Feature-specific components and logic
├── hooks/          # Custom React hooks
├── services/       # API services
└── styles/         # Global styles and Tailwind configuration
```

---

## 📄 License

This project is private and intended for internal use only2.
