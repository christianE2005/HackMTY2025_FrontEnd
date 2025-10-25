// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Headers comunes para todas las peticiones
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

/**
 * Helper function para hacer peticiones API con manejo de errores
 * @param {string} url - URL completa del endpoint
 * @param {object} options - Opciones de fetch (method, body, etc.)
 * @returns {Promise<any>} - Datos de la respuesta o null para 204
 */
export async function apiCall(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });
    
    // Manejo específico por código de estado
    switch (response.status) {
      case 404:
        throw new Error('Recurso no encontrado');
      case 409:
        const conflictError = await response.json();
        throw new Error('Conflicto: ' + (conflictError.detail || 'El recurso ya existe'));
      case 422:
        const validationError = await response.json();
        throw new Error('Error de validación: ' + JSON.stringify(validationError.detail));
      case 500:
        throw new Error('Error interno del servidor');
    }
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    // Para DELETE que retorna 204 No Content
    if (response.status === 204) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en la petición API:', error);
    throw error;
  }
}

/**
 * Helper para construir URLs con el base URL
 * @param {string} path - Path del endpoint (ej: '/products')
 * @returns {string} - URL completa
 */
export function buildUrl(path) {
  return `${API_BASE_URL}${path}`;
}

export { API_BASE_URL, headers };
