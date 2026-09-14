import { useState } from 'react';
import './cart.css';
import Checkout from './Checkout.jsx';

export default function Cart({ items, setItems, onShop }) {
  const [editing, setEditing] = useState(null);
  const saved = items.filter(item => item.saved).map(item => item.id);
  const setSaved = updater => setItems(current => {
    const ids = updater(current.filter(item => item.saved).map(item => item.id));
    return current.map(item => ({ ...item, saved: ids.includes(item.id) }));
  });
  const [message, setMessage] = useState('');
  const [checkout, setCheckout] = useState(false);
  const active = items.filter(item => !saved.includes(item.id));
  const count = active.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = active.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = count ? 695 : 0;
  const tax = Math.round(subtotal * 0.08);
  const subscriptions = active.filter(item => item.subscription);
  const money = cents => `$${(cents / 100).toFixed(2)}`;
  const update = (id, patch) => setItems(current => current.map(item => item.id === id ? { ...item, ...patch } : item));
  return <main className="cart-content">
    <h1>{checkout ? 'Secure checkout' : `Your cart (${count} items)`}</h1>
    <p className="muted">{checkout ? '1 Shipping ✓ / 2 Payment / 3 Review' : 'Keep creating with supplies delivered on your schedule.'}</p>
    <div className="cart-columns"><section className="cart-items" aria-label={checkout ? 'Payment' : 'Cart items'}>
      {checkout ? <Checkout items={active} onBack={() => setCheckout(false)} onShop={onShop} /> : <>
      {items.map(item => <article className="cart-item" key={item.id} aria-label={item.name}>
        <div className="cart-details"><div><h3>{item.name}</h3><p>{item.subscription ? <span className="subscription-badge">Subscription</span> : 'One-time purchase'}</p>{item.subscription && <p className="small muted">Every {item.frequency} days</p>}<strong>{money(item.price)}   ·   Qty {item.quantity}</strong></div></div>
        {saved.includes(item.id) ? <button className="cart-link" onClick={() => setSaved(current => current.filter(id => id !== item.id))}>Move to cart</button> : item.subscription ? <><button className="cart-link" onClick={() => setEditing(editing === item.id ? null : item.id)}>Change frequency</button>{editing === item.id && <label>Delivery frequency<select value={item.frequency} onChange={event => update(item.id, { frequency: event.target.value })}>{['30', '60', '90'].map(days => <option value={days} key={days}>Every {days} days</option>)}</select></label>}<button className="cart-link" onClick={() => update(item.id, { subscription: false, price: 2399 })}>Switch to one-time purchase</button></> : <div className="small muted"><button onClick={() => setSaved(current => [...current, item.id])}>Save for later</button>　·　<button onClick={() => setItems(current => current.filter(row => row.id !== item.id))}>Remove</button></div>}
      </article>)}
      {!items.length && <p>Your cart is empty.</p>}
      <form className="cart-promo" onSubmit={event => { event.preventDefault(); setMessage('Promo codes cannot be verified in this local prototype.'); }}><label htmlFor="promo">Promo code</label><input id="promo" placeholder="Enter code" required /><button className="pill secondary">Apply code</button></form>
      <button className="cart-link" onClick={onShop}>Continue shopping</button></>}
    </section><aside className="cart-summary"><h2>Order summary</h2><p><span>Items ({count})</span><span>{money(subtotal)}</span></p><p><span>Shipping</span><span>{money(shipping)}</span></p><p><span>Estimated tax</span><span>{money(tax)}</span></p>{subscriptions.length > 0 && <strong className="cart-link">You save {money(subscriptions.reduce((sum, item) => sum + 240 * item.quantity, 0))} with Subscribe &amp; Save</strong>}<hr /><p className="cart-total"><strong>Total today</strong><strong>{money(subtotal + shipping + tax)}</strong></p>{subscriptions.map(item => <div className="cart-disclosure" key={item.id}><p>You'll be billed every {item.frequency} days. Manage or cancel anytime in Your Account.</p><p className="small muted">Future deliveries: {money(item.price * item.quantity)} plus applicable shipping and tax.</p></div>)}{!checkout && <button className="pill" disabled={!count} onClick={() => setCheckout(true)}>Continue to checkout</button>}<p>Secure checkout</p></aside></div><p role="status">{message}</p>
  </main>;
}
