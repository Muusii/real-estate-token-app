// src/components/HeroSection.js
import React, { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Logo from "../assets/images/logo.jpg"; // Update the logo path if necessary
import BackgroundVideo from "../assets/images/backgroundvideo.mp4"; // Update the video path if necessary
import CoreImage1 from "../assets/images/image1.jpg"; // Update the image paths if necessary
import CoreImage2 from "../assets/images/image2.jpg";
import CoreImage3 from "../assets/images/image3.jpg";
import DiamondIcon from "../assets/images/logo2.jpg"; // Update the icon path if necessary
import { useNavigate } from "react-router-dom";
import { CardContainer, CardBody } from "../components/ui/3d-card"; // Ensure these components exist

const HeroSection = () => {
    const videoRef = useRef(null);
    const navigate = useNavigate();
    const controls = useAnimation();
    const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.3,
    });
  
    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.playbackRate = 0.5;
      }
    }, []);
  
    useEffect(() => {
      if (inView) {
        controls.start({
          rotate: 0,
          y: 0,
          transition: { duration: 1, type: "spring" },
        });
      }
    }, [controls, inView]);
  
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.3,
        },
      },
    };
  
    const itemVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 },
    };
  
    return (
      <div>
        <div className="relative overflow-hidden h-screen">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover z-0"
            src={BackgroundVideo}
            autoPlay
            loop
            muted
            playsInline
          ></video>
  
          {/* Overlay with Mixed Colors */}
          <div className="absolute inset-0 z-1">
            <div className="bg-blue-600 opacity-60 absolute inset-0 mix-blend-overlay"></div>
            <div className="bg-green-400 opacity-40 absolute inset-0 mix-blend-overlay"></div>
            <div className="bg-gray-800 opacity-30 absolute inset-0 mix-blend-overlay"></div>
          </div>
  
          <div className="relative z-10 bg-black bg-opacity-50 text-white p-4 h-full flex items-center">
            <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <motion.h1
                  initial={{ y: -50 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-5xl font-bold text-white"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Tokenize Your Real Estate
                </motion.h1>
                <motion.h2
                  initial={{ y: -50 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-2xl font-bold text-white mt-4"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Unlock Liquidity and Ownership with Blockchain Technology
                </motion.h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="mt-6 bg-green-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow"
                  onClick={() => navigate("/about")}
                >
                  Learn More
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
  
        {/* Core Components Section */}
        <div className="relative py-20 px-4 sm:px-2 lg:px-8 bg-gray-900 text-white">
          <div className="relative z-10">
            <motion.div
              className="mt-10"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <h2
                className="text-3xl font-bold text-center text-blue-500 mb-10"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Our Key Features
              </h2>
              <CardContainer containerClassName="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <CardBody className="w-full">
                  <motion.div
                    className="relative overflow-hidden rounded-lg shadow-lg"
                    variants={itemVariants}
                  >
                    <img
                      src={CoreImage1}
                      alt="Fractional Ownership"
                      className="w-full h-72 object-cover transition-transform duration-500 transform hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center text-center p-4">
                      <h3 className="text-2xl font-bold text-blue-500 mb-4">
                        Fractional Ownership
                      </h3>
                      <p className="text-white text-xl">
                        Invest in real estate with fractional ownership, making it accessible to everyone.
                      </p>
                      <button
                        className="mt-4 bg-green-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow"
                        onClick={() => navigate("/features/fractional-ownership")}
                      >
                        Learn More
                      </button>
                    </div>
                  </motion.div>
                </CardBody>
  
                {/* Feature 2 */}
                <CardBody className="w-full">
                  <motion.div
                    className="relative overflow-hidden rounded-lg shadow-lg"
                    variants={itemVariants}
                  >
                    <img
                      src={CoreImage2}
                      alt="Smart Contracts"
                      className="w-full h-72 object-cover transition-transform duration-500 transform hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center text-center p-4">
                      <h3 className="text-2xl font-bold text-blue-500 mb-4">
                        Smart Contracts
                      </h3>
                      <p className="text-white text-xl">
                        Automate transactions and agreements with secure smart contracts on the blockchain.
                      </p>
                      <button
                        className="mt-4 bg-green-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow"
                        onClick={() => navigate("/features/smart-contracts")}
                      >
                        Learn More
                      </button>
                    </div>
                  </motion.div>
                </CardBody>
  
                {/* Feature 3 */}
                <CardBody className="w-full">
                  <motion.div
                    className="relative overflow-hidden rounded-lg shadow-lg"
                    variants={itemVariants}
                  >
                    <img
                      src={CoreImage3}
                      alt="Liquidity and Transparency"
                      className="w-full h-72 object-cover transition-transform duration-500 transform hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center text-center p-4">
                      <h3 className="text-2xl font-bold text-blue-500 mb-4">
                        Liquidity and Transparency
                      </h3>
                      <p className="text-white text-xl">
                        Enjoy enhanced liquidity and transparency in real estate transactions through tokenization.
                      </p>
                      <button
                        className="mt-4 bg-green-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow"
                        onClick={() => navigate("/features/liquidity-transparency")}
                      >
                        Learn More
                      </button>
                    </div>
                  </motion.div>
                </CardBody>
              </CardContainer>
            </motion.div>
          </div>
        </div>
  
        {/* Highlights Section */}
        <div className="relative py-20 bg-gray-800 text-white">
          <div className="relative z-10 max-w-7xl mx-auto" ref={ref}>
            <h2
              className="text-3xl font-bold text-center text-blue-500 mb-10"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Discover Our Highlights
            </h2>
            <div className="grid grid-cols-1 sm:px-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                className="highlight-card bg-gradient-to-r from-blue-500 to-green-500 p-8 rounded-lg shadow-lg"
                initial={{ rotate: -45, y: -100 }}
                animate={controls}
              >
                <div className="flex justify-center">
                  <img
                    src={DiamondIcon}
                    alt="Icon"
                    className="w-16 h-16"
                  />
                </div>
                <h3 className="text-2xl font-bold text-center mt-4">
                  Innovative Solutions
                </h3>
                <p className="text-white text-xl mt-4 text-center">
                  We leverage cutting-edge technology to revolutionize real estate investment.
                </p>
              </motion.div>
              <motion.div
                className="highlight-card bg-gradient-to-r from-blue-500 to-green-500 p-8 rounded-lg shadow-lg"
                initial={{ rotate: -45, y: -100 }}
                animate={controls}
              >
                <div className="flex justify-center">
                  <img
                    src={DiamondIcon} 
                    alt="Icon"
                    className="w-16 h-16"
                  />
                </div>
                <h3 className="text-2xl font-bold text-center mt-4">
                  Community Focused
                </h3>
                <p className="text-white text-xl mt-4 text-center">
                  Our platform is built for the community, empowering investors and property owners alike.
                </p>
              </motion.div>
              <motion.div
                className="highlight-card bg-gradient-to-r from-blue-500 to-green-500 p-8 rounded-lg shadow-lg"
                initial={{ rotate: -45, y: -100 }}
                animate={controls}
              >
                <div className="flex justify-center">
                  <img
                    src={DiamondIcon} 
                    alt="Icon"
                    className="w-16 h-16"
                  />
                </div>
                <h3 className="text-2xl font-bold text-center mt-4">
                  Secure and Compliant
                </h3>
                <p className="text-white text-xl mt-4 text-center">
                  We ensure compliance with regulations to provide a secure investment environment.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default HeroSection;