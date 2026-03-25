"use client";
import { useState, useEffect, useRef, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Camera, 
    Upload, 
    ShieldCheck, 
    CheckCircle2, 
    RefreshCw, 
    ArrowRight, 
    ChevronLeft,
    AlertCircle,
    User,
    CreditCard
} from "lucide-react";
import { api } from "@/lib/api";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function MobileKycPage({ params }: { params: Promise<{ token: string }> }) {
    const router = useRouter();
    const { token } = use(params);
    const [step, setStep] = useState<"loading" | "intro" | "front" | "back" | "selfie" | "processing" | "success" | "error">("loading");
    const [tokenData, setTokenData] = useState<any>(null);
    const [error, setError] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchTokenData();
    }, [token]);

    const fetchTokenData = async () => {
        try {
            const data = await api.get(`/kyc/mobile/${token}`);
            setTokenData(data);
            setStep("intro");
        } catch (err: any) {
            setError(err.message || "Invalid or expired session");
            setStep("error");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "front" | "back" | "selfie") => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));
        setIsUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            await api.postMultipart(`/kyc/upload/mobile/${token}/${type}`, formData);
            
            if (type === "front") {
                if (tokenData.documentType === "PASSPORT") setStep("selfie");
                else setStep("back");
            } else if (type === "back") {
                setStep("selfie");
            } else if (type === "selfie") {
                handleFinish();
            }
            setPreview(null);
        } catch (err: any) {
            setError(err.message || "Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleFinish = async () => {
        setStep("processing");
        try {
            await api.post(`/kyc/verify/mobile/${token}`, {});
            setStep("success");
        } catch (err: any) {
            setError(err.message || "Verification failed");
            setStep("error");
        }
    };

    const renderContent = () => {
        switch (step) {
            case "loading":
                return (
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <RefreshCw className="w-10 h-10 text-[#00FFA3] animate-spin" />
                        <p className="text-slate-400 font-medium">Securing connection...</p>
                    </div>
                );
            case "intro":
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-center">
                        <div className="w-20 h-20 bg-[#00FFA3]/10 rounded-3xl mx-auto flex items-center justify-center border border-[#00FFA3]/20">
                            <ShieldCheck className="w-10 h-10 text-[#00FFA3]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-2">Live Identity Check</h1>
                            <p className="text-sm text-slate-400">Welcome, {tokenData?.userName || 'User'}. Please prepare your {
                                tokenData?.documentType === 'PASSPORT' ? 'International Passport' : 
                                tokenData?.documentType === 'DRIVER_LICENSE' ? "Driver's License" : 
                                'National ID Card'}.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-4">
                            <div className="flex gap-3">
                                <CheckCircle2 className="w-5 h-5 text-[#00FFA3] shrink-0" />
                                <p className="text-xs text-slate-300">Ensure good lighting and a plain background.</p>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircle2 className="w-5 h-5 text-[#00FFA3] shrink-0" />
                                <p className="text-xs text-slate-300">Keep the document within the frame and clear.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setStep("front")}
                            className="w-full py-4 bg-[#00FFA3] text-[#020617] rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            Start Capture <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                );
            case "front":
            case "back":
            case "selfie":
                const isSelfie = step === "selfie";
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="flex items-center justify-between">
                            <button onClick={() => setStep(step === "front" ? "intro" : step === "back" ? "front" : "back")} className="text-slate-500">
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                             <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                Step {step === "front" ? "1" : step === "back" ? "2" : "3"} of {tokenData?.documentType === "PASSPORT" ? "2" : "3"}
                            </span>
                            <div className="w-6" />
                        </div>

                        <div className="text-center">
                            <h2 className="text-xl font-bold text-white mb-1">
                                {isSelfie ? "Take a Selfie" : `Upload ${step === "front" ? "Front" : "Back"} Side`}
                            </h2>
                            <p className="text-xs text-slate-500 uppercase tracking-tighter">
                                {isSelfie ? "Look directly into the camera" : `Position your ${tokenData?.documentType === "PASSPORT" ? "Passport" : "ID Card"} clearly`}
                            </p>
                        </div>

                        <div className="aspect-[4/3] bg-white/5 border-2 border-dashed border-white/10 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center group pointer-events-none">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
                                        {isSelfie ? <User className="w-8 h-8 text-slate-400" /> : <CreditCard className="w-8 h-8 text-slate-400" />}
                                    </div>
                                    <p className="text-sm text-slate-500">Tap to capture</p>
                                </>
                            )}
                        </div>

                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isUploading ? 'bg-white/10 text-slate-500' : 'bg-white text-[#020617] hover:scale-[1.02] active:scale-[0.98]'}`}
                        >
                            {isUploading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                            {isUploading ? "Uploading..." : `Capture ${isSelfie ? "Selfie" : "Document"}`}
                        </button>

                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            accept="image/*" 
                            capture={isSelfie ? "user" : "environment"}
                            onChange={(e) => handleFileUpload(e, step as any)} 
                            className="hidden" 
                        />
                    </motion.div>
                );
            case "processing":
                return (
                    <div className="text-center space-y-8 py-10">
                        <div className="relative mx-auto w-24 h-24">
                            <div className="absolute inset-0 rounded-full border-4 border-[#00FFA3]/10" />
                            <div className="absolute inset-0 rounded-full border-4 border-t-[#00FFA3] animate-spin" />
                            <ShieldCheck className="absolute inset-0 m-auto w-10 h-10 text-[#00FFA3]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2">Analyzing Identity</h2>
                            <p className="text-sm text-slate-500 px-4">Our AI is performing OCR and Biometric matching. This usually takes 10-20 seconds.</p>
                        </div>
                    </div>
                );
            case "success":
                return (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full mx-auto flex items-center justify-center border border-green-500/20">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-2">Verification Successful</h1>
                            <p className="text-sm text-slate-400">Everything looks great. Your identity has been verified and your account limits have been increased.</p>
                        </div>
                        <div className="p-4 bg-green-500/5 rounded-2xl border border-green-500/10 inline-block w-full">
                            <p className="text-xs text-green-500 font-bold uppercase tracking-widest">Account Status: VERIFIED</p>
                        </div>
                        <button 
                            onClick={() => router.push('/dashboard')}
                            className="w-full py-4 bg-[#00FFA3] text-[#020617] rounded-xl font-bold transition-all"
                        >
                            Go to Dashboard
                        </button>
                    </motion.div>
                );
            case "error":
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6">
                        <div className="w-20 h-20 bg-red-500/10 rounded-full mx-auto flex items-center justify-center border border-red-500/20">
                            <AlertCircle className="w-10 h-10 text-red-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-2">Verification Error</h1>
                            <p className="text-sm text-red-500/80">{error}</p>
                        </div>
                        <button 
                            onClick={fetchTokenData}
                            className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all"
                        >
                            Try Again
                        </button>
                    </motion.div>
                );
        }
    };

    return (
        <main className="min-h-screen bg-[#020617] flex flex-col p-6 font-sans">
            <div className="flex justify-center mb-10">
                <Image src="/logo.png" alt="Logo" width={140} height={40} className="h-8 w-auto object-contain" />
            </div>

            <div className="flex-1 flex flex-col justify-center">
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <ShieldCheck className="w-20 h-20 text-white" />
                    </div>
                    {renderContent()}
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">Secure Institutions Grade KYC v2.0</p>
            </div>
        </main>
    );
}
