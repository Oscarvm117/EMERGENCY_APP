import { Patient } from '../domain/Patient.js';

// ============================================
// INFRASTRUCTURE LAYER - CSV Parser
// ============================================

/**
 * Parser para archivos CSV de datos de pacientes
 * Transforma datos tabulares en entidades Patient
 * MEJORADO: Maneja mejor los delimitadores y campos con comas
 */
export class CSVParser {
  static parse(csvText) {
    const lines = csvText.trim().split('\n');
    
    // Parsear la primera línea como headers
    const headerLine = lines[0];
    const headers = this.parseCSVLine(headerLine);
    
    console.log('📋 CSV Headers detectados:', headers);
    
    const patients = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue; // Skip empty lines
      
      try {
        const values = this.parseCSVLine(lines[i]);
        
        const patientData = {};
        headers.forEach((header, index) => {
          patientData[header] = values[index] || '';
        });
        
        // Debug: mostrar los primeros 3 pacientes
        if (i <= 3) {
          console.log(`👤 Paciente ${i}:`, {
            Chief_complain: patientData.Chief_complain,
            Sex: patientData.Sex,
            Age: patientData.Age,
            KTAS_expert: patientData.KTAS_expert
          });
        }
        
        // Create patient with index for name generation
        patients.push(new Patient(patientData, i));
      } catch (error) {
        console.warn(`⚠️ Error parseando línea ${i}:`, error.message);
      }
    }
    
    console.log(`✅ Parseados ${patients.length} pacientes exitosamente`);
    if (patients.length > 0) {
      console.log('👤 Muestra de primer paciente:', {
        name: patients[0].name,
        chiefComplaint: patients[0].chiefComplaint,
        gender: patients[0].gender,
        triage: patients[0].triage
      });
    }
    return patients;
  }

  /**
   * Parsea una línea CSV manejando correctamente:
   * - Campos entre comillas
   * - Comas dentro de campos
   * - Comillas escapadas
   */
  static parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Comillas escapadas ""
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote mode
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // Fin de campo
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    // Agregar el último campo
    result.push(current.trim());
    
    return result;
  }
}