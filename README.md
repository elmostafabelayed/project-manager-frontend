# Jobsy frontend

Requires Node.js 22.12+ and npm. Copy `.env.example` to `.env` and set `REACT_APP_BACKEND_URL` to the Laravel origin (without `/api`). Existing `REACT_APP_` environment names remain supported by Vite.

```sh
npm ci --legacy-peer-deps
npm start
npm run build
npm test
```

The development server uses port 3000. Production files are written to `build/`. Configure the host to serve `index.html` for client routes such as `/auth/login`. `npm run preview` previews the production build locally.

The Laravel server requires a matching `FRONTEND_URL`, `SANCTUM_STATEFUL_DOMAINS` and session cookie domain for cross-origin cookie authentication. Use HTTPS and secure cookies in production.
