import React from 'react';
import { Clock, Activity, CheckCircle, ChefHat, AlertTriangle } from 'lucide-react';

// ============================================
// COMPONENTE - PatientCard
// ============================================

/**
 * Tarjeta de paciente para vista de dashboard
 * SIN edad - INCLUYE chiefComplaint prominente
 */
const PatientCard = ({ patient, onViewDetails, onGenerateDiet, onUpdateStatus, isGenerating }) => {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pendiente' },
    analyzing: { color: 'bg-blue-100 text-blue-800', icon: Activity, text: 'Analizando...' },
    diet_ready: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Dieta Lista' },
    preparing: { color: 'bg-orange-100 text-orange-800', icon: ChefHat, text: 'En Cocina' },
    delivered: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle, text: 'Entregado' },
    error: { color: 'bg-red-100 text-red-800', icon: AlertTriangle, text: 'Error' }
  };

  const config = statusConfig[patient.status];
  const StatusIcon = config.icon;

  const triageColor = patient.triage <= 2 ? 'text-red-600' : patient.triage <= 3 ? 'text-orange-600' : 'text-green-600';

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-xl font-bold text-gray-800">{patient.name}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${triageColor} bg-gray-100`}>
              Triage {patient.triage}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
            <p>👤 {patient.gender}</p>
            <p>🏥 KTAS {patient.triage} | {patient.arrivalMode}</p>
            <p className="col-span-2 font-medium text-gray-800">
              📋 Motivo: {patient.chiefComplaint}
            </p>
          </div>
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${config.color}`}>
            <StatusIcon className="w-4 h-4" />
            <span className="text-sm font-medium">{config.text}</span>
          </div>
        </div>
        <div className="flex flex-col space-y-2 ml-4">
          <button
            onClick={onViewDetails}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
          >
            Ver Detalles
          </button>
          {patient.status === 'pending' && (
            <button
              onClick={onGenerateDiet}
              disabled={isGenerating}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium disabled:bg-gray-400"
            >
              {isGenerating ? 'Generando...' : 'Generar Dieta'}
            </button>
          )}
          {patient.status === 'diet_ready' && (
            <button
              onClick={() => onUpdateStatus(patient.id, 'preparing')}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium"
            >
              Enviar a Cocina
            </button>
          )}
          {patient.status === 'preparing' && (
            <button
              onClick={() => onUpdateStatus(patient.id, 'delivered')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Marcar Entregado
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientCard;