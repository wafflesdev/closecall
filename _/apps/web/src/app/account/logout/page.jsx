import useAuth from "@/utils/useAuth";
import { Sparkles } from "lucide-react";

export default function LogoutPage() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
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

      <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10 relative z-10">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="w-6 h-6 text-white rotate-45 fill-current" />
          <h1 className="text-3xl font-bold text-white">CloseNotes</h1>
        </div>

        <h2 className="text-xl font-medium text-white/90 mb-8 text-center">
          Sign out of your account?
        </h2>

        <button
          onClick={handleSignOut}
          className="w-full bg-white rounded-lg px-4 py-3 text-base font-semibold text-black hover:bg-white/90 transition-all"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
