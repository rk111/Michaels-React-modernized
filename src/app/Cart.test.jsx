import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Prototype from './Prototype';

describe('Connected cart', () => {
  it('opens the cart, updates purchase type and continues to local checkout', async () => {
    const user = userEvent.setup();
    render(<Prototype />);
    await user.click(screen.getAllByRole('button', { name: 'Cart (3)' })[0]);
    expect(screen.getByRole('heading', { name: 'Your cart (3 items)' })).toBeInTheDocument();
    expect(screen.getByText('$52.93')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Change frequency' }));
    await user.selectOptions(screen.getByLabelText('Delivery frequency'), '90');
    expect(screen.getByText(/You'll be billed every 90 days/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Switch to one-time purchase' }));
    expect(screen.getByText('$55.52')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Continue to checkout' }));
    expect(screen.getByRole('radio', { name: 'Affirm' })).toBeEnabled();
    await user.click(screen.getByRole('button', { name: 'Return to cart' }));
    await user.click(screen.getByRole('button', { name: 'Continue shopping' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Oil paint set');
  });
  it('removes a line and blocks Affirm for subscription carts', async () => {
    const user = userEvent.setup(); render(<Prototype />);
    await user.click(screen.getAllByRole('button', { name: 'Cart (3)' })[0]);
    const brushes = screen.getByRole('article', { name: 'Taklon paintbrush value pack, 10 pieces' });
    await user.click(within(brushes).getByRole('button', { name: 'Remove' }));
    expect(screen.getByRole('heading', { name: 'Your cart (2 items)' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Continue to checkout' }));
    expect(screen.getByRole('radio', { name: 'Affirm' })).toBeDisabled();
  });
});
