import type { CSSProperties, ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import styles from './star-border.module.css';

type StarBorderProps<T extends ElementType> = ComponentPropsWithoutRef<T> & {
  as?: T;
  className?: string;
  children?: ReactNode;
  color?: string;
  speed?: CSSProperties['animationDuration'];
  thickness?: number;
  innerClassName?: string;
};

export default function StarBorder<T extends ElementType = 'button'>({
  as,
  className,
  innerClassName,
  color = 'white',
  speed = '5s',
  thickness = 1,
  children,
  ...rest
}: StarBorderProps<T>) {
  const Component = as || 'button';

  return (
    <Component
      className={`${styles.starBorderContainer} ${className ?? ''}`}
      {...(rest as any)}
      style={{
        padding: `${thickness}px`,
        ...(rest as any).style,
      }}
    >
      <span
        className={styles.borderGradientBottom}
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 35%)`,
          animationDuration: speed,
        }}
      />
      <span
        className={styles.borderGradientTop}
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 35%)`,
          animationDuration: speed,
        }}
      />
      <span className={cn(styles.innerContent, innerClassName)}>{children}</span>
    </Component>
  );
}
