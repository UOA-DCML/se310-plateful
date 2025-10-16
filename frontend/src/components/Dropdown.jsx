// Dropdown component for selecting options with emerald/teal theme
export default function DropdownSelect({
  label,
  options,
  value,
  onChange,
  width = "w-[120px]",
}) {
  return (
    <select
      className={`bg-gradient-to-r from-emerald-50 to-teal-50 text-sm font-medium text-gray-700 px-4 py-2.5 rounded-lg outline-none border-2 border-emerald-200 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${width}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="" className="bg-white text-gray-700">{label}</option>
      {options.map((opt) => (
        <option key={opt.value ?? opt} value={opt.value ?? opt} className="bg-white text-gray-700">
          {opt.label ?? opt}
        </option>
      ))}
    </select>
  );
}
