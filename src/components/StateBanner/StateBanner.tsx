import type { ReactNode } from 'react'
import clsx from 'clsx'
import './StateBanner.css'

type StateBannerVariant = 'info' | 'error' | 'warning'

type StateBannerProps = {
  variant?: StateBannerVariant
  children: ReactNode
  className?: string
}

function StateBanner({ variant = 'info', children, className }: StateBannerProps) {
  const classes = clsx('state-banner', `state-banner-${variant}`, className)

  return <div className={classes}>{children}</div>
}

export default StateBanner
