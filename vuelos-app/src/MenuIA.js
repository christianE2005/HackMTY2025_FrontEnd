import React, { useState } from 'react';
import './MenuIA.css';

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

const MenuIA = ({ onBack }) => {
  const [chatInput, setChatInput] = useState('');
  const [vueloSeleccionado] = useState({
    id: 'AM 401',
    origen: 'MTY',
    destino: 'MEX',
    capacidad: 184,
    fecha: '18 Oct 2025'
  });

  const [menuSugerido] = useState([
    {
      id: 1,
      nombre: 'Pollo en Salsa de Chipotle',
      cantidad: 92,
      icono: '🍗'
    },
    {
      id: 2,
      nombre: 'Pasta Alfredo Vegetales',
      cantidad: 70,
      icono: '🍝'
    },
    {
      id: 3,
      nombre: 'Jugo de Naranja',
      cantidad: 92,
      icono: '🧃'
    }
  ]);

  const [metricas] = useState([
    { titulo: 'Insights', items: ['2x más seleccionado vs anterior', 'Preferencia por calorías', 'Aumento del bienestar'] },
    { titulo: 'Métricas de Satisfacción', items: ['Rating: 4.3/5', '90% aceptado', 'Fecha: 18 Oct 2025'] }
  ]);

  const handleChatSubmit = () => {
    console.log('Sugerencia del usuario:', chatInput);
    setChatInput('');
  };

  return (
    <div className="menu-ia-container">
      {/* Header */}
      <header className="header">
        <div className="header-content-menu">
          <div className="logo">
            <span className="logo-bold">gate</span>
            <span className="logo-light">group</span>
          </div>
          <div className="header-buttons">
            <button className="header-btn-back" onClick={onBack}>
              <ArrowLeftIcon />
              <span>Regresar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content-ia">
        <div className="ia-title-section">
          <h1 className="ia-title">Generación de Menú con IA</h1>
          <p className="ia-subtitle">Optimiza menú basado en vuelos previos</p>
        </div>

        {/* Información del Vuelo */}
        <div className="vuelo-info-card">
          <h3>Vuelo Seleccionado</h3>
          <div className="vuelo-details">
            <p><strong>ID:</strong> {vueloSeleccionado.id}</p>
            <p><strong>Ruta:</strong> {vueloSeleccionado.origen} → {vueloSeleccionado.destino}</p>
            <p><strong>Capacidad Máxima:</strong> {vueloSeleccionado.capacidad} pasajeros</p>
            <p><strong>Fecha:</strong> {vueloSeleccionado.fecha}</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Menú Sugerido - Izquierda */}
          <div className="menu-sugerido-section">
            <div className="menu-sugerido-header">
              <h2>Menú Sugerido</h2>
            </div>
            <div className="menu-sugerido-content">
              {menuSugerido.map((item) => (
                <div key={item.id} className="menu-item">
                  <div className="menu-item-icon">{item.icono}</div>
                  <div className="menu-item-details">
                    <h4>{item.nombre}</h4>
                    <p className="cantidad">Cantidad: {item.cantidad} unidades</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Métricas */}
            <div className="metricas-section">
              {metricas.map((metrica, index) => (
                <div key={index} className="metrica-card">
                  <h4>{metrica.titulo}</h4>
                  <ul>
                    {metrica.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Chatbot - Derecha */}
          <div className="chatbot-section">
            <div className="chatbot-header">
              <h3>💬 Asistente de Sugerencias</h3>
            </div>
            <div className="chatbot-content">
              <div className="chat-messages">
                <div className="chat-message bot-message">
                  <p>¡Hola! Estoy aquí para ayudarte a mejorar el menú. ¿Tienes alguna sugerencia?</p>
                </div>
              </div>
              <div className="chat-input-container">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                  placeholder="¿Alguna sugerencia?"
                  className="chat-input"
                />
                <button onClick={handleChatSubmit} className="chat-send-btn">
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="action-buttons">
          <button className="action-btn">
            Ver KPIs Mejorados
          </button>
          <button className="action-btn">
            Ver Inventario Completo
          </button>
        </div>
      </main>
    </div>
  );
};

export default MenuIA;