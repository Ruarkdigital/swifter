import React from "react";
import { Forger } from "@/lib/forge";
import {
	TextInput,
	TextSelect,
	TextArea,
}	from "@/components/layouts/FormInputs";
import { useWatch } from "react-hook-form";

type Props = {
  typeOptions: Array<{ label: string; value: string }>;
  projectOptions: Array<{ label: string; value: string }>;
  awardedOptions: Array<{ label: string; value: string; vendorEmail?: string; vendorId?: string }>;
};

const Step1BasicInfo: React.FC<Props> = ({
  typeOptions,
  projectOptions,
  awardedOptions,
}) => {
	const relationship = useWatch({ name: "relationship" });

	const projectOrMsaLabel =
		relationship === "msa" ? "Select MSA" : "Select Project";
	const projectOrMsaPlaceholder =
		relationship === "msa" ? "Select MSA" : "Select Project";

  return (
		<div className="mt-4 space-y-4">
			<Forger
				name="name"
				label="Contract Name"
				placeholder="Enter Title"
				component={TextInput}
				data-testid="contract-name-input"
			/>
			<Forger
				name="relationship"
				label="Contract Relationship"
				placeholder="Enter Title"
				component={TextSelect}
				options={[
					{ label: "Stand-Alone Contract", value: "standalone" },
					{ label: "Link to MSA", value: "msa" },
					{ label: "Link to Project", value: "project" },
				]}
				data-testid="contract-relationship-select"
			/>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Forger
					name="project"
					label={projectOrMsaLabel}
					placeholder={projectOrMsaPlaceholder}
					component={TextSelect}
					options={projectOptions}
					data-testid="select-project-select"
				/>
				<Forger
					name="awardedSolicitation"
					label="Select Awarded Solicitation (Optional)"
					placeholder="Select Solicititaion"
					component={TextSelect}
					options={awardedOptions}
				/>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Forger
					name="type"
					label="Contract Type"
					placeholder="Select Type"
					component={TextSelect}
					options={typeOptions}
					data-testid="contract-type-select"
				/>
				<Forger
					name="category"
					label="Category"
					placeholder="Legal/IT Operations/Office Supplies"
					component={TextSelect}
					options={[
						{ label: "Legal", value: "legal" },
						{ label: "IT Operations", value: "it_ops" },
						{ label: "Office Supplies", value: "office_supplies" },
					]}
					data-testid="contract-category-select"
				/>
			</div>
			{/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Forger
					name="manager"
					label="Contract Manger"
					placeholder="Enter Title"
					component={TextInput}
					data-testid="contract-manager-input"
				/>
				<Forger
					name="jobTitle"
					label="Job Title"
					placeholder="Enter Title"
					component={TextInput}
					data-testid="job-title-input"
				/>
			</div> */}
			<Forger
				name="contractId"
				label="Contract ID/Number (Optional)"
				placeholder="Enter Title"
				component={TextInput}
				data-testid="contract-id-input"
			/>
			<Forger
				name="description"
				label="Description"
				placeholder="Enter Detail"
				component={TextArea}
				data-testid="description-input"
			/>
		</div>
  );
};

export default Step1BasicInfo;
