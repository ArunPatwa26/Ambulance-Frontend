import React from "react";

const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Contact Us
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Get in touch with us for any emergency or inquiries.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Our Location</h2>
          <p className="text-gray-600">📍 123 Emergency Street, City, Country</p>
          <h2 className="text-xl font-semibold text-gray-700 mt-6">Call Us</h2>
          <p className="text-gray-600">📞 +123 456 7890</p>
          <h2 className="text-xl font-semibold text-gray-700 mt-6">Email</h2>
          <p className="text-gray-600">📧 support@e-ambulance.com</p>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Send a Message</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              rows="4"
              placeholder="Your Message"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
