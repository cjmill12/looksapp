import React, { useState, useRef } from 'react';
import { Camera, Sparkles, RotateCcw, Download, Check } from 'lucide-react';

const HairstyleGenerator = () => {
  const [step, setStep] = useState('camera'); // 'camera', 'selectStyle', 'generating', 'result'
  const [selfieImage, setSelfieImage] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [stream, setStream] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const hairstyles = [
    { 
      id: 1,
      name: 'Classic Slick Back', 
      url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      description: 'Polished & Professional'
    },
    { 
      id: 2,
      name: 'Textured Quiff', 
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      description: 'Modern & Stylish'
    },
    { 
      id: 3,
      name: 'Side Part Fade', 
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      description: 'Sharp & Clean'
    },
    { 
      id: 4,
      name: 'Messy Fringe', 
      url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
      description: 'Casual & Cool'
    },
    { 
      id: 5,
      name: 'Wavy Flow', 
      url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop',
      description: 'Natural & Relaxed'
    },
    { 
      id: 6,
      name: 'Tapered Crop', 
      url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      description: 'Athletic & Fresh'
    },
    { 
      id: 7,
      name: 'Pompadour', 
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      description: 'Bold & Confident'
    },
    { 
      id: 8,
      name: 'Undercut Style', 
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      description: 'Edgy & Trendy'
    },
    { 
      id: 9,
      name: 'Brushed Up', 
      url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
      description: 'Volume & Height'
    },
  ];

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Unable to access camera. Please ensure you have granted camera permissions.');
    }
  };

  const captureSelfie = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/png');
      setSelfieImage(imageData);
      
      // Stop camera stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      
      setStep('selectStyle');
    }
  };

  const retakeSelfie = () => {
    setSelfieImage(null);
    setSelectedStyle(null);
    setGeneratedImage(null);
    setStep('camera');
    startCamera();
  };

  const selectStyle = (style) => {
    setSelectedStyle(style);
  };

  const generateHairstyle = async () => {
    setStep('generating');
    
    // Simulate AI processing with a realistic delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // For demo purposes, we'll create a composite image
    // In a real app, this would call an AI API
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const selfie = new Image();
    selfie.src = selfieImage;
    
    selfie.onload = () => {
      canvas.width = selfie.width;
      canvas.height = selfie.height;
      
      // Draw the selfie
      ctx.drawImage(selfie, 0, 0);
      
      // Add a subtle overlay effect to simulate the hairstyle change
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = '#8b4513';
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.4);
      
      // Add some text indicating this is a demo
      ctx.globalAlpha = 1;
      ctx.font = 'bold 30px Arial';
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;
      ctx.textAlign = 'center';
      const text = `${selectedStyle.name} Preview`;
      ctx.strokeText(text, canvas.width / 2, 50);
      ctx.fillText(text, canvas.width / 2, 50);
      
      setGeneratedImage(canvas.toDataURL('image/png'));
      setStep('result');
    };
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.download = `hairstyle-${selectedStyle.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = generatedImage;
      link.click();
    }
  };

  const startOver = () => {
    setSelfieImage(null);
    setSelectedStyle(null);
    setGeneratedImage(null);
    setStep('camera');
    startCamera();
  };

  // Initialize camera on mount
  React.useEffect(() => {
    if (step === 'camera') {
      startCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [step]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
            <h1 className="text-3xl font-bold text-center mb-2">AI Hairstyle Generator ✨</h1>
            <p className="text-center opacity-90">Transform your look with AI magic!</p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-4 p-6 bg-gray-50">
            <div className={`flex items-center gap-2 ${step === 'camera' ? 'text-purple-600 font-bold' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step !== 'camera' && selfieImage ? 'bg-green-500 text-white' : step === 'camera' ? 'bg-purple-600 text-white' : 'bg-gray-300 text-white'}`}>
                {step !== 'camera' && selfieImage ? <Check size={16} /> : '1'}
              </div>
              <span className="hidden sm:inline">Take Selfie</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center gap-2 ${step === 'selectStyle' ? 'text-purple-600 font-bold' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'generating' || step === 'result' ? 'bg-green-500 text-white' : step === 'selectStyle' ? 'bg-purple-600 text-white' : 'bg-gray-300 text-white'}`}>
                {step === 'generating' || step === 'result' ? <Check size={16} /> : '2'}
              </div>
              <span className="hidden sm:inline">Choose Style</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center gap-2 ${step === 'generating' || step === 'result' ? 'text-purple-600 font-bold' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'result' ? 'bg-green-500 text-white' : step === 'generating' ? 'bg-purple-600 text-white' : 'bg-gray-300 text-white'}`}>
                {step === 'result' ? <Check size={16} /> : '3'}
              </div>
              <span className="hidden sm:inline">Generate</span>
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {/* Step 1: Camera */}
          {step === 'camera' && (
            <div className="p-6">
              <div className="relative bg-black rounded-2xl overflow-hidden shadow-xl mb-6 aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={captureSelfie}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-xl transition-all transform hover:scale-105"
              >
                <Camera size={24} />
                Capture Selfie
              </button>
            </div>
          )}

          {/* Step 2: Select Style */}
          {step === 'selectStyle' && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Your Selfie</h2>
                <div className="relative">
                  <img src={selfieImage} alt="Your selfie" className="w-full rounded-2xl shadow-lg" />
                  <button
                    onClick={retakeSelfie}
                    className="absolute top-4 right-4 bg-white text-gray-700 px-4 py-2 rounded-full shadow-lg hover:bg-gray-100 transition-all flex items-center gap-2"
                  >
                    <RotateCcw size={16} />
                    Retake
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Choose Your Style</h2>
                <div className="grid grid-cols-3 gap-3">
                  {hairstyles.map((hair) => (
                    <button
                      key={hair.id}
                      onClick={() => selectStyle(hair)}
                      className={`relative overflow-hidden rounded-xl transition-all ${
                        selectedStyle?.id === hair.id
                          ? 'ring-4 ring-purple-500 shadow-xl scale-105'
                          : 'ring-2 ring-gray-200 hover:ring-purple-300'
                      }`}
                    >
                      <img 
                        src={hair.url} 
                        alt={hair.name}
                        className="w-full aspect-square object-cover"
                      />
                      <div className={`absolute bottom-0 left-0 right-0 p-2 ${
                        selectedStyle?.id === hair.id
                          ? 'bg-gradient-to-t from-purple-600 to-transparent' 
                          : 'bg-gradient-to-t from-black/70 to-transparent'
                      }`}>
                        <div className="text-white text-xs font-bold">{hair.name}</div>
                      </div>
                      {selectedStyle?.id === hair.id && (
                        <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full p-1">
                          <Check size={16} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generateHairstyle}
                disabled={!selectedStyle}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                  selectedStyle
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Sparkles size={24} />
                Generate My New Look
              </button>
            </div>
          )}

          {/* Step 3: Generating */}
          {step === 'generating' && (
            <div className="p-6 flex flex-col items-center justify-center min-h-96">
              <div className="relative mb-6">
                <div className="w-24 h-24 border-8 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Magic in Progress...</h2>
              <p className="text-gray-600 text-center">Creating your perfect hairstyle with {selectedStyle?.name}</p>
            </div>
          )}

          {/* Step 4: Result */}
          {step === 'result' && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Your New Look! ✨</h2>
                <img src={generatedImage} alt="Generated result" className="w-full rounded-2xl shadow-lg" />
                <p className="text-sm text-gray-500 mt-2 text-center italic">
                  Demo preview - In production, this would use AI to realistically apply the hairstyle
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={downloadImage}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                >
                  <Download size={20} />
                  Download
                </button>
                <button
                  onClick={startOver}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                >
                  <Camera size={20} />
                  Try Another
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-white/90 backdrop-blur rounded-2xl p-4 text-center text-sm text-gray-600">
          <p className="font-semibold mb-1">💡 Demo Version</p>
          <p>This is a demo showing the user flow. In production, integrate with AI APIs like Stable Diffusion or commercial hairstyle APIs for realistic results.</p>
        </div>
      </div>
    </div>
  );
};

export default HairstyleGenerator;