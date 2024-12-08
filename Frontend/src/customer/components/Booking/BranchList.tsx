import React from "react";
import { Branch } from "../../utils/types";

interface BranchListProps {
  viewType: string;
  branches: Branch[];
  selectedBranch: Branch | null;
  setSelectedBranch: (branch: Branch | null) => void;
  resetState: () => void;
}

const BranchList: React.FC<BranchListProps> = ({
  viewType,
  branches,
  selectedBranch,
  setSelectedBranch,
  resetState,
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
          className={`w-full rounded-lg h-[150px] my-10 ${
            selectedBranch?.id === branch.id
              ? "bg-blue-200 border-blue-500"
              : "bg-gray-100 border-gray-300"
          } cursor-pointer text-left flex items-center`}
        >
          <div className="w-1/3 h-full overflow-hidden rounded-lg">
            <img
              src="/src/customer/assets/bg.png"
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
