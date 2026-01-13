import { Sparkles, FileAudio, Brain, Send, ArrowRight, Shield } from "lucide-react";
import useUser from "@/utils/useUser";
import { useNavigate } from "react-router";

export default function HomePage() {
  const { data: user, loading } = useUser();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Starfield Background */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div className="absolute top-[10%] left-[15%] w-0.5 h-0.5 bg-white/20 rounded-full"></div>
        <div className="absolute top-[20%] right-[20%] w-0.5 h-0.5 bg-white/20 rounded-full"></div>
        <div className="absolute top-[35%] left-[8%] w-0.5 h-0.5 bg-white/20 rounded-full"></div>
        <div className="absolute top-[45%] right-[12%] w-0.5 h-0.5 bg-white/20 rounded-full"></div>
        <div className="absolute top-[60%] left-[25%] w-0.5 h-0.5 bg-white/20 rounded-full"></div>
        <div className="absolute top-[70%] right-[30%] w-0.5 h-0.5 bg-white/20 rounded-full"></div>
        <div className="absolute top-[15%] left-[70%] w-0.5 h-0.5 bg-white/20 rounded-full"></div>
        <div className="absolute top-[25%] right-[60%] w-0.5 h-0.5 bg-white/20 rounded-full"></div>
        <div className="absolute top-[40%] left-[45%] w-0.5 h-0.5 bg-white/20 rounded-full"></div>
        <div className="absolute top-[55%] right-[45%] w-0.5 h-0.5 bg-white/20 rounded-full"></div>
        <div className="absolute top-[75%] left-[60%] w-0.5 h-0.5 bg-white/20 rounded-full"></div>
        <div className="absolute top-[80%] right-[15%] w-0.5 h-0.5 bg-white/20 rounded-full"></div>
        <div className="absolute top-[30%] left-[35%] w-0.5 h-0.5 bg-white/20 rounded-full"></div>
        <div className="absolute top-[50%] right-[70%] w-0.5 h-0.5 bg-white/20 rounded-full"></div>
        <div className="absolute top-[65%] left-[80%] w-0.5 h-0.5 bg-white/20 rounded-full"></div>
        <div className="absolute top-[85%] right-[50%] w-0.5 h-0.5 bg-white/20 rounded-full"></div>
        <div className="absolute top-[5%] left-[50%] w-0.5 h-0.5 bg-white/20 rounded-full"></div>
        <div className="absolute top-[90%] left-[20%] w-0.5 h-0.5 bg-white/20 rounded-full"></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 w-full flex items-center justify-between gap-8 py-3 backdrop-blur border-b border-white/10 bg-black/60 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10 w-full flex items-center justify-between gap-8">
          <div className="inline-flex items-center gap-2">
            <Sparkles className="w-[18px] h-[18px] text-white rotate-45 fill-current" />
            <span className="text-lg font-bold text-white">CloseNotes</span>
          </div>

          {!loading && (
            <div className="flex items-center gap-4">
              {/* Admin Login Button - Always visible for testing */}
              <button
                onClick={() => navigate("/admin")}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-sm font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 border border-red-500/30"
              >
                <Shield className="w-4 h-4" />
                Admin Login
              </button>

              {user ? (
                <div className="flex items-center gap-4">
                  <a
                    href="/admin"
                    className="rounded-full border border-white text-white font-semibold text-sm px-5 py-2 flex items-center gap-2 hover:bg-white/10 transition"
                  >
                    Admin
                  </a>
                  <a
                    href="/dashboard"
                    className="rounded-full border border-white text-white font-semibold text-sm px-5 py-2 flex items-center gap-2 hover:bg-white/10 transition"
                  >
                    Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                <a
                  href="/account/signup"
                  className="rounded-full border border-white text-white font-semibold text-sm px-5 py-2 flex items-center gap-2 hover:bg-white/10 transition"
                >
                  Get started
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="pt-24 md:pt-32 flex flex-col items-center text-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs text-white backdrop-blur mb-8">
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-black rotate-45 fill-current" />
            </div>
            AI-powered meeting notes for sales teams
          </div>

          {/* Main Heading */}
          <h1 className="font-medium leading-tight text-5xl sm:text-6xl lg:text-7xl text-white max-w-4xl mb-8">
            Turn sales calls into CRM-ready notes
          </h1>

          {/* Sub-heading */}
          <p className="max-w-2xl text-base md:text-lg text-white/70 mb-12">
            <span className="font-semibold text-white">
              Upload your call transcripts
            </span>{" "}
            and get perfectly formatted notes with key insights and follow-up
            tasks in seconds.
          </p>

          {/* CTA Button */}
          <a
            href={user ? "/dashboard" : "/account/signup"}
            className="bg-white text-black font-semibold px-8 py-4 text-lg rounded-lg hover:bg-white/90 transition inline-flex items-center gap-2"
          >
            {user ? "Go to Dashboard" : "Start for free"}
            <ArrowRight className="w-5 h-5" />
          </a>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-24 w-full max-w-5xl">
            <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <FileAudio className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Upload transcripts
              </h3>
              <p className="text-white/60 text-sm">
                Paste your call transcripts from any source and let AI do the
                work
              </p>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                AI analysis
              </h3>
              <p className="text-white/60 text-sm">
                Extract key insights, pain points, and next steps automatically
              </p>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <Send className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                CRM-ready output
              </h3>
              <p className="text-white/60 text-sm">
                Get structured notes ready to paste into your favorite CRM
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-32"></div>
    </div>
  );
}
