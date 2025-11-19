import React, { useState, useEffect } from 'react';
import { Upload, Users, Activity, AlertTriangle, CheckCircle, Clock, ChefHat, Search } from 'lucide-react';
import { GeminiService } from '../../infrastructure/GeminiService.js';
import { CSVParser } from '../../infrastructure/CSVParser.js';
import { GenerateDietUseCase } from '../../application/GenerateDietUseCase.js';
import { AIOpsMonitoringService } from '../../application/AIOpsMonitoringService.js';
import PatientCard from './PatientCard.jsx';
import PatientDetailView from './PatientDetailView.jsx';
import AIOpsMonitorView from './AIOpsMonitorView.jsx';

// ============================================
// COMPONENTE PRINCIPAL - Emergency Diet System
// ============================================

/**
 * Componente principal de la aplicación
 * Gestiona el estado global y la navegación entre vistas
 */
const EmergencyDietSystem = () => {
  const [patients, setPatients] = useState([]);
  const [geminiApiKey, setGeminiApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
  const [geminiService, setGeminiService] = useState(null);
  const [aiopsService] = useState(new AIOpsMonitoringService());
  const [currentView, setCurrentView] = useState('upload'); // upload, dashboard, patient, aiops
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 10;

  // Configurar servicios cuando se ingresa API key
  useEffect(() => {
    if (geminiApiKey && geminiApiKey.length > 20) {
      const service = new GeminiService(geminiApiKey);
      setGeminiService(service);
    }
  }, [geminiApiKey]);

  // Monitoreo AIOps cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (geminiService && patients.length > 0) {
        aiopsService.monitorPatients(patients);
        aiopsService.monitorAPIPerformance(geminiService.getMetrics());
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [geminiService, patients, aiopsService]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target.result;
      const parsedPatients = CSVParser.parse(csvText);
      setPatients(parsedPatients);
      setCurrentView('dashboard');
      
      // Show success message
      console.log(`✅ ${parsedPatients.length} pacientes cargados exitosamente`);
    };
    reader.readAsText(file);
  };

  const generateDiet = async (patient) => {
    if (!geminiService) {
      alert('Por favor, ingresa tu API Key de Gemini primero');
      return;
    }

    setIsGenerating(true);
    const useCase = new GenerateDietUseCase(geminiService, aiopsService);
    
    await useCase.execute(patient, (updatedPatient) => {
      setPatients(prev => prev.map(p => 
        p.id === updatedPatient.id ? updatedPatient : p
      ));
      setSelectedPatient(updatedPatient);
    });
    
    setIsGenerating(false);
  };

  const updatePatientStatus = (patientId, newStatus) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const updated = { ...p, status: newStatus };
        if (newStatus === 'delivered') {
          updated.deliveredAt = new Date();
        }
        return updated;
      }
      return p;
    }));
  };

  const filteredPatients = patients.filter(p => {
    // Apply status filter
    let statusMatch = true;
    if (filter === 'pending') statusMatch = p.status === 'pending';
    if (filter === 'ready') statusMatch = p.status === 'diet_ready' || p.status === 'preparing';
    if (filter === 'completed') statusMatch = p.status === 'delivered';
    
    // Apply search filter
    let searchMatch = true;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      searchMatch = 
        p.name.toLowerCase().includes(query) ||
        p.id.toString().includes(query) ||
        p.conditions.toLowerCase().includes(query) ||
        p.chiefComplaint.toLowerCase().includes(query) ||
        p.triage.toString().includes(query);
    }
    
    return statusMatch && searchMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  const startIndex = (currentPage - 1) * patientsPerPage;
  const endIndex = startIndex + patientsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);

  const stats = {
    total: patients.length,
    pending: patients.filter(p => p.status === 'pending').length,
    preparing: patients.filter(p => p.status === 'preparing').length,
    delivered: patients.filter(p => p.status === 'delivered').length,
    critical: patients.filter(p => p.triage <= 2).length
  };

  // ========== VISTAS ==========

  if (currentView === 'upload') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <ChefHat className="w-20 h-20 text-indigo-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Sistema de Gestión de Dietas
              </h1>
              <p className="text-gray-600">Urgencias Hospitalarias - IA Powered</p>
            </div>

            {/* File Upload */}
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Upload className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Cargar Base de Datos de Pacientes
              </h2>
              <p className="text-gray-500 mb-6">
                Arrastra tu archivo CSV o haz clic para seleccionar
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold cursor-pointer hover:bg-indigo-700 transition-colors"
              >
                Seleccionar Archivo CSV
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <ChefHat className="w-8 h-8 text-indigo-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Sistema de Dietas</h1>
                  <p className="text-sm text-gray-600">Servicio de Urgencias</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setCurrentView('aiops')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                >
                  <Activity className="w-5 h-5" />
                  <span>AIOps Monitor</span>
                </button>
                <button
                  onClick={() => setCurrentView('upload')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cambiar CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Pacientes</p>
                  <p className="text-3xl font-bold text-indigo-600">{stats.total}</p>
                </div>
                <Users className="w-10 h-10 text-indigo-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pendientes</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-10 h-10 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En Preparación</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.preparing}</p>
                </div>
                <ChefHat className="w-10 h-10 text-orange-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Entregados</p>
                  <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Críticos</p>
                  <p className="text-3xl font-bold text-red-600">{stats.critical}</p>
                </div>
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex space-x-3">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-lg font-medium ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Pendientes
                </button>
                <button
                  onClick={() => setFilter('ready')}
                  className={`px-4 py-2 rounded-lg font-medium ${filter === 'ready' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Listos
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-4 py-2 rounded-lg font-medium ${filter === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Completados
                </button>
              </div>
              
              {/* Search Bar */}
              <div className="flex-1 max-w-md relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, ID, condición, motivo o triage..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-gray-600">
              Mostrando <span className="font-semibold">{startIndex + 1}</span> - <span className="font-semibold">{Math.min(endIndex, filteredPatients.length)}</span> de <span className="font-semibold">{filteredPatients.length}</span> pacientes
              {searchQuery && <span className="ml-2 text-indigo-600">(búsqueda activa)</span>}
            </p>
          </div>

          {/* Patient List */}
          <div className="space-y-4">
            {paginatedPatients.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron pacientes</h3>
                <p className="text-gray-500">
                  {searchQuery 
                    ? 'Intenta con otros términos de búsqueda' 
                    : 'No hay pacientes que coincidan con los filtros seleccionados'
                  }
                </p>
              </div>
            ) : (
              paginatedPatients.map(patient => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onViewDetails={() => {
                    setSelectedPatient(patient);
                    setCurrentView('patient');
                  }}
                  onGenerateDiet={() => generateDiet(patient)}
                  onUpdateStatus={updatePatientStatus}
                  isGenerating={isGenerating}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Anterior
              </button>
              
              <div className="flex space-x-1">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          currentPage === page
                            ? 'bg-indigo-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return <span key={page} className="px-2 py-2">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentView === 'patient' && selectedPatient) {
    return <PatientDetailView 
      patient={selectedPatient} 
      onBack={() => setCurrentView('dashboard')}
      onGenerateDiet={() => generateDiet(selectedPatient)}
      onUpdateStatus={updatePatientStatus}
      isGenerating={isGenerating}
    />;
  }

  if (currentView === 'aiops') {
    return <AIOpsMonitorView 
      aiopsService={aiopsService}
      geminiService={geminiService}
      patients={patients}
      onBack={() => setCurrentView('dashboard')}
    />;
  }

  return null;
};

export default EmergencyDietSystem;
