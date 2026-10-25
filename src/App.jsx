
import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "./redux/cartSlice";

const products = [
  { id: 1, name: "Headphones", price: 1999, category: "Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
  { id: 2, name: "Smart Watch", price: 2499, category: "Electronics", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
  { id: 3, name: "Sneakers", price: 2999, category: "Fashion", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" },
  { id: 4, name: "Backpack", price: 1499, category: "Accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500" },
  { id: 5, name: "Sunglasses", price: 999, category: "Fashion", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500" },
  { id: 6, name: "Camera", price: 8999, category: "Electronics", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500" },
  { id: 7, name: "Wristwatch", price: 1799, category: "Accessories", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500" },
  { id: 8, name: "Sports Shoes", price: 2199, category: "Fashion", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500" },
];

function Navbar() {
  const items = useSelector((state) => state.cart.items);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar">
      <Link to="/" className="logo">ShopEase.</Link>
      <div className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/cart">Cart ({count})</NavLink>
      </div>
    </nav>
  );
}

function Home() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div>
        <span className="eyebrow">WELCOME TO SHOPEASE</span>
        <h1>Find your next favorite thing.</h1>
        <p>Discover everyday essentials, fashion and electronics at great prices.</p>
        <button onClick={() => navigate("/products")}>Explore Products →</button>{" "}
        <button className="secondary-btn" onClick={() => navigate("/cart")}>View Cart</button>
      </div>
      <img
        className="hero-image"
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900"
        alt="Shopping store"
      />
    </section>
  );
}

function Products() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [message, setMessage] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesName = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || product.category === category;
    return matchesName && matchesCategory;
  });

  function handleAdd(product) {
    dispatch(addToCart(product));
    setMessage(product.name + " added to cart!");
  }

  return (
    <main className="page-container">
      <h1>Explore Products</h1>
      <p className="subtitle">Find something you'll love.</p>

      <div className="filters">
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>All</option>
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Accessories</option>
        </select>
      </div>

      {message && <p className="success-message">{message}</p>}

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.name} />
            <div className="product-info">
              <span className="category">{product.category}</span>
              <h3>{product.name}</h3>
              <div className="product-bottom">
                <strong>₹{product.price.toLocaleString("en-IN")}</strong>
                <button onClick={() => handleAdd(product)}>+ Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && <p>No products found.</p>}
    </main>
  );
}

function Cart() {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="page-container">
      <h1>Your Shopping Cart</h1>
      <p className="subtitle">Review and manage your items.</p>

      {items.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty 🛍️</h2>
          <p>Let's find something for you!</p>
          <button onClick={() => navigate("/products")}>Start Shopping</button>
        </div>
      ) : (
        <div className="cart-layout">
          <div>
            {items.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>₹{item.price.toLocaleString("en-IN")} each</p>
                  <div className="quantity-controls">
                    <button onClick={() => dispatch(decreaseQuantity(item.id))}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => dispatch(increaseQuantity(item.id))}>+</button>
                  </div>
                </div>
                <div className="cart-item-end">
                  <strong>₹{(item.price * item.quantity).toLocaleString("en-IN")}</strong>
                  <button className="remove-btn" onClick={() => dispatch(removeFromCart(item.id))}>Remove</button>
                </div>
              </div>
            ))}
            <button className="text-btn" onClick={() => dispatch(clearCart())}>Clear Cart</button>
          </div>

          <aside className="order-summary">
            <h2>Order Summary</h2>
            <p>Items: {items.reduce((sum, item) => sum + item.quantity, 0)}</p>
            <p>Shipping: FREE</p>
            <hr />
            <h2>Total: ₹{total.toLocaleString("en-IN")}</h2>
            <button onClick={() => navigate("/checkout")}>Proceed to Checkout →</button>
          </aside>
        </div>
      )}
    </main>
  );
}

function About() {
  return (
    <main className="page-container about-page">
      <span className="eyebrow">OUR STORY</span>
      <h1>Shopping made simple.</h1>
      <p>ShopEase is a student e-commerce project that makes browsing products, managing a shopping cart, and reviewing an order simple and convenient.</p>
      <Link to="/" className="primary-link">← Back to Home</Link>
    </main>
  );
}

function Checkout() {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (placed) {
    return (
      <main className="page-container success-page">
        <h1>Order placed successfully! ✓</h1>
        <p>Thank you for shopping with ShopEase.</p>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="page-container empty-cart">
        <h1>Your cart is empty</h1>
        <button onClick={() => navigate("/products")}>Browse Products</button>
      </main>
    );
  }

  return (
    <main className="page-container checkout-page">
      <h1>Checkout</h1>
      <p className="subtitle">Your order summary</p>
      <div className="order-summary">
        {items.map((item) => (
          <p key={item.id}>
            {item.name} × {item.quantity} — ₹{item.price * item.quantity}
          </p>
        ))}
        <hr />
        <h2>Total: ₹{total.toLocaleString("en-IN")}</h2>
        <p className="subtitle">Demo checkout only. No real payment is collected.</p>
        <button onClick={() => {
          dispatch(clearCart());
          setPlaced(true);
        }}>Confirm Demo Order</button>
      </div>
    </main>
  );
}

function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="page-container not-found">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, this page doesn't exist.</p>
      <button onClick={() => navigate("/")}>Go Home</button>
    </main>
  );
}

export default function App() {
  const items = useSelector((state) => state.cart.items);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <footer className="footer">
        <Link to="/" className="logo">ShopEase.</Link>
        <p>Good finds. Better shopping.</p>
        <span>© 2026 ShopEase. Student Mini Project.</span>
      </footer>
    </div>
  );
}
