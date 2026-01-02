import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Timer,
  Check,
  Play,
  RefreshCw,
  History,
  ChevronRight,
  Lightbulb,
  Target,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SetData {
  id: number;
  weight: string;
  reps: string;
  completed: boolean;
  isWarmup: boolean;
  tags: string[];
  prevWeight?: number;
  prevReps?: number;
}

interface ExerciseData {
  id: string;
  name: string;
  targetSets: number;
  targetReps: string;
  restSeconds: number;
  sets: SetData[];
  supersetId?: string;
  notes?: string;
}

// Mock exercise details database
const exerciseDetails: Record<string, {
  description: string;
  muscleGroups: string[];
  tips: string[];
  formCues: string[];
  videoPlaceholder: string;
  alternatives: { id: string; name: string; reason: string }[];
}> = {
  '1': {
    description: 'The barbell bench press is a compound movement that primarily targets the chest, with secondary involvement of the shoulders and triceps.',
    muscleGroups: ['Chest', 'Front Delts', 'Triceps'],
    tips: [
      'Keep your feet flat on the floor for stability',
      'Retract and depress your shoulder blades',
      'Lower the bar to your mid-chest with control',
      'Drive through your feet as you press up',
    ],
    formCues: [
      'Grip: Slightly wider than shoulder-width',
      'Arch: Maintain natural spine arch',
      'Elbows: 45-75° angle from torso',
      'Touch: Bar touches mid-chest',
    ],
    videoPlaceholder: 'bench-press',
    alternatives: [
      { id: 'alt1', name: 'Dumbbell Bench Press', reason: 'No barbell available' },
      { id: 'alt2', name: 'Push-ups', reason: 'Bodyweight alternative' },
      { id: 'alt3', name: 'Machine Chest Press', reason: 'Easier setup' },
    ],
  },
  '2': {
    description: 'The incline dumbbell press targets the upper portion of the chest while also engaging the shoulders and triceps.',
    muscleGroups: ['Upper Chest', 'Front Delts', 'Triceps'],
    tips: [
      'Set bench to 30-45 degree angle',
      'Keep dumbbells in line with upper chest',
      'Control the weight on the way down',
      'Press dumbbells together at the top',
    ],
    formCues: [
      'Angle: 30-45 degrees',
      'Path: Press up and slightly in',
      'Grip: Neutral or angled',
      'Range: Full stretch at bottom',
    ],
    videoPlaceholder: 'incline-db-press',
    alternatives: [
      { id: 'alt1', name: 'Incline Barbell Press', reason: 'Heavier loading' },
      { id: 'alt2', name: 'Low-to-High Cable Fly', reason: 'Constant tension' },
      { id: 'alt3', name: 'Landmine Press', reason: 'Shoulder-friendly' },
    ],
  },
  '3': {
    description: 'Cable flyes isolate the chest muscles through a horizontal adduction movement pattern, providing constant tension throughout the range.',
    muscleGroups: ['Chest', 'Front Delts'],
    tips: [
      'Keep a slight bend in your elbows',
      'Focus on squeezing your chest at the peak',
      'Control the negative portion',
      'Think about hugging a tree',
    ],
    formCues: [
      'Stance: Staggered for stability',
      'Arms: Slight elbow bend maintained',
      'Path: Arc motion, not pressing',
      'Peak: Squeeze chest hard at center',
    ],
    videoPlaceholder: 'cable-flyes',
    alternatives: [
      { id: 'alt1', name: 'Dumbbell Flyes', reason: 'No cables available' },
      { id: 'alt2', name: 'Pec Deck Machine', reason: 'Easier to control' },
      { id: 'alt3', name: 'Resistance Band Flyes', reason: 'Home gym option' },
    ],
  },
};

interface ExerciseDetailSheetProps {
  exercise: ExerciseData | null;
  isOpen: boolean;
  onClose: () => void;
  onSetComplete: (exerciseId: string, setId: number) => void;
  onInputChange: (exerciseId: string, setId: number, field: 'weight' | 'reps', value: string) => void;
  onSwapExercise: (exerciseId: string, newExerciseId: string, newName: string) => void;
  onViewHistory: (exerciseId: string) => void;
  elapsedTime: number;
  unit: 'kg' | 'lbs';
  deloadMode: boolean;
}

export function ExerciseDetailSheet({
  exercise,
  isOpen,
  onClose,
  onSetComplete,
  onInputChange,
  onSwapExercise,
  onViewHistory,
  elapsedTime,
  unit,
  deloadMode,
}: ExerciseDetailSheetProps) {
  const [showSwapOptions, setShowSwapOptions] = useState(false);
  
  if (!exercise) return null;

  const details = exerciseDetails[exercise.id] || {
    description: 'A strength training exercise targeting multiple muscle groups.',
    muscleGroups: ['Primary', 'Secondary'],
    tips: ['Focus on controlled movements', 'Maintain proper form throughout'],
    formCues: ['Setup properly', 'Breathe consistently'],
    videoPlaceholder: 'exercise',
    alternatives: [],
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[95vh] rounded-t-3xl bg-background border-border overflow-hidden p-0">
        {/* Sticky Header with Timer */}
        <div className="sticky top-0 z-10 glass border-b border-border/50">
          <SheetHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-bold">{exercise.name}</SheetTitle>
              <div className="flex items-center gap-2 text-primary">
                <Timer className="w-4 h-4" />
                <span className="font-mono font-bold">{formatTime(elapsedTime)}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              {details.muscleGroups.map((muscle) => (
                <span key={muscle} className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                  {muscle}
                </span>
              ))}
            </div>
          </SheetHeader>
        </div>

        <div className="overflow-y-auto h-[calc(95vh-80px)] pb-24">
          <div className="p-4 space-y-4">
            {/* Video/Animation Placeholder */}
            <GlassCard noPadding className="overflow-hidden">
              <div className="aspect-video bg-muted/50 flex flex-col items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <motion.div
                  className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Play className="w-10 h-10 text-primary ml-1" />
                </motion.div>
                <p className="text-sm text-muted-foreground mt-3 relative z-10">Tap to play form video</p>
              </div>
            </GlassCard>

            {/* Form Cues */}
            <GlassCard>
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Form Cues
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {details.formCues.map((cue, i) => (
                  <div key={i} className="text-xs p-2 bg-muted/30 rounded-lg">
                    {cue}
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Tips */}
            <GlassCard>
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-warning" />
                Pro Tips
              </h4>
              <ul className="space-y-2">
                {details.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* Set Logging */}
            <GlassCard noPadding>
              <div className="p-4 border-b border-border/50">
                <h4 className="font-semibold text-sm">Log Sets</h4>
                <p className="text-xs text-muted-foreground">{exercise.targetSets} sets × {exercise.targetReps} reps</p>
              </div>
              
              <div className="divide-y divide-border/30">
                <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs text-muted-foreground font-medium bg-muted/30">
                  <div className="col-span-2">SET</div>
                  <div className="col-span-4">PREV</div>
                  <div className="col-span-2">{unit.toUpperCase()}</div>
                  <div className="col-span-2">REPS</div>
                  <div className="col-span-2 text-center">✓</div>
                </div>

                {exercise.sets.map((set) => (
                  <div
                    key={set.id}
                    className={cn(
                      'grid grid-cols-12 gap-2 px-4 py-3 items-center transition-colors',
                      set.completed && 'bg-success/10'
                    )}
                  >
                    <div className="col-span-2 text-sm font-medium">{set.id}</div>
                    <div className="col-span-4 text-xs text-muted-foreground">
                      {set.prevWeight} × {set.prevReps}
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={set.weight}
                        onChange={(e) => onInputChange(exercise.id, set.id, 'weight', e.target.value)}
                        className="h-8 text-center text-sm"
                        placeholder={String(deloadMode ? Math.round((set.prevWeight || 0) * 0.6) : set.prevWeight)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={set.reps}
                        onChange={(e) => onInputChange(exercise.id, set.id, 'reps', e.target.value)}
                        className="h-8 text-center text-sm"
                        placeholder={String(set.prevReps)}
                      />
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <Button
                        variant={set.completed ? 'default' : 'ghost'}
                        size="icon"
                        className={cn(
                          'h-8 w-8',
                          set.completed && 'bg-success hover:bg-success/90'
                        )}
                        onClick={() => onSetComplete(exercise.id, set.id)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => onViewHistory(exercise.id)}
              >
                <History className="w-4 h-4" />
                View History
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setShowSwapOptions(!showSwapOptions)}
              >
                <RefreshCw className="w-4 h-4" />
                Swap Exercise
              </Button>
            </div>

            {/* Swap Options */}
            {showSwapOptions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <GlassCard>
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-warning" />
                    Alternative Exercises
                  </h4>
                  <div className="space-y-2">
                    {details.alternatives.map((alt) => (
                      <button
                        key={alt.id}
                        onClick={() => {
                          onSwapExercise(exercise.id, alt.id, alt.name);
                          setShowSwapOptions(false);
                          onClose();
                        }}
                        className="w-full p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                      >
                        <p className="font-medium text-sm">{alt.name}</p>
                        <p className="text-xs text-muted-foreground">{alt.reason}</p>
                      </button>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
