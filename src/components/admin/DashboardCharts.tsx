'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, LineChart, Line, CartesianGrid, Legend,
} from 'recharts';

// ── Types passed from server ──────────────────────────────────────────────────
export type DashboardChartsProps = {
  projectsByCategory: { category: string; count: number }[];
  projectsByYear: { year: string; published: number; draft: number }[];
  messagesByMonth: { month: string; messages: number }[];
  projectStatus: { name: string; value: number }[];
  topTags: { tag: string; count: number }[];
};

// ── Colour palette (cohesive with the zinc/green admin theme) ─────────────────
const ACCENT = '#4ade80';      // green-app
const BLUE   = '#60a5fa';
const YELLOW = '#facc15';
const PURPLE = '#a78bfa';
const PINK   = '#f472b6';
const TEAL   = '#2dd4bf';

const BAR_COLORS = [ACCENT, BLUE, YELLOW, PURPLE, PINK, TEAL];

const tooltipStyle = {
  contentStyle: {
    background: '#18181b',
    border: '1px solid #27272a',
    borderRadius: '10px',
    fontSize: '12px',
    color: '#e4e4e7',
  },
  cursor: { fill: 'rgba(255,255,255,0.04)' },
};

// ── Small section title ───────────────────────────────────────────────────────
function ChartTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">
      {children}
    </p>
  );
}

// ── Card wrapper ──────────────────────────────────────────────────────────────
function ChartCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 ${className}`}>
      {children}
    </div>
  );
}

// ── Custom tooltip label ──────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs shadow-xl">
      {label && <p className="text-zinc-400 mb-1">{label}</p>}
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DashboardCharts({
  projectsByCategory,
  projectsByYear,
  messagesByMonth,
  projectStatus,
  topTags,
}: DashboardChartsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
        Statistiques
      </h2>

      {/* Row 1: Projects by category + Project status */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Projects by category */}
        {projectsByCategory.length > 0 && (
          <ChartCard className="lg:col-span-2">
            <ChartTitle>Projets par catégorie</ChartTitle>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={projectsByCategory} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="category"
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  width={24}
                />
                <Tooltip {...tooltipStyle} content={<CustomTooltip />} />
                <Bar dataKey="count" name="Projets" radius={[6, 6, 0, 0]}>
                  {projectsByCategory.map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* Project status donut */}
        {projectStatus.some((s) => s.value > 0) && (
          <ChartCard>
            <ChartTitle>État des projets</ChartTitle>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie
                    data={projectStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={32}
                    outerRadius={52}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {projectStatus.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? ACCENT : YELLOW} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2">
                {projectStatus.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: i === 0 ? ACCENT : YELLOW }}
                    />
                    <span className="text-xs text-zinc-400">{s.name}</span>
                    <span className="text-xs font-bold text-zinc-200 ml-auto pl-2">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        )}
      </div>

      {/* Row 2: Messages over time + Projects per year */}
      <div className="grid sm:grid-cols-2 gap-4">

        {/* Messages over last 6 months */}
        {messagesByMonth.length > 0 && (
          <ChartCard>
            <ChartTitle>Messages reçus (6 mois)</ChartTitle>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={messagesByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  width={24}
                />
                <Tooltip {...tooltipStyle} content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="messages"
                  name="Messages"
                  stroke={BLUE}
                  strokeWidth={2.5}
                  dot={{ fill: BLUE, r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* Projects published/draft per year */}
        {projectsByYear.length > 0 && (
          <ChartCard>
            <ChartTitle>Projets par année</ChartTitle>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={projectsByYear} barCategoryGap="30%" barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  width={24}
                />
                <Tooltip {...tooltipStyle} content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '11px', color: '#71717a', paddingTop: '8px' }}
                />
                <Bar dataKey="published" name="Publiés" fill={ACCENT} radius={[4, 4, 0, 0]} />
                <Bar dataKey="draft" name="Brouillons" fill={YELLOW} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>

      {/* Row 3: Top tags */}
      {topTags.length > 0 && (
        <ChartCard>
          <ChartTitle>Top technologies / tags</ChartTitle>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={topTags} layout="vertical" barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: '#71717a', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="tag"
                tick={{ fill: '#a1a1aa', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip {...tooltipStyle} content={<CustomTooltip />} />
              <Bar dataKey="count" name="Projets" radius={[0, 6, 6, 0]}>
                {topTags.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  );
}
