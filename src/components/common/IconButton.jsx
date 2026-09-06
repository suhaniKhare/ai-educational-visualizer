import "./IconButton.css";

function IconButton({
  children,
  label,
  size = "medium",
  variant = "default",
  onClick,
  disabled = false,
  type = "button",
}) {
  return (
    <button
      type={type}
      className={`icon-button icon-button--${size} icon-button--${variant}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

export default IconButton;