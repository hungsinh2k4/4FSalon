import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto mt-8">
      <header className="text-center my-8">
        <h1 className="text-5xl font-bold text-gray-800">Welcome to Hair Salon</h1>
        <p className="mt-4 text-lg text-gray-600">Your beauty, our duty.</p>
      </header>

      <section className="my-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Haircut</h3>
            <p className="text-gray-600">Professional haircut services for men and women.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Hair Coloring</h3>
            <p className="text-gray-600">Expert hair coloring services to give you a fresh look.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Hair Styling</h3>
            <p className="text-gray-600">Stylish hair styling services for any occasion.</p>
          </div>
        </div>
      </section>

      <section className="my-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">About Us</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto">
          At Hair Salon, we are dedicated to providing the best hair care services. Our team of professional stylists
          are here to help you look and feel your best.
        </p>
      </section>
    </div>
  );
};

export default Home;