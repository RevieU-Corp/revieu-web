# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1qkGkjjEMc1eIk3248CR10e_1nSnc7EGZ

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## CI/CD & Deployment

This project uses **GitHub Actions** for automated testing and deployment.

- **Continuous Integration**: Every push to `main`, `master`, or `dev` triggers a build and type-check.
- **Continuous Deployment**: Every push directly to the `main` branch (including PR merges) will automatically deploy the build output (`dist/` folder) to the configured server via SSH.

### Required Secrets

For deployment to work, ensure the following GitHub Secrets are configured:
1. `DEPLOY_HOST`: Server IP Address
2. `DEPLOY_USER`: SSH Username
3. `DEPLOY_KEY`: SSH Private Key
4. `DEPLOY_PATH`: Target directory on the server
