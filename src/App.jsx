import { useState } from "react";

const members = [
  { id: 1, name: "Rahul Sharma", present: 14, absent: 9, lastVisit: 6, renewalChance: 82, plan: "Monthly", status: "at-risk" },
  { id: 2, name: "Priya Mehta", present: 22, absent: 1, lastVisit: 1, renewalChance: 97, plan: "Quarterly", status: "active" },
  { id: 3, name: "Arjun Patel", present: 3, absent: 20, lastVisit: 14, renewalChance: 31, plan: "Monthly", status: "critical" },
  { id: 4, name: "Sneha Joshi", present: 18, absent: 5, lastVisit: 2, renewalChance: 91, plan: "Annual", status: "active" },
  { id: 5, name: "Vikram Singh", present: 7, absent: 16, lastVisit: 9, renewalChance: 48, plan: "Monthly", status: "at-risk" },
  { id: 6, name: "Anjali Nair", present: 1, absent: 22, lastVisit: 21, renewalChance: 12, plan: "Monthly", status: "critical" },
];

const statusConfig = {
  active: { label: "Active", bg: "#E6F4EA", color: "#1A7A3C", dot: "#22C55E" },
  "at-risk": { label: "At Risk", bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B" },
  critical: { label: "Critical", bg: "#FEE2E2", color: "#991B1B", dot: "#EF4444" },
};

function HealthBar({ value }) {
  const color = value >= 80 ? "#22C55E" : value >= 50 ? "#F59E0B" : "#EF4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: "#E4E4E7", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color, minWidth: 34, textAlign: "right" }}>{value}%</span>
    </div>
  );
}

function Avatar({ name }) {
  const initials = name.split(" ").map(n => n[0]).join("");
  const colors = ["#E0E7FF", "#FEE2E2", "#D1FAE5", "#FEF3C7", "#F3E8FF", "#FFEDD5"];
  const textColors = ["#4F46E5", "#DC2626", "#059669", "#D97706", "#9333EA", "#EA580C"];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div style={{
      width: 36, height: 36, borderRadius: "50%",
      background: colors[idx], color: textColors[idx],
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 13, fontWeight: 700, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

export default function AttendanceTracking() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? members : members.filter(m => m.status === filter);
  const atRisk = members.filter(m => m.status === "at-risk" || m.status === "critical").length;
  const avgHealth = Math.round(members.reduce((s, m) => s + m.renewalChance, 0) / members.length);

  return (
    <section style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", padding: "3rem 0" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
          <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#10B981" }}>
            Feature 1
          </span>
        </div>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.03em", color: "#09090B", marginBottom: 8 }}>
          Smart Attendance Tracking
        </h2>
        <p style={{ color: "#52525B", fontSize: "0.95rem", maxWidth: 520 }}>
          Automatically tracks member attendance and surfaces at-risk members before they stop renewing.
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Members", value: members.length, sub: "being tracked" },
          { label: "Members At Risk", value: atRisk, sub: "need attention", accent: true },
          { label: "Avg Health Score", value: `${avgHealth}%`, sub: "renewal likelihood" },
        ].map(({ label, value, sub, accent }) => (
          <div key={label} style={{
            background: accent ? "#09090B" : "#FAFAFA",
            border: `1px solid ${accent ? "#09090B" : "#E4E4E7"}`,
            borderRadius: 12, padding: "1.25rem",
          }}>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: accent ? "#A1A1AA" : "#71717A", marginBottom: 6 }}>{label}</p>
            <p style={{ fontSize: "1.75rem", fontWeight: 700, color: accent ? "#FFFFFF" : "#09090B", lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: 12, color: accent ? "#71717A" : "#A1A1AA", marginTop: 4 }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["all", "active", "at-risk", "critical"].map(tab => (
          <button key={tab} onClick={() => setFilter(tab)} style={{
            padding: "6px 14px", borderRadius: 99, fontSize: 13, fontWeight: 500, cursor: "pointer",
            border: filter === tab ? "1px solid #09090B" : "1px solid #E4E4E7",
            background: filter === tab ? "#09090B" : "transparent",
            color: filter === tab ? "#FFFFFF" : "#52525B",
            transition: "all 0.15s",
          }}>
            {tab === "all" ? "All Members" : tab.charAt(0).toUpperCase() + tab.slice(1).replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Members Table */}
      <div style={{ border: "1px solid #E4E4E7", borderRadius: 12, overflow: "hidden" }}>
        {/* Table Header */}
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1.5fr 1fr",
          padding: "10px 20px", background: "#FAFAFA",
          borderBottom: "1px solid #E4E4E7",
        }}>
          {["Member", "Present", "Absent", "Last Visit", "Health Score", "Status"].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#71717A" }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {filtered.map((m, i) => {
          const s = statusConfig[m.status];
          return (
            <div key={m.id} style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1.5fr 1fr",
              padding: "14px 20px", alignItems: "center",
              borderBottom: i < filtered.length - 1 ? "1px solid #F4F4F5" : "none",
              background: "#FFFFFF",
              transition: "background 0.1s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
              onMouseLeave={e => e.currentTarget.style.background = "#FFFFFF"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name={m.name} />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#09090B", margin: 0 }}>{m.name}</p>
                  <p style={{ fontSize: 12, color: "#A1A1AA", margin: 0 }}>{m.plan}</p>
                </div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#09090B" }}>{m.present}d</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#EF4444" }}>{m.absent}d</span>
              <span style={{ fontSize: 14, color: "#52525B" }}>{m.lastVisit}d ago</span>
              <HealthBar value={m.renewalChance} />
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 99, background: s.bg }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: s.color }}>{s.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Members At Risk callout */}
      <div style={{
        marginTop: 16, padding: "1rem 1.25rem",
        background: "#FFF7ED", border: "1px solid #FED7AA",
        borderRadius: 12, display: "flex", alignItems: "center", gap: 12,
      }}>
        <span style={{ fontSize: 20 }}>⚠️</span>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#9A3412", margin: 0 }}>
            {atRisk} members flagged for re-engagement
          </p>
          <p style={{ fontSize: 13, color: "#C2410C", margin: 0 }}>
            Automated WhatsApp messages will be triggered for at-risk members. See Feature 2 below.
          </p>
        </div>
      </div>
    </section>
  );
}
