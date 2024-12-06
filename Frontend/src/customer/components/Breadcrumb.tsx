import React from "react";
import { Link } from "react-router-dom";

interface BreadcrumbProps {
  items: { name: string; path?: string }[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="text-sm font-medium text-gray-500">
      <ol className="list-none p-0 inline-flex">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.path ? (
              <Link to={item.path} className="text-blue-500 hover:underline">
                {item.name}
              </Link>
            ) : (
              <span className="text-gray-500">{item.name}</span>
            )}
            {index < items.length - 1 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
