# Anything App

A full-stack React Router application with authentication, featuring both web and mobile implementations.

## 🚀 Features

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

## 🛠️ Tech Stack

### Web App
- **Framework**: React Router v7
- **Server**: Hono (Node.js)
- **Database**: Neon PostgreSQL
- **Authentication**: @auth/create with JWT
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Language**: TypeScript/JavaScript

### Mobile App
- **Framework**: React Native + Expo
- **Navigation**: Expo Router
- **Styling**: React Native styles
- **Build Tool**: Metro + EAS

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Git
- For mobile: Expo CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd anything
   ```

2. **Install dependencies**
   ```bash
   # Web app
   cd _/apps/web
   npm install

   # Mobile app
   cd ../mobile
   npm install
   ```

3. **Environment Setup**
   Create `.env` file in `_/apps/web/`:
   ```env
   AUTH_SECRET=your-secret-key
   DATABASE_URL=your-neon-database-url
   ```

4. **Database Setup**
   Run migrations:
   ```bash
   cd _/apps/web
   node run-migration.js
   ```

### Development

1. **Web App**
   ```bash
   cd _/apps/web
   npm run dev
   ```
   Visit: http://localhost:4000

2. **Mobile App**
   ```bash
   cd _/apps/mobile
   npx expo start
   ```

## 🔐 Authentication

The app uses a custom authentication system with:
- Sign in/Sign up forms
- JWT sessions
- Persistent login (Remember Me)
- Admin role protection

### Admin Access
- Visit `/admin` after authentication
- Requires admin privileges

## 📱 Mobile Features

- Cross-platform React Native app
- Expo Router for navigation
- Native authentication flow
- Responsive design

## 🗄️ Database Schema

- `auth_users`: User accounts
- `auth_accounts`: OAuth accounts
- `auth_sessions`: User sessions
- `auth_verification_token`: Email verification

## 🎨 Styling

- **Web**: Tailwind CSS with custom gradients and animations
- **Mobile**: React Native StyleSheet with consistent theming

## 📦 Scripts

### Web App
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests

### Mobile App
- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the [Issues](https://github.com/your-username/anything/issues) page
- Create a new issue with detailed information

---

Built with ❤️ using React Router, Hono, and Expo