import React, { useState } from 'react';
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
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">AI Safety Incident Dashboard</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Severity</label>
          <select
            className="w-full p-2 border rounded-md"
            value={filter}
            onChange={(e) => setFilter(e.target.value as Severity | 'All')}
          >
            <option value="All">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort by Date</label>
          <select
            className="w-full p-2 border rounded-md"
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
        <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Report New Incident</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={newIncident.title}
                onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full p-2 border rounded-md"
                value={newIncident.description}
                onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <select
                className="w-full p-2 border rounded-md"
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
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{incident.title}</h3>
                <div className="flex items-center gap-4 mt-2">
                  <span className={`px-2 py-1 rounded-full text-sm ${getSeverityColor(incident.severity)}`}>
                    {incident.severity}
                  </span>
                  <span className="text-gray-500">
                    {new Date(incident.reported_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => setExpandedIncident(expandedIncident === incident.id ? null : incident.id)}
              >
                {expandedIncident === incident.id ? 'Hide Details' : 'View Details'}
              </button>
            </div>
            {expandedIncident === incident.id && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="text-gray-700">{incident.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AISafetyDashboard; 