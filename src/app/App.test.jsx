import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('Subscribe & Save prototype', () => {
  it('renders core figma copy and section markers', () => {
    const { container } = render(<App />);
    expect(screen.getByText('Make more. Save more. Shop weekly deals')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Ohuhu oil paint set, 24 colors' })).toBeInTheDocument();
    expect(container.querySelectorAll('[data-figma-section]').length).toBeGreaterThanOrEqual(35);
  });

  it('supports purchase type and frequency interactions', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('radio', { name: /one-time/i }));
    expect(screen.getByRole('radio', { name: /one-time/i })).toBeChecked();

    await user.selectOptions(screen.getByLabelText('Delivery frequency'), 'Every 60 days');
    expect(screen.getByText('Every 60 days')).toBeInTheDocument();
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

    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    await user.keyboard('{Enter}');

    expect(screen.getByText('Added to your cart ✓')).toBeInTheDocument();
  });
});
