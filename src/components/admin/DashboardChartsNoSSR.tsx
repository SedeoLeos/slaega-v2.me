'use client';

// Client wrapper — App Router only allows dynamic+ssr:false inside client components.
import dynamic from 'next/dynamic';
import type { DashboardChartsProps } from './DashboardCharts';

const DashboardCharts = dynamic(() => import('./DashboardCharts'), { ssr: false });

export default function DashboardChartsNoSSR(props: DashboardChartsProps) {
  return <DashboardCharts {...props} />;
}
