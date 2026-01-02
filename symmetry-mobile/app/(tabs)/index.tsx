import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, AlertTriangle, Flame, Dumbbell } from 'lucide-react-native';
import { router } from 'expo-router';

/**
 * Dashboard - React Native Implementation
 * 
 * Migration Notes:
 * - Replaced web HTML with React Native primitives
 * - SafeAreaView handles notch/dynamic island
 * - ScrollView for scrollable content
 * - Expo Router navigation (router.push)
 * - Same data/state logic from web version
 */

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

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-sm text-muted-foreground font-medium">
            {getGreeting()}
          </Text>
          <Text className="text-3xl font-bold mt-1 text-primary">
            {user?.name || 'Athlete'}
          </Text>
        </View>

        {/* Today's Workout Card */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <Dumbbell size={16} color="hsl(187, 85%, 53%)" />
              <Text className="text-base font-semibold text-foreground">
                Today's Workout
              </Text>
            </View>
          </View>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{todayWorkout.name}</CardTitle>
              <CardDescription>{todayWorkout.dayName}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onPress={() => router.push('/active-workout')}
                className="w-full"
              >
                Start Workout
              </Button>
            </CardContent>
          </Card>
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-base font-semibold mb-3 text-foreground">
            Quick Actions
          </Text>
          <View className="gap-3">
            <Button
              variant="outline"
              onPress={() => router.push('/physique-scan')}
              rightIcon={<ChevronRight size={16} />}
            >
              Take Physique Scan
            </Button>
            <Button
              variant="outline"
              onPress={() => router.push('/(tabs)/progress')}
              rightIcon={<ChevronRight size={16} />}
            >
              Log Progress
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
