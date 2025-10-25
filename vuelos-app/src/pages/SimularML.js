import React, { useState } from 'react';
import ComparacionMenus from './ComparacionMenus';
import './SimularML.css';

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

// Ícono de upload
const UploadIcon = () => (
  <svg 
    width="48" 
    height="48" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="#60a5fa" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const SimularMenuML = ({ onBack, vueloSeleccionado }) => {
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [mostrarComparacion, setMostrarComparacion] = useState(false);

  const handleArchivoChange = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setArchivoSeleccionado(archivo);
    }
  };

  const handleReiniciar = () => {
    setArchivoSeleccionado(null);
    document.getElementById('file-input').value = '';
  };

  const handleAceptar = () => {
    if (archivoSeleccionado) {
      setMostrarComparacion(true);
    }
  };

  if (mostrarComparacion) {
    return (
      <ComparacionMenus 
        onBack={() => setMostrarComparacion(false)} 
        archivoUsuario={archivoSeleccionado}
        vueloSeleccionado={vueloSeleccionado}
      />
    );
  }

  return (
    <div className="simular-ml-container">
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
      <main className="main-content-simular">
        <div className="simular-title-section">
          <h1 className="simular-title">Simular Menú con Machine Learning</h1>
          <p className="simular-subtitle">Carga tu menú propuesto y obtén recomendaciones basadas en datos históricos</p>
        </div>

        {/* Upload Section */}
        <div className="upload-container">
          <div className="upload-card">
            <UploadIcon />
            <h2>Cargar Archivo de Excel</h2>
            <p>Sube tu menú propuesto en formato .xlsx o .xls</p>
            
            <input
              type="file"
              id="file-input"
              accept=".xlsx,.xls"
              onChange={handleArchivoChange}
              style={{ display: 'none' }}
            />
            
            <label htmlFor="file-input" className="upload-button">
              Seleccionar Archivo
            </label>

            {archivoSeleccionado && (
              <div className="archivo-seleccionado">
                <div className="archivo-info">
                  <span className="archivo-icono">📄</span>
                  <div className="archivo-detalles">
                    <p className="archivo-nombre">{archivoSeleccionado.name}</p>
                    <p className="archivo-size">
                      {(archivoSeleccionado.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <span className="archivo-check">✓</span>
                </div>
              </div>
            )}

            <div className="action-buttons-upload">
              <button 
                className="btn-reiniciar" 
                onClick={handleReiniciar}
                disabled={!archivoSeleccionado}
              >
                Reiniciar / Borrar
              </button>
              <button 
                className="btn-aceptar" 
                onClick={handleAceptar}
                disabled={!archivoSeleccionado}
              >
                Aceptar y Analizar
              </button>
            </div>
          </div>

          {/* Información adicional */}
          <div className="info-card">
            <h3>📋 Formato requerido</h3>
            <ul>
              <li>El archivo debe estar en formato Excel (.xlsx o .xls)</li>
              <li>Debe incluir columnas: Producto, Cantidad, Categoría</li>
              <li>Los nombres deben ser claros y específicos</li>
              <li>Las cantidades deben ser numéricas</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SimularMenuML;