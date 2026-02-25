import * as THREE from 'three';
import { useEffect, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, useRapier } from '@react-three/rapier';
import { useKeyboardControls } from '@react-three/drei';

const Player = () => {
	const [smoothedCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10));
	const [smoothedCameraTarget] = useState(() => new THREE.Vector3());
	const [subscribeKeys, getKeys] = useKeyboardControls();
	const { rapier, world } = useRapier();
	const bodyRef = useRef();

	const jump = () => {
		const origin = bodyRef.current.translation();
		origin.y -= 0.31;
		const direction = { x: 0, y: -1, z: 0 };
		const ray = new rapier.Ray(origin, direction);
		const hit = world.castRay(ray, 10, true);

		if (hit.timeOfImpact < 0.15) {
			bodyRef.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
		}
	};

	useEffect(() => {
		const unsubscribeJump = subscribeKeys(
			(state) => state.jump,
			(value) => {
				if (value) {
					jump();
				}
			},
		);

		return () => unsubscribeJump();
	}, []);

	useFrame((state, delta) => {
		if (!bodyRef.current) return;

		// Controls
		const { forward, backward, leftward, rightward } = getKeys();

		const impulse = { x: 0, y: 0, z: 0 };
		const torque = { x: 0, y: 0, z: 0 };

		const impulseStrength = 0.6 * delta;
		const torqueStrength = 0.2 * delta;

		if (forward) {
			impulse.z -= impulseStrength;
			torque.x -= torqueStrength;
		}

		if (rightward) {
			impulse.x += impulseStrength;
			torque.z -= torqueStrength;
		}

		if (backward) {
			impulse.z += impulseStrength;
			torque.x += torqueStrength;
		}

		if (leftward) {
			impulse.x -= impulseStrength;
			torque.z += torqueStrength;
		}

		bodyRef.current.applyImpulse(impulse);
		bodyRef.current.applyTorqueImpulse(torque);

		// Camera
		const bodyPosition = bodyRef.current.translation();
		const cameraPosition = new THREE.Vector3(bodyPosition.x, bodyPosition.y + 0.65, bodyPosition.z + 2.25);
		const cameraTarget = new THREE.Vector3(bodyPosition.x, bodyPosition.y + 0.25, bodyPosition.z);

		smoothedCameraPosition.lerp(cameraPosition, 5 * delta);
		smoothedCameraTarget.lerp(cameraTarget, 5 * delta);

		state.camera.position.copy(smoothedCameraPosition);
		state.camera.lookAt(smoothedCameraTarget);
	});

	return (
		<RigidBody
			ref={bodyRef}
			canSleep={false}
			colliders='ball'
			position={[0, 1, 0]}
			restitution={0.2}
			friction={1}
			linearDamping={0.5}
			angularDamping={0.5}
		>
			<mesh castShadow>
				<icosahedronGeometry args={[0.3, 1]} />
				<meshStandardMaterial
					flatShading
					color='mediumpurple'
				/>
			</mesh>
		</RigidBody>
	);
};

export default Player;
