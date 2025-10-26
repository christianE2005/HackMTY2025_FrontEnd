import { apiCall } from './api';

// Model base URL (separate service)
const MODEL_BASE_URL = process.env.REACT_APP_MODEL_URL || 'http://localhost:8001';
function buildModelUrl(path) {
  return `${MODEL_BASE_URL}${path}`;
}

/**
 * Llamar al modelo de predicción con datos del vuelo y lista de productos
 * @param {Object} predictionData - Datos para la predicción
 * @param {string} predictionData.origen - Código del aeropuerto de origen
 * @param {string} predictionData.flight_type - Tipo de vuelo
 * @param {string} predictionData.service_type - Tipo de servicio
 * @param {number} predictionData.passenger_count - Número de pasajeros
 * @param {Array<string>} predictionData.lista_productos - Lista de nombres de productos
 * @param {number} predictionData.buffer_pct - Porcentaje de buffer (default 1)
 * @returns {Promise<Object>} Resultado de la predicción
 */
export async function predict(predictionData) {
  // Call the ML model service (separate base URL)
  return apiCall(buildModelUrl('/predict-simple'), {
    method: 'POST',
    body: JSON.stringify(predictionData),
  });
}
