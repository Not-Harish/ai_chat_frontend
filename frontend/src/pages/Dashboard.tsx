import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Camera, Upload, User, LogOut, History } from "lucide-react";

const Dashboard = () => {
  const handleLogout = () => {
    // In real app, this would use Supabase auth
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center border-b border-border">
        <div className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold gradient-text">AgePredict</span>
        </div>
        <div className="flex items-center space-x-4">
          {/* <Button variant="ghost" size="sm">
            <History className="h-4 w-4 mr-2" />
            History
          </Button> */}
          {/* <Button variant="ghost" size="sm">
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button> */}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4 leading-tight md:leading-tight">
              Welcome to AgePredict
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose how you'd like to predict age using our AI technology
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Image Option */}
            <Link to="/upload">
              <Card className="glass-morphism hover:glow-primary transition-all duration-300 cursor-pointer group h-full">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                    <Upload className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Upload Image</CardTitle>
                  <CardDescription className="text-lg">
                    Upload a photo from your device for AI age analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-3 text-muted-foreground">
                    <p>✓ Supports JPG, PNG, WEBP formats</p>
                    <p>✓ Instant results with detailed analysis</p>
                    <p>✓ High accuracy AI model</p>
                  </div>
                  <Button className="w-full mt-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                    Choose File
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Camera Option */}
            <Link to="/camera">
              <Card className="glass-morphism hover:glow-accent transition-all duration-300 cursor-pointer group h-full">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 rounded-full bg-accent/10 w-fit group-hover:bg-accent/20 transition-colors">
                    <Camera className="h-12 w-12 text-accent" />
                  </div>
                  <CardTitle className="text-2xl">Use Camera</CardTitle>
                  <CardDescription className="text-lg">
                    Take a photo with your camera for real-time prediction
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-3 text-muted-foreground">
                    <p>✓ Real-time camera access</p>
                    <p>✓ Instant capture and analysis</p>
                    <p>✓ Mobile and desktop friendly</p>
                  </div>
                  <Button className="w-full mt-6 bg-gradient-to-r from-accent to-blue-500 hover:from-accent/90 hover:to-blue-500/90">
                    Open Camera
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Recent Predictions
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Recent Predictions</h2>
            <Card className="glass-morphism">
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No predictions yet</p>
                  <p>Start by uploading an image or using your camera</p>
                </div>
              </CardContent>
            </Card>
          </div> */}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;