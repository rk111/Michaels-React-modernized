import { useEffect, useRef } from 'react';
import Cart from './Cart.jsx';
import './mini-cart.css';

export default function MiniCart({ items, setItems, onClose, onViewCart }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    const dialog = ref.current;
    dialog.showModal();
    dialog.querySelector('.mini-cart-close').focus();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  return <dialog ref={ref} className="mini-cart prototype" aria-labelledby="mini-cart-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) { const box = event.currentTarget.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose(); } }}>
    <h2 id="mini-cart-title">Added to your cart ✓</h2>
    <button className="mini-cart-close" aria-label="Close mini-cart" onClick={onClose}>Close ×</button>
    <Cart mini items={items} setItems={setItems} onShop={onClose} onViewCart={onViewCart} />
  </dialog>;
}
