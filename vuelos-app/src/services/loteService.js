import { apiCall, buildUrl } from './api';

/**
 * Obtener lista de todos los lotes
 * @returns {Promise<Array>} Lista de lotes
 */
export async function getLotes() {
  return apiCall(buildUrl('/lotes'), {
    method: 'GET',
  });
}

/**
 * Obtener un lote por ID
 * @param {string} loteId - UUID del lote
 * @returns {Promise<Object>} Datos del lote
 */
export async function getLoteById(loteId) {
  return apiCall(buildUrl(`/lotes/${loteId}`), {
    method: 'GET',
  });
}

/**
 * Obtener detalles completos de un lote (con items)
 * @param {string} loteId - UUID del lote
 * @returns {Promise<Object>} Lote con detalles completos
 */
export async function getLoteDetailed(loteId) {
  return apiCall(buildUrl(`/lotes/${loteId}/detailed`), {
    method: 'GET',
  });
}

/**
 * Obtener items de un lote específico
 * @param {string} loteId - UUID del lote
 * @returns {Promise<Array>} Lista de items del lote
 */
export async function getLoteItems(loteId) {
  return apiCall(buildUrl(`/lotes/${loteId}/items`), {
    method: 'GET',
  });
}

/**
 * Crear un nuevo lote
 * @param {Object} loteData - Datos del lote a crear
 * @returns {Promise<Object>} Lote creado
 */
export async function createLote(loteData) {
  return apiCall(buildUrl('/lotes'), {
    method: 'POST',
    body: JSON.stringify(loteData),
  });
}

/**
 * Actualizar un lote existente
 * @param {string} loteId - UUID del lote
 * @param {Object} updates - Datos a actualizar
 * @returns {Promise<Object>} Lote actualizado
 */
export async function updateLote(loteId, updates) {
  return apiCall(buildUrl(`/lotes/${loteId}`), {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

/**
 * Eliminar un lote
 * @param {string} loteId - UUID del lote
 * @returns {Promise<null>} null en caso de éxito
 */
export async function deleteLote(loteId) {
  return apiCall(buildUrl(`/lotes/${loteId}`), {
    method: 'DELETE',
  });
}
