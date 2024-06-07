import * as React from 'react';
import { Label } from '@radix-ui/react-label';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  errorId?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, errorId, id, label, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <Label className={cn(error && 'text-destructive')} htmlFor={id}>
            {label}
          </Label>
        )}
        <input
          id={id}
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <span
            className={cn(
              'text-sm font-medium text-destructive mt-0.5',
              className,
            )}
            id={errorId}
          >
            {error}
          </span>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };