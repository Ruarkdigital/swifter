import React from "react";
import { useWatch, Control } from "react-hook-form";

type Props = { control: Control<any> };

const Step6ReviewPublish: React.FC<Props> = ({ control }) => {
  const name = useWatch({ control, name: "name" });
  const type = useWatch({ control, name: "type" });
  const category = useWatch({ control, name: "category" });
  const description = useWatch({ control, name: "description" });

  return (
    <div className="mt-4 space-y-4">
      <p className="text-sm font-semibold text-slate-900">Contract Summary</p>
      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <span className="text-slate-500">Contract Name</span>
          <span className="text-slate-800">{name}</span>
          <span className="text-slate-500">Contract Type</span>
          <span className="text-slate-800">{type}</span>
          <span className="text-slate-500">Category</span>
          <span className="text-slate-800">{category}</span>
        </div>
        <div>
          <span className="text-slate-500">Description</span>
          <p className="text-slate-700 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Step6ReviewPublish;

