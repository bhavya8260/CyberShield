import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getMyProgress, getDailyChallenge, getMySkills, getMyRecommendations } from '../services/userService';
import { getHistory } from '../services/historyService';
import { Shield, Play, TrendingUp, Target, Award, Clock, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [progress, setProgress] = useState(null);
  const [daily, setDaily] = useState(null);
  const [skillsData, setSkillsData] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [progRes, dailyRes, skillsRes, recRes, histRes] = await Promise.all([
          getMyProgress(),
          getDailyChallenge().catch(() => null),
          getMySkills().catch(() => null),
          getMyRecommendations().catch(() => null),
          getHistory().catch(() => null)
        ]);
        
        if (progRes.success) setProgress(progRes.data);
        if (dailyRes && dailyRes.success) setDaily(dailyRes.data);
        if (skillsRes && skillsRes.success) setSkillsData(skillsRes.data);
        if (recRes && recRes.success) setRecommendation(recRes.data);
        if (histRes && histRes.success) setHistory(histRes.data.slice(0, 3)); // Only latest 3
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>Loading Command Center...</div>;
  if (error) return <div className="container" style={{ textAlign: 'center', padding: '4rem', color: 'var(--accent-red)' }}>{error}</div>;

  const progressPercent = progress.nextLevelXP ? (progress.totalXP / progress.nextLevelXP) * 100 : 100;

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem' }}>Command Center</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: 0 }}>Welcome back, <span style={{ color: 'var(--accent-cyan)' }}>{user?.username}</span></p>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Current Streak</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>🔥 {progress.currentStreak} Days</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Global Rank</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Top 15%</div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Progress & Next Action - spanning 8 cols */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ flex: 1, background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Level {progress.level}</span>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-cyan)' }}>{progress.totalXP} / {progress.nextLevelXP || 'MAX'} XP</span>
              </div>
              <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                <div style={{ height: '100%', width: `${Math.min(progressPercent, 100)}%`, background: 'var(--accent-cyan)', boxShadow: '0 0 10px var(--accent-cyan)' }}></div>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Complete missions to reach Level {progress.level + 1}</div>
            </div>

            <div style={{ flex: 1, background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>{progress.completedMissions}</h3>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Missions Completed</div>
              </div>
              <Shield size={40} color="var(--accent-purple)" opacity={0.5} />
            </div>
          </div>

          {/* Continue Learning Banner */}
          {recommendation && (
            <div style={{ background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.1), rgba(6, 182, 212, 0.1))', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(74, 222, 128, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Target size={18} color="#4ade80" />
                  <span style={{ color: '#4ade80', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Recommended Action</span>
                </div>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>Improve your {recommendation.improve.replace(/([A-Z])/g, ' $1').trim()} skills</h2>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{recommendation.reason}</p>
              </div>
              <Link to="/learn" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}>
                <Play size={18} fill="currentColor" /> Continue Learning
              </Link>
            </div>
          )}
        </div>

        {/* Right Sidebar - spanning 4 cols */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Daily Challenge */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, padding: '0.5rem', background: '#f59e0b', color: '#000', fontSize: '0.75rem', fontWeight: 'bold', borderBottomLeftRadius: '8px' }}>DAILY</div>
            <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Target size={20} color="#f59e0b" /> Today's Mission</h3>
            {daily ? (
              <>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{daily.title}</div>
                <div style={{ color: '#4ade80', fontSize: '0.9rem', marginBottom: '1.5rem' }}>+{daily.bonusXP} Bonus XP</div>
                {progress.dailyChallengeClaimed ? (
                  <div style={{ padding: '0.75rem', textAlign: 'center', background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', borderRadius: '4px', fontWeight: 'bold' }}>COMPLETED</div>
                ) : (
                  <Link to={`/missions/${daily.missionId}`} className="btn btn-outline" style={{ display: 'block', textAlign: 'center', width: '100%' }}>ACCEPT CHALLENGE</Link>
                )}
              </>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Check back later for a new challenge.</p>
            )}
          </div>

          {/* Recent Activity */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={20} color="var(--accent-cyan)" /> Recent Activity</h3>
              <Link to="/history" style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', textDecoration: 'none' }}>View All</Link>
            </div>
            {history.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {history.map(item => (
                  <div key={item._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.missionId?.title}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span>{item.score} pts</span>
                      <span style={{ color: '#4ade80' }}>+{item.xpEarned} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No recent activity.</p>
            )}
          </div>

        </div>
      </div>

      {/* Skills & Achievements Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
        
        {/* Skills radar/bars */}
        <div style={{ gridColumn: 'span 6', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><TrendingUp size={20} color="var(--accent-cyan)" /> Competency Profile</h3>
            <Link to="/skills" style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', textDecoration: 'none' }}>Details</Link>
          </div>
          {skillsData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {Object.entries(skillsData.skills).map(([key, val]) => (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span style={{ color: 'var(--accent-cyan)' }}>{val}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${val}%`, background: 'var(--accent-cyan)' }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>Complete simulations to build your skill profile.</p>
          )}
        </div>

        {/* Top Achievements */}
        <div style={{ gridColumn: 'span 6', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Award size={20} color="var(--accent-purple)" /> Achievements</h3>
            <Link to="/profile" style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', textDecoration: 'none' }}>View All ({progress.achievementsUnlocked}/{progress.achievementsTotal})</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {progress.allAchievements.slice(0, 4).map(ach => {
              const unlocked = progress.achievements.find(a => a.achievementId === ach.id);
              return (
                <div key={ach.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  padding: '1rem', 
                  background: unlocked ? 'rgba(74, 222, 128, 0.05)' : 'rgba(255,255,255,0.02)', 
                  border: `1px solid ${unlocked ? 'rgba(74, 222, 128, 0.2)' : 'var(--border-subtle)'}`,
                  borderRadius: '8px',
                  opacity: unlocked ? 1 : 0.6
                }}>
                  <div style={{ fontSize: '1.5rem' }}>{unlocked ? '🏆' : '🔒'}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: unlocked ? '#4ade80' : 'var(--text-primary)' }}>{ach.name}</div>
                </div>
              )
            })}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
