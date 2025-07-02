import React from "react";

const FilterButtons = ({filter, setFilter}) => {
  const filters = ["all", "completed", "pending"];
  
  return (
    <div className="flex justify-center gap-3 mb-6">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`px-3 py-1 rounded border text-sm capitalize transition ${
            filter === f
              ? "bg-accent text-bg border-accent"
              : "bg-transparent border-text text-text hover:opacity-70"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
