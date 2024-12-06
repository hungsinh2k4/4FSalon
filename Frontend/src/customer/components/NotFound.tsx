// src/pages/NotFound.tsx
import React from "react";

const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-2xl text-gray-600 mt-4">Page Not Found</p>
        <a href="/" className="text-blue-500 mt-6 inline-block">
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
