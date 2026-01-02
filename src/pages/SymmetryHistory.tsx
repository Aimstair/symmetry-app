import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  TrendingUp, 
  Sparkles,
  ArrowUp,
  ArrowDown,
  Calendar,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

// Mock historical data
const symmetryHistory = [
  { date: 'Aug', score: 65 },
  { date: 'Sep', score: 68 },
  { date: 'Oct', score: 72 },
  { date: 'Nov', score: 76 },
  { date: 'Dec', score: 82 },
  { date: 'Jan', score: 85 },
];

const muscleHistoryData = {
  chest: [
    { date: 'Oct', score: 85 },
    { date: 'Nov', score: 88 },
    { date: 'Dec', score: 90 },
    { date: 'Jan', score: 92 },
  ],
  back: [
    { date: 'Oct', score: 78 },
    { date: 'Nov', score: 80 },
    { date: 'Dec', score: 83 },
    { date: 'Jan', score: 85 },
  ],
  shoulders: [
    { date: 'Oct', score: 75 },
    { date: 'Nov', score: 78 },
    { date: 'Dec', score: 81 },
    { date: 'Jan', score: 83 },
  ],
  arms: [
    { date: 'Oct', score: 68 },
    { date: 'Nov', score: 70 },
    { date: 'Dec', score: 73 },
    { date: 'Jan', score: 76 },
  ],
  legs: [
    { date: 'Oct', score: 82 },
    { date: 'Nov', score: 84 },
    { date: 'Dec', score: 85 },
    { date: 'Jan', score: 85 },
  ],
  abs: [
    { date: 'Oct', score: 58 },
    { date: 'Nov', score: 62 },
    { date: 'Dec', score: 65 },
    { date: 'Jan', score: 68 },
  ],
};

const scanHistory = [
  { 
    date: 'Jan 5, 2026', 
    score: 85, 
    change: +3,
    muscles: [
      { muscle: 'Chest', status: 'strong', score: 92 },
      { muscle: 'Back (Lats)', status: 'balanced', score: 85 },
      { muscle: 'Shoulders', status: 'balanced', score: 83 },
      { muscle: 'Left Bicep', status: 'lagging', score: 72 },
      { muscle: 'Right Bicep', status: 'strong', score: 80 },
      { muscle: 'Left Quad', status: 'balanced', score: 86 },
      { muscle: 'Right Quad', status: 'balanced', score: 84 },
      { muscle: 'Abs', status: 'lagging', score: 68 },
    ]
  },
  { 
    date: 'Dec 20, 2025', 
    score: 82, 
    change: +3,
    muscles: [
      { muscle: 'Chest', status: 'strong', score: 90 },
      { muscle: 'Back (Lats)', status: 'balanced', score: 83 },
      { muscle: 'Shoulders', status: 'balanced', score: 81 },
      { muscle: 'Left Bicep', status: 'lagging', score: 70 },
      { muscle: 'Right Bicep', status: 'balanced', score: 78 },
      { muscle: 'Left Quad', status: 'balanced', score: 84 },
      { muscle: 'Right Quad', status: 'balanced', score: 83 },
      { muscle: 'Abs', status: 'lagging', score: 65 },
    ]
  },
  { 
    date: 'Dec 13, 2025', 
    score: 79, 
    change: +4,
    muscles: [
      { muscle: 'Chest', status: 'balanced', score: 88 },
      { muscle: 'Back (Lats)', status: 'balanced', score: 80 },
      { muscle: 'Shoulders', status: 'balanced', score: 78 },
      { muscle: 'Left Bicep', status: 'lagging', score: 68 },
      { muscle: 'Right Bicep', status: 'balanced', score: 76 },
      { muscle: 'Left Quad', status: 'balanced', score: 82 },
      { muscle: 'Right Quad', status: 'balanced', score: 80 },
      { muscle: 'Abs', status: 'lagging', score: 62 },
    ]
  },
  { 
    date: 'Nov 29, 2025', 
    score: 75, 
    change: +3,
    muscles: [
      { muscle: 'Chest', status: 'balanced', score: 85 },
      { muscle: 'Back (Lats)', status: 'balanced', score: 78 },
      { muscle: 'Shoulders', status: 'balanced', score: 75 },
      { muscle: 'Left Bicep', status: 'lagging', score: 65 },
      { muscle: 'Right Bicep', status: 'balanced', score: 74 },
      { muscle: 'Left Quad', status: 'balanced', score: 80 },
      { muscle: 'Right Quad', status: 'balanced', score: 78 },
      { muscle: 'Abs', status: 'lagging', score: 58 },
    ]
  },
];

const currentMuscleAnalysis = [
  { muscle: 'Chest', status: 'strong', score: 92, trend: +2 },
  { muscle: 'Back (Lats)', status: 'balanced', score: 85, trend: +2 },
  { muscle: 'Shoulders', status: 'balanced', score: 83, trend: +2 },
  { muscle: 'Left Bicep', status: 'lagging', score: 72, trend: +2 },
  { muscle: 'Right Bicep', status: 'strong', score: 80, trend: +2 },
  { muscle: 'Left Quad', status: 'balanced', score: 86, trend: +2 },
  { muscle: 'Right Quad', status: 'balanced', score: 84, trend: +1 },
  { muscle: 'Abs', status: 'lagging', score: 68, trend: +3 },
];

export default function SymmetryHistory() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedScan, setSelectedScan] = useState<typeof scanHistory[0] | null>(null);

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
    <div className="min-h-screen px-4 py-6 safe-top pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
          className="shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Symmetry Analysis</h1>
          <p className="text-muted-foreground text-sm">Track your muscle balance over time</p>
        </div>
      </div>

      {/* Current Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlassCard variant="glow" glowColor="primary" className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-primary uppercase tracking-wide flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Current Score
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Last scan: Jan 5, 2026</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/scan')}
            >
              New Scan
            </Button>
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <span className="text-5xl font-bold text-gradient-cyber">85</span>
              <span className="text-2xl text-muted-foreground ml-1">/100</span>
            </div>
            <div className="text-right">
              <span className="text-success text-sm font-medium flex items-center gap-1">
                <ArrowUp className="w-4 h-4" />
                +20 pts
              </span>
              <span className="text-xs text-muted-foreground">since first scan</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-lg font-bold text-success">4</p>
              <p className="text-xs text-muted-foreground">Strong</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-primary">3</p>
              <p className="text-xs text-muted-foreground">Balanced</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-destructive">2</p>
              <p className="text-xs text-muted-foreground">Lagging</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="muscles">Muscles</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Symmetry Progress Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Score Progress
              </h2>
            </div>
            <GlassCard>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={symmetryHistory} margin={{ top: 0, right: 0, left: -10, bottom: -15 }}>
                    <defs>
                      <linearGradient id="symmetryGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
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
                      domain={[50, 100]}
                      width={36}           // reduce reserved left space
                      tickMargin={8}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(var(--success))"
                      strokeWidth={2}
                      fill="url(#symmetryGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>

          {/* Current Muscle Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Current Analysis
            </h2>
            <div className="space-y-2">
              {currentMuscleAnalysis.map((muscle) => (
                <GlassCard key={muscle.muscle} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-3 h-3 rounded-full',
                      muscle.status === 'strong' && 'bg-success',
                      muscle.status === 'balanced' && 'bg-primary',
                      muscle.status === 'lagging' && 'bg-destructive'
                    )} />
                    <span className="font-medium text-sm">{muscle.muscle}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-success flex items-center gap-0.5">
                      <ArrowUp className="w-3 h-3" />
                      +{muscle.trend}
                    </span>
                    <span className={cn(
                      'text-sm font-bold stat-number px-2 py-0.5 rounded min-w-[40px] text-center',
                      getStatusBg(muscle.status),
                      getStatusColor(muscle.status)
                    )}>
                      {muscle.score}
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* Muscles Tab */}
        <TabsContent value="muscles" className="space-y-6">
          {Object.entries(muscleHistoryData).map(([muscle, data], index) => (
            <motion.div
              key={muscle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold capitalize">{muscle}</h3>
                <span className="text-xs text-muted-foreground">
                  Current: <span className="text-foreground font-medium">{data[data.length - 1].score}</span>
                </span>
              </div>
              <GlassCard className="py-3">
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={9}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        hide
                        domain={[50, 100]}
                      />
                      <Tooltip
                        contentStyle={{
                          background: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Scan History</h2>
          </div>

          {scanHistory.map((scan, index) => (
            <motion.div
              key={scan.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard 
                className="cursor-pointer transition-all hover:border-primary/50"
                onClick={() => setSelectedScan(selectedScan?.date === scan.date ? null : scan)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{scan.date}</p>
                    <p className="text-xs text-muted-foreground">Front Double Bicep</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <span className="text-success text-xs font-medium flex items-center gap-0.5">
                      <ArrowUp className="w-3 h-3" />
                      +{scan.change}
                    </span>
                    <span className="text-2xl font-bold text-primary stat-number">{scan.score}</span>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedScan?.date === scan.date && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-border"
                  >
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Muscle Breakdown</p>
                    <div className="grid grid-cols-2 gap-2">
                      {scan.muscles.map((muscle) => (
                        <div key={muscle.muscle} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              'w-2 h-2 rounded-full',
                              muscle.status === 'strong' && 'bg-success',
                              muscle.status === 'balanced' && 'bg-primary',
                              muscle.status === 'lagging' && 'bg-destructive'
                            )} />
                            <span className="text-xs">{muscle.muscle}</span>
                          </div>
                          <span className={cn(
                            'text-xs font-bold',
                            getStatusColor(muscle.status)
                          )}>
                            {muscle.score}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
