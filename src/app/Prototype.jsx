import { useState } from 'react';
import './prototype.css';

const categories = ['Shop categories', 'Weekly ad', 'Coupons', 'Projects & ideas', 'Classes', 'Custom framing', 'Michaels Rewards'];
const footerGroups = [
  ['Customer care', 'Contact us', 'Shipping & returns', 'Track your order', 'Help center'],
  ['Shop with Michaels', 'Find a store', 'Weekly ad', 'Gift cards', 'Michaels Rewards'],
  ['About Michaels', 'Our company', 'Careers', 'Accessibility', 'Privacy policy'],
];

function Price({ subscription, large = false }) {
  return <div className={`price ${large ? 'large' : ''}`}><strong>{subscription ? '$21.59' : '$23.99'}</strong>{subscription && <><s>$23.99</s><b>Save 10%</b></>}</div>;
}

function PurchaseCard({ subscription, selected, onChange }) {
  const label = subscription ? 'Subscribe & Save' : 'One-time purchase';
  return <label className={`purchase-card ${selected ? 'selected' : ''}`}>
    <span className="purchase-label"><input className="sr-only" type="radio" name="purchase" aria-label={label} checked={selected} onChange={onChange} /><span aria-hidden="true">{selected ? '◉' : '○'}{'  '}</span>{label}</span>
    <Price subscription={subscription} />
    {subscription && <p className="muted small">Save on every delivery</p>}
  </label>;
}

export default function Prototype() {
  const [subscription, setSubscription] = useState(true);
  const [frequency, setFrequency] = useState('30');
  const [quantity, setQuantity] = useState(1);
  const [count, setCount] = useState(3);
  const [favorite, setFavorite] = useState(false);
  const [menu, setMenu] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  return <div className="prototype" data-figma-section={String(26 + ['30', '60', '90'].indexOf(frequency))}>
    <header>
      <p className="promotion">Make more. Save more. Shop weekly deals</p>
      <div className="header-row">
        <p className="wordmark">Michaels</p>
        <input className="search" aria-label="Search products, projects and more" placeholder="Search products, projects and more" />
        <div className="desktop-utilities"><span>Find a store</span><span>Sign in</span><strong>Cart ({count})</strong></div>
        <div className="mobile-utilities"><button aria-label="Menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>☰</button><button aria-label="Favorites" aria-pressed={favorite} onClick={() => setFavorite(!favorite)}>♡</button><strong>Bag {count}</strong></div>
      </div>
      <nav aria-label="Categories" className={`categories ${menu ? 'open' : ''}`}>{categories.map(item => <span key={item}>{item}</span>)}</nav>
    </header>
    <main className="product-content">
      <p className="breadcrumb">Home  /  Art supplies  /  Painting  /  Oil paint</p>
      <div className="product-columns">
        <section className="gallery" aria-label="Product gallery">
          <figure><img src="/figma-assets/paint-tubes.svg" alt="Illustration of the Ohuhu oil paint set with 24 paint tubes" /><figcaption>Ohuhu · Oil paint · 24 colors</figcaption></figure>
          <div className="thumbnails">{['24 colors', 'Paint tubes', 'Color range'].map(label => <span key={label}>{label}</span>)}</div>
          <h2>Rich color for your next canvas</h2>
          <p className="muted">Explore 24 oil-based colors in easy-to-use 12 ml tubes. Create blends, build texture and bring your ideas to life.</p>
        </section>
        <section className="buy-box" aria-label="Purchase options">
          <p className="brand">Ohuhu</p>
          <h1>Oil paint set, 24 oil-based colors</h1>
          <p className="small muted">24 × 12 ml tubes · Artist painting supplies</p>
          <p className="small">★★★★☆   4.6   (128 reviews)</p>
          <Price subscription={subscription} large />
          <strong>Shipping available</strong>
          <p className="small muted">Ships to your home · Estimated arrival Sep 18–21</p>
          <hr />
          <fieldset className="purchase-options"><legend className="sr-only">Purchase type</legend>
            <PurchaseCard selected={!subscription} subscription={false} onChange={() => setSubscription(false)} />
            <PurchaseCard selected={subscription} subscription onChange={() => setSubscription(true)} />
          </fieldset>
          {subscription && <><label className="frequency-label" htmlFor="delivery-frequency">Delivery frequency</label>
            <div className="frequency-control"><select id="delivery-frequency" value={frequency} onChange={event => setFrequency(event.target.value)}>{['30', '60', '90'].map(days => <option key={days} value={days}>Every {days} days</option>)}</select><span aria-hidden="true">⌄</span></div>
            <p className="small muted">Billed each delivery. Cancel anytime.</p></>}
          <div className="quantity"><span>Quantity</span><div><button aria-label="Decrease quantity" disabled={quantity === 1} onClick={() => setQuantity(quantity - 1)}>−</button><output aria-label="Quantity">{quantity}</output><button aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)}>+</button></div></div>
          <button className="pill" onClick={() => { setCount(count + quantity); setAnnouncement(`${quantity} ${subscription ? 'subscription' : 'one-time'} item${quantity > 1 ? 's' : ''} added to cart${subscription ? `, every ${frequency} days` : ''}.`); }}>{subscription ? 'Add subscription to cart' : 'Add to cart'}</button>
          <button className="pill secondary" aria-pressed={favorite} onClick={() => setFavorite(!favorite)}>Save to favorites</button>
          <p className="small muted">Secure checkout · Easy returns</p>
          <p role="status" className="sr-only">{announcement}</p>
        </section>
      </div>
      <section className="product-information" aria-label="Product information">
        <hr /><h2>Product details</h2>
        <p className="muted">• Includes 24 oil-based colors, 12 ml each<br />• For canvas painting and color mixing<br />• Suitable for beginners, students and artists<br />• Store tubes tightly closed between uses</p>
        <hr /><h2>Shipping &amp; returns    +</h2>
        <p className="small muted">View shipping options and return eligibility before placing your order.</p>
      </section>
    </main>
    <footer>
      <h2>Get inspired. Get rewarded.</h2>
      <p>Join Michaels Rewards for offers, inspiration and more.</p>
      <a className="pill rewards" href="https://www.michaels.com/rewards">Join Michaels Rewards</a>
      <div className="footer-groups">{footerGroups.map(([title, ...items]) => <section key={title}><h3>{title}</h3><p className="small muted">{items.map(item => <span key={item}>{item}<br /></span>)}</p></section>)}</div>
      <hr /><p className="copyright muted">© 2026 Michaels Stores. Terms of use · Privacy policy</p>
    </footer>
  </div>;
}
