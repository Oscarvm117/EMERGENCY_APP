/**
 * PUNTO DE ENTRADA - Emergency Diet System
 * 
 * Este archivo sirve como punto de entrada para la aplicación.
 * Exporta el componente principal para ser usado en React.
 */

import EmergencyDietSystem from './presentation/components/EmergencyDietSystem.jsx';

export default EmergencyDietSystem;

// También puedes exportar componentes individuales si los necesitas
export { default as PatientCard } from './presentation/components/PatientCard.jsx';
export { default as PatientDetailView } from './presentation/components/PatientDetailView.jsx';
export { default as AIOpsMonitorView } from './presentation/components/AIOpsMonitorView.jsx';

// Exportar servicios
export { GeminiService } from './infrastructure/GeminiService.js';
export { CSVParser } from './infrastructure/CSVParser.js';
export { GenerateDietUseCase } from './application/GenerateDietUseCase.js';
export { AIOpsMonitoringService } from './application/AIOpsMonitoringService.js';

// Exportar entidades de dominio
export { Patient } from './domain/Patient.js';
export { Alert } from './domain/Alert.js';
export { NameGenerator, DataDecoder } from './domain/helpers.js';