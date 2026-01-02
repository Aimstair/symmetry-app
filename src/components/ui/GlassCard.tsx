import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'glow' | 'solid' | 'interactive';
  glowColor?: 'primary' | 'success' | 'warning' | 'destructive';
  noPadding?: boolean;
  hoverable?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', glowColor, noPadding, hoverable = false, children, ...props }, ref) => {
    const baseClasses = 'rounded-2xl border transition-all duration-300';
    
    const variantClasses = {
      default: 'glass',
      glow: cn(
        'glass',
        glowColor === 'primary' && 'border-primary/40 glow-cyan',
        glowColor === 'success' && 'border-success/40 glow-green',
        glowColor === 'warning' && 'border-warning/40',
        glowColor === 'destructive' && 'border-destructive/40 glow-red'
      ),
      solid: 'bg-card border-border',
      interactive: 'glass hover:bg-card/90 hover:border-primary/30 active:scale-[0.98] cursor-pointer',
    };

    const hoverClasses = hoverable ? 'hover:border-primary/30 hover:bg-card/90 active:scale-[0.98] cursor-pointer' : '';

    return (
      <motion.div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          hoverClasses,
          !noPadding && 'p-4',
          className
        )}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
