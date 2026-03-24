import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const viralMenuItems = [
  { id: 1, cat: 'food', title: 'Loaded Waffle', price: 80, badgeClass: 'bh', badge: '🔥 Bestseller', emoji: '🧇', image: 'loaded_waffle.png', desc: 'Crispy golden waffle with chocolate drizzle, fresh fruits & whipped cream cloud on top.', grad: 'linear-gradient(135deg,#FFF4DC,#FFE08A)' },
  { id: 2, cat: 'food', title: 'Grill Sandwich', price: 70, badgeClass: 'bl', badge: '💛 Fan Fav', emoji: '🥪', image: 'grill_sandwich.png', desc: 'Fresh veggies, gooey cheese & secret green chutney stuffed and grilled to golden perfection.', grad: 'linear-gradient(135deg,#FFFBE0,#FFE080)' },
  { id: 3, cat: 'food', title: 'Potato Spiral', price: 49, badgeClass: 'bn', badge: '✨ New Hit', emoji: '🌀', image: 'potato_spiral.png', desc: 'Whole potato twisted on a stick, fried and dusted with zingy masala & cheese powder blast.', grad: 'linear-gradient(135deg,#FFE8D4,#FFB87A)' },
  { id: 4, cat: 'food', title: 'French Fries', price: 50, badgeClass: 'bh', badge: '🔥 Crispy', emoji: '🍟', image: 'french_fries.png', desc: 'Golden crispy fries — plain, peri-peri, cheesy or schezwan. Always piping hot & fresh!', grad: 'linear-gradient(135deg,#FFE0C4,#FFB07A)' },
  { id: 5, cat: 'food', title: 'Steamed Momos', price: 60, badgeClass: 'bl', badge: '❤️ Must Try', emoji: '🥟', image: 'steamed_momos.png', desc: 'Juicy dumplings with fiery red chutney. Veg & paneer options — always steaming fresh!', grad: 'linear-gradient(135deg,#D8F5E4,#90E4BC)' },
  { id: 6, cat: 'food', title: 'Masala Maggie with Vegies', price: 60, badgeClass: 'bl', badge: '🌙 Comfort', emoji: '🍜', image: 'masala_maggie.png', desc: 'Extra masala, loaded veggies & a squeeze of lime. The ultimate street food comfort bowl!', grad: 'linear-gradient(135deg,#FFF4DC,#FFD595)' },
  { id: 7, cat: 'drinks', title: 'Cold Coffee', price: 60, badgeClass: 'bh', badge: '🔥 Chilled', emoji: '☕', image: 'cold_coffee.png', desc: 'Rich blended cold coffee with double espresso shot, topped with dreamy whipped cream.', grad: 'linear-gradient(135deg,#E4DCF8,#B8A4E8)' },
  { id: 8, cat: 'drinks', title: 'Virgin Mojito', price: 60, badgeClass: 'bn', badge: '✨ Fresh', emoji: '🍹', image: 'virgin_mojito.png', desc: 'Super fresh mint lime mojito on crushed ice. Watermelon, lychee & classic mint variants!', grad: 'linear-gradient(135deg,#DCFAEC,#82E8AC)' },
  { id: 9, cat: 'drinks', title: 'Shikanji', price: 30, badgeClass: 'bl', badge: '☀️ ZESTY', emoji: '🍋', image: 'shikanji.png', desc: 'Traditional Indian lemonade with black salt, roasted cumin & fresh mint. Super refreshing!', grad: 'linear-gradient(135deg,#FFFDE0,#FFE07A)' },
  { id: 10, cat: 'food', title: 'Peri-Peri Potato Spiral', price: 59, badgeClass: 'bn', badge: '✨ New Hit', emoji: '🌀', image: 'peri_peri_spiral.png', desc: 'Whole potato twisted on a stick, fried and dusted with zingy masala & cheese powder blast.', grad: 'linear-gradient(135deg,#FFE8D4,#FFB87A)' },
];

export default function MenuPage() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [isScrolled, setIsScrolled] = useState(false);
    
    // Custom cursor variables
    const curRef = useRef(null);
    const curRRef = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(es => {
            es.forEach(e => {
                if (e.isIntersecting) e.target.classList.add('visible');
            });
        }, { threshold: 0.1 });
        
        const tm = setTimeout(() => {
            document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
        }, 100);

        return () => {
            clearTimeout(tm);
            obs.disconnect();
        };
    }, [activeCategory]);

    useEffect(() => {
        // Handle navigation scorll
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        // Handle cursor
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

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(req);
        };
    }, []);

    return (
        <div style={{ cursor: 'none' }}>
            {/* Custom Mouse Cursor */}
            <div id="cur" ref={curRef}></div>
            <div id="cur-r" ref={curRRef}></div>

            {/* Background Blobs */}
            <div className="blobs">
                <div className="blob b1"></div><div className="blob b2"></div>
                <div className="blob b3"></div><div className="blob b4"></div>
            </div>

            {/* Navbar */}
            <nav id="nav" className={isScrolled ? 'sc' : 'sc'}>
                <Link to="/" className="nav-logo">
                    <img src={`${import.meta.env.BASE_URL}logo.jpeg`} alt="TVM Logo" style={{ width: 50, height: 50, borderRadius: 14, objectFit: 'cover' }} />
                    <div className="logo-text">The Viral Munchies</div>
                </Link>
                <ul className="nav-links">
                    <li><Link to="/">Back to Home</Link></li>
                </ul>
            </nav>

            {/* Menu Section */}
            <section id="menu" style={{ paddingTop: '140px', minHeight: '100vh', background: 'var(--bg2)', zIndex: 1, position: 'relative' }}>
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
                    {viralMenuItems.filter(c => activeCategory === 'all' || c.cat === activeCategory).map(item => (
                        <div className="mc reveal" key={item.id}>
                            <div className="mc-img" style={{ background: item.grad, padding: 0 }}>
                                <img src={`${import.meta.env.BASE_URL}${item.image}`} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div className={`mc-badge ${item.badgeClass}`} style={{ zIndex: 1 }}>{item.badge}</div>
                            </div>
                            <div className="mc-body">
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                                <div className="mc-foot">
                                    <div className="mc-price"><sup>₹</sup>{item.price}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
