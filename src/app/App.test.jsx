import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';


it('resets an incompatible tender when switching back to subscription', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole('button', { name: 'Switch to one-time purchase' }));
  await user.click(screen.getByRole('radio', { name: 'Affirm' }));
  expect(screen.getByRole('radio', { name: 'Affirm' })).toBeChecked();
  await user.click(screen.getByRole('radio', { name: /Subscribe & Save/i }));
  expect(screen.getByRole('radio', { name: 'Affirm' })).toBeDisabled();
  expect(screen.getByRole('radio', { name: 'Affirm' })).not.toBeChecked();
  expect(screen.getByRole('radio', { name: 'Credit/Debit Card' })).toBeChecked();
  await user.click(screen.getByRole('button', { name: 'Change frequency' }));
  expect(screen.getByLabelText('Delivery frequency')).toHaveFocus();
});

describe('Subscribe & Save prototype', () => {
  it('renders core figma copy and section markers', () => {
    const { container } = render(<App />);
    expect(screen.getByText('Make more. Save more. Shop weekly deals')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Oil paint set, 24 oil-based colors' })).toBeInTheDocument();
    expect(container.querySelectorAll('[data-figma-section]').length).toBeGreaterThanOrEqual(35);
  });

  it('supports purchase type and frequency interactions', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('radio', { name: /one-time/i }));
    expect(screen.getByRole('radio', { name: /one-time/i })).toBeChecked();

    await user.selectOptions(screen.getByLabelText('Delivery frequency'), 'Every 60 days');
    expect(screen.getByLabelText('Delivery frequency')).toHaveValue('Every 60 days');
  });

  it('enforces quantity lower bound and payment constraint', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByLabelText('Decrease quantity'));
    expect(screen.getByText('1')).toBeInTheDocument();

    expect(screen.getByRole('radio', { name: 'Affirm' })).toBeDisabled();
  });

  it('supports keyboard operation for add-to-cart control', async () => {
    const user = userEvent.setup();
    render(<App />);

    screen.getByRole('button', { name: 'Add to cart' }).focus();
    expect(screen.getByRole('button', { name: 'Add to cart' })).toHaveFocus();
    await user.keyboard('{Enter}');

    expect(screen.getByText('Added to your cart ✓')).toBeInTheDocument();
  });
});
