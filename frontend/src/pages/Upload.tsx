import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, Upload as UploadIcon, ArrowLeft, Image, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, WEBP)",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // ---------------- Updated handleAnalyze ----------------
  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setProgress(0);
    setResult(null);

    // Simulate progress bar
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
      const formData = new FormData();
      formData.append('file', selectedFile);

      // 🔹 Call FastAPI backend
      const response = await fetch("http://localhost:8000/predict_age", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      clearInterval(progressInterval);
      setProgress(100);
      setResult(data.predicted_age); // 🔹 use actual model prediction
      setIsAnalyzing(false);

      toast({
        title: "Analysis complete!",
        description: `Predicted age: ${data.predicted_age} years`,
      });

    } catch (error: any) {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      setProgress(0);
      toast({
        title: "Analysis failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };
  // ---------------------------------------------------------

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setProgress(0);
    setIsAnalyzing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
            <h1 className="text-3xl font-bold gradient-text mb-2">Upload Image</h1>
            <p className="text-muted-foreground">Upload a photo to predict age using AI</p>
          </div>

          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UploadIcon className="h-5 w-5" />
                <span>Select Image</span>
              </CardTitle>
              <CardDescription>
                Drag and drop an image or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Area */}
              {!preview && (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">Drop your image here</p>
                  <p className="text-muted-foreground mb-4">or</p>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    Browse Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <p className="text-sm text-muted-foreground mt-4">
                    Supports JPG, PNG, WEBP (max 20MB)
                  </p>
                </div>
              )}

              {/* Preview & Analysis */}
              {preview && (
                <div className="space-y-6">
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                    />
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <div className="text-center text-white">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                          <p>Analyzing...</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {isAnalyzing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Analyzing the image...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="w-full" />
                    </div>
                  )}

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

                  <div className="flex gap-3">
                    {!result && !isAnalyzing && (
                      <Button 
                        onClick={handleAnalyze}
                        className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                      >
                        Analyze Image
                      </Button>
                    )}
                    {result && !isAnalyzing && (
                      <Link to="/chatbot" className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-accent to-blue-500 hover:from-accent/90 hover:to-blue-500/90">
                          Chat with AI
                        </Button>
                      </Link>
                    )}
                    <Button 
                      variant="outline" 
                      onClick={handleReset}
                      className="flex-1"
                    >
                      {result ? 'Analyze Another' : 'Reset'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Upload
