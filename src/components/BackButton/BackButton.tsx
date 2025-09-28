import { useNavigate } from 'react-router-dom'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '..'
import './BackButton.css'

type BackButtonProps = {
  fallbackPath?: string
  children?: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

function BackButton({ fallbackPath = '/products', children = 'Back', ...rest }: BackButtonProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (window.history.length > 1) {
      void navigate(-1)
    } else {
      void navigate(fallbackPath)
    }
  }

  return (
    <Button className="back-button" variant="secondary" size="sm" onClick={handleClick} {...rest}>
      <ArrowLeft size={16} />
      <span>{children}</span>
    </Button>
  )
}

export default BackButton
