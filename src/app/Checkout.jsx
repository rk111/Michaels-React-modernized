import { useState } from 'react';

// This flow deliberately never sends or persists payment details.
export default function Checkout({ items, onBack, onShop, onStepChange = () => {} }) {
  const [step, updateStep] = useState('payment');
  const setStep = next => {
    updateStep(next);
    onStepChange(next);
  };
  const [method, setMethod] = useState('Credit/Debit Card');
  const [consent, setConsent] = useState(false);
  const subscription = items.some(item => item.subscription);
  const money = value => `$${(value / 100).toFixed(2)}`;
  if (!items.length) return <section aria-label="Empty checkout"><h2>Your cart is empty.</h2><button className="pill" onClick={onShop}>Continue shopping</button></section>;
  if (step === 'confirmation' || step === 'receipt') return <section className="cart-items" aria-label="Order confirmation">
    <h2>{step === 'receipt' ? 'Your Michaels order is confirmed' : '✓ Thanks, Jamie. Your order is confirmed.'}</h2>
    <p role="status">Demo order only. No payment was taken and no email was sent.</p>
    <p>Order #MCS-091426-2841 · September 14, 2026</p>
    {subscription && <h3>Subscription items</h3>}
    {items.filter(item => item.subscription).map(item => <article className="cart-item" key={item.id}><h3>{item.name}</h3><p>Quantity {item.quantity} · {money(item.price * item.quantity)}</p><p>Every {item.frequency} days · Billed each delivery</p><p>Manage or cancel anytime in Your Account.</p></article>)}
    <h3>One-time items</h3>{items.filter(item => !item.subscription).map(item => <article className="cart-item" key={item.id}><h3>{item.name}</h3><p>{money(item.price * item.quantity)} · Qty {item.quantity}</p></article>)}
    <h3>Delivery details</h3><p>Jamie Taylor<br />123 Maple Street<br />Austin, TX 78701<br />Standard shipping · Estimated Sep 18–21</p>
    <button className="pill secondary" onClick={() => setStep(step === 'receipt' ? 'confirmation' : 'receipt')}>{step === 'receipt' ? 'Back to confirmation' : 'View receipt'}</button>
    <button className="pill" onClick={onShop}>Continue shopping</button>
  </section>;
  if (step === 'review') return <section className="cart-items" aria-label="Review order"><h2>Review your order</h2><p>Shipping to Jamie Taylor</p><p>123 Maple Street, Austin, TX 78701</p><p>Payment: {method} (simulation)</p>{items.map(item => <article className="cart-item" key={item.id}><strong>{item.name}</strong><p>{money(item.price * item.quantity)} · Qty {item.quantity}</p>{item.subscription && <p>Every {item.frequency} days · Billed each delivery. Cancel anytime.</p>}</article>)}<button className="pill" onClick={() => setStep('confirmation')}>Place demo order</button><button className="cart-link" onClick={() => setStep('payment')}>Edit payment</button><button className="cart-link" onClick={onBack}>Return to cart</button></section>;
  return <form className="cart-items checkout-form" onSubmit={event => { event.preventDefault(); setStep('review'); }}>
    <section className="cart-item"><h3>Shipping to Jamie Taylor</h3><p>123 Maple Street, Austin, TX 78701<br />Standard shipping · Sep 18–21</p></section>
    <h2>Choose a payment method</h2><p role="note">Local prototype only. Use fictional details. No payment information is sent or saved.</p>
    <fieldset><legend className="sr-only">Payment method</legend>{['Credit/Debit Card', 'PayPal', 'Google Pay', 'Affirm'].map(value => <div className="cart-item" key={value}><label><input type="radio" name="payment" value={value} checked={method === value} disabled={value === 'Affirm' && subscription} onChange={() => setMethod(value)} /> {value}</label>{value === 'Credit/Debit Card' && method === value && <><p className="small muted">Visa · Mastercard · American Express · Discover</p><label>Name on card<input required placeholder="Jamie Taylor" autoComplete="off" /></label><label>Card number<input required inputMode="numeric" pattern="[0-9 ]{13,23}" placeholder="1234 5678 9012 3456" autoComplete="off" /></label><div className="checkout-pair"><label>Expiration date<input required pattern="(0[1-9]|1[0-2]) ?/ ?[0-9]{2}" placeholder="MM / YY" autoComplete="off" /></label><label>Security code<input required inputMode="numeric" pattern="[0-9]{3,4}" placeholder="CVV" autoComplete="off" /></label></div><label>Billing ZIP code<input required pattern="[0-9]{5}" inputMode="numeric" placeholder="78701" /></label><label><input type="checkbox" defaultChecked /> Billing address is the same as shipping</label></>}{value === 'Affirm' && subscription && <p className="small muted">Not available with Subscribe &amp; Save items.</p>}</div>)}</fieldset>
    {method !== 'Credit/Debit Card' && <p>{method} authorization is simulated; no external account will be opened.</p>}
    {subscription && <label><input type="checkbox" required checked={consent} onChange={event => setConsent(event.target.checked)} /> Authorize recurring charges at your selected frequency. Billed each delivery. Cancel anytime.</label>}
    <button className="pill" type="submit">Continue to review</button><button className="cart-link" type="button" onClick={onBack}>Return to cart</button>
  </form>;
}
