import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Scale, 
  Ruler, 
  Activity,
  Plus,
  ChevronUp,
  ChevronDown,
  Minus,
  ChevronRight
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
  Area,
  AreaChart,
} from 'recharts';

// Mock data
const weightData = [
  { date: 'Nov 1', weight: 185 },
  { date: 'Nov 8', weight: 186.2 },
  { date: 'Nov 15', weight: 185.5 },
  { date: 'Nov 22', weight: 186.8 },
  { date: 'Nov 29', weight: 187.2 },
  { date: 'Dec 6', weight: 186.5 },
  { date: 'Dec 13', weight: 187.8 },
  { date: 'Dec 20', weight: 188.1 },
  { date: 'Dec 27', weight: 188.5 },
];

const symmetryData = [
  { date: 'Oct', score: 72 },
  { date: 'Nov', score: 76 },
  { date: 'Dec', score: 82 },
];

const measurements = [
  { name: 'Chest', current: 42.5, previous: 42.0, unit: 'in' },
  { name: 'Waist', current: 32.0, previous: 32.5, unit: 'in', inverse: true },
  { name: 'Left Arm', current: 15.2, previous: 15.0, unit: 'in' },
  { name: 'Right Arm', current: 15.5, previous: 15.3, unit: 'in' },
  { name: 'Left Thigh', current: 24.5, previous: 24.0, unit: 'in' },
  { name: 'Right Thigh', current: 24.8, previous: 24.2, unit: 'in' },
];

export default function Progress() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const getDelta = (current: number, previous: number, inverse?: boolean) => {
    const delta = current - previous;
    const isPositive = inverse ? delta < 0 : delta > 0;
    return { value: Math.abs(delta).toFixed(1), isPositive };
  };

  return (
    <div className="px-4 py-6 safe-top pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Progress</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track your transformation
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="cardio">Cardio</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Weight Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" />
                Body Weight
              </h2>
              <span className="text-sm text-success">+3.5 lbs</span>
            </div>
            <GlassCard>
              <div className="h-48 flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weightData} margin={{ top: 0, right: 0, left: -10, bottom: -15 }}>
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
                      tickLine={true}
                      interval={1}
                      padding={{ left: 0, right: 0 }}
                      type="category"
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={10}
                      tickLine={true}
                      domain={['dataMin - 2', 'dataMax + 2']}
                      interval={0}
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
                      dataKey="weight"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#weightGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>

          {/* Symmetry Score Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Symmetry Score
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
            <GlassCard>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={symmetryData} margin={{ top: 0, right: 0, left: -10, bottom: -15 }}>
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
                      domain={[60, 100]}
                      width={36}
                      tickMargin={8}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(var(--success))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold mb-3">This Month</h2>
            <div className="grid grid-cols-2 gap-3">
              <GlassCard className="text-center">
                <p className="text-3xl font-bold text-primary stat-number">16</p>
                <p className="text-xs text-muted-foreground mt-1">Workouts</p>
              </GlassCard>
              <GlassCard className="text-center">
                <p className="text-3xl font-bold text-success stat-number">48.2k</p>
                <p className="text-xs text-muted-foreground mt-1">Total Volume</p>
              </GlassCard>
              <GlassCard className="text-center">
                <p className="text-3xl font-bold text-warning stat-number">12h</p>
                <p className="text-xs text-muted-foreground mt-1">Time Trained</p>
              </GlassCard>
              <GlassCard className="text-center">
                <p className="text-3xl font-bold stat-number">4</p>
                <p className="text-xs text-muted-foreground mt-1">PRs Hit</p>
              </GlassCard>
            </div>
          </motion.div>
        </TabsContent>

        {/* Body Measurements Tab */}
        <TabsContent value="body" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Ruler className="w-5 h-5 text-primary" />
                Tape Measurements
              </h2>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Log
              </Button>
            </div>

            <div className="space-y-3">
              {measurements.map((m) => {
                const delta = getDelta(m.current, m.previous, m.inverse);
                return (
                  <GlassCard key={m.name} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">Last: {m.previous} {m.unit}</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <span className={cn(
                        'text-xs font-medium flex items-center gap-0.5',
                        delta.isPositive ? 'text-success' : delta.value !== '0.0' ? 'text-destructive' : 'text-muted-foreground'
                      )}>
                        {delta.value === '0.0' ? (
                          <Minus className="w-3 h-3" />
                        ) : delta.isPositive ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                        {delta.value}"
                      </span>
                      <span className="text-xl font-bold stat-number">{m.current}</span>
                      <span className="text-sm text-muted-foreground">{m.unit}</span>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </motion.div>

          {/* Weight Log */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" />
                Log Weight
              </h2>
            </div>
            <GlassCard>
              <div className="flex gap-3">
                <Input 
                  type="number" 
                  placeholder="188.5" 
                  className="text-center text-lg font-bold"
                />
                <Button className="bg-gradient-cyber hover:opacity-90 px-6">
                  Log
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Last entry: 188.5 lbs on Dec 27
              </p>
            </GlassCard>
          </motion.div>
        </TabsContent>

        {/* Cardio Tab */}
        <TabsContent value="cardio" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Cardio Log
              </h2>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>

            <div className="space-y-3">
              {[
                { type: 'Running', duration: 30, intensity: 'Moderate', date: 'Today', calories: 320 },
                { type: 'Walking', duration: 45, intensity: 'Low', date: 'Dec 27', calories: 180 },
                { type: 'Cycling', duration: 25, intensity: 'High', date: 'Dec 25', calories: 280 },
              ].map((session, i) => (
                <GlassCard key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      session.intensity === 'High' ? 'bg-destructive/20' :
                      session.intensity === 'Moderate' ? 'bg-warning/20' : 'bg-success/20'
                    )}>
                      <Activity className={cn(
                        'w-5 h-5',
                        session.intensity === 'High' ? 'text-destructive' :
                        session.intensity === 'Moderate' ? 'text-warning' : 'text-success'
                      )} />
                    </div>
                    <div>
                      <p className="font-medium">{session.type}</p>
                      <p className="text-xs text-muted-foreground">{session.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold stat-number">{session.duration} min</p>
                    <p className="text-xs text-muted-foreground">{session.calories} cal</p>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Weekly Summary */}
            <GlassCard className="mt-6">
              <h3 className="font-semibold mb-3">This Week</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary stat-number">3</p>
                  <p className="text-xs text-muted-foreground">Sessions</p>
                </div>
                <div>
                  <p className="text-2xl font-bold stat-number">100</p>
                  <p className="text-xs text-muted-foreground">Minutes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-warning stat-number">780</p>
                  <p className="text-xs text-muted-foreground">Calories</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
