import React from 'react';

// ============================================
// COMPONENTE - Alert Card
// ============================================

/**
 * Tarjeta de alerta del sistema AIOps
 */
export const AlertCard = ({ alert, onResolve }) => {
  const priorityConfig = {
    CRITICAL: { color: 'bg-red-100 border-red-300 text-red-800', icon: '🔴' },
    HIGH: { color: 'bg-orange-100 border-orange-300 text-orange-800', icon: '🟠' },
    MEDIUM: { color: 'bg-yellow-100 border-yellow-300 text-yellow-800', icon: '🟡' },
    LOW: { color: 'bg-blue-100 border-blue-300 text-blue-800', icon: '🔵' }
  };

  const config = priorityConfig[alert.priority];

  return (
    <div className={`p-4 border-2 rounded-lg ${config.color}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xl">{config.icon}</span>
            <span className="font-bold">{alert.priority}</span>
            <span className="text-sm opacity-75">• {alert.type}</span>
          </div>
          <p className="font-medium mb-2">{alert.message}</p>
          <p className="text-xs opacity-75">
            {new Date(alert.timestamp).toLocaleString('es-ES')}
          </p>
        </div>
        <button
          onClick={onResolve}
          className="ml-4 px-4 py-2 bg-white rounded hover:bg-gray-50 text-sm font-medium"
        >
          Resolver
        </button>
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE - Rule Card
// ============================================

/**
 * Tarjeta de regla de monitoreo del sistema
 */
export const RuleCard = ({ title, condition, action, status }) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-gray-800">{title}</h4>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {status === 'active' ? '✓ Activa' : 'Inactiva'}
        </span>
      </div>
      <div className="text-sm text-gray-600 space-y-1">
        <p><span className="font-semibold">Condición:</span> {condition}</p>
        <p><span className="font-semibold">Acción:</span> {action}</p>
      </div>
    </div>
  );
};