import "./SectionTitle.css";

function SectionTitle({
  title,
  subtitle,
  align = "left",
  eyebrow,
}) {
  return (
    <div className={`section-title section-title--${align}`}>
      {eyebrow && (
        <span className="section-title__eyebrow">
          {eyebrow}
        </span>
      )}

      <h2 className="section-title__heading">
        {title}
      </h2>

      {subtitle && (
        <p className="section-title__subtitle">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionTitle;