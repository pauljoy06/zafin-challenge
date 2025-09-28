import ReactMarkdown, { type Components } from 'react-markdown'
import './Markdown.css'

type MarkdownProps = {
  children: string
  className?: string
  components?: Components
}

function Markdown({ children, className, components }: MarkdownProps) {
  const containerClassName = className ? `markdown ${className}` : 'markdown'
  const content = children.replace(/\\n/g, '\n')

  return (
    <div className={containerClassName}>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  )
}

export default Markdown
