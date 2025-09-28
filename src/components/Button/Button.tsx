import type { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
import './Button.css'

type ButtonVariant = 'primary' | 'secondary' | 'plain'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

function Button({ variant = 'plain', size = 'md', className, children, ...rest }: ButtonProps) {
  const classes = clsx('button', `button-${variant}`, `button-${size}`, className)

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}

export default Button
