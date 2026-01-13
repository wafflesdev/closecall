import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Plus,
  FileText,
  Loader2,
  LogOut,
  Mic,
  Square,
  Circle,
} from "lucide-react";
import useUser from "@/utils/useUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function DashboardPage() {
  const { data: user, loading: userLoading } = useUser();
  const queryClient = useQueryClient();

  const [showNewCallModal, setShowNewCallModal] = useState(false);
  const [title, setTitle] = useState("");
  const [transcript, setTranscript] = useState("");

  // Recording states
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedTranscript, setRecordedTranscript] = useState("");
  const [recordingError, setRecordingError] = useState(null);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const [audioSource, setAudioSource] = useState("microphone"); // "microphone" or "desktop"

  // Fetch calls
  const { data: callsData, isLoading: callsLoading } = useQuery({
    queryKey: ["calls"],
    queryFn: async () => {
      const response = await fetch("/api/calls");
      if (!response.ok) {
        throw new Error("Failed to fetch calls");
      }
      return response.json();
    },
    enabled: !!user,
  });

  // Create call mutation
  const createCallMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create call");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calls"] });
      setShowNewCallModal(false);
      setTitle("");
      setTranscript("");
    },
  });

  const handleCreateCall = (e) => {
    e.preventDefault();
    if (!title || !transcript) return;

    createCallMutation.mutate({ title, transcript });
  };

  // Recording functions
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    setRecordingError(null);
    setRecordedTranscript("");
    setRecordingTime(0);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setRecordingError(
        "Your browser doesn't support speech recognition. Try Chrome or Edge.",
      );
      return;
    }

    try {
      // Get audio stream based on selected source
      let stream;
      if (audioSource === "desktop") {
        try {
          stream = await navigator.mediaDevices.getDisplayMedia({
            audio: {
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false,
            },
            video: false,
          });
        } catch (error) {
          console.error("Desktop audio capture error:", error);
          if (error.name === "NotAllowedError") {
            setRecordingError("Desktop audio capture was cancelled.");
          } else {
            setRecordingError("Failed to capture desktop audio. Please try again.");
          }
          return;
        }
      } else {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          });
        } catch (error) {
          console.error("Microphone access error:", error);
          if (error.name === "NotAllowedError") {
            setRecordingError(
              "Microphone access denied. Please allow microphone access and try again.",
            );
          } else {
            setRecordingError("Failed to access microphone. Please try again.");
          }
          return;
        }
      }

      // Store the stream for cleanup
      mediaStreamRef.current = stream;

      // Create Web Audio API context for processing
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Create a source from the stream
      const source = audioContext.createMediaStreamSource(stream);

      // Create a processor to send audio to recognition
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      source.connect(processor);
      processor.connect(audioContext.destination);

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      let finalTranscript = "";

      recognition.onresult = (event) => {
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        setRecordedTranscript(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setRecordingError(
            "Speech recognition access denied. Please allow access and try again.",
          );
        } else {
          setRecordingError(`Recording error: ${event.error}`);
        }
        stopRecording();
      };

      recognition.onend = () => {
        if (isRecording) {
          recognition.start();
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
      setShowRecordModal(true);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Failed to start recording:", error);
      setRecordingError(
        "Failed to start recording. Please check your settings.",
      );
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Stop all media streams
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setIsRecording(false);
  };

  const handleSaveRecording = () => {
    if (!recordedTranscript.trim()) {
      setRecordingError(
        "No transcript to save. Please record some audio first.",
      );
      return;
    }

    const callTitle = `Call Recording - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;

    createCallMutation.mutate(
      { title: callTitle, transcript: recordedTranscript.trim() },
      {
        onSuccess: () => {
          setShowRecordModal(false);
          setRecordedTranscript("");
          setRecordingTime(0);
          setRecordingError(null);
        },
      },
    );
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
    }
  }, [user, userLoading]);

  if (userLoading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  const calls = callsData?.calls || [];

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
          <a href="/" className="inline-flex items-center gap-2">
            <Sparkles className="w-[18px] h-[18px] text-white rotate-45 fill-current" />
            <span className="text-lg font-bold text-white">CloseNotes</span>
          </a>

          <div className="flex items-center gap-4">
            <span className="text-sm text-white/60 hidden sm:block">
              {user.email}
            </span>
            <a
              href="/account/logout"
              className="text-white/60 hover:text-white transition-colors"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Your Calls
            </h1>
            <p className="text-white/60">
              Upload transcripts and get AI-powered insights
            </p>
          </div>
          <div className="flex gap-3 self-start sm:self-auto flex-wrap">
            <button
              onClick={startRecording}
              disabled={isRecording}
              className="bg-red-600 rounded-lg px-6 py-3 text-white font-semibold hover:bg-red-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mic className="w-5 h-5" />
              Record Call
            </button>
            <button
              onClick={() => setShowNewCallModal(true)}
              className="bg-white rounded-lg px-6 py-3 text-black font-semibold hover:bg-white/90 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Call
            </button>
          </div>
        </div>

        {/* Calls List */}
        {callsLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        ) : calls.length === 0 ? (
          <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-12 border border-white/10 text-center">
            <FileText className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No calls yet
            </h3>
            <p className="text-white/60 mb-6">
              Upload your first call transcript to get started
            </p>
            <button
              onClick={() => setShowNewCallModal(true)}
              className="bg-white rounded-lg px-6 py-3 text-black font-semibold hover:bg-white/90 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Call
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {calls.map((call) => (
              <a
                key={call.id}
                href={`/calls/${call.id}`}
                className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/40 hover:bg-white/[0.05] transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white transition-colors">
                      {call.title}
                    </h3>
                    {call.summary && (
                      <p className="text-white/60 text-sm line-clamp-2">
                        {call.summary}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-white/40 whitespace-nowrap">
                    {new Date(call.created_at).toLocaleDateString()}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* New Call Modal */}
      {showNewCallModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#121212] rounded-2xl p-6 md:p-8 max-w-2xl w-full border border-white/10 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">New Call</h2>

            <form onSubmit={handleCreateCall} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Call Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Discovery call with Acme Corp"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Transcript
                </label>
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Paste your call transcript here..."
                  rows={12}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all resize-none"
                  required
                />
              </div>

              {createCallMutation.error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-300">
                  {createCallMutation.error.message}
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCallModal(false);
                    setTitle("");
                    setTranscript("");
                  }}
                  className="px-6 py-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all font-medium"
                  disabled={createCallMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createCallMutation.isPending || !title || !transcript
                  }
                  className="bg-white rounded-lg px-6 py-3 text-black font-semibold hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {createCallMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Create Call"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recording Modal */}
      {showRecordModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#121212] rounded-2xl p-6 md:p-8 max-w-2xl w-full border border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recording Call</h2>
              <div className="flex items-center gap-3">
                {isRecording && (
                  <div className="flex items-center gap-2 text-red-500">
                    <Circle className="w-3 h-3 fill-current animate-pulse" />
                    <span className="text-sm font-mono">
                      {formatTime(recordingTime)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {recordingError && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-300 mb-4">
                {recordingError}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-white/80 mb-3">
                Audio Source
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => !isRecording && setAudioSource("microphone")}
                  disabled={isRecording}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    audioSource === "microphone"
                      ? "bg-white text-black"
                      : "bg-white/10 text-white hover:bg-white/20"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Mic className="w-4 h-4 inline mr-2" />
                  Microphone
                </button>
                <button
                  onClick={() => !isRecording && setAudioSource("desktop")}
                  disabled={isRecording}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    audioSource === "desktop"
                      ? "bg-white text-black"
                      : "bg-white/10 text-white hover:bg-white/20"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  🖥️ Desktop Audio
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Live Transcription
              </label>
              <div className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white min-h-[300px] max-h-[400px] overflow-y-auto">
                {recordedTranscript || (
                  <span className="text-white/40">
                    {isRecording ? "Listening..." : `Starting ${audioSource}...`}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              {isRecording ? (
                <button
                  onClick={stopRecording}
                  className="bg-red-600 rounded-lg px-6 py-3 text-white font-semibold hover:bg-red-700 transition-all flex items-center gap-2"
                >
                  <Square className="w-5 h-5" />
                  Stop Recording
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setShowRecordModal(false);
                      setRecordedTranscript("");
                      setRecordingTime(0);
                      setRecordingError(null);
                    }}
                    className="px-6 py-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all font-medium"
                    disabled={createCallMutation.isPending}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveRecording}
                    disabled={
                      createCallMutation.isPending || !recordedTranscript.trim()
                    }
                    className="bg-white rounded-lg px-6 py-3 text-black font-semibold hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {createCallMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Save & Analyze"
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
