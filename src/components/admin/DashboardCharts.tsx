'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, AreaChart, Area, CartesianGrid, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  RadialBarChart, RadialBar,
} from 'recharts';

// ── Types passed from server ──────────────────────────────────────────────────
export type DashboardChartsProps = {
  projectsByCategory: { category: string; count: number }[];
  projectsByYear:     { year: string; published: number; draft: number }[];
  messagesByMonth:    { month: string; messages: number }[];
  projectStatus:      { name: string; value: number }[];
  topTags:            { tag: string; count: number }[];
  contentCompletion:  { subject: string; fullMark: number; value: number }[];
  activityByMonth:    { month: string; projets: number; messages: number }[];
};

// ── Palette ───────────────────────────────────────────────────────────────────
const G = '#4ade80';   // green-app
const B = '#60a5fa';   // blue
const Y = '#facc15';   // yellow
const P = '#a78bfa';   // purple
const T = '#2dd4bf';   // teal
const O = '#fb923c';   // orange
const COLORS = [G, B, Y, P, T, O, '#f472b6', '#e879f9'];

// ── Shared tooltip ────────────────────────────────────────────────────────────
const TT = {
  contentStyle: {
    background: '#18181b', border: '1px solid #27272a',
    borderRadius: '10px', fontSize: '12px', color: '#e4e4e7',
  },
  cursor: { fill: 'rgba(255,255,255,0.04)' },
};

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs shadow-xl">
      {label && <p className="text-zinc-400 mb-1 font-medium">{label}</p>}
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

// ── Wrappers ──────────────────────────────────────────────────────────────────
function Title({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">{children}</p>;
}
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 ${className}`}>
      {children}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function DashboardCharts({
  projectsByCategory, projectsByYear, messagesByMonth,
  projectStatus, topTags, contentCompletion, activityByMonth,
}: DashboardChartsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Statistiques</h2>

      {/* ── Row 1 : projets par catégorie + statut donut ── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {projectsByCategory.length > 0 && (
          <Card className="lg:col-span-2">
            <Title>Projets par catégorie</Title>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={projectsByCategory} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="category" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} width={24} />
                <Tooltip {...TT} content={<CustomTooltip />} />
                <Bar dataKey="count" name="Projets" radius={[6, 6, 0, 0]}>
                  {projectsByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {projectStatus.some((s) => s.value > 0) && (
          <Card>
            <Title>État des projets</Title>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={110} height={110}>
                <PieChart>
                  <Pie data={projectStatus} cx="50%" cy="50%" innerRadius={30} outerRadius={50}
                    paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {projectStatus.map((_, i) => <Cell key={i} fill={i === 0 ? G : Y} />)}
                  </Pie>
                  <Tooltip {...TT} content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2">
                {projectStatus.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: i === 0 ? G : Y }} />
                    <span className="text-xs text-zinc-400">{s.name}</span>
                    <span className="text-xs font-bold text-zinc-200 ml-auto pl-2">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* ── Row 2 : activité globale (area) + projets par an ── */}
      <div className="grid sm:grid-cols-2 gap-4">

        <Card>
          <Title>Activité — 6 derniers mois</Title>
          <ResponsiveContainer width="100%" height={165}>
            <AreaChart data={activityByMonth}>
              <defs>
                <linearGradient id="gProj" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={G} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={G} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gMsg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={B} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={B} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} width={24} />
              <Tooltip {...TT} content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#71717a', paddingTop: '8px' }} />
              <Area type="monotone" dataKey="projets" name="Projets" stroke={G} strokeWidth={2} fill="url(#gProj)"
                dot={{ fill: G, r: 2.5, strokeWidth: 0 }} activeDot={{ r: 4, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="messages" name="Messages" stroke={B} strokeWidth={2} fill="url(#gMsg)"
                dot={{ fill: B, r: 2.5, strokeWidth: 0 }} activeDot={{ r: 4, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {projectsByYear.length > 0 && (
          <Card>
            <Title>Projets par année</Title>
            <ResponsiveContainer width="100%" height={165}>
              <BarChart data={projectsByYear} barCategoryGap="30%" barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="year" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} width={24} />
                <Tooltip {...TT} content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#71717a', paddingTop: '8px' }} />
                <Bar dataKey="published" name="Publiés"    fill={G} radius={[4, 4, 0, 0]} />
                <Bar dataKey="draft"     name="Brouillons" fill={Y} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      {/* ── Row 3 : radar (répartition) + radial (complétion) ── */}
      <div className="grid sm:grid-cols-2 gap-4">

        {contentCompletion.length > 0 && (
          <Card>
            <Title>Complétion du portfolio</Title>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={contentCompletion} outerRadius={70}>
                <PolarGrid stroke="#27272a" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 10 }} />
                <Radar name="Rempli" dataKey="value" stroke={G} fill={G} fillOpacity={0.2} strokeWidth={2} />
                <Tooltip {...TT} content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {projectsByCategory.length > 0 && (
          <Card>
            <Title>Répartition catégories</Title>
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart
                innerRadius="20%"
                outerRadius="90%"
                data={projectsByCategory.slice(0, 6).map((d, i) => ({
                  ...d,
                  fill: COLORS[i % COLORS.length],
                }))}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar
                  dataKey="count"
                  cornerRadius={4}
                  label={{ position: 'insideStart', fill: 'rgba(255,255,255,0.6)', fontSize: 9 }}
                />
                <Tooltip {...TT} content={<CustomTooltip />} />
                <Legend
                  iconSize={8}
                  wrapperStyle={{ fontSize: '10px', color: '#71717a', paddingTop: '4px' }}
                  formatter={(value) => value}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      {/* ── Row 4 : top tags (horizontal bar) ── */}
      {topTags.length > 0 && (
        <Card>
          <Title>Top technologies / tags</Title>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={topTags} layout="vertical" barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="tag" tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip {...TT} content={<CustomTooltip />} />
              <Bar dataKey="count" name="Projets" radius={[0, 6, 6, 0]}>
                {topTags.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
}
