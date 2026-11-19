import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button, Dialog, Field, Input } from '../src/components/ui'

describe('shared UI components', () => {
  it('prevents interaction while a button is loading', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<Button loading onClick={onClick}>Save guild</Button>)

    const button = screen.getByRole('button', { name: 'Save guild' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('connects field labels and validation feedback to inputs', () => {
    render(<Field label="Guild name" error="A guild name is required."><Input /></Field>)

    const input = screen.getByLabelText('Guild name')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby')
    expect(screen.getByRole('alert')).toHaveTextContent('A guild name is required.')
  })

  it('closes a dialog when Escape is pressed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Dialog open title="Dialog heading" onClose={onClose}>Content</Dialog>)

    expect(screen.getByRole('dialog', { name: 'Dialog heading' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })
})
