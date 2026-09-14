import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Checkout from './Checkout';
const items = [{ id: 'paint', name: 'Ohuhu oil paint set, 24 colors', price: 2159, quantity: 1, subscription: true, frequency: '60' }];
describe('Local checkout', () => {
  it('blocks empty orders and offers a return to shopping', async () => {
    const shop = vi.fn();
    render(<Checkout items={[]} onBack={vi.fn()} onShop={shop} />);
    expect(screen.queryByRole('button', { name: 'Continue to review' })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Continue shopping' }));
    expect(shop).toHaveBeenCalledOnce();
  });
  it('reports review, confirmation and receipt transitions to the page shell', async () => {
    const changed = vi.fn();
    const user = userEvent.setup();
    render(<Checkout items={[{ ...items[0], subscription: false }]} onBack={vi.fn()} onShop={vi.fn()} onStepChange={changed} />);
    await user.click(screen.getByRole('radio', { name: 'PayPal' }));
    await user.click(screen.getByRole('button', { name: 'Continue to review' }));
    expect(changed).toHaveBeenLastCalledWith('review');
    await user.click(screen.getByRole('button', { name: 'Place demo order' }));
    expect(changed).toHaveBeenLastCalledWith('confirmation');
    await user.click(screen.getByRole('button', { name: 'View receipt' }));
    expect(changed).toHaveBeenLastCalledWith('receipt');
  });
  it('requires consent, reviews and displays a demo confirmation and receipt', async () => {
    const user = userEvent.setup();
    render(<Checkout items={items} onBack={vi.fn()} onShop={vi.fn()} />);
    expect(screen.getByRole('radio', { name: 'Affirm' })).toBeDisabled();
    await user.click(screen.getByRole('radio', { name: 'PayPal' }));
    await user.click(screen.getByRole('button', { name: 'Continue to review' }));
    expect(screen.queryByText('Review your order')).not.toBeInTheDocument();
    await user.click(screen.getByRole('checkbox', { name: /Authorize recurring/ }));
    await user.click(screen.getByRole('button', { name: 'Continue to review' }));
    expect(screen.getByText('Review your order')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Place demo order' }));
    expect(screen.getByRole('status')).toHaveTextContent('No payment was taken');
    await user.click(screen.getByRole('button', { name: 'View receipt' }));
    expect(screen.getByText('Your Michaels order is confirmed')).toBeInTheDocument();
  });
  it('validates card fields and permits returning to the cart', async () => {
    const back = vi.fn(); const user = userEvent.setup();
    render(<Checkout items={items} onBack={back} onShop={vi.fn()} />);
    expect(screen.getByLabelText('Card number')).toBeRequired();
    await user.type(screen.getByLabelText('Card number'), '123');
    expect(screen.getByLabelText('Card number')).toBeInvalid();
    await user.click(screen.getByRole('button', { name: 'Return to cart' }));
    expect(back).toHaveBeenCalledOnce();
  });
});
