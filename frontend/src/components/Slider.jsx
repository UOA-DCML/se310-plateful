// Simple dropdown component for price range selection with emerald/teal theme
export default function PriceSlider({ value, onChange, onApply }) {
  const priceOptions = [
    { min: 1, max: 5, label: "Any Price" },
    { min: 1, max: 1, label: "$" },
    { min: 2, max: 2, label: "$$" },
    { min: 3, max: 3, label: "$$$" },
    { min: 4, max: 4, label: "$$$$" },
    { min: 5, max: 5, label: "$$$$$" },
  ];

  // Find current selection
  const currentOption = priceOptions.find(
    (opt) => opt.min === value[0] && opt.max === value[1]
  );
  const currentValue = currentOption
    ? `${currentOption.min}-${currentOption.max}`
    : "1-5";

  const handleChange = (e) => {
    const [min, max] = e.target.value.split("-").map(Number);
    onChange([min, max]);
    // Auto-apply on change
    setTimeout(() => {
      onApply();
    }, 0);
  };

  return (
    <select
      value={currentValue}
      onChange={handleChange}
      className="w-full rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2.5 text-sm font-medium text-gray-700 outline-none border-2 border-emerald-200 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
    >
      {priceOptions.map((option) => (
        <option
          key={`${option.min}-${option.max}`}
          value={`${option.min}-${option.max}`}
          className="bg-white text-gray-700"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}