// API Configuration (main backend)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8002';

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
    
    // Manejo específico por código de estado - intentamos leer cuerpo para más detalle
    if (!response.ok) {
      // Intentar leer como JSON, si falla leer como texto
      let bodyText = '';
      try {
        const cloned = response.clone();
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const json = await cloned.json();
          bodyText = JSON.stringify(json);
        } else {
          bodyText = await cloned.text();
        }
      } catch (readErr) {
        // Ignorar error de lectura, usar statusText
        bodyText = response.statusText || '';
      }

      // Mapear mensajes comunes por código
      if (response.status === 404) throw new Error(`404 Not Found: ${bodyText}`);
      if (response.status === 409) throw new Error(`409 Conflict: ${bodyText}`);
      if (response.status === 422) throw new Error(`422 Unprocessable Entity: ${bodyText}`);
      if (response.status === 500) throw new Error(`500 Internal Server Error: ${bodyText}`);

      throw new Error(`HTTP ${response.status}: ${bodyText}`);
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
