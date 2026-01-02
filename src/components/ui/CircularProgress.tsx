import { cn } from '@/lib/utils';

interface CircularProgressProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: 'primary' | 'success' | 'warning' | 'destructive';
  showValue?: boolean;
  className?: string;
}

export function CircularProgress({
  value,
  max,
  size = 80,
  strokeWidth = 6,
  label,
  sublabel,
  color = 'primary',
  showValue = true,
  className,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((value / max) * 100, 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    primary: 'stroke-primary',
    success: 'stroke-success',
    warning: 'stroke-warning',
    destructive: 'stroke-destructive',
  };

  const glowClasses = {
    primary: 'drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]',
    success: 'drop-shadow-[0_0_8px_hsl(var(--success)/0.5)]',
    warning: 'drop-shadow-[0_0_8px_hsl(var(--warning)/0.5)]',
    destructive: 'drop-shadow-[0_0_8px_hsl(var(--destructive)/0.5)]',
  };

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className={cn(colorClasses[color], glowClasses[color])}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 0.5s ease-in-out',
            }}
          />
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold stat-number">{Math.round(value)}</span>
            {sublabel && (
              <span className="text-[10px] text-muted-foreground">{sublabel}</span>
            )}
          </div>
        )}
      </div>
      {label && (
        <span className="mt-2 text-xs font-medium text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  );
}
