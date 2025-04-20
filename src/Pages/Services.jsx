import React from "react";

const Services = () => {
  const services = [
    {
      title: "Emergency Ambulance",
      description: "24/7 emergency ambulance services to ensure immediate medical assistance.",
      icon: "🚑",
    },
    {
      title: "Medical Transport",
      description: "Safe and efficient non-emergency medical transportation.",
      icon: "🏥",
    },
    {
      title: "Air Ambulance",
      description: "Quick and reliable air ambulance services for critical patients.",
      icon: "✈️",
    },
    {
      title: "Home Care Support",
      description: "Medical professionals providing care at your doorstep.",
      icon: "🏡",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-blue-600">Our Services</h1>
        <p className="mt-4 text-gray-600">
          We provide a range of medical transport and emergency services to ensure your safety and well-being.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="text-4xl mb-4">{service.icon}</div>
            <h2 className="text-xl font-semibold text-gray-800">{service.title}</h2>
            <p className="text-gray-600 mt-2">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;