import "./Card.css";

function Card({
  children,
  className = "",
  variant = "default",
  onClick,
}) {
  const cardClassName = [
    "common-card",
    `common-card--${variant}`,
    onClick ? "common-card--interactive" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClassName} onClick={onClick}>
      {children}
    </div>
  );
}

export default Card;