import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Dumbbell, 
  Check, 
  X,
  Zap,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock workout data
const weeklyPlan = [
  { 
    day: 'Mon', 
    date: 23, 
    name: 'Push Day', 
    muscles: ['Chest', 'Shoulders', 'Triceps'],
    status: 'completed',
    exercises: 6
  },
  { 
    day: 'Tue', 
    date: 24, 
    name: 'Pull Day', 
    muscles: ['Back', 'Biceps', 'Rear Delts'],
    status: 'completed',
    exercises: 6
  },
  { 
    day: 'Wed', 
    date: 25, 
    name: 'Rest', 
    muscles: [],
    status: 'rest',
    exercises: 0
  },
  { 
    day: 'Thu', 
    date: 26, 
    name: 'Legs', 
    muscles: ['Quads', 'Hamstrings', 'Glutes'],
    status: 'today',
    exercises: 7
  },
  { 
    day: 'Fri', 
    date: 27, 
    name: 'Push Day', 
    muscles: ['Chest', 'Shoulders', 'Triceps'],
    status: 'upcoming',
    exercises: 6
  },
  { 
    day: 'Sat', 
    date: 28, 
    name: 'Pull Day', 
    muscles: ['Back', 'Biceps', 'Rear Delts'],
    status: 'upcoming',
    exercises: 6
  },
  { 
    day: 'Sun', 
    date: 29, 
    name: 'Rest', 
    muscles: [],
    status: 'rest',
    exercises: 0
  },
];

export default function WorkoutPlan() {
  const [selectedDay, setSelectedDay] = useState(3); // Thursday

  const selectedWorkout = weeklyPlan[selectedDay];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success/20 text-success border-success/30';
      case 'today': return 'bg-primary/20 text-primary border-primary/30';
      case 'skipped': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'rest': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-card text-foreground border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Check className="w-3 h-3" />;
      case 'skipped': return <X className="w-3 h-3" />;
      case 'today': return <Zap className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="px-4 py-6 safe-top">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Workout Plan</h1>
          <p className="text-sm text-muted-foreground">December 2024</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Week Calendar */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4">
        {weeklyPlan.map((day, index) => (
          <motion.button
            key={day.day}
            onClick={() => setSelectedDay(index)}
            className={cn(
              'flex-shrink-0 flex flex-col items-center p-3 rounded-xl border transition-all min-w-[52px]',
              selectedDay === index
                ? 'bg-primary text-primary-foreground border-primary scale-105'
                : getStatusColor(day.status)
            )}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xs font-medium opacity-70">{day.day}</span>
            <span className="text-lg font-bold mt-0.5">{day.date}</span>
            <div className="mt-1 h-4 flex items-center">
              {getStatusIcon(day.status)}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Selected Workout Details */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {selectedWorkout.status === 'rest' ? (
            <GlassCard className="text-center py-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold">Rest Day</h3>
              <p className="text-muted-foreground mt-2">
                Recovery is part of the process. Rest up!
              </p>
            </GlassCard>
          ) : (
            <>
              <GlassCard 
                variant="glow" 
                glowColor={selectedWorkout.status === 'today' ? 'primary' : undefined}
                className="mb-4"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'w-14 h-14 rounded-xl flex items-center justify-center',
                    selectedWorkout.status === 'completed' 
                      ? 'bg-gradient-success' 
                      : 'bg-gradient-cyber'
                  )}>
                    {selectedWorkout.status === 'completed' ? (
                      <Check className="w-7 h-7 text-success-foreground" />
                    ) : (
                      <Dumbbell className="w-7 h-7 text-primary-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{selectedWorkout.name}</h3>
                      {selectedWorkout.status === 'today' && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full">
                          Today
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedWorkout.muscles.join(' • ')}
                    </p>
                    <p className="text-xs text-primary mt-1">
                      {selectedWorkout.exercises} exercises
                    </p>
                  </div>
                </div>

                {selectedWorkout.status === 'today' && (
                  <Link to="/workout/active">
                    <Button className="w-full mt-4 bg-gradient-cyber hover:opacity-90 text-primary-foreground font-semibold">
                      <Zap className="w-4 h-4 mr-2" />
                      Start Workout
                    </Button>
                  </Link>
                )}

                {selectedWorkout.status === 'completed' && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-success stat-number">48:32</p>
                        <p className="text-xs text-muted-foreground">Duration</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold stat-number">24</p>
                        <p className="text-xs text-muted-foreground">Sets</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold stat-number">8,450</p>
                        <p className="text-xs text-muted-foreground">Volume (lbs)</p>
                      </div>
                    </div>
                  </div>
                )}
              </GlassCard>

              {/* Exercise Preview */}
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                Exercises
              </h3>
              <div className="space-y-2">
                {['Bench Press', 'Incline DB Press', 'Cable Flyes', 'Shoulder Press', 'Lateral Raises', 'Tricep Pushdowns'].slice(0, selectedWorkout.exercises).map((exercise, i) => (
                  <GlassCard key={exercise} className="flex items-center gap-3 py-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{exercise}</p>
                      <p className="text-xs text-muted-foreground">4 sets • 8-12 reps</p>
                    </div>
                    {selectedWorkout.status === 'completed' && (
                      <Check className="w-5 h-5 text-success" />
                    )}
                  </GlassCard>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
