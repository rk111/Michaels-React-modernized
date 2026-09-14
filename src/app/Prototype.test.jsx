import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Prototype from './Prototype';

describe('Prototype 10', () => {
  it('renders only the specified product page and its artwork', () => {
    render(<Prototype />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Oil paint set, 24 oil-based colors');
    expect(screen.getByRole('img')).toHaveAttribute('src', '/figma-assets/paint-tubes.svg');
    expect(screen.getByRole('radio', { name: 'Subscribe & Save' })).toBeChecked();
    expect(screen.queryByText('Order summary')).not.toBeInTheDocument();
    expect(screen.queryByText(/coverage map/i)).not.toBeInTheDocument();
  });
  it('selects all three prototype frequencies and preserves selection when toggling purchase type', async () => {
    const user = userEvent.setup(); render(<Prototype />);
    for (const days of ['60', '90', '30']) {
      await user.selectOptions(screen.getByLabelText('Delivery frequency'), days);
      expect(screen.getByLabelText('Delivery frequency')).toHaveValue(days);
    }
    await user.click(screen.getByRole('radio', { name: 'One-time purchase' }));
    expect(screen.queryByLabelText('Delivery frequency')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add to cart' })).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'Subscribe & Save' }));
    expect(screen.getByLabelText('Delivery frequency')).toHaveValue('30');
  });
  it('enforces quantity minimum and supports keyboard cart and favorite actions', async () => {
    const user = userEvent.setup(); render(<Prototype />);
    expect(screen.getByRole('button', { name: 'Decrease quantity' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Increase quantity' }));
    const add = screen.getByRole('button', { name: 'Add subscription to cart' });
    add.focus(); await user.keyboard('{Enter}');
    expect(screen.getByText('Cart (5)')).toBeInTheDocument();
    expect(screen.getByText(/2 subscription items added to cart/)).toBeInTheDocument();
    const favorite = screen.getByRole('button', { name: 'Save to favorites' });
    await user.click(favorite); expect(favorite).toHaveAttribute('aria-pressed', 'true');
    await user.click(favorite); expect(favorite).toHaveAttribute('aria-pressed', 'false');
  });
  it('keeps the Figma radio glyphs decorative and supports native arrow-key selection', async () => {
    const user = userEvent.setup();
    render(<Prototype />);
    const subscription = screen.getByRole('radio', { name: 'Subscribe & Save' });
    subscription.focus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('radio', { name: 'One-time purchase' })).toBeChecked();
    await user.keyboard('{ArrowDown}');
    expect(subscription).toBeChecked();
    expect(screen.getByText('◉')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('⌄')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('combobox', { name: 'Delivery frequency' })).toHaveValue('30');
  });

});
