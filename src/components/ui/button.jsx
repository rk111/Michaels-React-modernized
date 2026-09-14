import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-pill font-ui font-bold transition-colors outline-none ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-brand-red',
  {
    variants: {
      variant: {
        primary: 'bg-brand-red text-white hover:bg-brand-red-pressed',
        secondary: 'border border-brand-red bg-white text-brand-red hover:bg-brand-red-soft',
      },
      size: {
        default: 'h-12 px-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});

Button.displayName = 'Button';

export { Button, buttonVariants };
