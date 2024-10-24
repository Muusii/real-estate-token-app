// src/pages/properties.js
import React, { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { motion } from "framer-motion";
import { TracingBeam } from "../components/ui/tracing-beam";
import { LampContainer } from "../components/ui/lampDemo";
import AnimatedCard from "../components/AnimatedCard";
import { image } from "framer-motion/m";

const features = [
  {
    title: "Sarit center Expo",
    description: "Location: Naitobi, Kenya",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fhotel-entrance&psig=AOvVaw0cX3GHpoH2jglRUaIltf8g&ust=1729875246067000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPCegM-9p4kDFQAAAAAdAAAAABAE",
    points: [
      "Year Built: 2020",
      "Lot Size: 1500 sq ft",
      "Number of Rooms: 3",
    ],
  },
  {
    title: "Roswell Suites",
    description: "Location: Nakuru, Kenya",
    points: [
      "Year Built: 2018",
      "Lot Size: 2000 sq ft",
      "Number of Rooms: 4",
    ],
  },
  {
    title: "Red woods",
    description: "Location: Nairobi, kenya",
    points: [
      "Year Built: 2021",
      "Lot Size: 1800 sq ft",
      "Number of Rooms: 5",
    ],
  },
  {
    title: "White House Suites",
    description: "Location: Nairobi, kenya",
    points: [
      "Year Built: 2019",
      "Lot Size: 2200 sq ft",
      "Number of Rooms: 6",
    ],
  },
];

const Properties = ({ contract, account }) => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      if (!contract) return;
      try {
        const propertyCount = await contract.methods.propertyCount().call();
        const fetchedProperties = [];

        for (let i = 1; i <= propertyCount; i++) {
          const property = await contract.methods.properties(i).call();
          fetchedProperties.push(property);
        }

        setProperties(fetchedProperties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, [contract]);

  return (
    <div className="py-4 px-4 sm:px-6 lg:px-8 bg-ret-dark text-white">
      <h2 className="text-3xl font-bold text-center text-ret-pink mb-4">
        Dummy Properties Listed
      </h2>
      <TracingBeam className="mb-1">
        <div className="flex flex-col space-y-4">
          {features.map((feature, index) => (
            <LampContainer key={index} className="mb-2">
              <div className="p-4 bg-ret-main border border-white rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-ret-purple mb-1">
                  {feature.title}
                </h3>
                <p className="text-white mb-2">{feature.description}</p>
                <ul className="text-white list-disc list-inside">
                  {feature.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            </LampContainer>
          ))}
        </div>
      </TracingBeam>

      <h1 className="text-3xl font-bold text-center mb-8">Real Properties Listed</h1>
      {properties.length === 0 ? (
        <div>
          <p className="text-center text-gray-500">No properties found.</p>
          <p className="text-center text-gray-500">Properties will be listed once inputted by the Admin.</p>

        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="h-64">
                <Canvas>
                  <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                    <OrbitControls enableZoom={false} />
                    <AnimatedCard position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]}>
                      <Text
                        position={[0, 0.6, 0.06]}
                        fontSize={0.1}
                        color="#000000"
                        anchorX="center"
                        anchorY="middle"
                      >
                        {property.addressInfo}
                      </Text>
                      <Text
                        position={[0, 0.4, 0.06]}
                        fontSize={0.05}
                        color="#000000"
                        anchorX="center"
                        anchorY="middle"
                      >
                        Year Built: {property.yearBuilt}
                      </Text>
                      <Text
                        position={[0, 0.3, 0.06]}
                        fontSize={0.05}
                        color="#000000"
                        anchorX="center"
                        anchorY="middle"
                      >
                        Lot Size: {property.lotSize} sq ft
                      </Text>
                      <Text
                        position={[0, 0.2, 0.06]}
                        fontSize={0.05}
                        color="#000000"
                        anchorX="center"
                        anchorY="middle"
                      >
                        Rooms: {property.numberOfRooms}
                      </Text>
                      <Text
                        position={[0, 0, 0.06]}
                        fontSize={0.08}
                        color="#4F46E5"
                        anchorX="center"
                        anchorY="middle"
                      >
                        Price: {property.price} ETH
                      </Text>
                    </AnimatedCard>
                  </Suspense>
                </Canvas>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Properties;