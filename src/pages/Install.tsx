import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Smartphone, 
  Share, 
  Plus,
  Check,
  Zap,
  WifiOff,
  Bell
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for beforeinstallprompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const features = [
    { icon: Zap, title: 'Lightning Fast', desc: 'Works instantly, even on slow connections' },
    { icon: WifiOff, title: 'Works Offline', desc: 'Track workouts without internet' },
    { icon: Bell, title: 'Notifications', desc: 'Get workout reminders' },
  ];

  return (
    <div className="min-h-screen bg-background bg-cyber-grid bg-grid-pattern px-4 py-8 safe-top">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-cyber flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
          <Smartphone className="w-10 h-10 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold">Install Symmetry</h1>
        <p className="text-muted-foreground mt-2">
          Get the full app experience on your device
        </p>
      </motion.div>

      {/* Already Installed */}
      {isInstalled && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <GlassCard variant="glow" glowColor="success" className="text-center mb-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-success/20 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-xl font-bold text-success">Already Installed!</h2>
            <p className="text-muted-foreground mt-2">
              Symmetry is ready to use on your device
            </p>
            <Link to="/">
              <Button className="mt-4 bg-gradient-cyber hover:opacity-90">
                Open App
              </Button>
            </Link>
          </GlassCard>
        </motion.div>
      )}

      {/* Install Button (Android/Desktop) */}
      {!isInstalled && deferredPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Button 
            onClick={handleInstall}
            className="w-full h-14 bg-gradient-cyber hover:opacity-90 text-primary-foreground font-semibold text-lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Install App
          </Button>
        </motion.div>
      )}

      {/* iOS Instructions */}
      {!isInstalled && isIOS && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard variant="glow" glowColor="primary" className="mb-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-primary" />
              Install on iPhone/iPad
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">Tap the Share button</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    Look for <Share className="w-4 h-4" /> in Safari's toolbar
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">Scroll down and tap</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Plus className="w-4 h-4" /> "Add to Home Screen"
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">Tap "Add"</p>
                  <p className="text-sm text-muted-foreground">
                    Symmetry will appear on your home screen
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Android/Desktop Instructions (fallback if no prompt) */}
      {!isInstalled && !deferredPrompt && !isIOS && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard variant="glow" glowColor="primary" className="mb-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-primary" />
              Install on Your Device
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">Open browser menu</p>
                  <p className="text-sm text-muted-foreground">
                    Tap the three dots (⋮) in Chrome or your browser
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">Select "Install app" or "Add to Home screen"</p>
                  <p className="text-sm text-muted-foreground">
                    The option name varies by browser
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">Confirm installation</p>
                  <p className="text-sm text-muted-foreground">
                    Symmetry will be added to your apps
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Why Install?
        </h3>
        <div className="space-y-3">
          {features.map((feature, i) => (
            <GlassCard key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{feature.title}</p>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>

      {/* Back to app */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center"
      >
        <Link to="/" className="text-sm text-primary hover:underline">
          Continue in browser →
        </Link>
      </motion.div>
    </div>
  );
}
