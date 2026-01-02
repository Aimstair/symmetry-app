// User & Profile Types
export interface User {
  id: string;
  name: string;
  email: string;
  height: number; // in cm
  weight: number; // in kg
  age: number;
  gender: 'male' | 'female' | 'other';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  goal: 'bulk' | 'cut' | 'maintain' | 'recomp';
  trainingFrequency: 3 | 4 | 5 | 6;
  trainingDays: string[]; // ['Monday', 'Tuesday', ...]
  createdAt: Date;
}

export interface NutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

// Equipment & Inventory Types
export interface EquipmentProfile {
  type: 'gym' | 'home';
  barWeight: number; // in lbs or kg
  unit: 'lbs' | 'kg';
  availablePlates: PlateInventory;
}

export interface PlateInventory {
  [weight: number]: number; // weight -> count (e.g., 45: 4 means four 45lb plates)
}

// Exercise Types
export interface Exercise {
  id: string;
  name: string;
  targetMuscle: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  videoUrl?: string;
  isUnilateral: boolean;
  supersetId?: string;
  notes?: string;
  equipmentRequired: string[];
}

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'abs'
  | 'traps'
  | 'lats';

// Workout Types
export interface WorkoutPlan {
  id: string;
  name: string;
  dayName: string;
  targetMuscles: MuscleGroup[];
  exercises: WorkoutExercise[];
  status: 'scheduled' | 'active' | 'completed' | 'skipped';
  scheduledDate: Date;
  completedAt?: Date;
  duration?: number; // in minutes
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  sets: SetLog[];
  targetSets: number;
  targetReps: string; // e.g., "8-12"
  restSeconds: number;
  supersetId?: string;
  order: number;
}

export interface SetLog {
  id: string;
  setNumber: number;
  weight: number;
  reps: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  isWarmup: boolean;
  tags: SetTag[];
  completedAt?: Date;
  previousWeight?: number;
  previousReps?: number;
  unit: 'lbs' | 'kg';
  actualRestSeconds?: number;
}

export type SetTag = 'failure' | 'dropset' | 'pause' | 'slow-negative' | 'cluster';

// Progress & Analytics Types
export interface BodyMeasurement {
  id: string;
  date: Date;
  weight: number;
  unit: 'lbs' | 'kg';
  measurements: {
    chest?: number;
    waist?: number;
    hips?: number;
    leftArm?: number;
    rightArm?: number;
    leftThigh?: number;
    rightThigh?: number;
    neck?: number;
    shoulders?: number;
  };
}

export interface PhysiqueScan {
  id: string;
  date: Date;
  imageUrl?: string;
  pose: 'front-double-bicep' | 'back-double-bicep' | 'side-chest' | 'front-relaxed' | 'back-relaxed';
  symmetryScore: number;
  muscleAnalysis: MuscleAnalysis[];
  overallAssessment: string;
}

export interface MuscleAnalysis {
  muscle: MuscleGroup;
  status: 'strong' | 'balanced' | 'lagging';
  leftScore?: number;
  rightScore?: number;
  symmetryDelta?: number; // percentage difference left vs right
  recommendation?: string;
}

export interface CardioLog {
  id: string;
  date: Date;
  type: 'running' | 'cycling' | 'walking' | 'swimming' | 'rowing' | 'stairs' | 'elliptical' | 'other';
  duration: number; // in minutes
  intensity: 'low' | 'moderate' | 'high' | 'hiit';
  caloriesBurned?: number;
  distance?: number;
  notes?: string;
}

// Settings Types
export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  unit: 'lbs' | 'kg';
  measurementUnit: 'in' | 'cm';
  notifications: {
    workoutReminders: boolean;
    restTimerSound: boolean;
    progressUpdates: boolean;
  };
  subscription: 'free' | 'pro';
  blacklistedExercises: string[]; // exercise IDs
}

// Onboarding Types
export interface OnboardingData {
  step: number;
  completed: boolean;
  biometrics?: {
    height: number;
    weight: number;
    age: number;
    gender: 'male' | 'female' | 'other';
  };
  experience?: {
    level: 'beginner' | 'intermediate' | 'advanced';
    goal: 'bulk' | 'cut' | 'maintain' | 'recomp';
  };
  equipment?: EquipmentProfile;
  schedule?: {
    frequency: 3 | 4 | 5 | 6;
    days: string[];
  };
  consent?: {
    biometricPrivacy: boolean;
    ageVerification: boolean;
    termsAccepted: boolean;
  };
}

// UI State Types
export interface ActiveWorkoutState {
  isActive: boolean;
  workoutId: string | null;
  startTime: Date | null;
  currentExerciseIndex: number;
  warmupMode: boolean;
  deloadMode: boolean;
  restTimer: {
    isRunning: boolean;
    targetSeconds: number;
    elapsedSeconds: number;
  };
}

// Macro Calculator Types
export interface MacroCalculation {
  bmr: number;
  tdee: number;
  targets: NutritionTargets;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
}
