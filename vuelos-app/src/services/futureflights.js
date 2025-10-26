import { apiCall } from './api'; // asegúrate de que esta ruta sea correcta

/**
 * Consultar vuelos futuros desde Aviation Edge
 * @param {Object} params - Parámetros de consulta (date, iataCode, arrDep, etc.)
 * @returns {Promise<Array>} Lista de vuelos futuros
 */
export async function getFutureFlights(params) {
    const baseUrl = 'https://aviation-edge.com/v2/public/flightsFuture';
    const apiKey = process.env.AVIATION_EDGE_API || '7a2b14-202d05';
  
    const queryParams = new URLSearchParams({
      key: apiKey,
      ...params
    });
  
    return apiCall(`${baseUrl}?${queryParams.toString()}`, {
      method: 'GET',
    });
  }
  