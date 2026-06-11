import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, ContactShadows, Text, Center } from '@react-three/drei';
import * as THREE from 'three';

interface AttarBottleProps {
  color?: string;
  label?: string;
  [key: string]: unknown;
}

export const AttarBottle = ({ color = '#D4AF37', label = 'ATTAR', ...props }: AttarBottleProps) => {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      // Gentle floating rotation
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  // Procedural Lathe Geometry for the Glass Bottle
  // A seamless, continuous curve creates a much more realistic and beautiful glass object
  const bottleProfile = useMemo(() => {
    const pts = [];
    pts.push(new THREE.Vector2(0, -1));          // Bottom center
    pts.push(new THREE.Vector2(0.6, -1));        // Bottom edge
    pts.push(new THREE.Vector2(0.7, -0.9));      // Bottom bevel
    pts.push(new THREE.Vector2(0.85, -0.4));     // Widest point (belly)
    pts.push(new THREE.Vector2(0.7, 0.2));       // Tapering up
    pts.push(new THREE.Vector2(0.35, 0.7));      // Shoulder
    pts.push(new THREE.Vector2(0.22, 0.9));      // Neck start
    pts.push(new THREE.Vector2(0.22, 1.2));      // Neck straight
    pts.push(new THREE.Vector2(0.3, 1.25));      // Lip outward
    pts.push(new THREE.Vector2(0.3, 1.35));      // Lip straight
    pts.push(new THREE.Vector2(0.18, 1.4));      // Lip inward
    pts.push(new THREE.Vector2(0, 1.4));         // Top center (closed)
    return pts;
  }, []);

  // Procedural Lathe Geometry for the Liquid inside
  const liquidProfile = useMemo(() => {
    const pts = [];
    pts.push(new THREE.Vector2(0, -0.85));       // Bottom center
    pts.push(new THREE.Vector2(0.55, -0.85));    // Bottom edge
    pts.push(new THREE.Vector2(0.62, -0.8));     // Bottom bevel
    pts.push(new THREE.Vector2(0.75, -0.4));     // Widest point
    pts.push(new THREE.Vector2(0.62, 0.15));     // Tapering up
    pts.push(new THREE.Vector2(0.35, 0.5));      // Liquid level surface edge
    pts.push(new THREE.Vector2(0, 0.5));         // Liquid level surface center
    return pts;
  }, []);

  return (
    <group ref={group} {...props} dispose={null}>
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
        
        {/* === GLASS BOTTLE === */}
        {/* We use 12 radial segments to give it a faceted "crystal cut" look, 
            which is highly premium and traditional for Attar bottles. */}
        <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
          <latheGeometry args={[bottleProfile, 16]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={1}
            opacity={1}
            metalness={0.1}
            roughness={0.05}
            ior={1.6}             // High IOR for crystal-like refraction
            thickness={1.5}       // Simulates thick glass volume
            clearcoat={1}
            clearcoatRoughness={0.1}
            attenuationColor="#ffffff"
            attenuationDistance={2}
          />
        </mesh>

        {/* === PERFUME LIQUID === */}
        <mesh position={[0, -0.5, 0]}>
          <latheGeometry args={[liquidProfile, 16]} />
          <meshPhysicalMaterial
            color={color}
            transmission={0.4}    // Let some light through, but keep it rich in color
            roughness={0.1}
            metalness={0.1}
            ior={1.33}            // IOR of water/oil
            thickness={2}
            attenuationColor={color}
            attenuationDistance={1}
          />
        </mesh>

        {/* === GOLDEN CAP === */}
        <group position={[0, 0.9, 0]}>
          {/* Cap Base Ring */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.32, 0.35, 0.15, 16]} />
            <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.15} />
          </mesh>
          {/* Cap Main Body (Faceted Dome) */}
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.15, 0.32, 0.6, 8]} />
            <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.2} />
          </mesh>
          {/* Cap Crown / Finial */}
          <mesh position={[0, 0.75, 0]}>
            <octahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial color="#F3E5AB" metalness={1} roughness={0.1} />
          </mesh>
          {/* Neck Ribbon/Band */}
          <mesh position={[0, -0.3, 0]}>
            <torusGeometry args={[0.25, 0.04, 16, 32]} />
            <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.1} />
          </mesh>
        </group>

        {/* === PREMIUM LABEL === */}
        <group position={[0, -0.9, 0.81]} rotation={[-0.05, 0, 0]}>
          {/* Label Plate */}
          <mesh>
            <boxGeometry args={[0.8, 1.0, 0.02]} />
            <meshStandardMaterial color="#0A1C12" metalness={0.2} roughness={0.7} />
          </mesh>
          {/* Gold Border */}
          <mesh position={[0, 0, -0.01]}>
            <boxGeometry args={[0.86, 1.06, 0.02]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Text: Brand */}
          <Center position={[0, 0.25, 0.02]}>
            <Text fontSize={0.06} color="#D4AF37" anchorX="center" anchorY="middle" fontStyle="italic">
              NIKUNJ
            </Text>
          </Center>
          <Center position={[0, 0.15, 0.02]}>
            <Text fontSize={0.04} color="#D4AF37" anchorX="center" anchorY="middle" letterSpacing={0.1}>
              ESSENCE
            </Text>
          </Center>
          
          {/* Separator Line */}
          <mesh position={[0, 0, 0.015]}>
            <planeGeometry args={[0.5, 0.01]} />
            <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.2} />
          </mesh>

          {/* Text: Product Name */}
          <Center position={[0, -0.2, 0.02]}>
            <Text fontSize={0.09} color="#ffffff" anchorX="center" anchorY="middle" maxWidth={0.7} textAlign="center" lineHeight={1.2}>
              {label}
            </Text>
          </Center>
        </group>

        {/* === CONTACT SHADOW === */}
        <ContactShadows position={[0, -1.6, 0]} opacity={0.5} scale={4} blur={2} far={3} color="#0A1C12" />
      </Float>
    </group>
  );
};
