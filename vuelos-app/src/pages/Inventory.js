import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInventoryFlat } from '../services/productService';
import { API_BASE_URL } from '../services/api';
import '../App.css';

// Ícono de flecha para regresar
const ArrowLeftIcon = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="white" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);


const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendErrorDetail, setBackendErrorDetail] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const inventoryUrl = `${API_BASE_URL}/products/inventory/flat`;

  useEffect(() => {
    // Fetch products from backend using the productService
    const loadProducts = async () => {
      try {
        setLoading(true);
        const products = await getInventoryFlat();
        setItems(products);
        setLoading(false);
      } catch (err) {
        console.error('Error cargando productos desde el backend:', err);
        setBackendErrorDetail(err?.message || String(err));
        // Fallback mock data
        const mock = [
          { 
            id: '1', 
            product_code: 'PROD001',
            name: 'Pollo en Salsa de Chipotle', 
            description: 'Plato principal',
            weight_or_volume: '250g',
            lot_number: 'LOT-2024-001',
            expiry_date: '2025-12-31',
            quantity: 92 
          },
          { 
            id: '2', 
            product_code: 'PROD002',
            name: 'Pasta Alfredo Vegetales', 
            description: 'Plato vegetariano',
            weight_or_volume: '300g',
            lot_number: 'LOT-2024-002',
            expiry_date: '2025-11-30',
            quantity: 70 
          },
          { 
            id: '3', 
            product_code: 'PROD003',
            name: 'Jugo de Naranja', 
            description: 'Bebida natural',
            weight_or_volume: '250ml',
            lot_number: 'LOT-2024-003',
            expiry_date: '2025-10-31',
            quantity: 92 
          },
          { 
            id: '4', 
            product_code: 'PROD004',
            name: 'Ensalada César', 
            description: 'Entrada fresca',
            weight_or_volume: '200g',
            lot_number: 'LOT-2024-004',
            expiry_date: '2025-10-28',
            quantity: 50 
          }
        ];
    setItems(mock);
    setError(`No se pudo conectar con el backend — usando datos de ejemplo. Asegúrate de que el backend esté corriendo en ${API_BASE_URL} y que el endpoint /products/inventory/flat exista`);
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-bold">gate</span>
            <span className="logo-light">group</span>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button className="header-btn-back" onClick={() => navigate(-1)}>
                <ArrowLeftIcon />
              Regresar
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="title-section">
          <h1 className="title">Inventario Completo</h1>
        </div>

        {loading ? (
          <p>Cargando inventario...</p>
        ) : (
          <div>
            {error && <p style={{ color: 'orange' }}>{error}</p>}
            {/* Debug panel: show request URL and backend error detail when present */}
            {backendErrorDetail && (
              <div style={{ background: '#fff7ed', border: '1px solid #f59e0b', padding: '10px 12px', borderRadius: '6px', marginBottom: '12px', color: '#92400e' }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Debug — petición de inventario</div>
                <div style={{ fontSize: 13, marginBottom: 6 }}><strong>Request URL:</strong> {inventoryUrl}</div>
                <div style={{ fontSize: 13 }}><strong>Error:</strong> {backendErrorDetail}</div>
              </div>
            )}

            <div style={{ overflowX: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 8px 0' }}>
                <div style={{ fontWeight: 600 }}>Listado de productos</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar..."
                      style={{
                        padding: '8px 32px 8px 10px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        background: '#ffffff'
                      }}
                    />
                    <svg viewBox="0 0 24 24" width="18" height="18" style={{ position: 'absolute', right: 8, top: 6, pointerEvents: 'none', color: '#9ca3af' }}>
                      <circle cx="11" cy="11" r="7" stroke="#9ca3af" strokeWidth="1.5" fill="none" />
                      <path d="M21 21l-4.35-4.35" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="inventory-card">
                  <div className="inventory-scroll">
                  <table className="inventory-table" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'transparent' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', borderBottom: '2px solid rgba(255,255,255,0.08)', backgroundColor: '#1D2C66' }}>
                        <th style={{ padding: '8px 12px', color: '#ffffff', fontWeight: 600, borderTopLeftRadius: '8px' }}>Product Code</th>
                        <th style={{ padding: '8px 12px', color: '#ffffff', fontWeight: 600 }}>Product Name</th>
                        <th style={{ padding: '8px 12px', color: '#ffffff', fontWeight: 600 }}>Description</th>
                        <th style={{ padding: '8px 12px', color: '#ffffff', fontWeight: 600 }}>Weight/Volume</th>
                        <th style={{ padding: '8px 12px', color: '#ffffff', fontWeight: 600 }}>LOT Number</th>
                        <th style={{ padding: '8px 12px', color: '#ffffff', fontWeight: 600 }}>Expiry Date</th>
                        <th style={{ padding: '8px 12px', color: '#ffffff', fontWeight: 600, borderTopRightRadius: '8px' }}>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items
                        .filter((it) => {
                          const term = searchTerm.trim().toLowerCase();
                          if (!term) return true;
                          const values = [
                            it.product_code,
                            it.product_name || it.name,
                            it.description,
                            it.weight_or_volume,
                            it.lot_number,
                            it.expiry_date,
                            it.quantity
                          ]
                            .filter((v) => v !== undefined && v !== null)
                            .map((v) => String(v).toLowerCase())
                            .join(' ');
                          return values.includes(term);
                        })
                        .map((it) => (
                          <tr key={it.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <td style={{ padding: '10px 12px', width: '120px' }}><strong>{it.product_code || ''}</strong></td>
                            <td style={{ padding: '10px 12px' }}>{it.product_name || it.name || ''}</td>
                            <td style={{ padding: '10px 12px' }}>{it.description || ''}</td>
                            <td style={{ padding: '10px 12px' }}>{it.weight_or_volume || ''}</td>
                            <td style={{ padding: '10px 12px' }}>{it.lot_number || ''}</td>
                            <td style={{ padding: '10px 12px' }}>{it.expiry_date || ''}</td>
                            <td style={{ padding: '10px 12px', width: '100px' }}>{it.quantity ?? ''}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Inventory;
