import { useState } from "react";
import { useNavigate } from "react-router";
import { Users, FileText, BarChart3, Settings, FileCode, Database, ArrowLeft, Sparkles } from "lucide-react";
import useUser from "@/utils/useUser";
import useAuth from "@/utils/useAuth";

export default function AdminPage() {
  const { data: user, loading } = useUser();
  const { signInWithCredentials } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true); // Default to true for persistent login
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signInWithCredentials({
        email: identifier,
        password,
        callbackUrl: "/admin",
        redirect: false,
      });
      // If successful, the page will re-render with user
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-md mx-auto relative z-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Admin Login
              </h1>
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            </div>
            <p className="text-gray-400">Access the admin panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">Email</label>
              <input
                type="email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-red-400 transition-all"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-red-400 transition-all"
                placeholder="Password"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-red-500 focus:ring-red-500"
                />
                Remember me
              </label>
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? "Signing in..." : "Login to Admin"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-white/70 hover:text-white transition-colors duration-200"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const adminSections = [
    {
      title: "User Management",
      description: "Manage users and permissions",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      hoverColor: "hover:from-blue-600 hover:to-cyan-600"
    },
    {
      title: "Content Management",
      description: "Edit and publish content",
      icon: FileText,
      color: "from-green-500 to-emerald-500",
      hoverColor: "hover:from-green-600 hover:to-emerald-600"
    },
    {
      title: "Analytics",
      description: "View site statistics",
      icon: BarChart3,
      color: "from-purple-500 to-pink-500",
      hoverColor: "hover:from-purple-600 hover:to-pink-600"
    },
    {
      title: "Settings",
      description: "Configure application settings",
      icon: Settings,
      color: "from-orange-500 to-red-500",
      hoverColor: "hover:from-orange-600 hover:to-red-600"
    },
    {
      title: "Logs",
      description: "View system logs",
      icon: FileCode,
      color: "from-indigo-500 to-purple-500",
      hoverColor: "hover:from-indigo-600 hover:to-purple-600"
    },
    {
      title: "Backup",
      description: "Manage backups",
      icon: Database,
      color: "from-teal-500 to-green-500",
      hoverColor: "hover:from-teal-600 hover:to-green-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Manage your application with powerful admin tools and insights
          </p>
        </div>

        {/* Admin Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {adminSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <button
                key={index}
                className={`
                  group relative overflow-hidden
                  bg-gradient-to-br ${section.color} ${section.hoverColor}
                  p-8 rounded-2xl shadow-2xl
                  transform transition-all duration-300 ease-out
                  hover:scale-105 hover:shadow-3xl hover:shadow-white/10
                  hover:-translate-y-2
                  active:scale-95 active:translate-y-0
                  border border-white/10 hover:border-white/20
                  backdrop-blur-sm
                `}
                onClick={() => {
                  // Placeholder for future functionality
                  console.log(`Navigate to ${section.title}`);
                }}
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Icon with animation */}
                <div className="relative z-10 mb-4">
                  <Icon className="w-12 h-12 text-white mb-2 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-100 transition-colors duration-300">
                    {section.title}
                  </h3>
                  <p className="text-white/90 group-hover:text-white transition-colors duration-300">
                    {section.description}
                  </p>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 rounded-2xl"></div>

                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Back to Home Button */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="
              group relative overflow-hidden
              bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600
              text-white px-8 py-4 rounded-xl font-semibold
              transform transition-all duration-300 ease-out
              hover:scale-110 hover:shadow-2xl hover:shadow-white/10
              hover:-translate-y-1
              active:scale-95 active:translate-y-0
              border border-gray-600 hover:border-gray-500
              flex items-center gap-3
            "
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Icon with animation */}
            <ArrowLeft className="w-5 h-5 transform transition-transform duration-300 group-hover:-translate-x-1 group-hover:scale-110" />

            {/* Text */}
            <span className="relative z-10 group-hover:text-yellow-200 transition-colors duration-300">
              Back to Home
            </span>

            {/* Shine effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}