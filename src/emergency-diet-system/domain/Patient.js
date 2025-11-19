import { NameGenerator, DataDecoder } from './helpers.js';

// ============================================
// ENTIDAD - Patient (Paciente)
// ============================================

/**
 * Entidad de dominio que representa un paciente en urgencias
 * NO incluye edad por solicitud del usuario
 */
export class Patient {
  constructor(data, index = 0) {
    this.id = data.id || Date.now() + Math.random();
    
    // Kaggle dataset specific fields
    const sex = data.Sex || data.sex || data.Gender || data.gender || 2;
    const group = data.Group || data.group || 1; // ED type (1=Local 3rd, 2=Regional 4th)
    const patientsPerHour = data['Patients number per hour'] || data.patients_per_hour || 'N/A';
    const injury = data.Injury || data.injury || 1;
    // Intentar múltiples nombres de columna y limpiar el valor
    let chiefComplain = data.Chief_complain || data.chief_complain || data['Chief complain'] || data.ChiefComplain || '';
    // Limpiar espacios y valores vacíos
    chiefComplain = chiefComplain.trim();
    // Si está vacío o es un placeholder, usar valor por defecto
    if (!chiefComplain || chiefComplain === '??' || chiefComplain === 'N/A' || chiefComplain === '0') {
      chiefComplain = 'Evaluación general';
    }
    const mental = data.Mental || data.mental || 1;
    const pain = data.Pain || data.pain || 0;
    const nrsPain = data.NRS_pain || data.nrs_pain || 0;
    const sbp = data.SBP || data.sbp || '120';
    const dbp = data.DBP || data.dbp || '80';
    const hr = data.HR || data.hr || '75';
    const rr = data.RR || data.rr || '16';
    const bt = data.BT || data.bt || '36.5';
    const ktas = data.KTAS_expert || data.KTAS || data.ktas || 3;
    const arrivalMode = data.Arrival_mode || data.arrival_mode || 1;
    const disposition = data.Diagnosis || data.Disposition || data.disposition || 1;
    
    // Generate patient info
    this.name = NameGenerator.generate(sex, index);
    this.gender = DataDecoder.gender(sex);
    this.genderCode = sex;
    
    // Triage level (1-5, where 1-3 is emergency)
    this.triage = parseInt(ktas) || 3;
    
    // *** CORRECCIÓN: Usar Chief_complain como motivo de consulta principal ***
    this.chiefComplaint = chiefComplain;
    
    // Build comprehensive conditions from all available data
    const conditions = [];
    
    // Add chief complaint as primary condition
    if (chiefComplain && chiefComplain !== 'N/A' && chiefComplain !== '??') {
      conditions.push(`Motivo: ${chiefComplain}`);
    }
    
    // Add injury status
    if (injury == 2) {
      conditions.push('Paciente con trauma/lesión');
    }
    // Add chief complaint as primary condition
    if (chiefComplain && chiefComplain !== 'N/A' && chiefComplain !== '??' && chiefComplain !== 'Evaluación general') {
      conditions.push(`${chiefComplain}`);
    }
    
    // Add mental state if altered
    const mentalState = DataDecoder.mental(mental);
    if (mental != 1) {
      conditions.push(`Estado mental alterado: ${mentalState}`);
    }
    
    // Add pain level if present
    if (pain == 1 && nrsPain > 0) {
      conditions.push(`Dolor nivel ${nrsPain}/10`);
    }
    
    // Analyze vital signs for abnormalities
    const vitalIssues = [];
    const sbpNum = parseFloat(sbp);
    const dbpNum = parseFloat(dbp);
    const hrNum = parseFloat(hr);
    const rrNum = parseFloat(rr);
    const btNum = parseFloat(bt);
    
    if (!isNaN(sbpNum) && (sbpNum > 140 || sbpNum < 90)) vitalIssues.push('HTA/Hipotensión');
    if (!isNaN(hrNum) && hrNum > 100) vitalIssues.push('Taquicardia');
    if (!isNaN(hrNum) && hrNum < 60) vitalIssues.push('Bradicardia');
    if (!isNaN(rrNum) && (rrNum > 20 || rrNum < 12)) vitalIssues.push('Taquipnea/Bradipnea');
    if (!isNaN(btNum) && btNum > 37.5) vitalIssues.push('Fiebre');
    if (!isNaN(btNum) && btNum < 36) vitalIssues.push('Hipotermia');
    
    if (vitalIssues.length > 0) {
      conditions.push(`Signos vitales: ${vitalIssues.join(', ')}`);
    }
    
    this.conditions = conditions.length > 0 ? conditions.join(' | ') : 'En evaluación';
    
    // Additional clinical info
    this.allergies = 'No registradas en sistema'; 
    this.medications = 'No registrados en sistema';
    
    // Calculate estimated weight based on gender only (NO AGE)
    // Average weights: Female 60-70kg, Male 70-85kg
    const baseWeight = sex == 1 ? 65 : 77;
    this.weight = Math.round(baseWeight + (Math.random() * 10 - 5)).toString();
    
    // Vital signs object
    this.vitalSigns = {
      sbp: sbp || 'N/A',
      dbp: dbp || 'N/A',
      hr: hr || 'N/A',
      rr: rr || 'N/A',
      bt: bt || 'N/A',
      pain,
      nrsPain: nrsPain || 0,
      mental: mentalState
    };
    
    // Clinical metadata
    this.arrivalMode = DataDecoder.arrivalMode(arrivalMode);
    this.hasInjury = DataDecoder.injury(injury);
    this.edType = group == 1 ? 'ED Local (3er nivel)' : 'ED Regional (4to nivel)';
    this.disposition = DataDecoder.disposition(disposition);
    
    this.status = 'pending';
    this.clinicalAnalysis = null;
    this.dietPlan = null;
    this.generatedAt = null;
    this.deliveredAt = null;
  }
}
