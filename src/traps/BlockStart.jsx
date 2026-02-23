import { boxGeometry, floor1Material } from '../../lib/materials';

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

export default BlockStart;
