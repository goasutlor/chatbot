import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  className,
  variant = 'default',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/20 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        {
          'bg-accent-500 text-white hover:bg-accent-600 shadow-sm hover:shadow-md': variant === 'default',
          'border border-primary-200 bg-white text-primary-700 hover:bg-primary-50 hover:border-primary-300': variant === 'outline',
          'text-primary-600 hover:text-primary-700 hover:bg-primary-50': variant === 'ghost',
          'bg-primary-100 text-primary-700 hover:bg-primary-200': variant === 'secondary',
        },
        {
          'h-8 px-3 text-sm rounded-lg': size === 'sm',
          'h-10 px-4 py-2 rounded-xl': size === 'md',
          'h-12 px-6 text-lg rounded-xl': size === 'lg',
        },
        className
      )}
      {...props}
    />
  )
}
