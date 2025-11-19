// ============================================
// APPLICATION LAYER - Generate Diet Use Case
// ============================================

/**
 * Caso de uso para generación de planes dietéticos
 * Orquesta el análisis clínico y generación de dieta
 */
export class GenerateDietUseCase {
    constructor(geminiService, alertService) {
      this.geminiService = geminiService;
      this.alertService = alertService;
    }
  
    async execute(patient, updateCallback) {
      try {
        // Paso 1: Análisis clínico
        updateCallback({ ...patient, status: 'analyzing' });
        
        const analysisResult = await this.geminiService.generateClinicalAnalysis(patient);
        
        if (!analysisResult.success) {
          throw new Error('Error en análisis clínico: ' + analysisResult.error);
        }
  
        // Verificar si hay alertas críticas
        if (analysisResult.data.alerts && analysisResult.data.alerts.length > 0) {
          analysisResult.data.alerts.forEach(alert => {
            this.alertService.createAlert('clinical', alert, 'HIGH', patient.id);
          });
        }
  
        patient.clinicalAnalysis = analysisResult.data;
  
        // Paso 2: Generación de dieta
        const dietResult = await this.geminiService.generateDietPlan(patient, analysisResult.data);
        
        if (!dietResult.success) {
          throw new Error('Error en generación de dieta: ' + dietResult.error);
        }
  
        patient.dietPlan = dietResult.data;
        patient.status = 'diet_ready';
        patient.generatedAt = new Date();
  
        updateCallback(patient);
        return { success: true, patient };
  
      } catch (error) {
        patient.status = 'error';
        this.alertService.createAlert('generation_error', error.message, 'CRITICAL', patient.id);
        updateCallback(patient);
        return { success: false, error: error.message };
      }
    }
  }