// ============================================
// HELPERS - Utilidades de dominio
// ============================================

/**
 * Generador de nombres ficticios para pacientes
 * Genera nombres basados en género y un seed para consistencia
 */
export const NameGenerator = {
    firstNames: {
      male: ['Carlos', 'José', 'Luis', 'Miguel', 'Juan', 'Pedro', 'Antonio', 'Francisco', 'Javier', 'Rafael', 'Daniel', 'Manuel', 'Ricardo', 'Fernando', 'Roberto', 'Eduardo', 'Alejandro', 'Sergio', 'Alberto', 'Jorge'],
      female: ['María', 'Ana', 'Carmen', 'Laura', 'Patricia', 'Isabel', 'Rosa', 'Lucía', 'Elena', 'Teresa', 'Sofía', 'Marta', 'Cristina', 'Andrea', 'Beatriz', 'Silvia', 'Diana', 'Gabriela', 'Natalia', 'Valentina']
    },
    lastNames: ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales', 'Reyes', 'Jiménez', 'Hernández', 'Ruiz', 'Mendoza'],
    
    generate(gender, seed) {
      const genderKey = gender === 1 || gender === '1' ? 'female' : 'male';
      const firstIndex = seed % this.firstNames[genderKey].length;
      const lastIndex = Math.floor(seed / this.firstNames[genderKey].length) % this.lastNames.length;
      
      return `${this.firstNames[genderKey][firstIndex]} ${this.lastNames[lastIndex]}`;
    }
  };
  
  /**
   * Decodificador de variables del dataset
   * Convierte códigos numéricos a valores legibles
   */
  export const DataDecoder = {
    gender(code) {
      return code == 1 ? 'Femenino' : code == 2 ? 'Masculino' : 'No especificado';
    },
    
    injury(code) {
      return code == 1 ? 'No' : code == 2 ? 'Sí' : 'No especificado';
    },
    
    pain(code) {
      return code == 1 ? 'Sí' : code == 0 ? 'No' : 'No especificado';
    },
    
    mental(code) {
      const states = {
        1: 'Alerta',
        2: 'Respuesta Verbal',
        3: 'Respuesta al Dolor',
        4: 'No Responde'
      };
      return states[code] || 'No especificado';
    },
    
    arrivalMode(code) {
      const modes = {
        1: 'Caminando',
        2: 'Ambulancia Pública',
        3: 'Vehículo Privado',
        4: 'Ambulancia Privada',
        5: 'Otro',
        6: 'Otro',
        7: 'Otro'
      };
      return modes[code] || 'No especificado';
    },
    
    disposition(code) {
      const dispositions = {
        1: 'Alta médica',
        2: 'Admisión a sala',
        3: 'Admisión a UCI',
        4: 'Alta',
        5: 'Transferencia',
        6: 'Fallecimiento',
        7: 'Cirugía programada'
      };
      return dispositions[code] || 'Pendiente';
    },
    
    edType(code) {
      return code == 1 ? 'ED Local (3er nivel)' : code == 2 ? 'ED Regional (4to nivel)' : 'No especificado';
    }
  };