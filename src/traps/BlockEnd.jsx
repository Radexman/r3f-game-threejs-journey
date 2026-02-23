import { useGLTF } from '@react-three/drei';
import { RigidBody, CylinderCollider } from '@react-three/rapier';

import { boxGeometry, floor1Material } from '../../lib/materials';

const BlockEnd = ({ position = [0, 0, 0] }) => {
	const hamburger = useGLTF('./hamburger.glb');
	hamburger.scene.children.forEach((mesh) => (mesh.castShadow = true));

	return (
		<group position={position}>
			<mesh
				geometry={boxGeometry}
				material={floor1Material}
				position={[0, 0, 0]}
				scale={[4, 0.2, 4]}
				receiveShadow
			/>
			<RigidBody
				type='fixed'
				colliders={false}
				restitution={0.2}
				friction={0}
			>
				<CylinderCollider
					args={[0.5, 1]}
					position={[0, 0.5, 0]}
				/>
				<primitive
					object={hamburger.scene}
					scale={0.2}
				/>
			</RigidBody>
		</group>
	);
};

export default BlockEnd;
