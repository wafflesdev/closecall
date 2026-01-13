import { useState } from "react";
import useAuth from "@/utils/useAuth";
import { Sparkles, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router";

export default function SignUpPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [rememberMe, setRememberMe] = useState(true); // Default to true for persistent login

  const { signUpWithCredentials } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic client-side validation
    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // Password strength validation
    const passwordErrors = [];
    if (password.length < 8) passwordErrors.push("at least 8 characters");
    if (!/[a-z]/.test(password)) passwordErrors.push("a lowercase letter");
    if (!/[A-Z]/.test(password)) passwordErrors.push("an uppercase letter");
    if (!/[0-9]/.test(password)) passwordErrors.push("a number");
    if (!/[^A-Za-z0-9]/.test(password)) passwordErrors.push("a special character");

    if (passwordErrors.length > 0) {
      setError(`Password must include ${passwordErrors.join(", ")}.`);
      setLoading(false);
      setPassword("");
      setConfirmPassword("");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please retype them.");
      setLoading(false);
      setPassword("");
      setConfirmPassword("");
      return;
    }
    try {
      // send `name` as "First Last". Username is collected client-side but
      // requires backend schema changes to be persisted separately.
      await signUpWithCredentials({
        email,
        password,
        name: `${firstName} ${lastName}`,
        username,
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch (err) {
      const errorMessages = {
        OAuthSignin:
          "Couldn't start sign-up. Please try again or use a different method.",
        OAuthCallback: "Sign-up failed after redirecting. Please try again.",
        OAuthCreateAccount:
          "Couldn't create an account with this sign-up option. Try another one.",
        EmailCreateAccount:
          "This email can't be used. It may already be registered.",
        Callback: "Something went wrong during sign-up. Please try again.",
        OAuthAccountNotLinked:
          "This account is linked to a different sign-in method. Try using that instead.",
        CredentialsSignin:
          "Invalid email or password. If you already have an account, try signing in instead.",
        AccessDenied: "You don't have permission to sign up.",
        Configuration:
          "Sign-up isn't working right now. Please try again later.",
        Verification: "Your sign-up link has expired. Request a new one.",
      };

      setError(
        errorMessages[err.message] || "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  };

  const passwordStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score; // 0-5
  };

  const strengthLabel = (score) => {
    if (score <= 1) return 'Very weak';
    if (score === 2) return 'Weak';
    if (score === 3) return 'Okay';
    if (score === 4) return 'Strong';
    return 'Very strong';
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
          Create your account
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">First name</label>
              <input
                required
                name="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-white/40 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">Last name</label>
              <input
                required
                name="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-white/40 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">Username</label>
            <input
              required
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-white/40 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">Email</label>
            <input
              required
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-white/40 transition-all"
            />
            {error && /email/.test(error.toLowerCase()) && (
              <div className="text-sm text-red-300 mt-1">{error}</div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">Password</label>
            <input
              required
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-white/40 transition-all"
              placeholder="Create a password"
            />
            <div className="mt-2">
              <div className="h-2 w-full bg-white/5 rounded overflow-hidden">
                <div
                  className={`h-2 bg-gradient-to-r from-green-400 to-lime-400 transition-all`}
                  style={{ width: `${(passwordStrength(password) / 5) * 100}%` }}
                />
              </div>
              <div className="text-xs text-white/60 mt-1">{strengthLabel(passwordStrength(password))}</div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">
              Confirm password
            </label>
            <input
              required
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-white/40 transition-all"
              placeholder="Retype your password"
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
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <p className="text-center text-sm text-white/60">
            Already have an account?{" "}
            <a
              href={`/account/signin${
                typeof window !== "undefined" ? window.location.search : ""
              }`}
              className="text-white hover:underline hover:text-white/90 hover:scale-105 inline-block transition-all duration-200 font-medium"
            >
              Sign in
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
