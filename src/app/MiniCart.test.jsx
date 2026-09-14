import { beforeEach, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import MiniCart from './MiniCart.jsx';
import Prototype from './Prototype.jsx';

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
  window.location.hash = '';
});
const initial = [{ id: 'paint', name: 'Ohuhu oil paint set, 24 colors', price: 2159, quantity: 1, subscription: true, frequency: '30' }];
function Harness(props) {
  const [items, setItems] = useState(initial);
  return <MiniCart items={items} setItems={setItems} {...props} />;
}
it('excludes saved items from the drawer and disables empty-cart checkout', () => {
  render(<MiniCart items={[{ ...initial[0], saved: true }]} setItems={vi.fn()} onClose={vi.fn()} onViewCart={vi.fn()} />);
  expect(screen.queryByRole('article')).toBeNull();
  expect(screen.getByText('Your cart is empty.')).toBeTruthy();
  expect(screen.getByRole('button', { name: 'View cart & checkout' }).disabled).toBe(true);
  expect(screen.queryByText(/You'll be billed/)).toBeNull();
});

it('renders artwork, changes frequency and recalculates one-time pricing', async () => {
  const user = userEvent.setup();
  render(<Harness onClose={vi.fn()} onViewCart={vi.fn()} />);
  expect(screen.getByRole('dialog', { name: 'Added to your cart ✓' })).toBeTruthy();
  expect(screen.getByRole('img', { name: initial[0].name })).toBeTruthy();
  await user.click(screen.getByRole('button', { name: 'Change frequency' }));
  await user.selectOptions(screen.getByRole('combobox'), '60');
  expect(screen.getByText(/You'll be billed every 60 days/)).toBeTruthy();
  await user.click(screen.getByRole('button', { name: 'Switch to one-time purchase' }));
  expect(screen.queryByText(/You'll be billed/)).toBeNull();
  expect(screen.getByText('$32.86')).toBeTruthy();
  await user.click(screen.getByRole('button', { name: 'Switch to subscription' }));
  expect(screen.getByText(/You'll be billed every 60 days/)).toBeTruthy();
  expect(screen.getByText('$30.27')).toBeTruthy();
  expect(screen.getAllByRole('button', { name: 'Continue shopping' })).toHaveLength(1);
  expect(screen.queryByLabelText('Promo code')).toBeNull();
});
it('supports close, cancel and cart navigation callbacks', async () => {
  const onClose = vi.fn();
  const onViewCart = vi.fn();
  const user = userEvent.setup();
  render(<Harness onClose={onClose} onViewCart={onViewCart} />);
  await user.click(screen.getByRole('button', { name: 'Close mini-cart' }));
  fireEvent.cancel(screen.getByRole('dialog'));
  expect(onClose).toHaveBeenCalledTimes(2);
  await user.click(screen.getByRole('button', { name: 'View cart & checkout' }));
  expect(onViewCart).toHaveBeenCalledOnce();
});
it('opens from the product and retains added items when navigating to cart', async () => {
  const user = userEvent.setup();
  render(<Prototype />);
  await user.click(screen.getByRole('button', { name: 'Add subscription to cart' }));
  const dialog = screen.getByRole('dialog');
  expect(within(dialog).getByText('Your cart (4 items)')).toBeTruthy();
  await user.click(within(dialog).getByRole('button', { name: 'View cart & checkout' }));
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(screen.getByRole('button', { name: 'Continue to checkout' })).toBeTruthy();
});

it('opens from either header cart control and restores focus and scrolling', async () => {
  const user = userEvent.setup();
  render(<Prototype />);
  for (const trigger of screen.getAllByRole('button', { name: 'Cart (3)' })) {
    await user.click(trigger);
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close mini-cart' }));
    expect(document.body.style.overflow).toBe('hidden');
    await user.click(screen.getByRole('button', { name: 'Close mini-cart' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(document.body.style.overflow).not.toBe('hidden');
  }
});
