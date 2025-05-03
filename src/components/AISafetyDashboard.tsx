import React, { useState, useEffect } from 'react';
import { Incident, Severity, SortOrder } from '../types/incident';
import { mockIncidents } from '../data/mockIncidents';

const AISafetyDashboard: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [filter, setFilter] = useState<Severity | 'All'>('All');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [expandedIncident, setExpandedIncident] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newIncident, setNewIncident] = useState({
    title: '',
    description: '',
    severity: 'Low' as Severity,
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const storedMode = localStorage.getItem('theme');
    return storedMode ? storedMode === 'dark' : false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

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
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center px-4 py-8 transition-colors duration-500 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-600 text-white hover:bg-purple-700 transition"
          title={`Switch to ${darkMode ? 'Light' : 'Dark'} Mode`}
        >
          {darkMode ? '🌞' : '🌙'}
        </button>
      </div>

      <div className="w-full max-w-4xl text-center">
        <h1 className="text-3xl font-bold mb-6">AI Safety Incident Dashboard</h1>

        <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
          <div>
            <select
              className="p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              value={filter}
              onChange={(e) => setFilter(e.target.value as Severity | 'All')}
            >
              <option value="All">All Severities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <select
              className="p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <button
          className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Report New Incident'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-left">
            <h2 className="text-xl font-semibold mb-4">Report New Incident</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  value={newIncident.title}
                  onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Severity</label>
                <select
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
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
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Submit Incident
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {filteredIncidents.map((incident) => (
            <div
              key={incident.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700 text-left"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{incident.title}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {new Date(incident.reported_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600"
                  onClick={() => setExpandedIncident(expandedIncident === incident.id ? null : incident.id)}
                >
                  {expandedIncident === incident.id ? 'Hide Details' : 'View Details'}
                </button>
              </div>
              {expandedIncident === incident.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md dark:bg-gray-700">
                  <p className="text-gray-700 dark:text-gray-200">{incident.description}</p>
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
