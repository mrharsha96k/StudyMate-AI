function Button({
  children,
  onClick,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;