import { Outlet } from 'react-router-dom';
import { BottomNav } from '@/components/ui/BottomNav';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Subtle grid overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />
      {/* Gradient orbs for depth */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-0 w-72 h-72 bg-primary/3 rounded-full blur-[80px] pointer-events-none" />
      
      <main className="relative pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
