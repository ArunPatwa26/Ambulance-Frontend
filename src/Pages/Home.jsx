import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNotification } from '../context/NotificationContext';
import { Ambulance, HeartPulse, Clock, MapPin, PhoneCall, ShieldCheck, Star, ChevronRight } from "lucide-react";

const Home = () => {
  const { notification } = useNotification();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const features = [
    {
      icon: <Clock className="h-8 w-8" />,
      title: "90-Second Response",
      description: "Our average dispatch time is under 90 seconds from receiving your call"
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Real-Time Tracking",
      description: "Track your ambulance's exact location in real-time"
    },
    {
      icon: <HeartPulse className="h-8 w-8" />,
      title: "Advanced Medical Care",
      description: "EMT-certified staff with life support equipment"
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Heart Attack Patient",
      quote: "The ambulance arrived within 5 minutes and the EMTs stabilized me before reaching the hospital. Truly saved my life.",
      rating: 5
    },
    {
      name: "Priya Sharma",
      role: "Accident Victim",
      quote: "The real-time tracking let my family know exactly when I would arrive at the hospital. Excellent service.",
      rating: 5
    },
    {
      name: "Amit Patel",
      role: "Father of Asthma Patient",
      quote: "When my son had a severe asthma attack at midnight, their quick response made all the difference. Grateful for their service.",
      rating: 5
    }
  ];

  const stats = [
    { value: "2,500+", label: "Lives Saved" },
    { value: "300+", label: "Ambulances" },
    { value: "24/7", label: "Availability" },
    { value: "98%", label: "Satisfaction Rate" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentFeature((prev) => (prev + 1) % features.length);
        setIsVisible(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white">
      {/* Notification Banner */}
      {notification && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-red-600 text-white p-3 text-center text-sm font-medium"
        >
          {notification}
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            className="w-full h-full object-cover opacity-30"
            src="https://assets.mixkit.co/videos/preview/mixkit-ambulance-on-a-city-street-2180-large.mp4"
            poster="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center justify-center mb-6"
            >
              <Ambulance className="h-12 w-12 text-red-500" />
              <span className="ml-3 text-3xl font-bold bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
                RapidRescue
              </span>
            </motion.div>
            
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              <span className="block">Emergency Medical</span>
              <motion.span 
                className="block text-red-400"
                animate={{ 
                  textShadow: ["0 0 8px rgba(248, 113, 113, 0)", "0 0 8px rgba(248, 113, 113, 0.8)", "0 0 8px rgba(248, 113, 113, 0)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Response System
              </motion.span>
            </h1>
            
            <p className="mt-6 max-w-lg mx-auto text-xl text-gray-300">
              Immediate ambulance dispatch with real-time tracking and professional medical care when seconds count.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/booking"
                  className="px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
                >
                  <span className="mr-2">🚑</span> Book Now
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/services"
                  className="px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-red-700 bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
                >
                  <span className="mr-2">⚕️</span> Our Services
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Emergency Contact Bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-red-700 to-red-600 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <motion.div 
                animate={{ 
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "reverse", 
                  duration: 1 
                }}
                className="flex p-2 rounded-lg bg-red-800"
              >
                <PhoneCall className="h-6 w-6 text-white" />
              </motion.div>
              <p className="ml-3 font-medium text-white text-lg">
                <span className="sm:hidden">Emergency? Call 108</span>
                <span className="hidden sm:inline">Emergency Contact: 108 (24/7 Support)</span>
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/emergency"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center"
              >
                Emergency Protocol <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-base text-red-600 font-semibold tracking-wide uppercase">Why Choose Us</h2>
            <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Life-Saving Services When You Need Them
            </h3>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Our emergency response system is designed for speed, reliability, and professional care.
            </p>
          </motion.div>

          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Animated Feature Showcase */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div className="mb-12 lg:mb-0">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative rounded-2xl shadow-xl overflow-hidden aspect-w-16 aspect-h-9"
              >
                <img
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                  alt="Ambulance dispatch center"
                  loading="lazy"
                />
              </motion.div>
            </div>

            <div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Advanced Emergency Response Technology
                </h2>
                <div className="mt-8 space-y-8">
                  {[
                    {
                      icon: <ShieldCheck className="h-5 w-5 text-red-500" />,
                      title: "AI-Powered Dispatch",
                      description: "Our system uses artificial intelligence to route the nearest available ambulance based on traffic, distance, and emergency level."
                    },
                    {
                      icon: <MapPin className="h-5 w-5 text-red-500" />,
                      title: "GPS Tracking",
                      description: "Real-time GPS tracking allows you and hospital staff to monitor the ambulance's location and ETA."
                    },
                    {
                      icon: <HeartPulse className="h-5 w-5 text-red-500" />,
                      title: "Telemedicine Support",
                      description: "Paramedics can connect with hospital physicians in real-time for critical case consultation."
                    }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      whileHover={{ x: 5 }}
                      className="flex"
                    >
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-100">
                          {item.icon}
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">{item.title}</h4>
                        <p className="mt-1 text-gray-600">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-red-700 to-red-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Trusted Emergency Medical Provider
            </h2>
            <p className="mt-3 text-xl text-red-100">
              Serving the community with life-saving transportation since 2010
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl"
              >
               <p className="text-2xl sm:text-5xl font-extrabold text-red-400">{stat.value}</p>
<p className="text-sm sm:text-lg mt-2 font-medium text-red-400">{stat.label}</p>


              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-base text-red-600 font-semibold tracking-wide uppercase">Our Process</h2>
            <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              How Our Emergency System Works
            </h3>
          </motion.div>

          <div className="relative">
            {/* Timeline */}
            <div className="hidden md:block absolute top-0 left-1/2 h-full w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
            
            <div className="space-y-12 md:space-y-0">
              {[
                {
                  step: "1",
                  title: "Emergency Call",
                  description: "Call our emergency number or use our mobile app to request immediate assistance. Our operators are trained to assess your situation quickly.",
                  icon: <PhoneCall className="h-6 w-6 text-white" />
                },
                {
                  step: "2",
                  title: "Ambulance Dispatch",
                  description: "Our AI system automatically routes the nearest available ambulance to your location, considering traffic and road conditions in real-time.",
                  icon: <Ambulance className="h-6 w-6 text-white" />
                },
                {
                  step: "3",
                  title: "Medical Care & Transport",
                  description: "EMTs provide immediate care and transport to the most appropriate medical facility with continuous vital monitoring during transit.",
                  icon: <HeartPulse className="h-6 w-6 text-white" />
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} ${index !== 2 ? 'mb-16 md:mb-0' : ''}`}
                >
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8 md:order-last'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h4 className="text-xl font-bold text-gray-900">{step.title}</h4>
                      <p className="mt-2 text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-red-600 text-white absolute left-1/2 transform -translate-x-1/2 z-10 shadow-lg">
                    {step.icon}
                  </div>
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pl-8 md:order-last' : 'md:pr-8'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <div className="flex md:hidden items-center justify-center w-12 h-12 rounded-full bg-red-600 text-white mb-4 mx-auto">
                        {step.icon}
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 md:hidden">{step.title}</h4>
                      <p className="mt-2 text-gray-600 md:hidden">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-base text-red-600 font-semibold tracking-wide uppercase">Testimonials</h2>
            <h3 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What Our Patients Say
            </h3>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="mb-6">
                  <p className="text-gray-600 italic">
                    "{testimonial.quote}"
                  </p>
                </blockquote>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-red-600 font-medium">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Ambulance className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to experience</span>
              <span className="block text-red-400">the fastest emergency response?</span>
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-300 mx-auto">
              Download our app or book online for immediate emergency medical assistance.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/booking"
                  className="px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
                >
                  <span className="mr-2">🚑</span> Book Ambulance Now
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/download"
                  className="px-8 py-3 border border-white text-base font-medium rounded-md shadow-lg text-white bg-transparent hover:bg-white hover:bg-opacity-10 transition-colors duration-200 flex items-center justify-center"
                >
                  <span className="mr-2">📱</span> Download Our App
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;