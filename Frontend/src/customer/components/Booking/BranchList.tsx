import React from "react";
import { Branch } from "../../utils/types";

interface BranchListProps {
  viewType: string;
  branches: Branch[];
  selectedBranch: Branch | null;
  setSelectedBranch: (branch: Branch | null) => void;
  resetState: () => void;
  searchTerm: String
}

const BranchList: React.FC<BranchListProps> = ({
  viewType,
  branches,
  selectedBranch,
  setSelectedBranch,
  resetState,
  searchTerm
}) => {
  if (viewType !== "branches") return null;
return (
  <div className="p-5 max-h-[500px] overflow-y-auto border border-gray-300">
    {branches.map((branch) => (
      <button
        key={branch.id}
        onClick={() => {
          setSelectedBranch(selectedBranch?.id === branch.id ? null : branch);
          resetState();
        }}
        className={`w-full rounded-lg h-[150px] my-10 transition-transform duration-300 transform hover:scale-105 ${
          selectedBranch?.id === branch.id
            ? "bg-blue-200 border-blue-500"
            : "bg-gray-100 border-gray-300"
        } cursor-pointer text-left flex items-center hover:border-gray-400`}
      >
        <div className="w-1/3 h-full overflow-hidden rounded-lg">
          <img
            src={branch.picture_url || undefined}
            alt="branch image"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex-1 p-4">
          <strong>{branch.name}</strong>
          <div className="text-sm text-gray-600">{branch.address}</div>
        </div>
      </button>
    ))}
  </div>
);

};

export default BranchList;
