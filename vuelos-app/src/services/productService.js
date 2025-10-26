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
 * Endpoint: /products/inventory/flat
 */
export async function getInventoryFlat() {
  // The backend exposes the inventory flat endpoint under /products/inventory/flat (exact route)
  const primary = buildUrl('/products/inventory/flat');
  console.log('📦 Fetching inventory from (primary):', primary);

  // Try primary endpoint first. If it fails (500, connection error, etc.),
  // attempt a fallback using the same host but port 8003 (some services were moved there).
  let fallback = null;
  try {
    return await apiCall(primary, { method: 'GET' });
  } catch (errPrimary) {
    console.warn('Primary inventory endpoint failed:', errPrimary);

    try {
      // Construct fallback by replacing port with 8003
      const u = new URL(primary);
      u.port = '8003';
      fallback = u.toString();
      console.log('📦 Trying fallback inventory URL:', fallback);
      return await apiCall(fallback, { method: 'GET' });
    } catch (errFallback) {
      console.error('Both inventory endpoints failed:', errPrimary, errFallback);
      // Throw a combined error so caller can show both details
      const message = `Primary (${primary}) error: ${errPrimary.message}; Fallback (${fallback}) error: ${errFallback.message}`;
      const composed = new Error(message);
      throw composed;
    }
  }
}
