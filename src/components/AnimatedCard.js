import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
// import { Text } from '@react-three/drei';

function AnimatedCard({ position, rotation, scale, children }) {
  const mesh = useRef();

  useFrame((state, delta) => {
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
    mesh.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh ref={mesh}>
        <boxGeometry args={[1, 1.5, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
        {children}
      </mesh>
    </group>
  );
}

export default AnimatedCard;