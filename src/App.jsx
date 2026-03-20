import React, { useState, useEffect, useRef } from 'react';

const MENU_ITEMS = [
  { id: 1, cat: 'food', name: 'Loaded Waffle', price: 80, badgeClass: 'bh', badgeText: '🔥 Bestseller', emoji: '🧇', img: '/loaded_waffle.png', desc: 'Crispy golden waffle with chocolate drizzle, fresh fruits & whipped cream cloud on top.', grad: 'linear-gradient(135deg,#FFF4DC,#FFE08A)' },
  { id: 2, cat: 'food', name: 'Grill Sandwich', price: 70, badgeClass: 'bl', badgeText: '💛 Fan Fav', emoji: '🥪', img: '/grill_sandwich.png', desc: 'Fresh veggies, gooey cheese & secret green chutney stuffed and grilled to golden perfection.', grad: 'linear-gradient(135deg,#FFFBE0,#FFE080)' },
  { id: 3, cat: 'food', name: 'Potato Spiral', price: 49, badgeClass: 'bn', badgeText: '✨ New Hit', emoji: '🌀', img: '/potato_spiral.png', desc: 'Whole potato twisted on a stick, fried and dusted with zingy masala & cheese powder blast.', grad: 'linear-gradient(135deg,#FFE8D4,#FFB87A)' },
  { id: 4, cat: 'food', name: 'French Fries', price: 50, badgeClass: 'bh', badgeText: '🔥 Crispy', emoji: '🍟', img: '/french_fries.png', desc: 'Golden crispy fries — plain, peri-peri, cheesy or schezwan. Always piping hot & fresh!', grad: 'linear-gradient(135deg,#FFE0C4,#FFB07A)' },
  { id: 5, cat: 'food', name: 'Steamed Momos', price: 60, badgeClass: 'bl', badgeText: '❤️ Must Try', emoji: '🥟', img: '/steamed_momos.png', desc: 'Juicy dumplings with fiery red chutney. Veg & paneer options — always steaming fresh!', grad: 'linear-gradient(135deg,#D8F5E4,#90E4BC)' },
  { id: 6, cat: 'food', name: 'Masala Maggie with Vegies', price: 60, badgeClass: 'bl', badgeText: '🌙 Comfort', emoji: '🍜', img: '/masala_maggie.png', desc: 'Extra masala, loaded veggies & a squeeze of lime. The ultimate street food comfort bowl!', grad: 'linear-gradient(135deg,#FFF4DC,#FFD595)' },
  { id: 7, cat: 'drinks', name: 'Cold Coffee', price: 60, badgeClass: 'bh', badgeText: '🔥 Chilled', emoji: '☕', img: '/cold_coffee.png', desc: 'Rich blended cold coffee with double espresso shot, topped with dreamy whipped cream.', grad: 'linear-gradient(135deg,#E4DCF8,#B8A4E8)' },
  { id: 8, cat: 'drinks', name: 'Virgin Mojito', price: 60, badgeClass: 'bn', badgeText: '✨ Fresh', emoji: '🍹', img: '/virgin_mojito.png', desc: 'Super fresh mint lime mojito on crushed ice. Watermelon, lychee & classic mint variants!', grad: 'linear-gradient(135deg,#DCFAEC,#82E8AC)' },
  { id: 9, cat: 'drinks', name: 'Shikanji', price: 30, badgeClass: 'bl', badgeText: '☀️ Zesty', emoji: '🍋', img: '/shikanji.png', desc: 'Traditional Indian lemonade with black salt, roasted cumin & fresh mint. Super refreshing!', grad: 'linear-gradient(135deg,#FFFDE0,#FFE07A)' },
  { id: 10, cat: 'food', name: 'Peri-Peri Potato Spiral', price: 59, badgeClass: 'bn', badgeText: '✨ New Hit', emoji: '🌀', img: '/peri_peri_spiral.png', desc: 'Whole potato twisted on a stick, fried and dusted with zingy masala & cheese powder blast.', grad: 'linear-gradient(135deg,#FFE8D4,#FFB87A)' },
];

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isScrolled, setIsScrolled] = useState(false);
  const [orderDetails, setOrderDetails] = useState({ name: '', phone: '', type: 'pickup', address: '', note: '', pay: 'cash' });
  const [orderState, setOrderState] = useState({ placed: false, id: null });
  const [formErrors, setFormErrors] = useState({ name: false, phone: false });
  const curRef = useRef(null);
  const curRRef = useRef(null);

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;
    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (curRef.current) {
        curRef.current.style.left = mx + 'px';
        curRef.current.style.top = my + 'px';
      }
    };
    
    let req;
    const loop = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (curRRef.current) {
        curRRef.current.style.left = rx + 'px';
        curRRef.current.style.top = ry + 'px';
      }
      req = requestAnimationFrame(loop);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    loop();

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    const obs = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    
    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    }, 500);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(req);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const addToCart = (item, e) => {
    const btn = e.currentTarget;
    const o = btn.innerHTML;
    btn.innerHTML = '✓';
    btn.style.background = 'var(--green)';
    btn.style.transform = 'scale(1.2)';
    setTimeout(() => {
      btn.innerHTML = o;
      btn.style.background = '';
      btn.style.transform = '';
    }, 700);

    setCart(prev => {
      const ex = prev.find(i => i.id === item.id);
      if (ex) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const chQty = (id, d) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + d } : i).filter(i => i.qty > 0));
  };

  const remItem = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const placeOrder = () => {
    if (!orderDetails.name.trim() || !orderDetails.phone.trim()) {
      setFormErrors({ name: !orderDetails.name.trim(), phone: !orderDetails.phone.trim() });
      setTimeout(() => setFormErrors({ name: false, phone: false }), 1400);
      return;
    }
    const id = 'TVM' + Math.floor(100000 + Math.random() * 900000);
    
    const orderItems = cart.map(c => `${c.qty}x ${c.name} (₹${c.price * c.qty})`).join('\n');
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0) + 5;
    const text = `*New Order: #${id}*
*Name:* ${orderDetails.name}
*Phone:* ${orderDetails.phone}
*Type:* ${orderDetails.type === 'delivery' ? '🛵 Delivery' : '🏃 Pickup'}
${orderDetails.type === 'delivery' ? `*Address:* ${orderDetails.address}\n` : ''}${orderDetails.note ? `*Note:* ${orderDetails.note}\n` : ''}
*Items:*
${orderItems}

*Total:* ₹${total}
*Payment:* ${orderDetails.pay === 'upi' ? '📱 UPI' : '💵 Cash'}`;

    window.open(`https://wa.me/918869813402?text=${encodeURIComponent(text)}`, '_blank');

    setOrderState({ placed: true, id });
    setCart([]);
  };

  const resetModal = () => {
    setIsCheckoutOpen(false);
    setOrderState({ placed: false, id: null });
    setOrderDetails({ name: '', phone: '', type: 'pickup', address: '', note: '', pay: 'cash' });
  };

  const renderCartItems = () => (
    cart.length === 0 ? (
      <div className="cempty">
        <div className="ei">🛒</div>
        <p>Your cart is empty!</p>
        <span style={{ fontSize: '.78rem', color: 'var(--muted)' }}>Add some yummy items 😋</span>
      </div>
    ) : (
      cart.map(c => (
        <div className="citem" key={c.id}>
          <div className="citem-em">{c.emoji}</div>
          <div className="citem-info">
            <h4>{c.name}</h4>
            <div className="cprice">₹{c.price} × {c.qty} = ₹{c.price * c.qty}</div>
          </div>
          <div className="ciqty">
            <button onClick={() => chQty(c.id, -1)}>−</button>
            <span>{c.qty}</span>
            <button onClick={() => chQty(c.id, 1)}>+</button>
          </div>
          <button className="cdel" onClick={() => remItem(c.id)}>🗑</button>
        </div>
      ))
    )
  );

  const cartTot = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCnt = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <div id="cur" ref={curRef}></div>
      <div id="cur-r" ref={curRRef}></div>

      <div className="blobs">
        <div className="blob b1"></div><div className="blob b2"></div>
        <div className="blob b3"></div><div className="blob b4"></div>
      </div>

      <nav id="nav" className={isScrolled ? 'sc' : ''}>
        <a href="#" className="nav-logo">
          <img src="/logo.jpeg" alt="TVM Logo" style={{ width: 50, height: 50, borderRadius: 14, objectFit: 'cover' }} />
          <div className="logo-text">The Viral Munchies</div>
        </a>
        <ul className="nav-links">
          <li><a href="#menu">Menu</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#features">Why Us</a></li>
          <li><a href="#contact">Find Us</a></li>
        </ul>
        <div className="nav-right">
          <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
            🛒 Cart
            <span className={`cc ${cartCnt > 0 ? 'bump' : ''}`} key={cartCnt}>{cartCnt}</span>
          </button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🔥 Now Open — Freshly Cooked Daily</div>
          <h1>Street Food<span className="accent">Gone Viral!</span></h1>
          <p className="hero-desc">Bold flavours. Pocket-friendly prices. Every bite is an Insta moment waiting to happen. Welcome to TVM — The Viral Munchies.</p>
          <div className="hero-tags">
            {['🧇 Waffles', '🥟 Momos', '🍟 Fries', '🥪 Sandwiches', '🍹 Mojito', '🍋 Shikanji', '🌀 Spiral', '☕ Cold Coffee'].map(t => (
              <span className="htag" key={t}>{t}</span>
            ))}
          </div>
          <div className="hero-btns">
            <a href="#menu" className="btn-main">Order Now 🛒</a>
            <a href="#about" className="btn-ghost">Our Story</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hplate">🍟
            <div className="oi oi1">🧇</div>
            <div className="oi oi2">🥟</div>
            <div className="oi oi3">🥪</div>
            <div className="oi oi4">🍹</div>
            <div className="oi oi5">☕</div>
          </div>
        </div>
      </section>

      <div className="mq">
        <div className="mq-inner">
          {Array(2).fill(['🧇 Waffle', '🥪 Grill Sandwich', '🌀 Potato Spiral', '🍟 French Fries', '🥟 Momos', '☕ Cold Coffee', '🍹 Mojito', '🍋 Shikanji', '🍜 Maggie']).flat().map((item, i) => (
            <React.Fragment key={i}>
              <span className="mq-item">{item}</span><span className="mq-dot">✦</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <section id="menu">
        <div className="menu-top reveal">
          <div>
            <div className="slbl">What We Serve</div>
            <h2 className="stitle">The <em>Viral</em> Menu</h2>
          </div>
          <div className="tabs">
            <button className={`tab ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setActiveCategory('all')}>All Items</button>
            <button className={`tab ${activeCategory === 'food' ? 'active' : ''}`} onClick={() => setActiveCategory('food')}>🍽️ Food</button>
            <button className={`tab ${activeCategory === 'drinks' ? 'active' : ''}`} onClick={() => setActiveCategory('drinks')}>🥤 Drinks</button>
          </div>
        </div>
        <div className="mgrid">
          {MENU_ITEMS.filter(c => activeCategory === 'all' || c.cat === activeCategory).map(item => (
            <div className="mc reveal" key={item.id}>
              <div className="mc-img" style={{ background: item.grad, padding: 0 }}>
                <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div className={`mc-badge ${item.badgeClass}`} style={{ zIndex: 1 }}>{item.badgeText}</div>
              </div>
              <div className="mc-body">
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
                <div className="mc-foot">
                  <div className="mc-price"><sup>₹</sup>{item.price}</div>
                  <button className="mc-add" onClick={(e) => addToCart(item, e)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="about">
        <div className="about-inner">
          <div className="acards reveal">
            <div className="acard feat">
              <div className="acard-icon">🌶️</div>
              <h4>Born on the Streets</h4>
              <p>TVM started with one cart, one dream & one obsession — making every bite unforgettable and worth sharing with the world.</p>
            </div>
            <div className="acard reveal">
              <div className="acard-icon">🌿</div>
              <h4>Fresh Every Day</h4>
              <p>All ingredients sourced fresh daily. No frozen food, no shortcuts — ever.</p>
            </div>
            <div className="acard reveal">
              <div className="acard-icon">💰</div>
              <h4>Pocket Friendly</h4>
              <p>Great food for everyone. Flavours starting at just ₹30!</p>
            </div>
          </div>
          <div className="aright reveal">
            <div className="slbl">Who We Are</div>
            <h2 className="stitle">The Story <em>Behind</em> The Munch</h2>
            <p>TVM – The Viral Munchies was born from a simple obsession: making street food so irresistibly good that people can't help but share it.</p>
            <p>From crispy potato spirals to steaming momos and ice-cold mojitos — we've got your cravings covered, one viral bite at a time. 🔥</p>
            <div className="stats">
              <div className="stat"><div className="num">10+</div><div className="lbl">Menu Items</div></div>
              <div className="stat"><div className="num">100%</div><div className="lbl">Fresh Daily</div></div>
              <div className="stat"><div className="num">∞</div><div className="lbl">Good Vibes</div></div>
            </div>
          </div>
        </div>
      </section>

      <section id="features">
        <div style={{ textAlign: 'center' }} className="reveal">
          <div className="slbl" style={{ justifyContent: 'center' }}>Why Choose TVM</div>
          <h2 className="stitle">Munch <em>Smarter</em></h2>
        </div>
        <div className="fgrid">
          <div className="feat reveal"><div className="ficon" style={{ background: '#FFF0D4' }}>🌿</div><h3>100% Fresh</h3><p>Every ingredient freshly prepped each morning. Your food is never frozen or pre-packaged.</p></div>
          <div className="feat reveal"><div className="ficon" style={{ background: '#FFE8D4' }}>⚡</div><h3>Super Fast</h3><p>Hot food in your hands in minutes — because hunger doesn't wait and neither should you.</p></div>
          <div className="feat reveal"><div className="ficon" style={{ background: '#FFF8DC' }}>💸</div><h3>Best Value</h3><p>Maximum flavour, minimum price. Starting at just ₹30 — best value on the street, always.</p></div>
          <div className="feat reveal"><div className="ficon" style={{ background: '#FFE8EE' }}>📸</div><h3>Insta-Worthy</h3><p>Every dish is a photo waiting to happen. Taste it, snap it, share it — go viral with us!</p></div>
        </div>
      </section>

      <section id="contact">
        <div style={{ textAlign: 'center' }} className="reveal">
          <div className="slbl" style={{ justifyContent: 'center' }}>Come Find Us</div>
          <h2 className="stitle">Your <em>Nearest</em> Munch</h2>
        </div>
        <div className="owners-row reveal">
          <div className="owner-card">
            <div className="owner-avatar">👨‍🍳</div>
            <div className="owner-info">
              <div className="owner-tag">Co-Founder</div>
              <h3>Nitin Mittal</h3>
              <a href="tel:+918869813402" className="owner-phone">📞 +91 88698 13402</a>
              <a href="https://wa.me/918869813402" target="_blank" rel="noreferrer" className="owner-wa">
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.096.542 4.061 1.49 5.77L0 24l6.394-1.467A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.661-.5-5.191-1.374l-.37-.22-3.797.871.943-3.701-.242-.381A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
          <div className="owner-divider">🤝</div>
          <div className="owner-card">
            <div className="owner-avatar">👨‍🍳</div>
            <div className="owner-info">
              <div className="owner-tag">Co-Founder</div>
              <h3>Shivam Prajapati</h3>
              <a href="tel:+917500679284" className="owner-phone">📞 +91 75006 79284</a>
              <a href="https://wa.me/917500679284" target="_blank" rel="noreferrer" className="owner-wa">
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.096.542 4.061 1.49 5.77L0 24l6.394-1.467A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.661-.5-5.191-1.374l-.37-.22-3.797.871.943-3.701-.242-.381A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
        <div className="locations-row reveal">
          <div className="loc-card"><div className="loc-icon">📍</div><div className="loc-body"><div className="loc-label">Stall 1</div><h4>Near Shiv Chowk</h4><p>Muzaffarnagar, Uttar Pradesh</p><a href="https://maps.google.com/?q=Shiv+Chowk+Muzaffarnagar" target="_blank" rel="noreferrer" className="loc-link">Get Directions →</a></div></div>
          <div className="loc-card"><div className="loc-icon">📍</div><div className="loc-body"><div className="loc-label">Stall 2</div><h4>New Mandi</h4><p>Muzaffarnagar, Uttar Pradesh</p><a href="https://maps.google.com/?q=New+Mandi+Muzaffarnagar" target="_blank" rel="noreferrer" className="loc-link">Get Directions →</a></div></div>
          <div className="loc-card"><div className="loc-icon">🕐</div><div className="loc-body"><div className="loc-label">Timings</div><h4>7:00 PM – 5:00 AM</h4><p>Open 7 Days a Week</p><span className="open-badge">🟢 Open Now</span></div></div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 36 }} className="reveal">
          <button className="btn-main" onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}>Order Now 🛒</button>
        </div>
      </section>

      <footer>
        <div className="flogo">
          <img src="/logo.jpeg" alt="TVM Logo" style={{ width: 42, height: 42, borderRadius: 12, objectFit: 'cover' }} />
          <div className="flogo-text">The Viral Munchies</div>
        </div>
        <p style={{ marginTop: 6, color: 'rgba(255,255,255,.55)', fontSize: '.8rem' }}>Founded by <strong style={{ color: '#FFB800' }}>Nitin Mittal</strong> &amp; <strong style={{ color: '#FFB800' }}>Shivam Prajapati</strong></p>
        <p style={{ marginTop: 10 }}>© 2025 The Viral Munchies · Muzaffarnagar, UP · Made with <span>♥</span> &amp; extra masala</p>
      </footer>

      {isCartOpen && <div className="co open" onClick={() => setIsCartOpen(false)}></div>}
      <div className={`cd ${isCartOpen ? 'open' : ''}`}>
        <div className="cd-head">
          <h2>🛒 Your Cart</h2>
          <button className="cd-close" onClick={() => setIsCartOpen(false)}>✕</button>
        </div>
        <div className="cd-items">
          {renderCartItems()}
        </div>
        {cart.length > 0 && (
          <div className="cd-foot">
            <div className="csumrow"><span>Subtotal</span><span>₹{cartTot}</span></div>
            <div className="csumrow"><span>Packing charge</span><span>₹5</span></div>
            <div className="ctotal"><span>Total</span><span>₹{cartTot + 5}</span></div>
            <button className="co-btn" onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}>Proceed to Checkout →</button>
          </div>
        )}
      </div>

      <div className={`mo ${isCheckoutOpen ? 'open' : ''}`}>
        <div className="modal">
          {!orderState.placed ? (
            <div>
              <div className="mhead"><h2>📋 Checkout</h2><button className="mclose" onClick={() => setIsCheckoutOpen(false)}>✕</button></div>
              <div className="mbody">
                <div className="frow">
                  <div className="fg">
                    <label>Your Name *</label>
                    <input type="text" placeholder="e.g. Rahul Sharma" style={{ borderColor: formErrors.name ? 'var(--red)' : '' }} value={orderDetails.name} onChange={e => setOrderDetails(d => ({ ...d, name: e.target.value }))} />
                  </div>
                  <div className="fg">
                    <label>Mobile *</label>
                    <input type="tel" placeholder="+91 98XXX XXXXX" style={{ borderColor: formErrors.phone ? 'var(--red)' : '' }} value={orderDetails.phone} onChange={e => setOrderDetails(d => ({ ...d, phone: e.target.value }))} />
                  </div>
                </div>
                <div className="fg">
                  <label>Order Type *</label>
                  <select value={orderDetails.type} onChange={e => setOrderDetails(d => ({ ...d, type: e.target.value }))}>
                    <option value="pickup">🏃 Pickup from Stall</option>
                    <option value="delivery">🛵 Delivery (nearby)</option>
                  </select>
                </div>
                {orderDetails.type === 'delivery' && (
                  <div className="fg"><label>Address *</label><textarea placeholder="Your full address..." value={orderDetails.address} onChange={e => setOrderDetails(d => ({ ...d, address: e.target.value }))}></textarea></div>
                )}
                <div className="fg"><label>Special Instructions</label><textarea placeholder="Extra spicy? No onions? Tell us!" value={orderDetails.note} onChange={e => setOrderDetails(d => ({ ...d, note: e.target.value }))}></textarea></div>
                <div className="osm">
                  <h4>Order Summary</h4>
                  {cart.map(c => <div className="osm-row" key={c.id}><span>{c.emoji} {c.name} ×{c.qty}</span><span>₹{c.price * c.qty}</span></div>)}
                  <div className="osm-row"><span>Packing</span><span>₹5</span></div>
                  <div className="osm-row"><span>Grand Total</span><span style={{ color: 'var(--orange)' }}>₹{cartTot + 5}</span></div>
                </div>
                <div className="fg">
                  <label>Payment</label>
                  <select value={orderDetails.pay} onChange={e => setOrderDetails(d => ({ ...d, pay: e.target.value }))}>
                    <option value="cash">💵 Cash on Pickup / Delivery</option>
                    <option value="upi">📱 UPI / QR Code</option>
                  </select>
                </div>
                <button className="po-btn" onClick={placeOrder}>✅ Confirm Order</button>
              </div>
            </div>
          ) : (
            <div className="success-screen">
              <div className="sicon">🎉</div>
              <h2>Order Placed!</h2>
              <p>Woohoo! Your order is confirmed and being freshly prepared with love. See you soon!</p>
              <div className="oid">Order #{orderState.id}</div>
              <p style={{ marginTop: 8, fontSize: '.82rem' }}>We'll notify you on <strong>{orderDetails.phone}</strong> when it's ready.</p>
              <button className="btn-main" style={{ marginTop: 26, width: '100%', justifyContent: 'center' }} onClick={resetModal}>🏠 Back to Menu</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
