import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingParticlesProps {
  count?: number;
  color?: string;
  area?: number;
}

export const FloatingParticles = ({ count = 60, color = '#D4AF37', area = 6 }: FloatingParticlesProps) => {
  const mesh = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * area;
      positions[i * 3 + 1] = (Math.random() - 0.5) * area;
      positions[i * 3 + 2] = (Math.random() - 0.5) * area;
      scales[i] = Math.random() * 0.5 + 0.1;
    }
    return { positions, scales };
  }, [count, area]);

  useFrame((state) => {
    if (!mesh.current) return;
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 1] += Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.002;
      positions[i3] += Math.cos(state.clock.elapsedTime * 0.2 + i) * 0.001;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};
