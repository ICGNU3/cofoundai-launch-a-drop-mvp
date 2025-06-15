
import React from "react";

export function RefinementCategorySelector({
  categories,
  activeRefiner,
  setActiveRefiner,
}: {
  categories: any[];
  activeRefiner: string;
  setActiveRefiner: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map((category) => (
        <div
          key={category.id}
          className={`cursor-pointer transition ${
            activeRefiner === category.id
              ? "border-accent bg-accent/5"
              : "hover:border-accent/50"
          } border rounded-lg`}
          onClick={() => setActiveRefiner(category.id)}
        >
          <div className="flex items-center gap-2 p-4">
            <category.icon size={16} />
            <span className="font-medium text-sm">{category.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
