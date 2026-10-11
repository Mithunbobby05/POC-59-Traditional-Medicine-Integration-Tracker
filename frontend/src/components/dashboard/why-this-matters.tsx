const reasons = [
  { number: "01", title: "Licensing visibility", copy: "See how practitioner authorization varies across regions and modalities." },
  { number: "02", title: "Usage patterns", copy: "Track where reported activity is changing and where oversight may need attention." },
  { number: "03", title: "Safety signals", copy: "Bring adverse-event reports into view alongside modality and jurisdiction." },
  { number: "04", title: "Referral pathways", copy: "Understand how complementary care connects with assessment, conventional care, and follow-up." },
];

export function WhyThisMatters() {
  return (
    <section className="panel why-panel">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">CONTEXT</p>
          <h2>Why this matters</h2>
        </div>
        <span className="panel-index">06 / RATIONALE</span>
      </div>
      <p className="why-lead">Integration needs a clear view of the systems around care.</p>
      <div className="why-list">
        {reasons.map((reason) => (
          <div className="why-item" key={reason.number}>
            <span>{reason.number}</span>
            <div><strong>{reason.title}</strong><p>{reason.copy}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}
