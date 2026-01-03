import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";


export default function Header() {
const { cart } = useCart();


return (
<header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
<Link to="/" className="text-2xl font-bold">Lustreva Jewelry</Link>


<nav className="flex gap-4 text-lg">
<Link to="/">Home</Link>
<Link to="/about">About</Link>
<Link to="/services">Services</Link>
<Link to="/products">Products</Link>
<Link to="/contact">Contact</Link>
<Link to="/cart">🛒 ({cart.length})</Link>
</nav>
</header>
);
}