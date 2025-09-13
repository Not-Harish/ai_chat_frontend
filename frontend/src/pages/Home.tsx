import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Camera, Upload, Zap } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold gradient-text">AgePredict</span>
        </div>
        <Link to="/login">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Login
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold gradient-text leading-tight">
              AI Age Prediction
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Discover your age with cutting-edge artificial intelligence. Upload a photo or use your camera for instant results.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white px-8 py-4 text-lg glow-primary">
                Get Started
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground px-8 py-4 text-lg">
              Learn More
            </Button>
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-2 gap-6 mt-16">
            <Card className="glass-morphism p-8 hover:glow-primary transition-all duration-300">
              <div className="flex items-center space-x-4 mb-4">
                <Upload className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-semibold">Upload Photo</h3>
              </div>
              <p className="text-muted-foreground">
                Simply upload any photo and let our AI analyze and predict the age with remarkable accuracy.
              </p>
            </Card>

            <Card className="glass-morphism p-8 hover:glow-accent transition-all duration-300">
              <div className="flex items-center space-x-4 mb-4">
                <Camera className="h-8 w-8 text-accent" />
                <h3 className="text-xl font-semibold">Live Camera</h3>
              </div>
              <p className="text-muted-foreground">
                Use your device's camera for real-time age prediction. Perfect for quick and convenient analysis.
              </p>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-muted-foreground">
        <p>&copy; 2024 AgePredict. Powered by advanced AI technology.</p>
      </footer>
    </div>
  );
};

export default Home;