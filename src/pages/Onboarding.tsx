import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Target, 
  Dumbbell, 
  Calendar,
  Shield,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

const steps = [
  { id: 1, title: 'Biometrics', icon: User },
  { id: 2, title: 'Goals', icon: Target },
  { id: 3, title: 'Equipment', icon: Dumbbell },
  { id: 4, title: 'Schedule', icon: Calendar },
  { id: 5, title: 'Consent', icon: Shield },
];

const experienceLevels = [
  { value: 'beginner', label: 'Beginner', desc: 'Less than 1 year' },
  { value: 'intermediate', label: 'Intermediate', desc: '1-3 years' },
  { value: 'advanced', label: 'Advanced', desc: '3+ years' },
];

const goals = [
  { value: 'bulk', label: 'Build Muscle', desc: 'Gain strength & size' },
  { value: 'cut', label: 'Lose Fat', desc: 'Get lean & shredded' },
  { value: 'maintain', label: 'Maintain', desc: 'Stay where I am' },
  { value: 'recomp', label: 'Recomposition', desc: 'Build muscle, lose fat' },
];

const equipmentTypes = [
  { value: 'gym', label: 'Full Gym', desc: 'Access to all equipment' },
  { value: 'home', label: 'Home Gym', desc: 'Limited equipment' },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Onboarding() {
  const navigate = useNavigate();
  const { updateOnboarding, completeOnboarding, setUser } = useAppStore();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: 'male' as 'male' | 'female' | 'other',
    experience: '' as 'beginner' | 'intermediate' | 'advanced' | '',
    goal: '' as 'bulk' | 'cut' | 'maintain' | 'recomp' | '',
    equipment: '' as 'gym' | 'home' | '',
    frequency: 4 as 3 | 4 | 5 | 6,
    selectedDays: [] as string[],
    biometricConsent: false,
    ageVerified: false,
    termsAccepted: false,
  });

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.height && formData.weight && formData.age && formData.gender;
      case 2:
        return formData.experience && formData.goal;
      case 3:
        return formData.equipment;
      case 4:
        return formData.selectedDays.length === formData.frequency;
      case 5:
        return formData.biometricConsent && formData.ageVerified && formData.termsAccepted;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      setUser({
        id: '1',
        name: 'Athlete',
        email: 'athlete@example.com',
        height: Number(formData.height),
        weight: Number(formData.weight),
        age: Number(formData.age),
        gender: formData.gender,
        experienceLevel: formData.experience as 'beginner' | 'intermediate' | 'advanced',
        goal: formData.goal as 'bulk' | 'cut' | 'maintain' | 'recomp',
        trainingFrequency: formData.frequency,
        trainingDays: formData.selectedDays,
        createdAt: new Date(),
      });
      completeOnboarding();
      navigate('/');
    }
  };

  const handleDayToggle = (day: string) => {
    const newDays = formData.selectedDays.includes(day)
      ? formData.selectedDays.filter((d) => d !== day)
      : formData.selectedDays.length < formData.frequency
        ? [...formData.selectedDays, day]
        : formData.selectedDays;
    setFormData({ ...formData, selectedDays: newDays });
  };

  return (
    <div className="min-h-screen bg-background bg-cyber-grid bg-grid-pattern px-4 py-6 safe-top">
      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center transition-all',
              step >= s.id 
                ? 'bg-gradient-cyber text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            )}>
              <s.icon className="w-5 h-5" />
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                'w-6 h-0.5 mx-1',
                step > s.id ? 'bg-primary' : 'bg-muted'
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Step 1: Biometrics */}
          {step === 1 && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Let's get to know you</h1>
              <p className="text-muted-foreground mb-6">
                We'll use this to customize your training
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Height (cm)</Label>
                    <Input
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      placeholder="175"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Weight (kg)</Label>
                    <Input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="80"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Age</Label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="25"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Gender</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['male', 'female', 'other'] as const).map((g) => (
                      <Button
                        key={g}
                        variant={formData.gender === g ? 'default' : 'outline'}
                        className={cn(
                          formData.gender === g && 'bg-gradient-cyber'
                        )}
                        onClick={() => setFormData({ ...formData, gender: g })}
                      >
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Experience & Goals */}
          {step === 2 && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Your Training Background</h1>
              <p className="text-muted-foreground mb-6">
                This helps us calibrate your program
              </p>

              <div className="space-y-6">
                <div>
                  <Label className="mb-3 block">Experience Level</Label>
                  <div className="space-y-2">
                    {experienceLevels.map((level) => (
                      <GlassCard
                        key={level.value}
                        className={cn(
                          'cursor-pointer transition-all',
                          formData.experience === level.value && 'border-primary glow-cyan'
                        )}
                        onClick={() => setFormData({ ...formData, experience: level.value as any })}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{level.label}</p>
                            <p className="text-sm text-muted-foreground">{level.desc}</p>
                          </div>
                          {formData.experience === level.value && (
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                              <ChevronRight className="w-4 h-4 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Primary Goal</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {goals.map((goal) => (
                      <GlassCard
                        key={goal.value}
                        className={cn(
                          'cursor-pointer transition-all text-center py-4',
                          formData.goal === goal.value && 'border-primary glow-cyan'
                        )}
                        onClick={() => setFormData({ ...formData, goal: goal.value as any })}
                      >
                        <p className="font-semibold">{goal.label}</p>
                        <p className="text-xs text-muted-foreground">{goal.desc}</p>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Equipment */}
          {step === 3 && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Your Equipment</h1>
              <p className="text-muted-foreground mb-6">
                Where will you be training?
              </p>

              <div className="space-y-3">
                {equipmentTypes.map((eq) => (
                  <GlassCard
                    key={eq.value}
                    className={cn(
                      'cursor-pointer transition-all',
                      formData.equipment === eq.value && 'border-primary glow-cyan'
                    )}
                    onClick={() => setFormData({ ...formData, equipment: eq.value as any })}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center',
                        formData.equipment === eq.value ? 'bg-gradient-cyber' : 'bg-muted'
                      )}>
                        <Dumbbell className={cn(
                          'w-6 h-6',
                          formData.equipment === eq.value ? 'text-primary-foreground' : 'text-muted-foreground'
                        )} />
                      </div>
                      <div>
                        <p className="font-semibold">{eq.label}</p>
                        <p className="text-sm text-muted-foreground">{eq.desc}</p>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Schedule */}
          {step === 4 && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Training Schedule</h1>
              <p className="text-muted-foreground mb-6">
                How often can you train?
              </p>

              <div className="space-y-6">
                <div>
                  <Label className="mb-3 block">Days per week</Label>
                  <div className="flex gap-2">
                    {([3, 4, 5, 6] as const).map((num) => (
                      <Button
                        key={num}
                        variant={formData.frequency === num ? 'default' : 'outline'}
                        className={cn(
                          'flex-1',
                          formData.frequency === num && 'bg-gradient-cyber'
                        )}
                        onClick={() => setFormData({ ...formData, frequency: num, selectedDays: [] })}
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">
                    Select {formData.frequency} training days
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {days.map((day) => (
                      <Button
                        key={day}
                        variant={formData.selectedDays.includes(day) ? 'default' : 'outline'}
                        className={cn(
                          formData.selectedDays.includes(day) && 'bg-gradient-cyber'
                        )}
                        onClick={() => handleDayToggle(day)}
                        disabled={
                          !formData.selectedDays.includes(day) && 
                          formData.selectedDays.length >= formData.frequency
                        }
                      >
                        {day.slice(0, 3)}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {formData.selectedDays.length} of {formData.frequency} selected
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Consent */}
          {step === 5 && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Almost There!</h1>
              <p className="text-muted-foreground mb-6">
                Please review and accept our terms
              </p>

              <div className="space-y-4">
                <GlassCard className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="biometric"
                      checked={formData.biometricConsent}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, biometricConsent: checked as boolean })
                      }
                    />
                    <div>
                      <Label htmlFor="biometric" className="font-medium">Biometric Data Consent</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        I consent to the collection and analysis of my body measurements 
                        and physique photos for AI-powered training recommendations.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="age"
                      checked={formData.ageVerified}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, ageVerified: checked as boolean })
                      }
                    />
                    <div>
                      <Label htmlFor="age" className="font-medium">Age Verification</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        I confirm that I am at least 18 years of age.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={formData.termsAccepted}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, termsAccepted: checked as boolean })
                      }
                    />
                    <div>
                      <Label htmlFor="terms" className="font-medium">Terms of Service</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        I agree to the Terms of Service and Privacy Policy.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent safe-bottom">
        <div className="flex gap-3">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className={cn(
              'flex-1 bg-gradient-cyber hover:opacity-90',
              step === 1 && 'w-full'
            )}
          >
            {step === 5 ? (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Start Training
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
