import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  History,
  MessageSquare,
  Play,
  Plus,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';

function Toast({ message, visible, onClose }) {
  useEffect(() => {
    if (!visible) return undefined;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [visible, onClose]);

  return (
    <div className={`toast ${visible ? 'visible' : ''}`}>
      <span className="toast-icon">
        <CheckCircle2 size={16} />
      </span>
      <span>{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Close notification">
        <X size={16} />
      </button>
    </div>
  );
}

export default function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [automationRunCount, setAutomationRunCount] = useState(0);
  const [newMember, setNewMember] = useState({ name: '', expiry: '', phone: '' });

  const [metrics, setMetrics] = useState({
    totalMembers: 150,
    expiringThisWeek: 12,
    renewalRate: 78,
    revenueSaved: 2800,
    potentialRevenue: 4300,
  });

  const [members, setMembers] = useState([
    { id: 1, name: 'John', expiry: 'May 30', status: 'Pending', phone: '+1 (555) 019-2834' },
    { id: 2, name: 'Sarah', expiry: 'May 28', status: 'Reminder Sent', phone: '+1 (555) 014-9821' },
    { id: 3, name: 'Mike', expiry: 'June 2', status: 'Renewed', phone: '+1 (555) 017-4839' },
  ]);

  const [logs, setLogs] = useState([
    { id: 1, type: 'Follow-up', title: 'Automated follow-up completed', desc: 'Sent follow-up message to 4 members with no replies in 48 hours.', time: 'Today 9:00 AM', status: 'success' },
    { id: 2, type: 'Reminder', title: 'Subscription renewal reminders sent', desc: 'Checked member list: sent 12 automated WhatsApp alerts for expiries in 7 days.', time: 'Today 9:00 AM', status: 'success' },
    { id: 3, type: 'Renewal', title: 'Member renewal confirmed', desc: 'Mike replied YES to reminder. Subscription renewed automatically.', time: 'Yesterday 4:15 PM', status: 'success' },
  ]);

  const remindersSent = useMemo(() => 12 + automationRunCount, [automationRunCount]);

  const scrollToDashboard = () => {
    document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRunAutomation = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setShowSuccessBanner(true);
      setShowToast(true);
      setAutomationRunCount((prev) => prev + 1);
      setMembers((prev) =>
        prev.map((member) =>
          member.status === 'Pending' ? { ...member, status: 'Reminder Sent' } : member
        )
      );
      setMetrics((prev) => ({
        ...prev,
        renewalRate: 81,
        revenueSaved: 2950,
        expiringThisWeek: Math.max(prev.expiringThisWeek - 1, 0),
      }));
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLogs((prev) => [
        { id: Date.now(), type: 'Run', title: 'Automation Completed', desc: 'Sent renewal reminders to all pending memberships expiring soon.', time: `Today ${timeStr}`, status: 'success' },
        ...prev,
      ]);
    }, 2000);
  };

  const handleAddMember = (event) => {
    event.preventDefault();
    if (!newMember.name.trim() || !newMember.expiry.trim()) return;

    const member = {
      id: Date.now(),
      name: newMember.name.trim(),
      expiry: newMember.expiry.trim(),
      phone: newMember.phone.trim() || 'Not provided',
      status: 'Pending',
    };

    setMembers((prev) => [member, ...prev]);
    setMetrics((prev) => ({
      ...prev,
      totalMembers: prev.totalMembers + 1,
      expiringThisWeek: prev.expiringThisWeek + 1,
      potentialRevenue: prev.potentialRevenue + 300,
    }));
    setLogs((prev) => [
      { id: Date.now() + 1, type: 'Member', title: 'New member added', desc: `${member.name} was added to renewal tracking.`, time: 'Just now', status: 'success' },
      ...prev,
    ]);
    setNewMember({ name: '', expiry: '', phone: '' });
    setShowToast(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="badge badge-pending">Pending</span>;
      case 'Reminder Sent':
        return <span className="badge badge-sent">Reminder Sent</span>;
      case 'Renewed':
        return <span className="badge badge-renewed">Renewed</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="site-shell">
      <Toast
        message={automationRunCount > 0 ? '12 reminders sent successfully' : 'Member saved successfully'}
        visible={showToast}
        onClose={() => setShowToast(false)}
      />

      <section className="hero-page" id="home">
        <nav className="hero-nav glass-panel">
          <div className="hero-logo">
            <span className="hero-logo-mark">G</span>
            <span>GymFlow</span>
          </div>
          <div className="hero-links">
            <a href="#home">Home</a>
            <a href="#dashboard">Dashboard</a>
            <a href="#members">Members</a>
            <a href="#analytics">Analytics</a>
          </div>
          <button className="glass-button nav-cta" onClick={scrollToDashboard}>
            Open Dashboard
          </button>
        </nav>

        <div className="hero-content">
          <p className="hero-kicker">Automated retention for modern fitness studios</p>
          <h1>Renewals handled before members drift away.</h1>
          <p className="hero-subtext">
            GymFlow watches expiring memberships, triggers WhatsApp reminders, logs follow-ups,
            and keeps your revenue recovery visible in one focused dashboard.
          </p>
          <div className="hero-actions">
            <button className="hero-primary" onClick={scrollToDashboard}>
              View Dashboard
            </button>
            <button className="hero-secondary" onClick={handleRunAutomation} disabled={isRunning}>
              <Play size={16} fill="currentColor" />
              {isRunning ? 'Running...' : 'Test Automation'}
            </button>
          </div>
          <p className="hero-trust">Free for your first 60 days. No credit card required.</p>
        </div>
      </section>

      <section className="dashboard-page" id="dashboard">
        <div className="dashboard-wrap">
          {showSuccessBanner && (
            <div className="success-banner">
              <div className="success-banner-left">
                <CheckCircle2 size={20} />
                <span>Automation completed — 12 reminders sent</span>
              </div>
              <button className="close-banner-btn" onClick={() => setShowSuccessBanner(false)} aria-label="Close banner">
                <X size={18} />
              </button>
            </div>
          )}

          {/* PAGE 2 KICKER REMOVED */}
          <header className="dashboard-header">
            <div>
              <h2>GymFlow Dashboard</h2>
              <p>Monitor membership renewals, outreach logs, and recovery analytics.</p>
            </div>
            <button className="btn btn-primary" onClick={handleRunAutomation} disabled={isRunning}>
              <Play size={16} fill="currentColor" />
              {isRunning ? 'Processing...' : 'Run Automation'}
            </button>
          </header>

          <div className="metrics-grid">
            <MetricCard label="Total Members" value={metrics.totalMembers} icon={<Users size={18} />} />
            <MetricCard label="Expiring This Week" value={metrics.expiringThisWeek} trend="-8.3%" icon={<Clock size={18} />} />
            <MetricCard label="Renewal Rate" value={`${metrics.renewalRate}%`} trend={automationRunCount > 0 ? '+6%' : undefined} icon={<TrendingUp size={18} />} />
            <MetricCard label="Revenue Saved" value={`$${metrics.revenueSaved}`} trend={automationRunCount > 0 ? '+$350' : undefined} icon={<DollarSign size={18} />} />
            <MetricCard label="Potential Revenue" value={`$${metrics.potentialRevenue.toLocaleString()}`} icon={<DollarSign size={18} />} highlight note="From pending and at-risk members" />
          </div>

          <div className="dashboard-grid">
            <section className="card form-card" id="members">
              <div className="card-heading">
                <div>
                  <h3>Add Member</h3>
                  <p>Add a new member to renewal tracking.</p>
                </div>
                <Plus size={18} />
              </div>
              <form className="member-form" onSubmit={handleAddMember}>
                <label>
                  Member name
                  <input
                    value={newMember.name}
                    onChange={(event) => setNewMember((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="Priya Sharma"
                  />
                </label>
                <label>
                  Expiry date
                  <input
                    value={newMember.expiry}
                    onChange={(event) => setNewMember((prev) => ({ ...prev, expiry: event.target.value }))}
                    placeholder="June 12"
                  />
                </label>
                <label>
                  WhatsApp number
                  <input
                    value={newMember.phone}
                    onChange={(event) => setNewMember((prev) => ({ ...prev, phone: event.target.value }))}
                    placeholder="+91 98765 43210"
                  />
                </label>
                <button className="btn btn-primary" type="submit">
                  <Plus size={16} />
                  Add Member
                </button>
              </form>
            </section>

            <section className="card action-card">
              <div>
                <h3>Automatic Renewal Follow-ups are Active</h3>
                <p>
                  GymFlow scans your membership sheet daily, triggers WhatsApp reminders
                  7 days prior to expiry, and processes replies.
                </p>
                <span className="whatsapp-line">
                  <MessageSquare size={14} />
                  WhatsApp renewal reminders sent automatically
                </span>
              </div>
              <button className="btn btn-primary" onClick={handleRunAutomation} disabled={isRunning}>
                {isRunning ? 'Processing...' : 'Test Run'}
              </button>
            </section>
          </div>

          <section className="card table-card">
            <div className="card-heading">
              <div>
                <h3>Members Table</h3>
                <p>Track individual memberships, expiry dates, and outreach status.</p>
              </div>
              <Calendar size={18} />
            </div>
            <div className="table-container">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Member Name</th>
                    <th>Expiry Date</th>
                    <th>Phone</th>
                    <th>Outreach Status</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id}>
                      <td className="member-name">{member.name}</td>
                      <td>{member.expiry}</td>
                      <td>{member.phone}</td>
                      <td>{getStatusBadge(member.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card logs-card">
            <div className="card-heading">
              <div>
                <h3>Automation Logs</h3>
                <p>Detailed records of automated notifications and system runs.</p>
              </div>
              <History size={18} />
            </div>
            <div className="log-summary-grid">
              <MiniStat label="Reminders Sent" value={remindersSent} />
              <MiniStat label="Follow-ups Completed" value="4" />
              <MiniStat label="Last Run Status" value={automationRunCount > 0 ? 'Just Now' : '9:00 AM'} />
            </div>
            <div className="logs-list">
              {logs.map((log) => (
                <div key={log.id} className="log-item">
                  <div className="log-icon-container success">
                    {log.type === 'Follow-up' && <MessageSquare size={16} />}
                    {log.type === 'Reminder' && <Clock size={16} />}
                    {log.type === 'Renewal' && <CheckCircle2 size={16} />}
                    {log.type === 'Run' && <Sparkles size={16} />}
                    {log.type === 'Member' && <Users size={16} />}
                  </div>
                  <div className="log-content">
                    <div className="log-header-row">
                      <h4>{log.title}</h4>
                      <span>{log.time}</span>
                    </div>
                    <p>{log.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="analytics-section" id="analytics">
            <div className="card chart-card">
              <div className="card-heading">
                <div>
                  <h3>Renewal Rate</h3>
                  <p>Percentage of expiring memberships successfully renewed.</p>
                </div>
                <BarChart3 size={18} />
              </div>
              <div className="chart-visual-wrapper">
                <div className="chart-donut-container">
                  <svg width="180" height="180" viewBox="0 0 180 180" className="donut-svg">
                    <circle cx="90" cy="90" r="75" fill="none" stroke="var(--bg-tertiary)" strokeWidth="10" />
                    <circle
                      cx="90"
                      cy="90"
                      r="75"
                      fill="none"
                      stroke="var(--text-primary)"
                      strokeWidth="10"
                      strokeDasharray={2 * Math.PI * 75}
                      strokeDashoffset={2 * Math.PI * 75 * (1 - metrics.renewalRate / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="donut-label-wrapper">
                    <span>{metrics.renewalRate}%</span>
                    <small>Target: 85%</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="card chart-card">
              <div className="card-heading">
                <div>
                  <h3>Members at Risk</h3>
                  <p>Expiries broken down by urgency level.</p>
                </div>
                <Users size={18} />
              </div>
              <RiskBar label="Expiring Tomorrow (Critical)" count={members.filter((m) => m.name === 'Sarah' && m.status !== 'Renewed').length} max={1} color="#EF4444" />
              <RiskBar label="Expiring in 5 Days (Pending)" count={members.filter((m) => m.name === 'John' && m.status === 'Pending').length} max={1} color="#F59E0B" />
              <RiskBar label="Outreach Active / Reminder Sent" count={members.filter((m) => m.status === 'Reminder Sent').length} max={members.length || 1} color="#2563EB" />
            </div>

            <div className="card chart-card revenue-chart">
              <div className="card-heading">
                <div>
                  <h3>Revenue Saved Trend</h3>
                  <p>Cumulative value of membership renewals secured by automated notifications.</p>
                </div>
                <DollarSign size={18} />
              </div>
              <div className="chart-visual-wrapper">
                <svg width="100%" height="220" viewBox="0 0 600 220" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--text-primary)" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="var(--text-primary)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[20, 70, 120, 170].map((y) => (
                    <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="var(--border-color)" strokeDasharray="4 4" />
                  ))}
                  <path d={`M 0 170 Q 150 140 300 120 T 450 70 T 600 ${metrics.revenueSaved === 2800 ? 50 : 25}`} fill="none" stroke="var(--text-primary)" strokeWidth="2.5" />
                  <path d={`M 0 170 Q 150 140 300 120 T 450 70 T 600 ${metrics.revenueSaved === 2800 ? 50 : 25} L 600 210 L 0 210 Z`} fill="url(#gradient-area)" />
                  <circle cx="600" cy={metrics.revenueSaved === 2800 ? 50 : 25} r="5" fill="var(--text-primary)" />
                </svg>
              </div>
            </div>
          </section>
        </div>
      </section>

      {isRunning && (
        <div className="loading-overlay">
          <div className="loading-card">
            <div className="spinner" />
            <div>
              <h4 className="loading-title">Scanning Subscriptions</h4>
              <p className="loading-subtitle">Checking records, verifying expiries, and dispatching WhatsApp reminders...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, trend, icon, highlight = false, note }) {
  return (
    <div className={`card metric-card ${highlight ? 'highlight' : ''}`}>
      <div className="metric-top">
        <span>{label}</span>
        <div className="metric-icon">{icon}</div>
      </div>
      <div className="metric-value-row">
        <strong>{value}</strong>
        {trend && <span>{trend}</span>}
      </div>
      {note && <p>{note}</p>}
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="mini-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function RiskBar({ label, count, max, color }) {
  const width = `${Math.min((count / max) * 100, 100)}%`;
  return (
    <div className="risk-item">
      <div className="risk-row">
        <span>{label}</span>
        <strong>{count} member{count !== 1 ? 's' : ''}</strong>
      </div>
      <div className="risk-track">
        <div className="risk-fill" style={{ width, backgroundColor: color }} />
      </div>
    </div>
  );
}
