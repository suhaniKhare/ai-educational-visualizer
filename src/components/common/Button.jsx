import "./Button.css";

function Button({
  children,
  variant = "primary",
  size = "medium",
  onClick,
  disabled = false,
  type = "button",
}) {
  return (
    <button
      type={type}
      className={`common-button common-button--${variant} common-button--${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;