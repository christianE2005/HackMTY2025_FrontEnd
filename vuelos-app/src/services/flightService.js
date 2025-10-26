import { apiCall, buildUrl } from './api';

/**
 * Obtener vuelos futuros
 * @param {string} date - Fecha en formato YYYY-MM-DD (por defecto 2025-11-03)
 * @param {string} iataCode - Código IATA del aeropuerto (por defecto 'MTY')
 * @returns {Promise<Array>} Lista de vuelos futuros
 */
export const getFutureFlights = async (date = null, iataCode = 'MTY') => {
  // Si no se proporciona fecha, usar una fecha válida futura (nov 3, 2025)
  if (!date) {
    date = '2025-11-03';
  }
  
  const url = buildUrl(`/api/flights/future?date=${date}&iataCode=${iataCode}`);
  console.log(' Fetching flights from:', url); // Debug log
  return apiCall(url, {
    method: 'GET'
  });
};

/**
 * Obtener un vuelo por ID
 * @param {string} id - ID del vuelo
 * @returns {Promise<Object>} Datos del vuelo
 */
export const getFlightById = async (id) => {
  const url = buildUrl(`/api/flights/${id}`);
  return apiCall(url, {
    method: 'GET'
  });
};
