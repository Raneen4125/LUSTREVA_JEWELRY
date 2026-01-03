import { Link } from "react-router-dom";


export default function ProductCard({ p }) {
return (
<Link to={`/product/${p.id}`} className="shadow-md bg-white rounded-lg p-4 hover:scale-105 transition block">
<img src={p.image} className="w-full h-48 object-cover rounded" />
<h3 className="text-xl font-semibold mt-3">{p.name}</h3>
<p className="text-gray-600">${p.price}</p>
</Link>
);
}