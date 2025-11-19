// ============================================
// ENTIDAD - Alert (Alerta del Sistema)
// ============================================

/**
 * Entidad de dominio que representa una alerta del sistema AIOps
 */
export class Alert {
    constructor(type, message, priority, patientId = null) {
      this.id = Date.now() + Math.random();
      this.type = type;
      this.message = message;
      this.priority = priority; // LOW, MEDIUM, HIGH, CRITICAL
      this.patientId = patientId;
      this.timestamp = Date.now();
      this.resolved = false;
      this.resolvedAt = null;
    }
  
    resolve() {
      this.resolved = true;
      this.resolvedAt = Date.now();
    }
  
    getAge() {
      return Date.now() - this.timestamp;
    }
  
    isPriority(level) {
      const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
      return priorities.indexOf(this.priority) >= priorities.indexOf(level);
    }
  }