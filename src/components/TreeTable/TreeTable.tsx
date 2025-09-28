import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import clsx from 'clsx'
import { ChevronDown, ChevronRight } from 'lucide-react'
import './TreeTable.css'

type TreeTableColumn<T> = {
  header: ReactNode
  cell: (item: T) => ReactNode
}

type TreeChildrenResult<T> = {
  data?: T[]
  isLoading: boolean
  isFetched: boolean
  isError?: boolean
  error?: unknown
}

type UseChildrenHook<T> = (item: T, expanded: boolean) => TreeChildrenResult<T>
type OnRowClick<T> = (item: T) => void

type TreeTableMessages = {
  loadingChildren?: string
  emptyChildren?: string
  errorChildren?: (error: unknown) => string
}

type TreeTableProps<T> = {
  columns: TreeTableColumn<T>[]
  data: T[]
  getId: (item: T) => string
  useChildren: UseChildrenHook<T>
  indentRem?: number
  messages?: TreeTableMessages
  onRowClick?: OnRowClick<T>
}

type TreeTableRowProps<T> = {
  item: T
  depth: number
  columns: TreeTableColumn<T>[]
  getId: (item: T) => string
  useChildren: UseChildrenHook<T>
  indentRem: number
  messages?: TreeTableMessages
  onRowClick?: OnRowClick<T>
}

function TreeTableRow<T>({
  item,
  depth,
  columns,
  getId,
  useChildren,
  indentRem,
  messages,
  onRowClick,
}: TreeTableRowProps<T>) {
  const [expanded, setExpanded] = useState(false)

  const {
    data: children = [],
    isLoading,
    isFetched,
    isError,
    error
  } = useChildren(item, expanded)

  const showToggle = useMemo(() => {
    if (expanded) {
      return true
    }

    if (!isFetched) {
      return true
    }

    return children.length > 0
  }, [children.length, expanded, isFetched])

  const handleToggle = () => {
    if (!showToggle) {
      return
    }

    setExpanded((prev) => !prev)
  }

  const indentStyle = { marginLeft: `${(depth * indentRem).toFixed(2)}rem` }

  return (
    <>
      <tr>
        {columns.map((column, index) => {
          const isPrimary = index === 0
          const handleCellClick =
            onRowClick && isPrimary
              ? () => {
                  onRowClick(item)
                }
              : undefined
          const labelClassName = clsx('cell-label', isPrimary && onRowClick && 'cell-label-action')

          if (isPrimary) {
            return (
              <td key={index} className="primary-cell">
                <span style={indentStyle}>
                  {showToggle ? (
                    <button type="button" className="toggle" onClick={handleToggle}>
                      {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  ) : (
                    <span className="toggle-placeholder" />
                  )}
                </span>
                <span className={labelClassName} onClick={handleCellClick}>
                  {column.cell(item)}
                </span>
              </td>
            )
          }

          return <td key={index}>{column.cell(item)}</td>
        })}
      </tr>

      {expanded && isLoading && (
        <tr>
          <td colSpan={columns.length} className="state-row">
            {messages?.loadingChildren ?? 'Loading…'}
          </td>
        </tr>
      )}

      {expanded && isError && (
        <tr>
          <td colSpan={columns.length} className="state-row">
            {messages?.errorChildren ? messages.errorChildren(error) : 'Failed to load data.'}
          </td>
        </tr>
      )}

      {expanded && !isLoading && !isError && children.length === 0 && (
        <tr>
          <td colSpan={columns.length} className="state-row">
            {messages?.emptyChildren ?? 'No items found.'}
          </td>
        </tr>
      )}

      {expanded &&
        children.map((child) => (
          <TreeTableRow
            key={getId(child)}
            item={child}
            depth={depth + 1}
            columns={columns}
            getId={getId}
            useChildren={useChildren}
            indentRem={indentRem}
            messages={messages}
            onRowClick={onRowClick}
          />
        ))}
    </>
  )
}

function TreeTable<T>({
  columns,
  data,
  getId,
  useChildren,
  indentRem = 1.6,
  messages,
  onRowClick,
}: TreeTableProps<T>) {
  return (
    <table className="tree-table">
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index} scope="col">
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <TreeTableRow
            key={getId(item)}
            item={item}
            depth={0}
            columns={columns}
            getId={getId}
            useChildren={useChildren}
            indentRem={indentRem}
            messages={messages}
            onRowClick={onRowClick}
          />
        ))}
      </tbody>
    </table>
  )
}

export type { TreeTableColumn }
export default TreeTable
