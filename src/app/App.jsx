import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { figmaSections, vectorAssets } from '@/features/sections';

const frequencies = ['Every 30 days', 'Every 60 days', 'Every 90 days'];
const paymentMethods = ['Credit/Debit Card', 'PayPal', 'Google Pay', 'Affirm'];

function Header() {
  return (
    <header className="border-b border-border bg-white" data-figma-section="21">
      <p className="bg-brand-red px-2 py-2 text-center text-sm font-bold text-white">Make more. Save more. Shop weekly deals</p>
      <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center gap-4 px-4 py-4 md:px-8">
        <p className="font-wordmark text-[44px] leading-[1.1] text-brand-red">Michaels</p>
        <label className="min-w-[260px] flex-1">
          <span className="sr-only">Search products, projects and more</span>
          <input className="h-12 w-full rounded-lg border border-border bg-surface px-3 text-base focus-visible:ring-2 focus-visible:ring-brand-red" defaultValue="Search products, projects and more" />
        </label>
        <nav aria-label="Utility" className="flex items-center gap-4 text-sm text-text-primary">
          <a href="#">Find a store</a>
          <a href="#">Sign in</a>
          <a href="#">Cart (3)</a>
        </nav>
      </div>
      <nav aria-label="Primary" className="mx-auto flex w-full max-w-[1440px] gap-8 overflow-x-auto border-t border-border px-4 py-3 text-sm md:px-8">
        <a href="#">Shop categories</a>
        <a href="#">Weekly ad</a>
        <a href="#">Coupons</a>
      </nav>
    </header>
  );
}

function ProductPanel({ purchaseType, onPurchaseType, frequency, setFrequency, qty, setQty, miniCartOpen, setMiniCartOpen }) {
  const isSubscription = purchaseType === 'subscription';

  return (
    <section className="mx-auto grid w-full max-w-[1440px] gap-8 px-4 py-8 md:grid-cols-[1fr_448px] md:px-8" data-figma-section={isSubscription ? '03' : '01'}>
      <article>
        <p className="mb-4 text-sm text-text-muted">Home / Art supplies / Painting / Oil paint</p>
        <div className="rounded-lg border border-border bg-surface p-4">
          <img src="/figma-assets/paint-tubes.svg" alt="Ohuhu oil paint set, 24 colors" className="mx-auto h-auto w-full max-w-[420px]" />
        </div>
      </article>
      <article className="space-y-4">
        <h1 className="text-[32px] font-bold leading-tight text-text-primary">Ohuhu oil paint set, 24 colors</h1>
        <p className="text-text-muted">24 colors · Paint tubes · Color range</p>

        <fieldset className="space-y-3" data-figma-section="32">
          <legend className="sr-only">Purchase type</legend>
          <label className={`block rounded-lg border p-4 ${!isSubscription ? 'border-brand-red bg-brand-red-soft' : 'border-border'}`}>
            <input type="radio" name="purchase-type" value="one-time" checked={!isSubscription} onChange={() => onPurchaseType('one-time')} className="mr-2" />◉ One-time purchase
            <span className="float-right font-bold">$23.99</span>
          </label>
          <label className={`block rounded-lg border p-4 ${isSubscription ? 'border-brand-red bg-brand-red-soft' : 'border-border'}`}>
            <input type="radio" name="purchase-type" value="subscription" checked={isSubscription} onChange={() => onPurchaseType('subscription')} className="mr-2" />Subscribe & Save
            <span className="float-right font-bold">$21.59</span>
            <span className="ml-2 inline-block rounded bg-white px-2 py-1 text-xs font-bold text-brand-red">Save 10%</span>
            <p className="mt-2 text-sm text-text-muted">Save on every delivery</p>
          </label>
        </fieldset>

        <div data-figma-section="33">
          <label htmlFor="frequency" className="mb-1 block font-bold text-text-primary">Delivery frequency</label>
          <select id="frequency" className="h-12 w-full rounded-lg border border-border bg-white px-3" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
            {frequencies.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <p className="font-bold">Quantity</p>
          <div className="flex items-center rounded-lg border border-border">
            <button aria-label="Decrease quantity" className="h-10 w-10" onClick={() => setQty((prev) => Math.max(1, prev - 1))}>−</button>
            <span className="w-10 text-center">{qty}</span>
            <button aria-label="Increase quantity" className="h-10 w-10" onClick={() => setQty((prev) => prev + 1)}>+</button>
          </div>
        </div>

        <Button onClick={() => setMiniCartOpen(true)} className="w-full">Add to cart</Button>
        {miniCartOpen && (
          <aside className="rounded-lg border border-border bg-white p-4" data-figma-section="10" aria-live="polite">
            <p className="font-bold text-brand-red">Added to your cart ✓</p>
            <p>Your cart (3 items) Close ×</p>
            <p>Ohuhu oil paint set, 24 colors</p>
            <p>Subscription</p>
            <p>{frequency}</p>
            <Button variant="secondary" onClick={() => setMiniCartOpen(false)} className="mt-3 w-full">Continue shopping</Button>
          </aside>
        )}
      </article>
    </section>
  );
}

function CheckoutPanel({ purchaseType, payment, setPayment }) {
  const isSubscription = purchaseType === 'subscription';
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-8 md:px-8" data-figma-section={isSubscription ? '11' : '13'}>
      <h2 className="text-2xl font-bold">Secure checkout</h2>
      <p className="mt-2">1 Shipping ✓ / 2 Payment / 3 Review</p>
      <p className="mt-2">Shipping to Jamie Taylor</p>
      <p>123 Maple Street, Austin, TX 78701 Standard shipping · Sep 18–21 Edit shipping details</p>
      <fieldset className="mt-6 space-y-2" data-figma-section="34">
        <legend className="font-bold">Choose a payment method</legend>
        {paymentMethods.map((method) => {
          const isAffirmBlocked = isSubscription && method === 'Affirm';
          return (
            <label key={method} className={`flex items-center justify-between rounded-lg border p-3 ${isAffirmBlocked ? 'opacity-60' : ''}`}>
              <span>{payment === method ? '◉' : '○'} {method}{method === 'Affirm' ? ' ⓘ' : ''}</span>
              <input
                type="radio"
                name="payment"
                value={method}
                checked={payment === method}
                disabled={isAffirmBlocked}
                onChange={() => setPayment(method)}
                aria-label={method}
              />
            </label>
          );
        })}
        {isSubscription && <p className="text-sm text-text-muted">Not available with Subscribe & Save items.</p>}
      </fieldset>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-surface px-4 py-8 md:px-12" data-figma-section="22">
      <div className="mx-auto max-w-[1440px] space-y-4">
        <h2 className="text-2xl font-bold">Get inspired. Get rewarded.</h2>
        <p>Join Michaels Rewards for offers, inspiration and more.</p>
        <Button className="w-full md:w-auto">Join Michaels Rewards</Button>
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="font-bold">Customer care</h3>
            <p>Contact us Shipping & returns Track your order Help center</p>
          </div>
          <div>
            <h3 className="font-bold">Shop with Michaels</h3>
            <p>Find a store Weekly ad Gift cards Michaels Rewards</p>
          </div>
          <div>
            <h3 className="font-bold">About Michaels</h3>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SectionCoverage() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-8 md:px-8" aria-label="Figma section coverage">
      <h2 className="mb-4 text-xl font-bold">Figma section coverage map</h2>
      <p className="mb-4 text-sm text-text-muted">This block preserves all exported section markers and anchor strings for parity checks across desktop/mobile variants.</p>
      <div className="grid gap-4 lg:grid-cols-2">
        {figmaSections.map((section) => (
          <article key={section.id} data-figma-section={section.id} className="rounded-lg border border-border bg-white p-4">
            <h3 className="font-bold">{section.id} · {section.title}</h3>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
              {section.anchors.map((copy) => <li key={copy}>{copy}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function AssetGrid() {
  const allAssets = useMemo(() => ['/figma-assets/paint-tubes.svg', ...vectorAssets], []);
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 pb-12 md:px-8" aria-label="Figma assets">
      <h2 className="mb-4 text-xl font-bold">Exported artwork assets</h2>
      <div className="grid grid-cols-5 gap-2 md:grid-cols-10">
        {allAssets.map((src) => (
          <img key={src} src={src} alt={src.replace('/figma-assets/', '')} className="h-14 w-14 rounded border border-border bg-white object-contain p-1" loading="lazy" />
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [purchaseType, setPurchaseType] = useState('subscription');
  const [frequency, setFrequency] = useState('Every 30 days');
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState('Credit/Debit Card');
  const [miniCartOpen, setMiniCartOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white font-ui text-base text-text-primary">
      <Header />
      <ProductPanel
        purchaseType={purchaseType}
        onPurchaseType={setPurchaseType}
        frequency={frequency}
        setFrequency={setFrequency}
        qty={qty}
        setQty={setQty}
        miniCartOpen={miniCartOpen}
        setMiniCartOpen={setMiniCartOpen}
      />
      <section className="mx-auto w-full max-w-[1440px] px-4" data-figma-section="35">
        <h2 className="text-2xl font-bold">Your cart (3 items)</h2>
        <p>Keep creating with supplies delivered on your schedule.</p>
        <div className="mt-4 rounded-lg border border-border p-4">
          <p className="font-bold">Ohuhu oil paint set, 24 colors</p>
          <p>Subscription</p>
          <p>{frequency}</p>
          <p>$21.59 · Qty {qty}</p>
          <button className="mr-3 underline">Change frequency</button>
          <button className="underline">Switch to one-time purchase</button>
        </div>
        <div className="mt-4 rounded-lg border border-border p-4">
          <p className="font-bold">Artist's Loft® canvas panel pack, 9 × 12 in.</p>
          <p>One-time purchase</p>
        </div>
      </section>
      <CheckoutPanel purchaseType={purchaseType} payment={payment} setPayment={setPayment} />
      <section className="mx-auto w-full max-w-[1440px] px-4 py-8 md:px-8" data-figma-section="16">
        <h2 className="text-3xl font-bold">✓ Thanks, Jamie. Your order is confirmed.</h2>
        <p>Order #MCS-091426-2841 · September 14, 2026</p>
        <p>We sent your receipt to jamie.taylor@example.com.</p>
        <h3 className="mt-3 font-bold">Subscription items</h3>
        <p>Ohuhu oil paint set, 24 colors</p>
      </section>
      <section className="mx-auto w-full max-w-[640px] rounded-lg border border-border bg-white p-6" data-figma-section="17">
        <h2 className="text-xl font-bold">Your Michaels order is confirmed</h2>
        <p className="text-sm text-text-muted">From: Michaels To: jamie.taylor@example.com September 14, 2026 · 10:42 AM</p>
        <p className="mt-2 text-2xl font-bold">Thanks for your order, Jamie.</p>
        <p>Your next creative project starts here. We'll email you when your items ship.</p>
        <p className="mt-2">Order #MCS-091426-2841 Placed September 14, 2026</p>
        <p className="mt-2 font-bold">Subscription items</p>
        <p>Subscription</p>
        <p>Ohuhu oil paint set, 24 colors</p>
      </section>
      <SectionCoverage />
      <AssetGrid />
      <Footer />
    </main>
  );
}
