import type { SourceMetadata } from "@/lib/types";

interface WhoControlsRailProps {
  sources: SourceMetadata[];
}

const controlLayers = [
  { id: "01", title: "Practice & licensing", detail: "Licensing bodies define practitioner authorization and modality scope." },
  { id: "02", title: "System integration", detail: "Health authorities shape service standards and referral pathways." },
  { id: "03", title: "Care delivery", detail: "Conventional-care providers receive referrals and coordinate follow-up." },
  { id: "04", title: "Product oversight", detail: "Product regulators oversee registration and market authorization." },
];

export function WhoControlsRail({ sources }: WhoControlsRailProps) {
  const references = [
    { label: "WHO Traditional Medicine Strategy", match: "WHO Traditional Medicine Strategy", type: "Reference framework" },
    { label: "UAE MOHAP", match: "UAE MOHAP", type: "Facility licensing" },
    { label: "Dubai Health Authority", match: "Dubai Health Authority", type: "Health authority reports" },
    { label: "Saudi SFDA", match: "Saudi SFDA", type: "Product registration" },
  ].map((reference) => ({
    ...reference,
    url: sources.find((source) => source.url && source.intended_future_source.includes(reference.match))?.url,
  }));

  return (
    <section className="panel controls-panel">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">GOVERNANCE LAYER</p>
          <h2>Who controls the rail</h2>
        </div>
        <span className="panel-index">07 / STAKEHOLDERS</span>
      </div>
      <p className="panel-description">Integration depends on connected decisions across regulation, service delivery, and product oversight.</p>
      <div className="control-layers">
        {controlLayers.map((layer) => (
          <div className="control-layer" key={layer.id}>
            <span className="control-layer-id">{layer.id}</span>
            <div><strong>{layer.title}</strong><p>{layer.detail}</p></div>
          </div>
        ))}
      </div>
      <div className="source-ecosystem">
        <span className="source-ecosystem-label">INTENDED REFERENCE ECOSYSTEM</span>
        <div className="source-reference-grid">
          {references.filter((reference) => reference.url).map((reference) => (
            <a className="source-reference" href={reference.url ?? undefined} target="_blank" rel="noopener noreferrer" key={reference.label}>
              <span>{reference.label}</span>
              <small>{reference.type}<span className="source-external-icon" aria-hidden="true">↗</span></small>
            </a>
          ))}
        </div>
        <p>Reference stakeholders only. Current dashboard values are synthetic and are not sourced from these organizations.</p>
      </div>
    </section>
  );
}
