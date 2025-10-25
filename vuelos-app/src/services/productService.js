import { apiCall, buildUrl } from './api';

/**
 * Obtener lista de todos los productos
 * @returns {Promise<Array>} Lista de productos
 */
export async function getProducts() {
  return apiCall(buildUrl('/products'), {
    method: 'GET',
  });
}

/**
 * Obtener un producto por ID
 * @param {string} productId - UUID del producto
 * @returns {Promise<Object>} Datos del producto
 */
export async function getProductById(productId) {
  return apiCall(buildUrl(`/products/${productId}`), {
    method: 'GET',
  });
}

/**
 * Crear un nuevo producto
 * @param {Object} productData - Datos del producto a crear
 * @returns {Promise<Object>} Producto creado
 */
export async function createProduct(productData) {
  return apiCall(buildUrl('/products'), {
    method: 'POST',
    body: JSON.stringify(productData),
  });
}

/**
 * Actualizar un producto existente
 * @param {string} productId - UUID del producto
 * @param {Object} updates - Datos a actualizar
 * @returns {Promise<Object>} Producto actualizado
 */
export async function updateProduct(productId, updates) {
  return apiCall(buildUrl(`/products/${productId}`), {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

/**
 * Eliminar un producto
 * @param {string} productId - UUID del producto
 * @returns {Promise<null>} null en caso de éxito
 */
export async function deleteProduct(productId) {
  return apiCall(buildUrl(`/products/${productId}`), {
    method: 'DELETE',
  });
}

/**
 * Obtener inventario aplanado (flat) usado por la UI de inventario
 * Endpoint: /api/v1/products/inventory/flat
 */
export async function getInventoryFlat() {
  // The backend exposes the inventory flat endpoint under /products/inventory/flat (no /api/v1 prefix)
  return apiCall(buildUrl('/products/inventory/flat'), {
    method: 'GET',
  });
}
