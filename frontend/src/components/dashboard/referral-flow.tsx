import type { ReferralFlowEdge } from "@/lib/types";

interface ReferralFlowProps {
  flows: ReferralFlowEdge[];
}

export function ReferralFlow({ flows }: ReferralFlowProps) {
  const stages = [...new Set(flows.flatMap((flow) => [flow.source, flow.target]))];

  return (
    <section className="panel referral-panel">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">CARE COORDINATION</p>
          <h2>Conventional-care referral flow</h2>
        </div>
        <span className="panel-index">05 / PATHWAY</span>
      </div>
      <p className="panel-description">Synthetic transitions from complementary care into conventional follow-up.</p>
      {stages.length ? (
        <div className="flow-track" aria-label="Referral flow from traditional care through assessment and conventional care to follow-up">
          {stages.map((stage, index) => (
            <div className="flow-segment" key={stage}>
              <div className="flow-node">
                <span className="flow-step">0{index + 1}</span>
                <strong>{stage}</strong>
              </div>
              {index < stages.length - 1 && (
                <div className="flow-connector" aria-label={`${flows[index]?.volume ?? 0} synthetic transitions`}>
                  <span className="flow-volume">{(flows[index]?.volume ?? 0).toLocaleString()}</span>
                  <span className="flow-arrow" aria-hidden="true">→</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : <p className="panel-empty">Referral flow data is not available.</p>}
      <p className="flow-unit">Flow volumes are synthetic demonstration transitions; they are not observed referral counts.</p>
    </section>
  );
}
