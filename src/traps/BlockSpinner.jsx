import * as THREE from 'three';
import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';

import { boxGeometry, floor2Material, obstacleMaterial } from '../../lib/materials';

const BlockSpinner = ({ position = [0, 0, 0] }) => {
	const [speed] = useState(() => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1));
	const obstacleRef = useRef();

	const rotation = new THREE.Quaternion();
	const euler = new THREE.Euler();

	useFrame((state) => {
		if (!obstacleRef.current) return;

		const time = state.clock.getElapsedTime();

		euler.set(0, time * speed, 0);
		rotation.setFromEuler(euler);
		obstacleRef.current.setNextKinematicRotation(rotation);
	});

	return (
		<group position={position}>
			<mesh
				geometry={boxGeometry}
				material={floor2Material}
				position={[0, -0.1, 0]}
				scale={[4, 0.2, 4]}
				receiveShadow
			/>
			<RigidBody
				ref={obstacleRef}
				type='kinematicPosition'
				position={[0, 0.3, 0]}
				restitution={0.2}
				friction={0}
			>
				<mesh
					geometry={boxGeometry}
					material={obstacleMaterial}
					scale={[3.5, 0.3, 0.3]}
					castShadow
					receiveShadow
				/>
			</RigidBody>
		</group>
	);
};

export default BlockSpinner;
