"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAdverseEvents,
  getDashboardSummary,
  getLicensingMap,
  getLicensingRankings,
  getReferralFlow,
  getSources,
  getUsageTrends,
} from "@/lib/api";
import type {
  AdverseEventsResponse,
  DashboardSummary as DashboardSummaryData,
  LicensingMapResponse,
  LicensingRankingsResponse,
  ReferralFlowResponse,
  SourcesResponse,
  UsageTrendsResponse,
} from "@/lib/types";
import { AdverseEvents } from "@/components/dashboard/adverse-events";
import { ComplianceTable } from "@/components/dashboard/compliance-table";
import { DashboardFilters, type PeriodLength } from "@/components/dashboard/dashboard-filters";
import { DataProvenance } from "@/components/dashboard/data-provenance";
import { HowToRead } from "@/components/dashboard/how-to-read";
import { LicensingMap } from "@/components/dashboard/licensing-map";
import { ReferralFlow } from "@/components/dashboard/referral-flow";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { UsageTrends } from "@/components/dashboard/usage-trends";
import { WhyThisMatters } from "@/components/dashboard/why-this-matters";
import { WhoControlsRail } from "@/components/dashboard/who-controls-rail";

interface DashboardData {
  summary: DashboardSummaryData;
  licensingMap: LicensingMapResponse;
  usage: UsageTrendsResponse;
  adverseEvents: AdverseEventsResponse;
  rankings: LicensingRankingsResponse;
  referralFlow: ReferralFlowResponse;
  sources: SourcesResponse;
}

export default function Home() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [regionCode, setRegionCode] = useState("all");
  const [modality, setModality] = useState("all");
  const [period, setPeriod] = useState<PeriodLength>(12);
  const [search, setSearch] = useState("");

  const fetchDashboardData = useCallback(() => Promise.all([
        getDashboardSummary(),
        getLicensingMap(),
        getUsageTrends(),
        getAdverseEvents(),
        getLicensingRankings(),
        getReferralFlow(),
        getSources(),
      ]), []);

  const loadDashboard = useCallback(async () => {
    try {
      const [summary, licensingMap, usage, adverseEvents, rankings, referralFlow, sources] = await fetchDashboardData();
      setError(null);
      setDashboard({ summary, licensingMap, usage, adverseEvents, rankings, referralFlow, sources });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load dashboard data.");
    }
  }, [fetchDashboardData]);

  useEffect(() => {
    let isCurrent = true;
    fetchDashboardData()
      .then(([summary, licensingMap, usage, adverseEvents, rankings, referralFlow, sources]) => {
        if (isCurrent) setDashboard({ summary, licensingMap, usage, adverseEvents, rankings, referralFlow, sources });
      })
      .catch((requestError: unknown) => {
        if (isCurrent) setError(requestError instanceof Error ? requestError.message : "Unable to load dashboard data.");
      });

    return () => { isCurrent = false; };
  }, [fetchDashboardData]);

  const modalities = useMemo(() => dashboard
    ? [...new Set(dashboard.licensingMap.regions.flatMap((region) => region.licensing.map((item) => item.modality)))]
    : [], [dashboard]);

  const resetFilters = () => {
    setRegionCode("all");
    setModality("all");
    setPeriod(12);
    setSearch("");
  };

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <a className="brand" href="#main" aria-label="Traditional Medicine Integration Tracker home">
          <span className="brand-mark" aria-hidden="true">T</span>
          <span>REAL RAILS <span className="brand-divider">/</span> POC-59</span>
        </a>
        <div className="topbar-status">
          <span className="status-label"><span className="status-dot" /> {dashboard ? "API CONNECTED" : "CONNECTING TO API"}</span>
          <span className="header-divider" />
          <span className="header-region">GULF MARKETS</span>
        </div>
      </header>

      <section className="intro" id="main" aria-labelledby="page-title">
        <div className="intro-copy">
          <p className="eyebrow">HEALTH SYSTEMS <span>·</span> INTEGRATION TRACKER</p>
          <h1 id="page-title">Traditional &amp; Complementary<br className="desktop-break" /> Medicine Integration Tracker</h1>
          <p className="subtitle">A regional view of licensing, safety signals, usage patterns, and pathways into conventional care.</p>
        </div>
        <div className="intro-side-note"><span>INTELLIGENCE BRIEF</span><strong>POC-59</strong><small>DEMONSTRATION BUILD</small></div>
      </section>

      {!dashboard && !error && (
        <div className="loading-panel" role="status"><span className="loading-mark" /> Connecting to the local synthetic data API…</div>
      )}

      {error && (
        <div className="error-panel" role="alert">
          <div><strong>Dashboard data unavailable</strong><p>{error}</p><small>Confirm the FastAPI service is running at the configured local API address.</small></div>
          <button className="retry-button" type="button" onClick={() => void loadDashboard()}>Retry connection</button>
        </div>
      )}

      {dashboard && (
        <>
          <DataProvenance sources={dashboard.sources.sources} />
          <HowToRead />
          <SummaryCards
            summary={dashboard.summary}
            events={dashboard.adverseEvents.events}
            regionCode={regionCode}
            modality={modality}
          />

          <DashboardFilters
            regions={dashboard.licensingMap.regions.map((item) => item.region)}
            modalities={modalities}
            regionCode={regionCode}
            modality={modality}
            period={period}
            search={search}
            onRegionChange={setRegionCode}
            onModalityChange={setModality}
            onPeriodChange={setPeriod}
            onSearchChange={setSearch}
            onReset={resetFilters}
          />

          <div className="dashboard-grid primary-grid">
            <LicensingMap
              regions={dashboard.licensingMap.regions}
              modality={modality}
              selectedRegion={regionCode}
              search={search}
              onRegionSelect={setRegionCode}
            />
            <UsageTrends
              observations={dashboard.usage.observations}
              modality={modality}
              regionCode={regionCode}
              period={period}
              search={search}
            />
          </div>

          <div className="dashboard-grid secondary-grid">
            <AdverseEvents events={dashboard.adverseEvents.events} regionCode={regionCode} modality={modality} search={search} />
            <ComplianceTable
              rankings={dashboard.rankings}
              regions={dashboard.licensingMap.regions}
              regionCode={regionCode}
              modality={modality}
              search={search}
            />
          </div>

          <ReferralFlow flows={dashboard.referralFlow.flows} unit={dashboard.referralFlow.unit} />

          <div className="dashboard-grid context-grid">
            <WhyThisMatters />
            <WhoControlsRail sources={dashboard.sources.sources} />
          </div>

          <footer className="footer-note">
            <span>POC-59 · REAL RAILS</span>
            <span>Illustrative analysis only · No external healthcare sources connected</span>
          </footer>
        </>
      )}
    </main>
  );
}
