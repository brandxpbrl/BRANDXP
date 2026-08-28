type MellSectionHeadingProps = {
  eyebrow: string;
  title: string;
  accent?: string;
  copy?: string;
};

export function MellSectionHeading({
  eyebrow,
  title,
  accent,
  copy,
}: MellSectionHeadingProps) {
  return (
    <div className="mell-section-heading">
      <div>
        <p className="mell-eyebrow">{eyebrow}</p>
        <h2>
          {title}
          {accent ? <span>{accent}</span> : null}
        </h2>
      </div>
      {copy ? <p>{copy}</p> : null}
    </div>
  );
}
