import React from "react";
import { Forger } from "@/lib/forge";
import { TextInput,  TextSelect, TextTagInput } from "@/components/layouts/FormInputs";

type Props = {
  internalStakeholderOptions?: Array<{ label: string; value: string }>;
};

const Step2ContractTeam: React.FC<Props> = ({ internalStakeholderOptions = [] }) => {
  return (
		<div className="mt-4 space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Forger
					name="manager"
					label="Contract Manger"
					placeholder="Enter Title"
					component={TextInput}
				/>
				<Forger
					name="jobTitle"
					label="Job Title"
					placeholder="Enter Title"
					component={TextInput}
				/>
			</div>
			<Forger
				name="vendor"
				label="Vendor / Contractor"
				placeholder="Enter Name"
				component={TextInput}
        helperText="Add with email address, Vendor name"
			/>
			<Forger
				name="vendorKeyPersonnel"
				label="Vendor/Contractor Key Personnel. (Multi-Select)"
				component={TextTagInput}
        helperText="Add vendor’s/contractor’s key personnel with email address, name"
			/>
			<Forger
				name="internalStakeholders"
				label="Internal Team/Stakeholders (Multi-Select)"
				component={TextTagInput}
				options={internalStakeholderOptions}
        helperText="Add with email address, name"
			/>
			<Forger
				name="visibility"
				label="Visibility"
				placeholder="Invites-only, Public"
				component={TextSelect}
				options={[
					{ label: "Invites-only", value: "invites_only" },
					{ label: "Public", value: "public" },
				]}
			/>
		</div>
  );
};

export default Step2ContractTeam;
