/**
 * Servicio para interactuar con el Agente LLM
 * Puerto: 8003
 * Endpoint: /api/agent/predict
 */

const AGENT_BASE_URL = process.env.REACT_APP_AGENT_URL || 'http://localhost:8003';

/**
 * Predicción con contexto del chat (detección de palabras clave)
 * @param {Object} payload - Datos de vuelo y chat
 * @param {string} payload.flight_number - Número de vuelo
 * @param {number} payload.passenger_count - Cantidad de pasajeros
 * @param {Array<string>} payload.productos - Lista de productos
 * @param {number} payload.base_buffer - Buffer base en porcentaje
 * @param {Array<Object>} payload.chat_history - Historial del chat [{role, content}]
 * @returns {Promise<Object>} Resultado con context_analysis.final_buffer y explanation
 */
export async function predictWithContext(payload) {
  const url = `${AGENT_BASE_URL}/api/agent/predict`;
  
  console.log('🤖 Llamando al agente LLM:', url);
  console.log('📨 Payload:', payload);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Agent API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Respuesta del agente:', data);
    return data;
  } catch (error) {
    console.error('❌ Error llamando al agente LLM:', error);
    throw error;
  }
}

/**
 * Categorías implementadas y sus buffers
 */
export const CATEGORIAS_KEYWORDS = {
  Celebridad: { buffer: 10, keywords: ['famoso', 'VIP', 'estrella', 'celebrity'] },
  Ejecutivo: { buffer: 8, keywords: ['CEO', 'director', 'business class'] },
  Concierto: { buffer: 12, keywords: ['concert', 'festival', 'show', 'gira'] },
  'Evento Especial': { buffer: 15, keywords: ['ceremonia', 'gala', 'special event'] },
  Delegación: { buffer: 8, keywords: ['diplomático', 'delegation', 'comitiva'] },
  Deportivo: { buffer: 10, keywords: ['equipo', 'atleta', 'championship'] },
  Boda: { buffer: 12, keywords: ['wedding', 'matrimonio', 'novios'] },
};
