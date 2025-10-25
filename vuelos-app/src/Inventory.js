import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

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
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Try to fetch from a backend endpoint. If it doesn't exist, fall back to mock data.
    fetch('/api/inventario')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Error fetching /api/inventario:', err);
        // Fallback mock data
        const mock = [
          { id: 1, nombre: 'Pollo en Salsa de Chipotle', cantidad: 92 },
          { id: 2, nombre: 'Pasta Alfredo Vegetales', cantidad: 70 },
          { id: 3, nombre: 'Jugo de Naranja', cantidad: 92 },
          { id: 4, nombre: 'Ensalada César', cantidad: 50 }
        ];
        setItems(mock);
        setError('No se pudo cargar desde /api/inventario — usando datos de ejemplo.');
        setLoading(false);
      });
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
              <div style={{ overflowX: 'auto' }}>
                {/* Top bar: title + search (placed outside the white card) */}
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

                <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', boxShadow: '0 1px 4px rgba(16,24,40,0.06)', overflow: 'hidden' }}>
                  {/* make table extend to card edges so header covers full width */}
                  <table className="inventory-table" style={{ width: 'calc(100% + 24px)', marginLeft: '-12px', marginRight: '-12px', marginTop: '-12px', borderCollapse: 'collapse', backgroundColor: '#ffffff' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '2px solid rgba(255,255,255,0.08)', backgroundColor: '#1D2C66' }}>
                      <th style={{ padding: '8px 12px', color: '#ffffff', fontWeight: 600, borderTopLeftRadius: '8px' }}>Product ID</th>
                      <th style={{ padding: '8px 12px', color: '#ffffff', fontWeight: 600 }}>Product Name</th>
                      <th style={{ padding: '8px 12px', color: '#ffffff', fontWeight: 600 }}>Weight or Volume</th>
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
                        it.id,
                        it.nombre || it.Product_Name,
                        it.weight || it.Weight_or_Volume,
                        it.lot || it.LOT_Number,
                        it.expiry || it.Expiry_Date,
                        it.cantidad ?? it.Quantity
                      ]
                        .filter((v) => v !== undefined && v !== null)
                        .map((v) => String(v).toLowerCase())
                        .join(' ');
                      return values.includes(term);
                    })
                    .map((it) => (
                    <tr key={it.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '10px 12px', width: '80px' }}><strong>{it.id}</strong></td>
                      <td style={{ padding: '10px 12px' }}>{it.nombre || it.Product_Name || ''}</td>
                      <td style={{ padding: '10px 12px' }}>{it.weight || it.Weight_or_Volume || ''}</td>
                      <td style={{ padding: '10px 12px' }}>{it.lot || it.LOT_Number || ''}</td>
                      <td style={{ padding: '10px 12px' }}>{it.expiry || it.Expiry_Date || ''}</td>
                      <td style={{ padding: '10px 12px', width: '140px' }}>{it.cantidad ?? it.Quantity ?? ''}</td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Inventory;
