"use client";

import { useEffect, useRef, useState } from "react";
import { Download, X, Share, Plus, CheckCircle, Monitor, Smartphone } from "lucide-react";

/* ─── Platform detection ─── */
function getOS(): "ios" | "android" | "desktop" {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) return "ios";
  if (/android/i.test(ua)) return "android";
  return "desktop";
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

type Step = "idle" | "ios-guide" | "android-guide" | "pick-platform" | "success";

function StepRow({ num, title, children }: { num: number; title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 mb-5">
      <div className="w-8 h-8 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/30 flex items-center justify-center flex-shrink-0">
        <span className="text-[#00FFA3] text-xs font-black">{num}</span>
      </div>
      <div className="flex-1">
        <div className="text-white text-sm font-bold mb-2">{title}</div>
        {children}
      </div>
    </div>
  );
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [step, setStep] = useState<Step>("idle");
  const [installing, setInstalling] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const os = getOS();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (isStandalone()) setIsInstalled(true);
    const mq = window.matchMedia("(display-mode: standalone)");
    const h = (e: MediaQueryListEvent) => setIsInstalled(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  useEffect(() => {
    const h = (e: Event) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener("beforeinstallprompt", h as EventListener);
    return () => window.removeEventListener("beforeinstallprompt", h as EventListener);
  }, []);

  useEffect(() => {
    const h = () => { setIsInstalled(true); setDeferredPrompt(null); setStep("success"); };
    window.addEventListener("appinstalled", h);
    return () => window.removeEventListener("appinstalled", h);
  }, []);

  useEffect(() => {
    if (step === "idle") return;
    const h = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) setStep("idle");
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [step]);

  useEffect(() => {
    document.body.style.overflow = step !== "idle" ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [step]);

  // Even if already installed, keep the button available if the user wants information.
  // if (isInstalled) return null;

  const openGuide = () => {
    if (os === "ios") setStep("ios-guide");
    else if (os === "android") setStep("android-guide");
    else setStep("pick-platform");
  };

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      setInstalling(true);
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setInstalling(false);
      setDeferredPrompt(null);
      if (outcome === "accepted") {
        setStep("success");
        setIsInstalled(true);
      }
    }
  };

  return (
    <>
      <button
        onClick={openGuide}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00FFA3]/40 text-[#00FFA3] text-xs font-bold hover:bg-[#00FFA3]/10 hover:border-[#00FFA3] transition-all"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Install App</span>
      </button>

      {step !== "idle" && (
        <div className="fixed inset-0 z-[999999] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setStep("idle")} />
          <div ref={modalRef} className="relative w-full max-w-sm rounded-[2rem] bg-[#0b0c0f] border border-white/10 shadow-2xl overflow-hidden p-6" style={{ animation: "slideUp 0.3s ease-out" }}>
            
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                 <Download className="w-5 h-5 text-[#00FFA3]" />
                 <span className="text-white font-black uppercase text-sm">PWA Install Information</span>
              </div>
              <button onClick={() => setStep("idle")} className="p-2 text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            {step === "pick-platform" && (
               <div className="space-y-4">
                  <p className="text-white/60 text-xs mb-6 px-1">Select your platform for specific installation instructions:</p>
                  <button onClick={() => setStep("android-guide")} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#00FFA3]/30 transition-all">
                    <Smartphone className="w-5 h-5 text-green-500" />
                    <span className="text-white font-bold">Android Guide</span>
                  </button>
                  <button onClick={() => setStep("ios-guide")} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#00FFA3]/30 transition-all">
                    <Monitor className="w-5 h-5 text-blue-500" />
                    <span className="text-white font-bold">iOS Safari Guide</span>
                  </button>
                  {deferredPrompt && (
                    <button onClick={handleNativeInstall} className="w-full mt-6 py-4 bg-[#00FFA3] text-[#0b0c0f] rounded-2xl font-black uppercase tracking-widest text-xs">Install on Desktop</button>
                  )}
               </div>
            )}

            {step === "ios-guide" && (
                <div className="space-y-6">
                  <StepRow num={1} title="Tap the Share Icon">
                    <p className="text-white/60 text-xs font-medium">
                      Tap the <span className="text-blue-400 font-bold">Share icon</span> in Safari. It might be at the <span className="text-white font-bold text-xs uppercase tracking-widest">top or bottom</span> of your browser window.
                    </p>
                    <div className="mt-4 flex justify-center p-4 bg-white/5 rounded-2xl border border-white/5">
                       <Share className="w-8 h-8 text-blue-400" />
                    </div>
                  </StepRow>
                  <StepRow num={2} title="Add to Home Screen">
                    <p className="text-white/60 text-xs font-medium">Scroll down and tap <span className="text-white font-bold">"Add to Home Screen"</span> to complete installation.</p>
                    <div className="mt-4 flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                       <Plus className="w-6 h-6 text-white" />
                       <span className="text-white font-bold text-sm">Add to Home Screen</span>
                    </div>
                  </StepRow>
                  <button onClick={() => setStep("idle")} className="w-full py-4 bg-[#00FFA3] text-[#0b0c0f] rounded-2xl font-black uppercase tracking-widest text-xs">Got it!</button>
                </div>
            )}

            {step === "android-guide" && (
                <div className="space-y-6">
                  <StepRow num={1} title="Open Browser Menu">
                    <p className="text-white/60 text-xs font-medium">Tap the <span className="text-[#00FFA3] font-bold">browser menu (⋮)</span> usually found in the top-right corner.</p>
                    <div className="mt-4 flex justify-center p-4 bg-white/5 rounded-2xl border border-white/5">
                       <span className="text-3xl text-white opacity-40">⋮</span>
                    </div>
                  </StepRow>
                  <StepRow num={2} title="Install App">
                    <p className="text-white/60 text-xs font-medium">Click on <span className="text-white font-bold">"Add to home screen"</span> or the <span className="text-[#00FFA3] font-bold uppercase text-[10px]">Download icon</span> if it appears in the menu.</p>
                    <div className="mt-4 flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                       <div className="flex items-center gap-4">
                         <Plus className="w-6 h-6 text-white" />
                         <span className="text-white font-bold text-sm">Add to Home Screen</span>
                       </div>
                       <Download className="w-6 h-6 text-[#00FFA3]" />
                    </div>
                  </StepRow>
                  {deferredPrompt ? (
                    <button onClick={handleNativeInstall} className="w-full py-4 bg-[#00FFA3] text-[#0b0c0f] rounded-2xl font-black uppercase tracking-widest text-xs">Install Now</button>
                  ) : (
                    <button onClick={() => setStep("idle")} className="w-full py-4 bg-[#00FFA3] text-[#0b0c0f] rounded-2xl font-black uppercase tracking-widest text-xs">I'll do it now</button>
                  )}
                </div>
            )}

            {step === "success" && (
                <div className="flex flex-col items-center gap-6 py-10">
                   <div className="w-20 h-20 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-[#00FFA3]" />
                   </div>
                   <div className="text-center">
                     <h3 className="text-white font-black text-xl tracking-tighter uppercase">Success!</h3>
                     <p className="text-white/40 text-xs mt-2">CapTrade Pro is ready on your device.</p>
                   </div>
                   <button onClick={() => setStep("idle")} className="w-full mt-4 py-4 bg-white/5 text-white rounded-2xl font-bold">Close</button>
                </div>
            )}

          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </>
  );
}
