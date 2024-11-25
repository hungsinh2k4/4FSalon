import React from "react";
import { Service } from "../../utils/types";

interface ServiceListProps {
  viewType: string;
  services: Service[];
  selectedService: Service | null;
  setSelectedService: React.Dispatch<React.SetStateAction<Service | null>>;
}

const ServiceList: React.FC<ServiceListProps> = ({
  viewType,
  services,
  selectedService,
  setSelectedService,
}) => {
  if (viewType !== "services") return null;

  return (
    <div className="mt-2.5 max-h-[500px] overflow-y-auto border border-gray-300 rounded-s-lg p-2 grid grid-cols-2 gap-3.5">
      {services.map((service) => (
        <button
          key={service.id}
          onClick={() =>
            setSelectedService(
              selectedService?.id === service.id ? null : service
            )
          } // Nếu đã chọn thì bỏ chọn, nếu chưa thì chọn
          className={`w-full py-9 h-[400px] my-2.5 ${
            selectedService?.id === service.id
              ? "bg-blue-200 border-blue-500" // Style khi được chọn
              : "bg-gray-100 border-[#0a0a0a]"
          } cursor-pointer text-left flex`}
        >
          <div className="w-2/5 h-full overflow-hidden">
            <img
              src="src/customer/assets/Booking/employees.jpeg"
              alt={service.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 p-4">
            <strong>{service.title}</strong>
            <div className="text-sm text-gray-600">{service.price}</div>
            <div className="text-sm text-gray-600">{service.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ServiceList;
