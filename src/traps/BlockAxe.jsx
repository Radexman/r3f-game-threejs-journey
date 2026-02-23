import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';

import { boxGeometry, floor2Material, obstacleMaterial } from '../../lib/materials';

const BlockAxe = ({ position = [0, 0, 0] }) => {
	const [timeOffset] = useState(() => Math.random() * Math.PI * 2);
	const obstacleRef = useRef();

	useFrame((state) => {
		if (!obstacleRef.current) return;

		const time = state.clock.getElapsedTime();

		const x = Math.sin(time + timeOffset) * 1.25;
		obstacleRef.current.setNextKinematicTranslation({ x: position[0] + x, y: position[1] + 0.75, z: position[2] });
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
					scale={[1.5, 1.5, 0.3]}
					castShadow
					receiveShadow
				/>
			</RigidBody>
		</group>
	);
};

export default BlockAxe;
