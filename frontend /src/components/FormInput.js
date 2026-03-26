function FormInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  options = [],
  placeholder,
  required = true
}) {
  const isSelect = type === "select";
  const isTextarea = type === "textarea";

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      {isSelect ? (
        <select id={name} name={name} value={value} onChange={onChange} required={required}>
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : isTextarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          required={required}
          rows={4}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          required={required}
        />
      )}
    </div>
  );
}

export default FormInput;
