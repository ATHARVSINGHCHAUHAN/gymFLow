import React, { useState } from 'react';
import {
  Users,
  Clock,
  TrendingUp,
  DollarSign,
  Play,
  Calendar,
  CheckCircle2,
  History,
  BarChart3,
  Menu,
  X,
  MessageSquare,
  Sparkles,
  BadgeDollarSign
} from 'lucide-react';

function Toast({ message, visible, onClose }) {
  React.useEffect(() => {
    if (!visible) return undefined;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [visible, onClose]);

  return (
    <div className={`toast ${visible ? 'visible' : ''}`}>
      <span className="toast-icon"><CheckCircle2 size={16} /></span>
      <span>{message}</span>
      <button className="icon-button" onClick={onClose} aria-label="Close notification">
        <X size={16} />
      </button>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [automationRunCount, setAutomationRunCount] = useState(0);

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

  const navigation = [
    { id: 'dashboard', icon: <Users size={18} />, label: 'Dashboard' },
    { id: 'members', icon: <Calendar size={18} />, label: 'Members' },
    { id: 'logs', icon: <History size={18} />, label: 'Automation Logs' },
    { id: 'analytics', icon: <BarChart3 size={18} />, label: 'Analytics' },
  ];

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
        expiringThisWeek: 11,
      }));
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLogs((prev) => [
        { id: Date.now(), type: 'Run', title: 'Automation Completed', desc: 'Sent renewal reminders to all pending memberships expiring soon.', time: `Today ${timeStr}`, status: 'success' },
        ...prev,
      ]);
    }, 2000);
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

  const renderNavigation = (mobile = false) => (
    <nav className="nav-links">
      {navigation.map(({ id, icon, label }) => (
        <button
          key={id}
          className={`nav-button ${activeTab === id ? 'active' : ''}`}
          onClick={() => {
            setActiveTab(id);
            if (mobile) setIsMobileMenuOpen(false);
          }}
        >
          {icon}
          {label}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="app-container">
      <Toast
        message="12 reminders sent successfully"
        visible={showToast}
        onClose={() => setShowToast(false)}
      />

      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo-icon">G</div>
          <span className="logo-text">GymFlow</span>
        </div>
        {renderNavigation()}
        <div className="sidebar-footer">GymFlow Demo v1.0</div>
      </aside>

      <header className="mobile-header">
        <div className="logo-container mobile-logo">
          <div className="logo-icon">G</div>
          <span className="logo-text">GymFlow</span>
        </div>
        <button className="mobile-nav-toggle" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu">
          <Menu size={24} />
        </button>
      </header>

      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-sidebar open" onClick={(event) => event.stopPropagation()}>
            <div className="mobile-sidebar-header">
              <div className="logo-container mobile-logo">
                <div className="logo-icon">G</div>
                <span className="logo-text">GymFlow</span>
              </div>
              <button className="mobile-nav-toggle" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                <X size={24} />
              </button>
            </div>
            {renderNavigation(true)}
            <div className="sidebar-footer">GymFlow Demo v1.0</div>
          </div>
        </div>
      )}

      <main className="main-content">
        {showSuccessBanner && (
          <div className="success-banner">
            <div className="success-banner-left">
              <CheckCircle2 size={20} />
              <span>Automation completed</span>
            </div>
            <button className="icon-button" onClick={() => setShowSuccessBanner(false)} aria-label="Close banner">
              <X size={18} />
            </button>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div>
            <div className="page-header">
              <div className="header-title-container">
                <h1 className="page-title">GymFlow Dashboard</h1>
                <p className="page-subtitle">Monitor membership renewals and automated outreach logs.</p>
              </div>
              <button className="btn btn-primary" onClick={handleRunAutomation} disabled={isRunning}>
                <Play size={16} fill="currentColor" />
                Run Automation
              </button>
            </div>

            <div className="stats-grid five">
              <StatCard label="Total Members" value={metrics.totalMembers} icon={<Users size={16} />} />
              <StatCard label="Expiring This Week" value={metrics.expiringThisWeek} trend="-8.3%" icon={<Clock size={16} />} />
              <StatCard label="Renewal Rate" value={`${metrics.renewalRate}%`} trend={automationRunCount > 0 ? '+6%' : undefined} icon={<TrendingUp size={16} />} />
              <StatCard label="Revenue Saved" value={`$${metrics.revenueSaved}`} trend={automationRunCount > 0 ? '+$350' : undefined} icon={<DollarSign size={16} />} />
              <div className="card stat-card recovery-card">
                <div className="stat-header">
                  <span className="stat-label">Potential Revenue Recovery</span>
                  <div className="stat-icon-wrapper recovery"><BadgeDollarSign size={16} /></div>
                </div>
                <div className="stat-value-row">
                  <span className="stat-value recovery-value">${metrics.potentialRevenue.toLocaleString()}</span>
                </div>
                <div className="stat-note">From pending & at-risk members</div>
              </div>
            </div>

            <div className="action-banner">
              <div className="banner-text-container">
                <h3 className="banner-title">Automatic Renewal Follow-ups are Active</h3>
                <p className="banner-desc">
                  GymFlow scans your membership sheet daily, triggers WhatsApp reminders 7 days prior to expiry, and processes replies.
                </p>
                <p className="whatsapp-line">
                  <MessageSquare size={14} />
                  WhatsApp renewal reminders sent automatically
                </p>
              </div>
              <button className="btn btn-primary" onClick={handleRunAutomation} disabled={isRunning}>
                {isRunning ? 'Processing...' : 'Test Run Automation'}
              </button>
            </div>

            <div className="dashboard-grid-main">
              <div className="card table-card">
                <div className="section-heading">
                  <h3>Expiring Soon</h3>
                  <button className="btn btn-ghost" onClick={() => setActiveTab('members')}>View All</button>
                </div>
                <MembersTable members={members} getStatusBadge={getStatusBadge} compact />
              </div>

              <div className="card activities-card">
                <h3 className="card-title">Automation Quick Feed</h3>
                <Activity title="Daily Run Scheduler" subtitle="Runs automatically at 9:00 AM" badge="9:00 AM" />
                <Activity title="Twilio WhatsApp Sandbox" subtitle="Messaging channel active" badge="Online" success />
                <Activity title="Follow-up Window" subtitle="48 hrs without reply" extra="Next check: Tomorrow" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div>
            <PageHeader title="Members List" subtitle="Track individual memberships, expiry dates, and outreach status." />
            <div className="table-container">
              <MembersTable members={members} getStatusBadge={getStatusBadge} />
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div>
            <PageHeader title="Automation Logs" subtitle="Detailed records of automated notifications and system runs." />
            <div className="stats-grid compact">
              <StatCard label="Reminders Sent" value={12 + automationRunCount} />
              <StatCard label="Follow-ups Completed" value={4} />
              <StatCard label="Last Run Status" value="Today" note={automationRunCount > 0 ? 'Just Now' : '9:00 AM'} />
            </div>
            <div className="logs-list">
              {logs.map((log) => (
                <div key={log.id} className="log-item">
                  <div className="log-icon-container success">
                    {log.type === 'Follow-up' && <MessageSquare size={16} />}
                    {log.type === 'Reminder' && <Clock size={16} />}
                    {log.type === 'Renewal' && <CheckCircle2 size={16} />}
                    {log.type === 'Run' && <Sparkles size={16} />}
                  </div>
                  <div className="log-content">
                    <div className="log-header-row">
                      <h4 className="log-title">{log.title}</h4>
                      <span className="log-time">{log.time}</span>
                    </div>
                    <p className="log-desc">{log.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <PageHeader title="Analytics" subtitle="Real-time charts illustrating campaign performance and revenue saved." />
            <div className="charts-grid">
              <div className="card chart-card">
                <div className="chart-title-container">
                  <h3 className="chart-title">Renewal Rate</h3>
                  <p className="chart-desc">Percentage of expiring memberships successfully renewed.</p>
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
                      <span className="donut-number">{metrics.renewalRate}%</span>
                      <span className="donut-label">Target: 85%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card chart-card">
                <div className="chart-title-container">
                  <h3 className="chart-title">Members at Risk</h3>
                  <p className="chart-desc">Expiries broken down by urgency level.</p>
                </div>
                <div className="risk-list">
                  <RiskBar label="Expiring Tomorrow (Critical)" count={1} max={3} color="#EF4444" />
                  <RiskBar label="Expiring in 5 Days (Pending)" count={1} max={3} color="#F59E0B" />
                  <RiskBar label="Outreach Active / Reminder Sent" count={members.filter((m) => m.status === 'Reminder Sent').length} max={members.length} color="#2563EB" />
                </div>
              </div>

              <div className="card chart-card revenue-card">
                <div className="chart-title-container">
                  <h3 className="chart-title">Revenue Saved Trend</h3>
                  <p className="chart-desc">Cumulative value of membership renewals secured by automated notifications.</p>
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
            </div>
          </div>
        )}
      </main>

      {isRunning && (
        <div className="loading-overlay">
          <div className="loading-card">
            <div className="spinner" />
            <div>
              <h4 className="loading-title">Scanning Subscriptions</h4>
              <p className="loading-subtitle">Checking Google Sheet records, verifying expiries, and dispatching WhatsApp reminders...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PageHeader({ title, subtitle }) {
  return (
    <div className="page-header">
      <div className="header-title-container">
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, icon, note }) {
  return (
    <div className="card stat-card">
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        {icon && <div className="stat-icon-wrapper">{icon}</div>}
      </div>
      <div className="stat-value-row">
        <span className="stat-value">{value}</span>
        {trend && <span className="stat-trend positive">{trend}</span>}
      </div>
      {note && <div className="stat-note">{note}</div>}
    </div>
  );
}

function MembersTable({ members, getStatusBadge, compact = false }) {
  return (
    <table className="premium-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Expiry</th>
          <th className={compact ? 'align-right' : ''}>Status</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member) => (
          <tr key={member.id}>
            <td>
              <div className="member-name">{member.name}</div>
              {compact && <div className="member-phone">{member.phone}</div>}
            </td>
            <td>{member.expiry}</td>
            <td className={compact ? 'align-right' : ''}>{getStatusBadge(member.status)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Activity({ title, subtitle, badge, extra, success = false }) {
  return (
    <div className="activity-item">
      <div className="activity-details">
        <div className="activity-title">{title}</div>
        <div className="activity-subtitle">{subtitle}</div>
        {extra && <div className="activity-extra">{extra}</div>}
      </div>
      {badge && <span className={`badge ${success ? 'badge-renewed' : ''}`}>{badge}</span>}
    </div>
  );
}

function RiskBar({ label, count, max, color }) {
  return (
    <div>
      <div className="risk-row">
        <span>{label}</span>
        <strong>{count} member{count !== 1 ? 's' : ''}</strong>
      </div>
      <div className="risk-track">
        <div className="risk-fill" style={{ width: `${(count / max) * 100}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
