
import React, { useRef, useState } from 'react';
import { Camera, Upload, X, RefreshCw } from 'lucide-react';

interface ScannerProps {
  onImageCapture: (base64: string) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onImageCapture }) => {
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Não foi possível aceder à câmara.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        onImageCapture(dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageCapture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (showCamera) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4">
        <video ref={videoRef} autoPlay playsInline className="max-w-full max-h-[80vh] rounded-lg shadow-2xl" />
        <canvas ref={canvasRef} className="hidden" />
        <div className="mt-8 flex gap-4">
          <button 
            onClick={stopCamera}
            className="p-4 bg-gray-800 rounded-full text-white"
          >
            <X />
          </button>
          <button 
            onClick={capturePhoto}
            className="p-6 bg-indigo-600 rounded-full text-white shadow-lg shadow-indigo-500/50"
          >
            <Camera className="w-8 h-8" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <button 
        onClick={startCamera}
        className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-700 rounded-2xl bg-gray-900/50 hover:bg-gray-800/50 hover:border-indigo-500 transition-all group"
      >
        <Camera className="w-10 h-10 text-gray-500 group-hover:text-indigo-500 mb-3" />
        <span className="font-semibold text-gray-300">Câmara</span>
        <span className="text-xs text-gray-500 mt-1">Digitalizar gráfico físico</span>
      </button>

      <button 
        onClick={() => fileInputRef.current?.click()}
        className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-700 rounded-2xl bg-gray-900/50 hover:bg-gray-800/50 hover:border-indigo-500 transition-all group"
      >
        <Upload className="w-10 h-10 text-gray-500 group-hover:text-indigo-500 mb-3" />
        <span className="font-semibold text-gray-300">Upload</span>
        <span className="text-xs text-gray-500 mt-1">Captura de ecrã (PNG, JPG)</span>
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileUpload}
        />
      </button>
    </div>
  );
};
