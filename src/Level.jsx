import * as THREE from 'three';
import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const floor1Material = new THREE.MeshStandardMaterial({ color: 'limegreen' });
const floor2Material = new THREE.MeshStandardMaterial({ color: 'greenyellow' });
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orangered' });
const wallMaterial = new THREE.MeshStandardMaterial({ color: 'slategray' });

const BlockStart = ({ position = [0, 0, 0] }) => {
	return (
		<group position={position}>
			<mesh
				geometry={boxGeometry}
				material={floor1Material}
				position={[0, -0.1, 0]}
				scale={[4, 0.2, 4]}
				receiveShadow
			/>
		</group>
	);
};

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

const Level = () => {
	return (
		<>
			<BlockStart position={[0, 0, 4]} />
			<BlockSpinner position={[0, 0, 0]} />
		</>
	);
};

export default Level;
