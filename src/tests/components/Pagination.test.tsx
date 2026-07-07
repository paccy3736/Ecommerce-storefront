import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Pagination } from '../../components/common/Pagination'

const renderPagination = (props: { currentPage: number; totalPages: number; onPageChange?: (p: number) => void }) =>
  render(
    <BrowserRouter>
      <Pagination
        currentPage={props.currentPage}
        totalPages={props.totalPages}
        onPageChange={props.onPageChange ?? vi.fn()}
      />
    </BrowserRouter>
  )

describe('Pagination', () => {
  it('renders nothing when totalPages is 1', () => {
    const { container } = renderPagination({ currentPage: 1, totalPages: 1 })
    expect(container.firstChild).toBeNull()
  })

  it('renders prev and next buttons', () => {
    renderPagination({ currentPage: 2, totalPages: 5 })
    expect(screen.getByLabelText('Previous page')).toBeDefined()
    expect(screen.getByLabelText('Next page')).toBeDefined()
  })

  it('disables prev button on first page', () => {
    renderPagination({ currentPage: 1, totalPages: 5 })
    expect(screen.getByLabelText('Previous page')).toHaveProperty('disabled', true)
  })

  it('disables next button on last page', () => {
    renderPagination({ currentPage: 5, totalPages: 5 })
    expect(screen.getByLabelText('Next page')).toHaveProperty('disabled', true)
  })

  it('calls onPageChange with correct page number', () => {
    const onPageChange = vi.fn()
    renderPagination({ currentPage: 1, totalPages: 5, onPageChange })
    fireEvent.click(screen.getByLabelText('Page 3'))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('calls onPageChange(2) when next is clicked from page 1', () => {
    const onPageChange = vi.fn()
    renderPagination({ currentPage: 1, totalPages: 5, onPageChange })
    fireEvent.click(screen.getByLabelText('Next page'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})
