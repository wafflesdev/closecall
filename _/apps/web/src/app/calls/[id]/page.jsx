import { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowLeft,
  Loader2,
  Copy,
  Check,
  Trash2,
} from "lucide-react";
import useUser from "@/utils/useUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function CallDetailPage({ params }) {
  const { id } = params;
  const { data: user, loading: userLoading } = useUser();
  const queryClient = useQueryClient();

  const [copiedField, setCopiedField] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch call
  const { data: callData, isLoading: callLoading } = useQuery({
    queryKey: ["call", id],
    queryFn: async () => {
      const response = await fetch(`/api/calls/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch call");
      }
      return response.json();
    },
    enabled: !!user,
  });

  // Delete call mutation
  const deleteCallMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/calls/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete call");
      }
      return response.json();
    },
    onSuccess: () => {
      window.location.href = "/dashboard";
    },
  });

  const handleCopy = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDelete = () => {
    deleteCallMutation.mutate();
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
    }
  }, [user, userLoading]);

  if (userLoading || callLoading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  const call = callData?.call;

  if (!call) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Call not found</h2>
          <a
            href="/dashboard"
            className="text-white hover:underline transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

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
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 w-full flex items-center justify-between gap-8 py-3 backdrop-blur border-b border-white/10 bg-black/60 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10 w-full flex items-center justify-between gap-8">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </a>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {call.title}
          </h1>
          <p className="text-white/40 text-sm">
            {new Date(call.created_at).toLocaleString()}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - AI Analysis */}
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-white" />
                  Summary
                </h2>
                <button
                  onClick={() => handleCopy(call.summary || "", "summary")}
                  className="text-white/40 hover:text-white transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedField === "summary" ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-white/80 whitespace-pre-wrap text-sm leading-relaxed">
                {call.summary || "No summary available"}
              </p>
            </div>

            {/* Key Insights */}
            <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Key Insights
                </h2>
                <button
                  onClick={() =>
                    handleCopy(call.key_insights || "", "insights")
                  }
                  className="text-white/40 hover:text-white transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedField === "insights" ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-white/70 whitespace-pre-wrap text-sm leading-relaxed">
                {call.key_insights || "No insights available"}
              </p>
            </div>

            {/* Pain Points */}
            <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Pain Points
                </h2>
                <button
                  onClick={() => handleCopy(call.pain_points || "", "pain")}
                  className="text-white/40 hover:text-white transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedField === "pain" ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-white/80 whitespace-pre-wrap text-sm leading-relaxed">
                {call.pain_points || "No pain points identified"}
              </p>
            </div>

            {/* Next Steps */}
            <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Next Steps</h2>
                <button
                  onClick={() => handleCopy(call.next_steps || "", "steps")}
                  className="text-white/40 hover:text-white transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedField === "steps" ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-white/80 whitespace-pre-wrap text-sm leading-relaxed">
                {call.next_steps || "No next steps identified"}
              </p>
            </div>
          </div>

          {/* Right Column - Transcript */}
          <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 border border-white/10 lg:sticky lg:top-24 lg:h-fit lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Transcript</h2>
              <button
                onClick={() => handleCopy(call.transcript || "", "transcript")}
                className="text-white/40 hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                {copiedField === "transcript" ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-white/40 whitespace-pre-wrap text-sm leading-relaxed">
              {call.transcript}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#121212] rounded-2xl p-6 md:p-8 max-w-md w-full border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">Delete Call?</h2>
            <p className="text-white/60 mb-6">
              Are you sure you want to delete this call? This action cannot be
              undone.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-3 rounded-lg text-white/60 hover:text-white transition-all font-medium"
                disabled={deleteCallMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteCallMutation.isPending}
                className="bg-white text-black rounded-lg px-6 py-3 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deleteCallMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
