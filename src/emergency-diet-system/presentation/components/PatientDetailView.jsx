import React from 'react';
import { Activity, ChefHat, CheckCircle, Send, AlertTriangle } from 'lucide-react';

// ============================================
// COMPONENTE - Patient Detail View
// ============================================

/**
 * Vista detallada de un paciente con análisis clínico y plan dietético
 * SIN edad
 */
const PatientDetailView = ({ patient, onBack, onGenerateDiet, onUpdateStatus, isGenerating }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-2"
          >
            ← Volver al Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Detalle del Paciente</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Patient Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{patient.name}</h2>
              <div className="flex items-center space-x-4 text-gray-600">
                <span>👤 {patient.gender}</span>
                <span>|</span>
                <span>⚖️ {patient.weight} kg</span>
                <span>|</span>
                <span className={`font-bold ${patient.triage <= 2 ? 'text-red-600' : 'text-orange-600'}`}>
                  KTAS Triage {patient.triage}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500">ID: {patient.id}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-2">🏥 Motivo de Consulta</p>
              <p className="text-gray-800 font-medium">{patient.chiefComplaint}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-2">🚑 Modo de Llegada</p>
              <p className="text-gray-800">{patient.arrivalMode}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-2">🩺 Signos Vitales</p>
              <div className="text-sm text-gray-700 space-y-1">
                <p>PA: {patient.vitalSigns.sbp}/{patient.vitalSigns.dbp} mmHg</p>
                <p>FC: {patient.vitalSigns.hr} lpm</p>
                <p>FR: {patient.vitalSigns.rr} rpm</p>
                <p>T°: {patient.vitalSigns.bt} °C</p>
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-2">🧠 Estado Mental</p>
              <p className="text-gray-800">{patient.vitalSigns.mental}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-2">😣 Dolor</p>
              <p className="text-gray-800">
                {patient.vitalSigns.pain == 1 
                  ? `Sí - Nivel ${patient.vitalSigns.nrsPain}/10` 
                  : 'No presenta'}
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-2">📋 Condiciones y Hallazgos</p>
            <p className="text-gray-800">{patient.conditions}</p>
          </div>
        </div>

        {/* Generate Diet Button */}
        {patient.status === 'pending' && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              ¿Listo para generar la dieta personalizada?
            </h3>
            <p className="text-green-50 mb-6">
              El sistema utilizará IA para crear un plan nutricional específico para este paciente
            </p>
            <button
              onClick={onGenerateDiet}
              disabled={isGenerating}
              className="px-8 py-4 bg-white text-green-600 rounded-lg font-bold text-lg hover:bg-green-50 disabled:bg-gray-200 disabled:text-gray-500 transition-colors"
            >
              {isGenerating ? '🤖 Generando con IA...' : '🚀 Generar Dieta Ahora'}
            </button>
          </div>
        )}

        {/* Clinical Analysis */}
        {patient.clinicalAnalysis && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-blue-600" />
              Análisis Clínico (IA)
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">🚫 Restricciones Dietéticas</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {patient.clinicalAnalysis.restrictions?.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">📊 Requerimientos Nutricionales</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {patient.clinicalAnalysis.requirements?.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">⚕️ Consideraciones Especiales</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {patient.clinicalAnalysis.considerations?.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              {patient.clinicalAnalysis.alerts?.length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Alertas Importantes
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-red-700">
                    {patient.clinicalAnalysis.alerts.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Diet Plan */}
        {patient.dietPlan && (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <ChefHat className="w-6 h-6 mr-2 text-orange-600" />
                Plan de Alimentación (24 horas)
              </h3>

              <div className="mb-4 p-4 bg-indigo-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-700">
                  📊 Total Estimado: <span className="text-indigo-600">{patient.dietPlan.total_calories}</span>
                </p>
              </div>

              <div className="space-y-6">
                {/* Breakfast */}
                <MealCard 
                  title="🌅 Desayuno" 
                  time={patient.dietPlan.breakfast?.time}
                  items={patient.dietPlan.breakfast?.items}
                />

                {/* Morning Snack */}
                <MealCard 
                  title="☕ Colación Matutina" 
                  time={patient.dietPlan.morning_snack?.time}
                  items={patient.dietPlan.morning_snack?.items}
                />

                {/* Lunch */}
                <MealCard 
                  title="🍽️ Almuerzo" 
                  time={patient.dietPlan.lunch?.time}
                  items={patient.dietPlan.lunch?.items}
                />

                {/* Afternoon Snack */}
                <MealCard 
                  title="🥤 Colación Vespertina" 
                  time={patient.dietPlan.afternoon_snack?.time}
                  items={patient.dietPlan.afternoon_snack?.items}
                />

                {/* Dinner */}
                <MealCard 
                  title="🌙 Cena" 
                  time={patient.dietPlan.dinner?.time}
                  items={patient.dietPlan.dinner?.items}
                />
              </div>

              {/* Preparation Notes */}
              {patient.dietPlan.preparation_notes && (
                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">👨‍🍳 Notas para Cocina</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {patient.dietPlan.preparation_notes.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Delivery Status */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Send className="w-6 h-6 mr-2 text-blue-600" />
                Estado de Entrega
              </h3>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-8">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${patient.status === 'diet_ready' || patient.status === 'preparing' || patient.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-700">Dieta Lista</p>
                  </div>

                  <div className={`h-1 w-24 ${patient.status === 'preparing' || patient.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>

                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${patient.status === 'preparing' || patient.status === 'delivered' ? 'bg-orange-500' : 'bg-gray-300'}`}>
                      <ChefHat className="w-6 h-6 text-white" />
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-700">En Cocina</p>
                  </div>

                  <div className={`h-1 w-24 ${patient.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>

                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${patient.status === 'delivered' ? 'bg-blue-500' : 'bg-gray-300'}`}>
                      <Send className="w-6 h-6 text-white" />
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-700">Entregado</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  {patient.status === 'diet_ready' && (
                    <button
                      onClick={() => onUpdateStatus(patient.id, 'preparing')}
                      className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold"
                    >
                      📤 Enviar a Cocina
                    </button>
                  )}
                  {patient.status === 'preparing' && (
                    <button
                      onClick={() => onUpdateStatus(patient.id, 'delivered')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                    >
                      ✅ Marcar como Entregado
                    </button>
                  )}
                  {patient.status === 'delivered' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 font-semibold flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Comida entregada exitosamente
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        {patient.deliveredAt && new Date(patient.deliveredAt).toLocaleString('es-ES')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Meal Card Component
const MealCard = ({ title, time, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-gray-800">{title}</h4>
        <span className="text-sm text-gray-500">⏰ {time}</span>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start space-x-3 text-gray-700">
            <span className="text-indigo-600 font-bold">•</span>
            <div className="flex-1">
              <p className="font-medium">{item.name} - {item.quantity}</p>
              {item.notes && <p className="text-sm text-gray-500 italic">{item.notes}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientDetailView;