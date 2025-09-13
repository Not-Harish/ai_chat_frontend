import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, Camera as CameraIcon, ArrowLeft, Loader2, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Camera = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to use this feature",
        variant: "destructive",
      });
    }
  }, [facingMode, toast]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Flip the image if using front camera
    if (facingMode === 'user') {
      context.scale(-1, 1);
      context.translate(-canvas.width, 0);
    }
    
    context.drawImage(video, 0, 0);
    
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageDataUrl);
    stopCamera();
  }, [facingMode, stopCamera]);

  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    if (isStreaming) {
      stopCamera();
      setTimeout(startCamera, 100);
    }
  }, [isStreaming, startCamera, stopCamera]);

  const handleAnalyze = async () => {
    if (!capturedImage) return;

    setIsAnalyzing(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Convert data URL to blob for upload
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      
      // Simulate API call to your FastAPI backend
      const formData = new FormData();
      formData.append('file', blob, 'camera-capture.jpg');

      // Simulated response - replace with actual API call
      setTimeout(() => {
        clearInterval(progressInterval);
        setProgress(100);
        
        // Simulate random age prediction (replace with actual API response)
        const predictedAge = Math.floor(Math.random() * 50) + 20;
        setResult(predictedAge);
        setIsAnalyzing(false);
        
        toast({
          title: "Analysis complete!",
          description: `Predicted age: ${predictedAge} years`,
        });
      }, 2000);

    } catch (error) {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      setProgress(0);
      toast({
        title: "Analysis failed",
        description: "Please try again or check your connection",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setResult(null);
    setProgress(0);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center border-b border-border">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">AgePredict</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">Camera Capture</h1>
            <p className="text-muted-foreground">Take a photo to predict age using AI</p>
          </div>

          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CameraIcon className="h-5 w-5" />
                <span>Camera</span>
              </CardTitle>
              <CardDescription>
                Capture a photo for instant age prediction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Camera/Preview Area */}
              <div className="relative bg-black rounded-lg overflow-hidden">
                {!capturedImage ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-64 md:h-80 object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                      style={{ display: isStreaming ? 'block' : 'none' }}
                    />
                    {!isStreaming && (
                      <div className="w-full h-64 md:h-80 flex items-center justify-center">
                        <div className="text-center text-white">
                          <CameraIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg">Camera not active</p>
                          <p className="text-sm opacity-75">Click "Start Camera" below</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="relative">
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="w-full h-64 md:h-80 object-cover"
                    />
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                          <p>Analyzing...</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              {!capturedImage && (
                <div className="flex justify-center space-x-3">
                  {!isStreaming ? (
                    <Button 
                      onClick={startCamera}
                      className="bg-gradient-to-r from-accent to-blue-500 hover:from-accent/90 hover:to-blue-500/90"
                    >
                      <CameraIcon className="h-4 w-4 mr-2" />
                      Start Camera
                    </Button>
                  ) : (
                    <>
                      <Button onClick={capturePhoto} size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                        <CameraIcon className="h-4 w-4 mr-2" />
                        Capture Photo
                      </Button>
                      <Button variant="outline" onClick={switchCamera}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Flip
                      </Button>
                      <Button variant="outline" onClick={stopCamera}>
                        Stop
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* Analysis Progress */}
              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Analyzing image...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              {/* Results */}
              {result !== null && !isAnalyzing && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-2xl font-bold gradient-text mb-2">
                      Predicted Age
                    </h3>
                    <p className="text-4xl font-bold text-primary mb-2">
                      {result} years
                    </p>
                    <p className="text-muted-foreground">
                      Analysis completed with high confidence
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              {capturedImage && (
                <div className="flex gap-3">
                  {!result && !isAnalyzing && (
                    <Button 
                      onClick={handleAnalyze}
                      className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                    >
                      Analyze Photo
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                    className="flex-1"
                  >
                    {result ? 'Take Another' : 'Retake'}
                  </Button>
                </div>
              )}

              <canvas ref={canvasRef} className="hidden" />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Camera;