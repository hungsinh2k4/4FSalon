import React from 'react';

interface ChipCheckboxProps { 
    label?: string; 
    checkable?: boolean;
    checked?: boolean;  
    onChange: () => void;
}

const ChipCheckbox: React.FC<ChipCheckboxProps> = ({ label, checkable = true, checked, onChange }) => {

    const handleOnChange = () => {
        if (!checkable) return;

        onChange();
    }

    return (
        <div
            className={`inline-flex items-center px-3 py-1 rounded-full cursor-pointer transition-colors duration-300 ${
                checked ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={handleOnChange}
        >
            {checked && (
                <svg className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                <path strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                ></path>
                </svg>
            )}
            {!checked && (
                <svg className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                <path strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M 5 13 l 14 0 M 12 6 V 20"
                ></path>
                </svg>
            )}
            <input
                type="checkbox"
                checked={checked}
                onChange={handleOnChange}
                className="hidden"
            />
            <span className="mx-2 select-none">{label}</span>
        </div>
  );
};

export default ChipCheckbox;