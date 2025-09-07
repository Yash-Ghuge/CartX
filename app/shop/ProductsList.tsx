'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ProductsList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (error) console.error(error);
      else setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 className="text-2xl font-bold mb-4">Available Products</h2>
      {products.length === 0 ? (
        <div>No products found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="border p-4 rounded shadow">
              <strong>{p.name}</strong>
              <p>₹{p.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
