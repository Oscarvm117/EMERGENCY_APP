// ============================================
// INFRASTRUCTURE LAYER - Gemini AI Service
// ============================================

/**
 * Servicio de infraestructura para integración con Gemini API
 * Maneja análisis clínico y generación de planes dietéticos
 */
export class GeminiService {
    constructor(apiKey) {
      this.apiKey = apiKey;
      this.baseUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';
      this.metrics = {
        totalCalls: 0,
        successfulCalls: 0,
        failedCalls: 0,
        totalResponseTime: 0,
        errors: []
      };
    }
  
    async generateClinicalAnalysis(patient) {
      const startTime = Date.now();
      
      const prompt = `Actúa como nutricionista clínico especializado en urgencias hospitalarias.
  
  DATOS DEL PACIENTE:
  - Nombre: ${patient.name} (dato ficticio, caso anónimo)
  - Género: ${patient.gender}
  - Peso estimado: ${patient.weight} kg
  
  CLASIFICACIÓN:
  - Nivel de Triage (KTAS): ${patient.triage} (1=resucitación, 2=emergencia, 3=urgente, 4=menos urgente, 5=no urgente)
  - Tipo de ED: ${patient.edType}
  - Forma de llegada: ${patient.arrivalMode}
  
  MOTIVO PRINCIPAL DE CONSULTA:
  "${patient.chiefComplaint}"
  
  EVALUACIÓN CLÍNICA ACTUAL:
  ${patient.conditions}
  
  SIGNOS VITALES REGISTRADOS:
  - Presión Arterial: ${patient.vitalSigns.sbp}/${patient.vitalSigns.dbp} mmHg
  - Frecuencia Cardíaca: ${patient.vitalSigns.hr} latidos/min
  - Frecuencia Respiratoria: ${patient.vitalSigns.rr} respiraciones/min
  - Temperatura Corporal: ${patient.vitalSigns.bt} °C
  - Estado de Conciencia: ${patient.vitalSigns.mental}
  - Dolor: ${patient.vitalSigns.pain == 1 ? `Presente (${patient.vitalSigns.nrsPain}/10 en escala NRS)` : 'Ausente'}
  - Paciente con lesión/trauma: ${patient.hasInjury}
  
  TAREA:
  Como nutricionista clínico especializado, analiza este caso de urgencias y proporciona:
  1. Restricciones dietéticas específicas según la condición actual
  2. Requerimientos nutricionales adaptados al estado de urgencia
  3. Consideraciones especiales para alimentación en este contexto
  4. Alertas importantes para el personal de cocina y enfermería
  
  Considera el nivel de urgencia, el motivo de consulta, signos vitales y estado general del paciente.
  
  Responde ÚNICAMENTE en formato JSON con esta estructura exacta (sin texto adicional):
  {
    "restrictions": ["restricción 1", "restricción 2"],
    "requirements": ["requerimiento 1", "requerimiento 2"],
    "considerations": ["consideración 1", "consideración 2"],
    "alerts": ["alerta 1", "alerta 2"]
  }`;
  
      try {
        const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          })
        });
  
        const data = await response.json();
        const responseTime = Date.now() - startTime;
        
        this.metrics.totalCalls++;
        this.metrics.totalResponseTime += responseTime;
        this.metrics.successfulCalls++;
  
        const text = data.candidates[0].content.parts[0].text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
        
        return { success: true, data: analysis, responseTime };
      } catch (error) {
        this.metrics.failedCalls++;
        this.metrics.errors.push({ timestamp: new Date(), error: error.message });
        return { success: false, error: error.message };
      }
    }
  
    async generateDietPlan(patient, clinicalAnalysis) {
      const startTime = Date.now();
      
      const prompt = `Basado en este análisis clínico previo:
  
  ANÁLISIS:
  ${JSON.stringify(clinicalAnalysis, null, 2)}
  
  DATOS DEL PACIENTE:
  - Nombre: ${patient.name}
  - Condiciones: ${patient.conditions}
  
  TAREA:
  Genera un plan de alimentación hospitalario para las próximas 24 horas.
  
  Responde ÚNICAMENTE en formato JSON con esta estructura exacta:
  {
    "breakfast": {
      "time": "07:00",
      "items": [{"name": "nombre", "quantity": "cantidad", "notes": "notas"}]
    },
    "morning_snack": {
      "time": "10:00",
      "items": [{"name": "nombre", "quantity": "cantidad", "notes": "notas"}]
    },
    "lunch": {
      "time": "13:00",
      "items": [{"name": "nombre", "quantity": "cantidad", "notes": "notas"}]
    },
    "afternoon_snack": {
      "time": "16:00",
      "items": [{"name": "nombre", "quantity": "cantidad", "notes": "notas"}]
    },
    "dinner": {
      "time": "19:00",
      "items": [{"name": "nombre", "quantity": "cantidad", "notes": "notas"}]
    },
    "preparation_notes": ["instrucciones para cocina"],
    "total_calories": "estimado de calorías diarias"
  }`;
  
      try {
        const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          })
        });
  
        const data = await response.json();
        const responseTime = Date.now() - startTime;
        
        this.metrics.totalCalls++;
        this.metrics.totalResponseTime += responseTime;
        this.metrics.successfulCalls++;
  
        const text = data.candidates[0].content.parts[0].text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const diet = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
        
        return { success: true, data: diet, responseTime };
      } catch (error) {
        this.metrics.failedCalls++;
        this.metrics.errors.push({ timestamp: new Date(), error: error.message });
        return { success: false, error: error.message };
      }
    }
  
    getMetrics() {
      return {
        ...this.metrics,
        averageResponseTime: this.metrics.totalCalls > 0 
          ? Math.round(this.metrics.totalResponseTime / this.metrics.totalCalls)
          : 0,
        successRate: this.metrics.totalCalls > 0
          ? ((this.metrics.successfulCalls / this.metrics.totalCalls) * 100).toFixed(1)
          : 100
      };
    }
  }