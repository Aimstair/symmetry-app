import { useAppStore } from '@/store/useAppStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  AlertTriangle, 
  Flame, 
  Dumbbell,
  Calendar,
  Zap,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user, nutritionTargets, workoutPlans } = useAppStore();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const todayMacros = {
    protein: { current: 145, target: nutritionTargets?.protein || 180 },
    carbs: { current: 220, target: nutritionTargets?.carbs || 300 },
    fats: { current: 55, target: nutritionTargets?.fats || 70 },
  };

  const todayWorkout = workoutPlans[0] || {
    id: '1',
    name: 'Push Day',
    dayName: 'Monday',
    targetMuscles: ['chest', 'shoulders', 'triceps'],
    exercises: [],
    status: 'scheduled',
  };

  const hasMissedWorkout = false;

  return (
    <div className="px-4 py-6 safe-top">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-sm text-muted-foreground font-medium">{getGreeting()}</p>
        <h1 className="text-3xl font-bold mt-1">
          <span className="text-gradient-cyber">{user?.name || 'Athlete'}</span>
        </h1>
      </motion.div>

      {/* Missed Workout Banner */}
      {hasMissedWorkout && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4"
        >
          <GlassCard variant="glow" glowColor="warning" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Missed yesterday's workout</p>
              <p className="text-xs text-muted-foreground">Shift schedule forward?</p>
            </div>
            <Button variant="outline" size="sm" className="border-warning/50 text-warning hover:bg-warning/10">
              Shift
            </Button>
          </GlassCard>
        </motion.div>
      )}

      {/* Daily Macros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <Flame className="w-4 h-4 text-primary" />
            Daily Macros
          </h2>
          <span className="text-xs text-muted-foreground font-medium">
            {nutritionTargets?.calories || 2500} cal target
          </span>
        </div>
        <GlassCard className="py-5">
          <div className="flex justify-around items-center">
            <CircularProgress value={todayMacros.protein.current} max={todayMacros.protein.target} color="primary" label="Protein" sublabel="g" size={80} />
            <CircularProgress value={todayMacros.carbs.current} max={todayMacros.carbs.target} color="warning" label="Carbs" sublabel="g" size={80} />
            <CircularProgress value={todayMacros.fats.current} max={todayMacros.fats.target} color="success" label="Fats" sublabel="g" size={80} />
          </div>
        </GlassCard>
      </motion.div>

      {/* Today's Mission */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-primary" />
            Today's Mission
          </h2>
          <Link to="/workout" className="text-xs text-primary font-medium flex items-center hover:underline">
            View Plan <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <GlassCard variant="glow" glowColor="primary" className="overflow-hidden breathe">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-cyber flex items-center justify-center shadow-lg">
              <Dumbbell className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{todayWorkout.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {(todayWorkout.targetMuscles as string[]).join(' • ')}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-primary font-medium">{todayWorkout.exercises?.length || 6} exercises</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">~60 min</span>
              </div>
            </div>
          </div>
          <Link to="/workout/active">
            <Button className="w-full mt-4 bg-gradient-cyber hover:opacity-90 text-primary-foreground font-semibold h-11 shadow-lg shadow-primary/20">
              <Zap className="w-4 h-4 mr-2" />
              Start Workout
            </Button>
          </Link>
        </GlassCard>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            This Week
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <GlassCard className="text-center py-5">
            <span className="text-2xl font-bold text-primary stat-number">4</span>
            <p className="text-xs text-muted-foreground mt-1">Workouts</p>
          </GlassCard>
          <GlassCard className="text-center py-5">
            <span className="text-2xl font-bold text-success stat-number">12.5k</span>
            <p className="text-xs text-muted-foreground mt-1">Volume</p>
          </GlassCard>
          <GlassCard className="text-center py-5">
            <span className="text-2xl font-bold text-warning stat-number">3h 20m</span>
            <p className="text-xs text-muted-foreground mt-1">Time</p>
          </GlassCard>
        </div>
      </motion.div>

      {/* Symmetry Score Teaser */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Link to="/scan">
          <GlassCard hoverable className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs text-primary font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI Physique Analysis
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Scan to see your symmetry score
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                <ChevronRight className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-cyber opacity-50" />
          </GlassCard>
        </Link>
      </motion.div>
    </div>
  );
}
