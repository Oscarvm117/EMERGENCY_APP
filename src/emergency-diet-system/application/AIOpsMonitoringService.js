import { Alert } from '../domain/Alert.js';

// ============================================
// APPLICATION LAYER - AIOps Monitoring Service
// ============================================

/**
 * Servicio de monitoreo y observabilidad del sistema
 * Genera alertas automáticas basadas en métricas y estado
 */
export class AIOpsMonitoringService {
  constructor() {
    this.alerts = [];
    this.metrics = {
      pendingPatients: 0,
      criticalPatients: 0,
      avgGenerationTime: 0,
      systemHealth: 'healthy'
    };
  }

  createAlert(type, message, priority, patientId = null) {
    const alert = new Alert(type, message, priority, patientId);
    this.alerts.unshift(alert);
    return alert;
  }

  monitorPatients(patients) {
    const now = new Date();
    const pending = patients.filter(p => p.status === 'pending');
    const critical = patients.filter(p => p.triage <= 2 && p.status !== 'delivered');

    // Alerta: Pacientes críticos sin atención
    critical.forEach(patient => {
      if (!patient.clinicalAnalysis) {
        this.createAlert(
          'critical_patient',
          `Paciente ${patient.name} (Triage ${patient.triage}) sin dieta asignada`,
          'CRITICAL',
          patient.id
        );
      }
    });

    // Alerta: Muchos pacientes pendientes
    if (pending.length > 10) {
      this.createAlert(
        'high_load',
        `${pending.length} pacientes pendientes de procesamiento`,
        'MEDIUM'
      );
    }

    this.metrics.pendingPatients = pending.length;
    this.metrics.criticalPatients = critical.length;
  }

  monitorAPIPerformance(geminiMetrics) {
    // Alerta: API lenta
    if (geminiMetrics.averageResponseTime > 5000) {
      this.createAlert(
        'performance',
        `Gemini API responde lento (${geminiMetrics.averageResponseTime}ms)`,
        'MEDIUM'
      );
    }

    // Alerta: Tasa de error alta
    if (geminiMetrics.successRate < 90) {
      this.createAlert(
        'api_errors',
        `Tasa de éxito de IA baja: ${geminiMetrics.successRate}%`,
        'HIGH'
      );
    }

    // Alerta: Múltiples errores recientes
    const recentErrors = geminiMetrics.errors.filter(e => {
      const errorTime = new Date(e.timestamp);
      return (Date.now() - errorTime) < 300000; // últimos 5 min
    });

    if (recentErrors.length >= 3) {
      this.createAlert(
        'api_failure',
        `${recentErrors.length} errores de API en los últimos 5 minutos`,
        'CRITICAL'
      );
    }
  }

  getActiveAlerts() {
    return this.alerts.filter(a => !a.resolved);
  }

  resolveAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) alert.resolve();
  }

  getMetrics() {
    return { ...this.metrics };
  }
}