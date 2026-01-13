import { useState } from "react";
import useAuth from "@/utils/useAuth";
import { Sparkles, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router";

export default function SignInPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true); // Default to true for persistent login

  const { signInWithCredentials } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!identifier || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      // determine whether identifier is email or username
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const payload = emailRegex.test(identifier)
        ? { email: identifier, password }
        : { username: identifier, password };

      await signInWithCredentials({
        ...payload,
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch (err) {
      const errorMessages = {
        OAuthSignin:
          "Couldn't start sign-in. Please try again or use a different method.",
        OAuthCallback: "Sign-in failed after redirecting. Please try again.",
        OAuthCreateAccount:
          "Couldn't create an account with this sign-in method. Try another option.",
        EmailCreateAccount:
          "This email can't be used to create an account. It may already exist.",
        Callback: "Something went wrong during sign-in. Please try again.",
        OAuthAccountNotLinked:
          "This account is linked to a different sign-in method. Try using that instead.",
        CredentialsSignin:
          "Incorrect email or password. Try again or reset your password.",
        AccessDenied: "You don't have permission to sign in.",
        Configuration:
          "Sign-in isn't working right now. Please try again later.",
        Verification: "Your sign-in link has expired. Request a new one.",
      };

      setError(
        errorMessages[err.message] || "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Starfield Background */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div className="absolute top-[10%] left-[15%] w-0.5 h-0.5 bg-white/20 rounded-full"></div>
        <div className="absolute top-[20%] right-[20%] w-0.5 h-0.5 bg-white/20 rounded-full"></div>
        <div className="absolute top-[35%] left-[8%] w-0.5 h-0.5 bg-white/20 rounded-full"></div>
        <div className="absolute top-[45%] right-[12%] w-0.5 h-0.5 bg-white/20 rounded-full"></div>
        <div className="absolute top-[60%] left-[25%] w-0.5 h-0.5 bg-white/20 rounded-full"></div>
        <div className="absolute top-[70%] right-[30%] w-0.5 h-0.5 bg-white/20 rounded-full"></div>
      </div>

      <form
        noValidate
        onSubmit={onSubmit}
        className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10 relative z-10"
      >
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-all duration-200 hover:scale-105 hover:-translate-x-1 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <Home className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="w-6 h-6 text-white rotate-45 fill-current" />
          <h1 className="text-3xl font-bold text-white">CloseNotes</h1>
        </div>

        <h2 className="text-xl font-medium text-white/90 mb-8 text-center">
          Welcome back
        </h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">
              Email or Username
            </label>
            <input
              required
              name="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your email or username"
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-white/40 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">
              Password
            </label>
            <input
              required
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-white/40 transition-all"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-white/20 bg-white/5 text-white focus:ring-white"
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
            disabled={loading}
            className="w-full bg-white rounded-lg px-4 py-3 text-base font-semibold text-black hover:bg-white/90 hover:scale-105 hover:shadow-lg hover:shadow-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-white/60">
            Don't have an account?{" "}
            <a
              href={`/account/signup${
                typeof window !== "undefined" ? window.location.search : ""
              }`}
              className="text-white hover:underline hover:text-white/90 hover:scale-105 inline-block transition-all duration-200 font-medium"
            >
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
