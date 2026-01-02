import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  TrendingUp,
  Calendar,
  Dumbbell,
  ChevronUp,
  ChevronDown,
  Minus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

// Mock history data
const exerciseHistoryData: Record<string, {
  name: string;
  sessions: { date: string; sets: { weight: number; reps: number }[] }[];
  personalRecord: { weight: number; reps: number; date: string };
}> = {
  '1': {
    name: 'Barbell Bench Press',
    sessions: [
      { date: 'Dec 23', sets: [{ weight: 85, reps: 8 }, { weight: 85, reps: 7 }, { weight: 85, reps: 6 }, { weight: 85, reps: 6 }] },
      { date: 'Dec 19', sets: [{ weight: 82.5, reps: 8 }, { weight: 82.5, reps: 8 }, { weight: 82.5, reps: 7 }, { weight: 80, reps: 7 }] },
      { date: 'Dec 16', sets: [{ weight: 82.5, reps: 7 }, { weight: 82.5, reps: 7 }, { weight: 80, reps: 7 }, { weight: 80, reps: 6 }] },
      { date: 'Dec 12', sets: [{ weight: 80, reps: 8 }, { weight: 80, reps: 7 }, { weight: 80, reps: 7 }, { weight: 77.5, reps: 6 }] },
      { date: 'Dec 9', sets: [{ weight: 80, reps: 7 }, { weight: 80, reps: 7 }, { weight: 77.5, reps: 6 }, { weight: 77.5, reps: 6 }] },
      { date: 'Dec 5', sets: [{ weight: 77.5, reps: 8 }, { weight: 77.5, reps: 8 }, { weight: 77.5, reps: 7 }, { weight: 75, reps: 7 }] },
    ],
    personalRecord: { weight: 100, reps: 3, date: 'Nov 15, 2024' },
  },
  '2': {
    name: 'Incline Dumbbell Press',
    sessions: [
      { date: 'Dec 23', sets: [{ weight: 30, reps: 10 }, { weight: 30, reps: 10 }, { weight: 30, reps: 9 }, { weight: 27.5, reps: 8 }] },
      { date: 'Dec 19', sets: [{ weight: 30, reps: 10 }, { weight: 30, reps: 9 }, { weight: 27.5, reps: 9 }, { weight: 27.5, reps: 8 }] },
      { date: 'Dec 16', sets: [{ weight: 27.5, reps: 10 }, { weight: 27.5, reps: 10 }, { weight: 27.5, reps: 9 }, { weight: 27.5, reps: 8 }] },
      { date: 'Dec 12', sets: [{ weight: 27.5, reps: 10 }, { weight: 27.5, reps: 9 }, { weight: 25, reps: 10 }, { weight: 25, reps: 9 }] },
    ],
    personalRecord: { weight: 35, reps: 6, date: 'Oct 20, 2024' },
  },
  '3': {
    name: 'Cable Flyes',
    sessions: [
      { date: 'Dec 23', sets: [{ weight: 12.5, reps: 15 }, { weight: 12.5, reps: 14 }, { weight: 12.5, reps: 12 }] },
      { date: 'Dec 19', sets: [{ weight: 12.5, reps: 14 }, { weight: 12.5, reps: 13 }, { weight: 10, reps: 14 }] },
      { date: 'Dec 16', sets: [{ weight: 10, reps: 15 }, { weight: 10, reps: 14 }, { weight: 10, reps: 13 }] },
    ],
    personalRecord: { weight: 15, reps: 12, date: 'Nov 1, 2024' },
  },
};

interface ExerciseHistorySheetProps {
  exerciseId: string | null;
  isOpen: boolean;
  onClose: () => void;
  unit: 'kg' | 'lbs';
}

export function ExerciseHistorySheet({
  exerciseId,
  isOpen,
  onClose,
  unit,
}: ExerciseHistorySheetProps) {
  if (!exerciseId) return null;

  const history = exerciseHistoryData[exerciseId] || {
    name: 'Exercise',
    sessions: [],
    personalRecord: { weight: 0, reps: 0, date: 'N/A' },
  };

  // Convert weight if needed
  const convertWeight = (kg: number) => unit === 'lbs' ? Math.round(kg * 2.205) : kg;

  // Prepare chart data - max weight per session
  const chartData = history.sessions.map((session) => ({
    date: session.date,
    weight: convertWeight(Math.max(...session.sets.map(s => s.weight))),
    volume: session.sets.reduce((acc, s) => acc + convertWeight(s.weight) * s.reps, 0),
  })).reverse();

  // Calculate progress
  const getProgress = () => {
    if (history.sessions.length < 2) return null;
    const latest = Math.max(...history.sessions[0].sets.map(s => s.weight));
    const previous = Math.max(...history.sessions[1].sets.map(s => s.weight));
    const delta = latest - previous;
    return { value: convertWeight(Math.abs(delta)), isPositive: delta >= 0 };
  };

  const progress = getProgress();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl bg-background border-border overflow-hidden p-0">
        <SheetHeader className="p-4 border-b border-border/50">
          <SheetTitle className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            {history.name}
          </SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto h-[calc(85vh-70px)] p-4 space-y-4">
          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-3">
            <GlassCard className="text-center">
              <p className="text-2xl font-bold text-primary stat-number">{history.sessions.length}</p>
              <p className="text-xs text-muted-foreground">Sessions</p>
            </GlassCard>
            <GlassCard className="text-center">
              <p className="text-2xl font-bold stat-number">
                {convertWeight(history.personalRecord.weight)}
              </p>
              <p className="text-xs text-muted-foreground">PR ({unit})</p>
            </GlassCard>
            <GlassCard className="text-center">
              {progress ? (
                <>
                  <p className={cn(
                    'text-2xl font-bold stat-number flex items-center justify-center gap-1',
                    progress.isPositive ? 'text-success' : 'text-destructive'
                  )}>
                    {progress.isPositive ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    {progress.value}
                  </p>
                  <p className="text-xs text-muted-foreground">Last Δ ({unit})</p>
                </>
              ) : (
                <>
                  <Minus className="w-5 h-5 mx-auto text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">No change</p>
                </>
              )}
            </GlassCard>
          </div>

          {/* Weight Progress Chart */}
          <GlassCard>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-primary" />
              Weight Progress
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -10, bottom: -15 }}>
                  <defs>
                    <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10}
                    tickLine={false}
                    interval={0}
                      padding={{ left: 0, right: 0 }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10}
                    tickLine={false}
                    domain={['dataMin - 5', 'dataMax + 5']}
                    width={36}           // reduce reserved left space
                      tickMargin={8}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value} ${unit}`, 'Max Weight']}
                  />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#weightGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Volume Chart */}
          <GlassCard>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success" />
              Volume Progress
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 0, right: 0, left: -10, bottom: -15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10}
                    tickLine={false}
                    interval={0}
                      padding={{ left: 0, right: 0 }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10}
                    tickLine={false}
                    width={36}           // reduce reserved left space
                      tickMargin={8}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value} ${unit}`, 'Total Volume']}
                  />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Session History */}
          <div>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Recent Sessions
            </h4>
            <div className="space-y-2">
              {history.sessions.map((session, i) => (
                <GlassCard key={i} className="py-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{session.date}</span>
                    <span className="text-xs text-muted-foreground">{session.sets.length} sets</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {session.sets.map((set, j) => (
                      <span key={j} className="px-2 py-1 text-xs bg-muted/50 rounded">
                        {convertWeight(set.weight)} × {set.reps}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Personal Record */}
          <GlassCard variant="glow" glowColor="success">
            <div className="text-center">
              <p className="text-xs text-success uppercase tracking-wide mb-1">Personal Record</p>
              <p className="text-3xl font-bold stat-number">
                {convertWeight(history.personalRecord.weight)} {unit} × {history.personalRecord.reps}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{history.personalRecord.date}</p>
            </div>
          </GlassCard>
        </div>
      </SheetContent>
    </Sheet>
  );
}
