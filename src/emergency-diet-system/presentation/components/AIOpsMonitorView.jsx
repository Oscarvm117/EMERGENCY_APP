import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock, FileText, TrendingUp } from 'lucide-react';
import { AlertCard, RuleCard } from './AlertsComponents.jsx';

// ============================================
// COMPONENTE - AIOps Monitor View
// ============================================

/**
 * Vista de monitoreo y observabilidad del sistema
 * Muestra métricas, alertas y estado de salud del sistema
 */
const AIOpsMonitorView = ({ aiopsService, geminiService, patients, onBack }) => {
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [systemHealth, setSystemHealth] = useState('healthy');

  useEffect(() => {
    const updateMetrics = () => {
      if (geminiService) {
        const geminiMetrics = geminiService.getMetrics();
        setMetrics(geminiMetrics);

        // Determine system health
        if (geminiMetrics.failedCalls > 5 || geminiMetrics.successRate < 80) {
          setSystemHealth('critical');
        } else if (geminiMetrics.averageResponseTime > 5000 || geminiMetrics.successRate < 95) {
          setSystemHealth('warning');
        } else {
          setSystemHealth('healthy');
        }
      }

      if (aiopsService) {
        setActiveAlerts(aiopsService.getActiveAlerts());
      }
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [geminiService, aiopsService]);

  const healthColor = systemHealth === 'critical' ? 'text-red-600' : systemHealth === 'warning' ? 'text-yellow-600' : 'text-green-600';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-white hover:text-purple-100 mb-4"
          >
            ← Volver al Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">AIOps Monitoring</h1>
              <p className="text-purple-100">Sistema de Observabilidad y Alertas Inteligentes</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-sm font-semibold text-white">Estado del Sistema</p>
              <p className={`text-2xl font-bold ${healthColor}`}>
                {systemHealth === 'critical' ? '🔴 Crítico' : systemHealth === 'warning' ? '🟡 Alerta' : '🟢 Operativo'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* AI Performance Metrics */}
        {metrics && (
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Llamadas IA Total</p>
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-gray-800">{metrics.totalCalls}</p>
              <p className="text-xs text-gray-500 mt-1">Exitosas: {metrics.successfulCalls}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Tiempo Promedio</p>
                <Clock className="w-5 h-5 text-indigo-500" />
              </div>
              <p className="text-3xl font-bold text-gray-800">{metrics.averageResponseTime}ms</p>
              <p className={`text-xs mt-1 ${metrics.averageResponseTime > 5000 ? 'text-red-600' : 'text-green-600'}`}>
                {metrics.averageResponseTime > 5000 ? '⚠️ Lento' : '✅ Óptimo'}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Tasa de Éxito</p>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-gray-800">{metrics.successRate}%</p>
              <p className={`text-xs mt-1 ${metrics.successRate < 90 ? 'text-red-600' : 'text-green-600'}`}>
                {metrics.successRate < 90 ? '⚠️ Bajo' : '✅ Excelente'}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Errores Totales</p>
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-3xl font-bold text-gray-800">{metrics.failedCalls}</p>
              <p className={`text-xs mt-1 ${metrics.failedCalls > 5 ? 'text-red-600' : 'text-gray-500'}`}>
                {metrics.failedCalls > 5 ? '⚠️ Revisar' : '✅ Normal'}
              </p>
            </div>
          </div>
        )}

        {/* Active Alerts */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2 text-orange-500" />
            Alertas Activas ({activeAlerts.length})
          </h2>

          {activeAlerts.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No hay alertas activas</p>
              <p className="text-sm text-gray-500">El sistema está operando normalmente</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeAlerts.map(alert => (
                <AlertCard 
                  key={alert.id} 
                  alert={alert} 
                  onResolve={() => {
                    aiopsService.resolveAlert(alert.id);
                    setActiveAlerts(aiopsService.getActiveAlerts());
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* System Rules */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-indigo-500" />
            Reglas de Monitoreo Activas
          </h2>

          <div className="space-y-3">
            <RuleCard
              title="Performance de API"
              condition="Tiempo de respuesta > 5000ms"
              action="Alerta MEDIUM + Email"
              status="active"
            />
            <RuleCard
              title="Pacientes Críticos"
              condition="Triage 1-2 sin dieta > 30 min"
              action="Alerta CRITICAL + Dashboard"
              status="active"
            />
            <RuleCard
              title="Errores de IA"
              condition="3+ errores en 5 minutos"
              action="Alerta HIGH + Notificación"
              status="active"
            />
            <RuleCard
              title="Carga Alta"
              condition="> 10 pacientes pendientes"
              action="Alerta MEDIUM + Dashboard"
              status="active"
            />
          </div>
        </div>

        {/* Recent Errors Log */}
        {metrics && metrics.errors.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
              Registro de Errores Recientes
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {metrics.errors.slice(-10).reverse().map((error, i) => (
                <div key={i} className="p-3 bg-red-50 border border-red-200 rounded text-sm">
                  <p className="font-mono text-red-800">{error.error}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(error.timestamp).toLocaleString('es-ES')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIOpsMonitorView;