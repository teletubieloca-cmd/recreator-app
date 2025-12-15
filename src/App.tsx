import React, { useState } from 'react';
import { Sparkles, Download, Wand2, Info, Command, AlertCircle, Image as ImageIcon } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import { editImageWithGemini } from './services/geminiService';

const App: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('Recreate this character in high quality, isolated on a clean background, no text.');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!sourceImage) return;
    
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await editImageWithGemini(sourceImage, prompt);
      setGeneratedImage(result);
    } catch (err: any) {
      setError(err.message || "An error occurred while generating the image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `athena-recreated-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-mythic-900 via-[#1a1a1a] to-black text-white selection:bg-gold-500/30">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-gold-400 to-mythic-600 p-2 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Athena's Forge
            </h1>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500 border border-white/10 px-3 py-1 rounded-full bg-black/40">
            <Command size={12} />
            <span>Powered by Gemini 2.5 Flash</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        
        {/* Intro */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            Recreate Your Character
          </h2>
          <p className="text-lg text-gray-400">
            Upload your character image (e.g., Wisdom of Athena) and let our AI forge a high-quality recreation without background or text.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Controls */}
          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-mythic-600 text-xs">1</span>
                  Source Image
                 </h3>
                 {sourceImage && (
                   <span className="text-xs text-green-400 flex items-center gap-1">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                     Ready
                   </span>
                 )}
              </div>
              <ImageUpload 
                selectedImage={sourceImage}
                onImageSelect={setSourceImage}
                onClear={() => {
                  setSourceImage(null);
                  setGeneratedImage(null);
                }}
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
               {/* Decorative background glow */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 blur-[50px] pointer-events-none"></div>

              <div className="flex items-center justify-between mb-4 relative z-10">
                 <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-mythic-600 text-xs">2</span>
                  Forge Instructions
                 </h3>
              </div>
              
              <div className="relative z-10">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe how to recreate the character..."
                  className="w-full h-32 bg-black/40 border border-white/20 rounded-xl p-4 text-gray-200 focus:border-gold-400 focus:ring-1 focus:ring-gold-400 focus:outline-none resize-none transition-colors"
                />
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-thin">
                    <button 
                        onClick={() => setPrompt('Recreate this character in high quality, isolated on a white background, no text.')}
                        className="whitespace-nowrap px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-full text-gray-300 transition-colors"
                    >
                        Clean & Isolated
                    </button>
                    <button 
                        onClick={() => setPrompt('Make the character look like a cyberpunk warrior, neon lights, dark background.')}
                        className="whitespace-nowrap px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-full text-gray-300 transition-colors"
                    >
                        Cyberpunk Style
                    </button>
                    <button 
                        onClick={() => setPrompt('Remove the background and increase sharpness.')}
                        className="whitespace-nowrap px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-full text-gray-300 transition-colors"
                    >
                        Remove BG
                    </button>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!sourceImage || isLoading}
                className={`
                  w-full mt-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all
                  ${!sourceImage || isLoading
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-mythic-600 to-red-600 hover:from-mythic-500 hover:to-red-500 text-white transform hover:scale-[1.02] hover:shadow-red-900/50'
                  }
                `}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Forging...
                  </>
                ) : (
                  <>
                    <Wand2 size={20} />
                    Generate Recreation
                  </>
                )}
              </button>
              
              {error && (
                <div className="mt-4 p-4 bg-red-900/30 border border-red-800 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Results */}
          <div className="h-full">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm h-full flex flex-col min-h-[500px]">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gold-500 text-black text-xs font-bold">3</span>
                Result
              </h3>

              <div className="flex-1 flex items-center justify-center bg-black/30 rounded-xl border-2 border-dashed border-white/10 relative overflow-hidden group">
                {generatedImage ? (
                  <>
                    <img 
                      src={generatedImage} 
                      alt="Generated" 
                      className="w-full h-full object-contain max-h-[600px] animate-in fade-in duration-700"
                    />
                     <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                        <button 
                            onClick={handleDownload}
                            className="bg-gold-500 hover:bg-gold-400 text-black font-bold py-2 px-6 rounded-full shadow-lg flex items-center gap-2 transition-transform transform hover:scale-105"
                        >
                            <Download size={18} />
                            Download HD
                        </button>
                     </div>
                  </>
                ) : isLoading ? (
                    <div className="text-center space-y-4">
                        <div className="relative w-24 h-24 mx-auto">
                            <div className="absolute inset-0 border-4 border-mythic-800 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-gold-500 rounded-full border-t-transparent animate-spin"></div>
                            <Sparkles className="absolute inset-0 m-auto text-gold-400 animate-pulse" size={32} />
                        </div>
                        <p className="text-gray-400 animate-pulse">Consulting the Oracle...</p>
                    </div>
                ) : (
                  <div className="text-center text-gray-500 max-w-sm px-6">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Your recreated masterpiece will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;