import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { 
  Camera, 
  ScanLine, 
  ChevronRight,
  Sparkles,
  History,
  ArrowRight,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type ScanPhase = 'idle' | 'scanning' | 'analyzing' | 'results';

const muscleResults = [
  { muscle: 'Chest', status: 'strong', score: 92 },
  { muscle: 'Back (Lats)', status: 'balanced', score: 85 },
  { muscle: 'Shoulders', status: 'balanced', score: 83 },
  { muscle: 'Left Bicep', status: 'lagging', score: 72, delta: -8 },
  { muscle: 'Right Bicep', status: 'strong', score: 80 },
  { muscle: 'Left Quad', status: 'balanced', score: 86 },
  { muscle: 'Right Quad', status: 'balanced', score: 84 },
  { muscle: 'Abs', status: 'lagging', score: 68 },
];

export default function PhysiqueScan() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<ScanPhase>('idle');
  const [analysisStep, setAnalysisStep] = useState(0);

  const analysisSteps = [
    'Mapping Skeleton...',
    'Volumetric Analysis...',
    'Calculating Symmetry...',
  ];

  const startScan = () => {
    setPhase('scanning');
    
    // Simulate camera capture
    setTimeout(() => {
      setPhase('analyzing');
      
      // Run through analysis steps
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setAnalysisStep(step);
        if (step >= analysisSteps.length) {
          clearInterval(interval);
          setTimeout(() => {
            setPhase('results');
          }, 1000);
        }
      }, 2000);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'strong': return 'text-success';
      case 'balanced': return 'text-primary';
      case 'lagging': return 'text-destructive';
      default: return 'text-foreground';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'strong': return 'bg-success/20';
      case 'balanced': return 'bg-primary/20';
      case 'lagging': return 'bg-destructive/20';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 safe-top">
      <AnimatePresence mode="wait">
        {/* Idle State */}
        {phase === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Physique Analysis</h1>
              <p className="text-muted-foreground text-sm mt-1">
                AI-powered symmetry detection
              </p>
            </div>

            {/* Main Scan Card */}
            <GlassCard variant="glow" glowColor="primary" className="mb-6">
              <div className="aspect-[3/4] rounded-xl bg-muted/30 border border-dashed border-primary/30 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Silhouette guide overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <svg viewBox="0 0 100 150" className="h-[80%] text-primary">
                    <ellipse cx="50" cy="20" rx="15" ry="18" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <line x1="50" y1="38" x2="50" y2="85" stroke="currentColor" strokeWidth="0.5" />
                    <line x1="50" y1="45" x2="25" y2="70" stroke="currentColor" strokeWidth="0.5" />
                    <line x1="50" y1="45" x2="75" y2="70" stroke="currentColor" strokeWidth="0.5" />
                    <line x1="50" y1="85" x2="30" y2="130" stroke="currentColor" strokeWidth="0.5" />
                    <line x1="50" y1="85" x2="70" y2="130" stroke="currentColor" strokeWidth="0.5" />
                  </svg>
                </div>
                
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <Camera className="w-10 h-10 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Position yourself in the frame
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Front double bicep pose recommended
                  </p>
                </div>
              </div>

              <Button 
                onClick={startScan}
                className="w-full mt-4 bg-gradient-cyber hover:opacity-90 text-primary-foreground font-semibold h-12"
              >
                <ScanLine className="w-5 h-5 mr-2" />
                Start Scan
              </Button>
            </GlassCard>

            {/* Previous Scans */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Previous Scans
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary"
                onClick={() => navigate('/symmetry')}
              >
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="space-y-3">
              {[
                { date: 'Dec 20, 2024', score: 82, change: +3 },
                { date: 'Dec 13, 2024', score: 79, change: +1 },
              ].map((scan, i) => (
                <GlassCard key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{scan.date}</p>
                    <p className="text-sm text-muted-foreground">Front Double Bicep</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary stat-number">{scan.score}</p>
                    <p className="text-xs text-success">+{scan.change} pts</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* Scanning State */}
        {phase === 'scanning' && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[70vh]"
          >
            <div className="relative w-48 h-48 mb-8">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="absolute inset-4 rounded-full bg-primary/20 flex items-center justify-center">
                <Camera className="w-16 h-16 text-primary" />
              </div>
            </div>
            <p className="text-lg font-medium">Capturing...</p>
            <p className="text-sm text-muted-foreground">Hold still</p>
          </motion.div>
        )}

        {/* Analyzing State */}
        {phase === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[70vh]"
          >
            <div className="relative w-64 h-64 mb-8">
              {/* Body outline with scan effect */}
              <svg viewBox="0 0 100 150" className="w-full h-full">
                <defs>
                  <linearGradient id="scanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="1" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Body outline */}
                <ellipse cx="50" cy="18" rx="12" ry="15" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.5" />
                <path d="M50,33 L50,80 M50,42 L28,65 M50,42 L72,65 M50,80 L32,125 M50,80 L68,125" 
                      stroke="hsl(var(--primary))" strokeWidth="1" fill="none" opacity="0.5" />
                
                {/* Scan line */}
                <motion.rect
                  x="0"
                  y="0"
                  width="100"
                  height="30"
                  fill="url(#scanGradient)"
                  animate={{ y: [0, 120, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
              </svg>
            </div>

            <div className="text-center">
              {analysisSteps.map((step, i) => (
                <motion.p
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: analysisStep >= i ? 1 : 0.3,
                    y: 0
                  }}
                  className={cn(
                    'text-sm mb-2 transition-colors',
                    analysisStep === i && 'text-primary font-medium',
                    analysisStep > i && 'text-success'
                  )}
                >
                  {analysisStep > i && '✓ '}{step}
                </motion.p>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results State */}
        {phase === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Analysis Complete</h1>
              <p className="text-muted-foreground text-sm mt-1">December 29, 2024</p>
            </div>

            {/* Symmetry Score */}
            <GlassCard variant="glow" glowColor="primary" className="mb-6 text-center">
              <p className="text-xs text-primary uppercase tracking-wide mb-2">
                <Sparkles className="w-4 h-4 inline mr-1" />
                Symmetry Score
              </p>
              <div className="text-6xl font-bold text-gradient-cyber mb-2">85</div>
              <p className="text-sm text-muted-foreground">
                +3 points from last scan
              </p>
              
              <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
                <div>
                  <p className="text-sm font-bold text-success">4</p>
                  <p className="text-xs text-muted-foreground">Strong</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">3</p>
                  <p className="text-xs text-muted-foreground">Balanced</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-destructive">2</p>
                  <p className="text-xs text-muted-foreground">Lagging</p>
                </div>
              </div>
            </GlassCard>

            {/* Symmetry Breakdown */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-3">Muscle Analysis</h2>
              <div className="space-y-2">
                {muscleResults.map((result) => (
                  <GlassCard key={result.muscle} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-3 h-3 rounded-full',
                        result.status === 'strong' && 'bg-success',
                        result.status === 'balanced' && 'bg-primary',
                        result.status === 'lagging' && 'bg-destructive'
                      )} />
                      <span className="font-medium text-sm">{result.muscle}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {result.delta && (
                        <span className={cn(
                          'text-xs font-medium flex items-center gap-0.5',
                          result.delta < 0 ? 'text-destructive' : 'text-success'
                        )}>
                          {result.delta < 0 ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
                          {Math.abs(result.delta)}%
                        </span>
                      )}
                      <span className={cn(
                        'text-sm font-bold stat-number px-2 py-0.5 rounded',
                        getStatusBg(result.status),
                        getStatusColor(result.status)
                      )}>
                        {result.score}
                      </span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* AI Recommendations */}
            <GlassCard className="mb-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                AI Recommendations
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  Add extra unilateral work for left bicep (concentration curls, hammer curls)
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  Increase ab training frequency to 3x per week
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  Maintain current chest development - excellent progress
                </li>
              </ul>
            </GlassCard>

            <Button 
              onClick={() => setPhase('idle')}
              className="w-full"
              variant="outline"
            >
              New Scan
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
