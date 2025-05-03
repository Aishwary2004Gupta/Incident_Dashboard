import React, { useState, useEffect } from 'react';
import { Incident, Severity, SortOrder } from '../types/incident';
import { mockIncidents } from '../data/mockIncidents';

const AISafetyDashboard: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [filter, setFilter] = useState<Severity | 'All'>('All');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [expandedIncident, setExpandedIncident] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [newIncident, setNewIncident] = useState({
    title: '',
    description: '',
    severity: 'Low' as Severity,
  });

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Apply dark mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const filteredIncidents = incidents
    .filter(incident => filter === 'All' || incident.severity === filter)
    .sort((a, b) => {
      const dateA = new Date(a.reported_at);
      const dateB = new Date(b.reported_at);
      return sortOrder === 'newest' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncident.title || !newIncident.description) return;

    const incident: Incident = {
      id: incidents.length + 1,
      ...newIncident,
      reported_at: new Date().toISOString(),
    };

    setIncidents([...incidents, incident]);
    setNewIncident({ title: '', description: '', severity: 'Low' });
    setShowForm(false);
  };

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case 'Low': return 'bg-emerald-100 text-emerald-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      case 'High': return 'bg-rose-100 text-rose-800';
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="container mx-auto px-6 py-10">
        {/* Dark Mode Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        <h1 className={`text-4xl font-extrabold mb-10 text-center ${isDarkMode ? 'text-white' : 'text-blue-800'}`}>
          🌐 AI Safety Incident Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Filter by Severity
            </label>
            <select
              className={`w-full p-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300'
              }`}
              value={filter}
              onChange={(e) => setFilter(e.target.value as Severity | 'All')}
            >
              <option value="All">All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Sort by Date
            </label>
            <select
              className={`w-full p-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300'
              }`}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <button
          className={`mb-8 px-6 py-3 rounded-xl font-medium transition-transform transform hover:scale-105 ${
            isDarkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '➕ Report New Incident'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className={`mb-10 p-6 border-2 rounded-xl shadow-lg ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-blue-700'}`}>
              📝 Report New Incident
            </h2>
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Title
                </label>
                <input
                  type="text"
                  className={`w-full p-3 border-2 rounded-lg ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                  }`}
                  value={newIncident.title}
                  onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description
                </label>
                <textarea
                  className={`w-full p-3 border-2 rounded-lg ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                  }`}
                  rows={4}
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Severity
                </label>
                <select
                  className={`w-full p-3 border-2 rounded-lg ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                  }`}
                  value={newIncident.severity}
                  onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value as Severity })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-transform transform hover:scale-105"
              >
                ✅ Submit Incident
              </button>
            </div>
          </form>
        )}

        <div className="space-y-6">
          {filteredIncidents.map((incident) => (
            <div
              key={incident.id}
              className={`border-2 rounded-xl p-6 shadow-md hover:shadow-lg transition-all ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {incident.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      📅 {new Date(incident.reported_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  className={`font-medium ${
                    isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-700'
                  }`}
                  onClick={() => setExpandedIncident(expandedIncident === incident.id ? null : incident.id)}
                >
                  {expandedIncident === incident.id ? '▲ Hide' : '▼ View'}
                </button>
              </div>
              {expandedIncident === incident.id && (
                <div className={`mt-4 p-4 rounded-lg border ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-700'
                }`}>
                  {incident.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AISafetyDashboard;
