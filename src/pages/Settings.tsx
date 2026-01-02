import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Dumbbell, 
  Calculator, 
  Bell, 
  Crown, 
  Download,
  Trash2,
  ChevronRight,
  Minus,
  Plus,
  Ban,
  Search,
  X,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Settings() {
  const [showMacroCalc, setShowMacroCalc] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showBlacklist, setShowBlacklist] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');

  // Macro calculator state
  const [macroForm, setMacroForm] = useState({
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    activity: 'moderate',
    goal: 'maintain',
  });
  const [macroResults, setMacroResults] = useState<{
    bmr: number;
    tdee: number;
    protein: number;
    carbs: number;
    fats: number;
    calories: number;
  } | null>(null);

  // Plate inventory state
  const [inventory, setInventory] = useState({
    barWeight: 45,
    plates: {
      45: 4,
      35: 2,
      25: 4,
      10: 4,
      5: 4,
      2.5: 2,
    } as Record<number, number>,
  });

  // Blacklist state
  const [blacklist, setBlacklist] = useState(['Deadlift', 'Barbell Row']);
  const [searchExercise, setSearchExercise] = useState('');

  const calculateMacros = () => {
    const { age, gender, weight, height, activity, goal } = macroForm;
    
    // Mifflin-St Jeor formula
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * Number(weight) * 0.453592 + 6.25 * Number(height) * 2.54 - 5 * Number(age) + 5;
    } else {
      bmr = 10 * Number(weight) * 0.453592 + 6.25 * Number(height) * 2.54 - 5 * Number(age) - 161;
    }

    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const tdee = bmr * activityMultipliers[activity];
    
    let calories: number;
    switch (goal) {
      case 'cut': calories = tdee - 500; break;
      case 'bulk': calories = tdee + 300; break;
      default: calories = tdee;
    }

    const protein = Number(weight) * 1; // 1g per lb
    const fats = (calories * 0.25) / 9;
    const carbs = (calories - protein * 4 - fats * 9) / 4;

    setMacroResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fats: Math.round(fats),
    });
  };

  const updatePlateCount = (weight: number, delta: number) => {
    setInventory((prev) => ({
      ...prev,
      plates: {
        ...prev.plates,
        [weight]: Math.max(0, (prev.plates[weight] || 0) + delta),
      },
    }));
  };

  return (
    <div className="px-4 py-6 safe-top pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Customize your experience
        </p>
      </div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Profile
        </h2>
        <GlassCard className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-cyber flex items-center justify-center">
            <User className="w-7 h-7 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-bold">Athlete</p>
            <p className="text-sm text-muted-foreground">athlete@example.com</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </GlassCard>
      </motion.div>

      {/* Gym & Training Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Gym & Training
        </h2>
        <div className="space-y-2">
          <GlassCard 
            className="flex items-center justify-between cursor-pointer hover:bg-card/90"
            onClick={() => setShowInventory(true)}
          >
            <div className="flex items-center gap-3">
              <Dumbbell className="w-5 h-5 text-primary" />
              <span>Plate Inventory</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </GlassCard>

          <GlassCard 
            className="flex items-center justify-between cursor-pointer hover:bg-card/90"
            onClick={() => setShowBlacklist(true)}
          >
            <div className="flex items-center gap-3">
              <Ban className="w-5 h-5 text-destructive" />
              <span>Exercise Blacklist</span>
            </div>
            <span className="text-sm text-muted-foreground">{blacklist.length} exercises</span>
          </GlassCard>
        </div>
      </motion.div>

      {/* Calculators Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Calculators
        </h2>
        <GlassCard 
          className="flex items-center justify-between cursor-pointer hover:bg-card/90"
          onClick={() => setShowMacroCalc(true)}
        >
          <div className="flex items-center gap-3">
            <Calculator className="w-5 h-5 text-warning" />
            <div>
              <span>Macro Calculator</span>
              <p className="text-xs text-muted-foreground">Mifflin-St Jeor formula</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </GlassCard>
      </motion.div>

      {/* Notifications Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Notifications
        </h2>
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <Label htmlFor="workout-reminders">Workout Reminders</Label>
            </div>
            <Switch id="workout-reminders" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <Label htmlFor="rest-timer-sound">Rest Timer Sound</Label>
            </div>
            <Switch id="rest-timer-sound" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <Label htmlFor="progress-updates">Progress Updates</Label>
            </div>
            <Switch id="progress-updates" defaultChecked />
          </div>
        </GlassCard>
      </motion.div>

      {/* Subscription Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Subscription
        </h2>
        <GlassCard variant="glow" glowColor="primary">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-cyber flex items-center justify-center">
              <Crown className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-bold">Free Plan</p>
              <p className="text-xs text-muted-foreground">Basic features</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>AI Analysis</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <X className="w-4 h-4" />
              <span>Unlimited Scans</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Workout Tracking</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <X className="w-4 h-4" />
              <span>Custom Plans</span>
            </div>
          </div>
          <Button className="w-full bg-gradient-cyber hover:opacity-90">
            Upgrade to Pro
          </Button>
        </GlassCard>
      </motion.div>

      {/* App Management Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          App Management
        </h2>
        <div className="space-y-2">
          <GlassCard className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-primary" />
              <div>
                <span>Download Assets</span>
                <p className="text-xs text-muted-foreground">For offline use</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Download</Button>
          </GlassCard>

          <GlassCard 
            className="flex items-center justify-between cursor-pointer hover:bg-destructive/10 border-destructive/30"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-destructive" />
              <span className="text-destructive">Delete Account</span>
            </div>
            <ChevronRight className="w-5 h-5 text-destructive" />
          </GlassCard>
        </div>
      </motion.div>

      {/* Macro Calculator Modal */}
      <Dialog open={showMacroCalc} onOpenChange={setShowMacroCalc}>
        <DialogContent className="glass border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-warning" />
              Macro Calculator
            </DialogTitle>
            <DialogDescription>
              Calculate your daily macro targets using the Mifflin-St Jeor formula
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Age</Label>
                <Input 
                  type="number" 
                  value={macroForm.age}
                  onChange={(e) => setMacroForm({ ...macroForm, age: e.target.value })}
                  placeholder="25"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Gender</Label>
                <Select 
                  value={macroForm.gender} 
                  onValueChange={(v) => setMacroForm({ ...macroForm, gender: v })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Weight (lbs)</Label>
                <Input 
                  type="number" 
                  value={macroForm.weight}
                  onChange={(e) => setMacroForm({ ...macroForm, weight: e.target.value })}
                  placeholder="180"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Height (in)</Label>
                <Input 
                  type="number" 
                  value={macroForm.height}
                  onChange={(e) => setMacroForm({ ...macroForm, height: e.target.value })}
                  placeholder="70"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Activity Level</Label>
              <Select 
                value={macroForm.activity} 
                onValueChange={(v) => setMacroForm({ ...macroForm, activity: v })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (desk job)</SelectItem>
                  <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                  <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                  <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                  <SelectItem value="veryActive">Very Active (2x/day)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Goal</Label>
              <Select 
                value={macroForm.goal} 
                onValueChange={(v) => setMacroForm({ ...macroForm, goal: v })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cut">Cut (-500 cal)</SelectItem>
                  <SelectItem value="maintain">Maintain</SelectItem>
                  <SelectItem value="bulk">Bulk (+300 cal)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={calculateMacros} className="w-full bg-gradient-cyber hover:opacity-90">
              Calculate
            </Button>

            {macroResults && (
              <GlassCard className="mt-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary stat-number">{macroResults.calories}</p>
                    <p className="text-xs text-muted-foreground">Calories</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold stat-number">{macroResults.tdee}</p>
                    <p className="text-xs text-muted-foreground">TDEE</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border text-center">
                  <div>
                    <p className="text-lg font-bold text-primary stat-number">{macroResults.protein}g</p>
                    <p className="text-xs text-muted-foreground">Protein</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-warning stat-number">{macroResults.carbs}g</p>
                    <p className="text-xs text-muted-foreground">Carbs</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-success stat-number">{macroResults.fats}g</p>
                    <p className="text-xs text-muted-foreground">Fats</p>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4" 
                  variant="outline"
                  onClick={() => setShowMacroCalc(false)}
                >
                  Save Targets
                </Button>
              </GlassCard>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Inventory Modal */}
      <Dialog open={showInventory} onOpenChange={setShowInventory}>
        <DialogContent className="glass border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-primary" />
              Plate Inventory
            </DialogTitle>
            <DialogDescription>
              Set your available plates for accurate plate calculations
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label>Bar Weight (lbs)</Label>
              <div className="flex items-center gap-4 mt-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setInventory({ ...inventory, barWeight: Math.max(0, inventory.barWeight - 5) })}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-2xl font-bold stat-number w-16 text-center">{inventory.barWeight}</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setInventory({ ...inventory, barWeight: inventory.barWeight + 5 })}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Plates (pairs)</Label>
              <div className="space-y-3 mt-2">
                {Object.entries(inventory.plates).map(([weight, count]) => (
                  <div key={weight} className="flex items-center justify-between">
                    <span className="font-medium">{weight} lbs</span>
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updatePlateCount(Number(weight), -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-lg font-bold stat-number w-8 text-center">{count}</span>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updatePlateCount(Number(weight), 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full" onClick={() => setShowInventory(false)}>
              Save Inventory
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Blacklist Modal */}
      <Dialog open={showBlacklist} onOpenChange={setShowBlacklist}>
        <DialogContent className="glass border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ban className="w-5 h-5 text-destructive" />
              Exercise Blacklist
            </DialogTitle>
            <DialogDescription>
              Banned exercises will be excluded from AI-generated plans
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search exercises..." 
                value={searchExercise}
                onChange={(e) => setSearchExercise(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2">
              {blacklist.map((exercise) => (
                <div key={exercise} className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <span>{exercise}</span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => setBlacklist(blacklist.filter((e) => e !== exercise))}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {blacklist.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No blacklisted exercises
              </p>
            )}

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                if (searchExercise && !blacklist.includes(searchExercise)) {
                  setBlacklist([...blacklist, searchExercise]);
                  setSearchExercise('');
                }
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add to Blacklist
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Modal */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="glass border-destructive/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="w-5 h-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. All your data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label>Type "DELETE" to confirm</Label>
            <Input 
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="DELETE"
              className="mt-2"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              disabled={deleteInput !== 'DELETE'}
              onClick={() => {
                // Handle delete
                setShowDeleteConfirm(false);
              }}
            >
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
