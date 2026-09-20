import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSimulation, submitSimulation, getMissionById } from '../services/missionService';

import PhishingSimulation from '../components/simulations/PhishingSimulation';
import PasswordSimulation from '../components/simulations/PasswordSimulation';
import NetworkSimulation from '../components/simulations/NetworkSimulation';
import MalwareSimulation from '../components/simulations/MalwareSimulation';
import IncidentResponseSimulation from '../components/simulations/IncidentResponseSimulation';
import AIAssistant from '../components/AIAssistant';

const Simulation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [mission, setMission] = useState(null);
  const [simulationItems, setSimulationItems] = useState([]);
  const [evidenceData, setEvidenceData] = useState([]);
  
  // Player decisions: { itemId: 'decision' }
  const [decisions, setDecisions] = useState({});

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [simRes, missionRes] = await Promise.all([
        getSimulation(id),
        getMissionById(id)
      ]);
      
      if (simRes.data && simRes.data.items) {
        setSimulationItems(simRes.data.items);
        if (simRes.data.evidence) {
          setEvidenceData(simRes.data.evidence);
        }
      } else {
        throw new Error('Invalid simulation data structure.');
      }
      
      if (missionRes.data) {
        setMission(missionRes.data);
      } else {
        throw new Error('Mission not found.');
      }
      
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load simulation.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      // Format decisions array
      const decisionsArray = Object.keys(decisions).map(key => ({
        itemId: key,
        decision: decisions[key]
      }));

      const res = await submitSimulation(id, decisionsArray);
      
      if (res.data) {
        // Navigate to result page
        navigate(`/missions/${id}/result`, { 
          state: { 
            resultData: res.data, 
            mission: { title: mission.title, _id: id } 
          } 
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to submit simulation.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="cybershield-container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading simulation interface...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cybershield-container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '4rem', borderRadius: '8px' }}>
          <h2 style={{ color: 'var(--accent-red)', marginBottom: '1rem' }}>ERROR</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <button onClick={() => navigate('/missions')} className="btn btn-outline" style={{ marginTop: '2rem' }}>[ RETURN TO MISSIONS ]</button>
        </div>
      </div>
    );
  }

  if (!mission || !mission.simulationType) {
    return (
      <div className="cybershield-container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Simulation type not recognized.</p>
      </div>
    );
  }

  const completedCount = Object.keys(decisions).length;
  const totalItems = simulationItems.length;
  const progressPercent = (completedCount / totalItems) * 100;

  return (
    <div className="cybershield-container" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Header & Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>{mission.title}</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0', fontSize: '0.9rem', textTransform: 'uppercase' }}>
            {mission.simulationType.replace('-', ' ')} Simulation Engine
          </p>
        </div>
        
        {mission.simulationType !== 'incident-response' && (
          <div style={{ textAlign: 'right', minWidth: '200px' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Investigation Progress: {completedCount} / {totalItems}
            </div>
            <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPercent}%`, background: 'var(--accent-cyan)', transition: 'width 0.3s ease' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Render Appropriate Subcomponent based on simulationType */}
      {mission.simulationType === 'phishing' && (
        <PhishingSimulation 
          data={simulationItems} 
          evidence={evidenceData}
          decisions={decisions} 
          setDecisions={setDecisions} 
          onSubmit={handleSubmit} 
          submitting={submitting} 
        />
      )}
      
      {mission.simulationType === 'password' && (
        <PasswordSimulation 
          data={simulationItems} 
          evidence={evidenceData}
          decisions={decisions} 
          setDecisions={setDecisions} 
          onSubmit={handleSubmit} 
          submitting={submitting} 
        />
      )}

      {mission.simulationType === 'network' && (
        <NetworkSimulation 
          data={simulationItems} 
          evidence={evidenceData}
          decisions={decisions} 
          setDecisions={setDecisions} 
          onSubmit={handleSubmit} 
          submitting={submitting} 
        />
      )}

      {mission.simulationType === 'malware' && (
        <MalwareSimulation 
          data={simulationItems} 
          evidence={evidenceData}
          decisions={decisions} 
          setDecisions={setDecisions} 
          onSubmit={handleSubmit} 
          submitting={submitting} 
        />
      )}

      {mission.simulationType === 'incident-response' && (
        <IncidentResponseSimulation 
          data={simulationItems} 
          evidence={evidenceData}
          decisions={decisions} 
          setDecisions={setDecisions} 
          onSubmit={handleSubmit} 
          submitting={submitting} 
        />
      )}

      {/* AI Assistant Context Integration */}
      <AIAssistant contextData={{
        simulationType: mission.simulationType,
        missionId: mission._id,
        evidenceAvailable: evidenceData.length > 0
      }} />
    </div>
  );
};

export default Simulation;
