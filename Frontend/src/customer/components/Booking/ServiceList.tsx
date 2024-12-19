import React from "react";
import { Service, Voucher } from "../../utils/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

interface ServiceListProps {
  viewType: string;
  services: Service[];
  selectedService: Service | null;
  setSelectedService: React.Dispatch<React.SetStateAction<Service | null>>;
  setSelectedVoucher: React.Dispatch<React.SetStateAction<Voucher | null>>;
  searchTerm: String
}

const ServiceList: React.FC<ServiceListProps> = ({
  viewType,
  services,
  selectedService,
  setSelectedService,
  setSelectedVoucher,
  searchTerm
}) => {
  if (viewType !== "services") return null;

  return (
    <div className="container mx-auto max-h-[500px] p-4 overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {services.filter(
          (service) =>
            service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(service.estimate_time).toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.price.toString().toLowerCase().includes(searchTerm.toLowerCase())


        ).map((service) => (
          <div
            key={service.id}
            onClick={() => {
              setSelectedVoucher(null)
              setSelectedService(
                selectedService?.id === service.id ? null : service
              )
            }
            }
            className={`w-full max-h-[300px] my-2.5 pb-5 rounded-lg shadow-lg transition-transform transform hover:scale-105 ${selectedService?.id === service.id
              ? "bg-blue-200 border-blue-500"
              : "bg-white border-gray-300"
              } cursor-pointer text-left flex flex-col`}
          >
            <div className="w-full h-28 overflow-hidden rounded-t-lg">
              <img
                src="src/customer/assets/Booking/employees.jpeg"
                alt="Image"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 p-4 overflow-hidden">
              <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col lg:flex-row justify-between items-top w-full">
                  <h2 className="text-base font-semibold mb-2">{service.title}</h2>
                  <div>
                    <FontAwesomeIcon icon={faClock} className="text-gray-600 mr-2" />
                    <span className="text-green-600 mb-4">{service.estimate_time}p</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;
