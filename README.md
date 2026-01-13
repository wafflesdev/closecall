# Anything App

A full-stack React Router application with authentication, featuring both web and mobile implementations.

##Features

- **Authentication System**: JWT-based authentication with persistent login
- **Admin Panel**: Protected admin dashboard with modern UI
- **Cross-Platform**: Web app (React Router + Hono) and React Native mobile app
- **Database**: Neon PostgreSQL with custom adapter
- **Styling**: Tailwind CSS with custom animations
- **Development**: Hot reload, TypeScript support

## 📁 Project Structure

```
_/
├── apps/
│   ├── mobile/          # React Native app
│   │   ├── src/
│   │   │   ├── app/     # Expo Router pages
│   │   │   ├── components/
│   │   │   └── utils/
│   │   └── package.json
│   └── web/             # React Router web app
│       ├── src/
│       │   ├── app/     # React Router pages
│       │   ├── components/
│       │   └── utils/
│       └── package.json
```



