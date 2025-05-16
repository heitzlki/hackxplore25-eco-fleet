import * as THREE from 'three';
import React, { useRef } from 'react';
import { Center, useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    mesh0_mesh: THREE.Mesh;
    mesh0_mesh_1: THREE.Mesh;
    mesh0_mesh_2: THREE.Mesh;
    mesh0_mesh_3: THREE.Mesh;
    mesh0_mesh_4: THREE.Mesh;
    mesh0_mesh_5: THREE.Mesh;
    mesh0_mesh_6: THREE.Mesh;
    mesh0_mesh_7: THREE.Mesh;
    mesh0_mesh_8: THREE.Mesh;
    mesh9_mesh: THREE.Mesh;
    mesh9_mesh_1: THREE.Mesh;
    mesh9_mesh_2: THREE.Mesh;
    mesh9_mesh_3: THREE.Mesh;
    mesh9_mesh_4: THREE.Mesh;
    mesh9_mesh_5: THREE.Mesh;
    mesh9_mesh_6: THREE.Mesh;
    mesh9_mesh_7: THREE.Mesh;
    mesh9_mesh_8: THREE.Mesh;
    mesh9_mesh_9: THREE.Mesh;
    mesh9_mesh_10: THREE.Mesh;
    mesh9_mesh_11: THREE.Mesh;
    mesh9_mesh_12: THREE.Mesh;
    mesh9_mesh_13: THREE.Mesh;
    mesh9_mesh_14: THREE.Mesh;
    mesh9_mesh_15: THREE.Mesh;
    mesh9_mesh_16: THREE.Mesh;
    mesh9_mesh_17: THREE.Mesh;
    mesh9_mesh_18: THREE.Mesh;
    mesh9_mesh_19: THREE.Mesh;
    mesh9_mesh_20: THREE.Mesh;
    mesh9_mesh_21: THREE.Mesh;
    mesh9_mesh_22: THREE.Mesh;
    mesh9_mesh_23: THREE.Mesh;
    mesh33_mesh: THREE.Mesh;
    mesh33_mesh_1: THREE.Mesh;
    mesh33_mesh_2: THREE.Mesh;
    mesh33_mesh_3: THREE.Mesh;
    mesh33_mesh_4: THREE.Mesh;
    mesh33_mesh_5: THREE.Mesh;
    mesh33_mesh_6: THREE.Mesh;
    mesh33_mesh_7: THREE.Mesh;
    mesh33_mesh_8: THREE.Mesh;
    mesh42_mesh: THREE.Mesh;
    mesh42_mesh_1: THREE.Mesh;
    mesh42_mesh_2: THREE.Mesh;
    mesh42_mesh_3: THREE.Mesh;
    mesh42_mesh_4: THREE.Mesh;
    mesh42_mesh_5: THREE.Mesh;
    mesh48_mesh: THREE.Mesh;
    mesh48_mesh_1: THREE.Mesh;
    mesh48_mesh_2: THREE.Mesh;
    mesh48_mesh_3: THREE.Mesh;
    mesh48_mesh_4: THREE.Mesh;
    mesh48_mesh_5: THREE.Mesh;
    mesh54_mesh: THREE.Mesh;
    mesh54_mesh_1: THREE.Mesh;
    mesh54_mesh_2: THREE.Mesh;
    mesh54_mesh_3: THREE.Mesh;
    mesh54_mesh_4: THREE.Mesh;
    mesh54_mesh_5: THREE.Mesh;
    mesh54_mesh_6: THREE.Mesh;
    mesh54_mesh_7: THREE.Mesh;
    mesh54_mesh_8: THREE.Mesh;
    mesh54_mesh_9: THREE.Mesh;
    mesh64_mesh: THREE.Mesh;
    mesh64_mesh_1: THREE.Mesh;
    mesh64_mesh_2: THREE.Mesh;
    mesh64_mesh_3: THREE.Mesh;
    mesh64_mesh_4: THREE.Mesh;
    mesh64_mesh_5: THREE.Mesh;
    mesh64_mesh_6: THREE.Mesh;
    mesh64_mesh_7: THREE.Mesh;
    mesh64_mesh_8: THREE.Mesh;
    mesh64_mesh_9: THREE.Mesh;
    mesh64_mesh_10: THREE.Mesh;
    mesh64_mesh_11: THREE.Mesh;
    mesh64_mesh_12: THREE.Mesh;
    mesh64_mesh_13: THREE.Mesh;
    mesh78_mesh: THREE.Mesh;
    mesh78_mesh_1: THREE.Mesh;
    mesh78_mesh_2: THREE.Mesh;
    mesh78_mesh_3: THREE.Mesh;
    mesh78_mesh_4: THREE.Mesh;
    mesh78_mesh_5: THREE.Mesh;
  };
  materials: {
    ['0.811765_0.858824_0.898039_0.000000_0.000000']: THREE.MeshStandardMaterial;
    ['0.400000_0.400000_0.400000_0.000000_0.000000']: THREE.MeshStandardMaterial;
    ['0.239216_0.992157_0.035294_0.000000_0.000000']: THREE.MeshStandardMaterial;
    ['0.341176_0.776471_0.741176_0.000000_0.462745']: THREE.MeshStandardMaterial;
    ['0.713725_0.760784_0.800000_0.000000_0.000000']: THREE.MeshStandardMaterial;
  };
};

export function DoorTwo(props: React.JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF(
    '/tech_door_highlight.gltf'
  ) as GLTFResult;

  return (
    <Center
      scale={350}
      position={[0, 0, 0]}
      rotation={[Math.PI / 2, Math.PI, 0]}>
      <group {...props} dispose={null}>
        <group position={[0.001, 0.002, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh9_mesh.geometry}
            material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh9_mesh_1.geometry}
            material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh9_mesh_2.geometry}
            material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh9_mesh_3.geometry}
            material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh9_mesh_4.geometry}
            material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh9_mesh_5.geometry}
            material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh9_mesh_6.geometry}
            material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh9_mesh_7.geometry}
            material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh9_mesh_8.geometry}
            material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh9_mesh_9.geometry}
            material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh9_mesh_10.geometry}
            material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh9_mesh_11.geometry}
            material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh9_mesh_12.geometry}
            material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh9_mesh_13.geometry}
            material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh9_mesh_14.geometry}
            material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh9_mesh_15.geometry}
            material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh9_mesh_16.geometry}
            material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh9_mesh_17.geometry}
            material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh9_mesh_18.geometry}
            material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh9_mesh_19.geometry}
            material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh9_mesh_20.geometry}
            material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh9_mesh_21.geometry}
            material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh9_mesh_22.geometry}
            material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh9_mesh_23.geometry}
            material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
          />
        </group>
        <group position={[0.001, 0.002, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh42_mesh.geometry}
            material={materials['0.341176_0.776471_0.741176_0.000000_0.462745']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh42_mesh_1.geometry}
            material={materials['0.341176_0.776471_0.741176_0.000000_0.462745']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh42_mesh_2.geometry}
            material={materials['0.341176_0.776471_0.741176_0.000000_0.462745']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh42_mesh_3.geometry}
            material={materials['0.341176_0.776471_0.741176_0.000000_0.462745']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh42_mesh_4.geometry}
            material={materials['0.341176_0.776471_0.741176_0.000000_0.462745']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh42_mesh_5.geometry}
            material={materials['0.341176_0.776471_0.741176_0.000000_0.462745']}
          />
        </group>
        <group position={[0.001, 0.002, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh48_mesh.geometry}
            material={materials['0.713725_0.760784_0.800000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh48_mesh_1.geometry}
            material={materials['0.713725_0.760784_0.800000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh48_mesh_2.geometry}
            material={materials['0.713725_0.760784_0.800000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh48_mesh_3.geometry}
            material={materials['0.713725_0.760784_0.800000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh48_mesh_4.geometry}
            material={materials['0.713725_0.760784_0.800000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh48_mesh_5.geometry}
            material={materials['0.713725_0.760784_0.800000_0.000000_0.000000']}
          />
        </group>
        <group position={[0.001, 0.002, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh64_mesh.geometry}
            material={materials['0.713725_0.760784_0.800000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh64_mesh_1.geometry}
            material={materials['0.713725_0.760784_0.800000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh64_mesh_2.geometry}
            material={materials['0.713725_0.760784_0.800000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh64_mesh_3.geometry}
            material={materials['0.713725_0.760784_0.800000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh64_mesh_4.geometry}
            material={materials['0.713725_0.760784_0.800000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh64_mesh_5.geometry}
            material={materials['0.713725_0.760784_0.800000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh64_mesh_6.geometry}
            material={materials['0.713725_0.760784_0.800000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh64_mesh_7.geometry}
            material={materials['0.713725_0.760784_0.800000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh64_mesh_8.geometry}
            material={materials['0.713725_0.760784_0.800000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh64_mesh_9.geometry}
            material={materials['0.713725_0.760784_0.800000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh64_mesh_10.geometry}
            material={materials['0.713725_0.760784_0.800000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh64_mesh_11.geometry}
            material={materials['0.713725_0.760784_0.800000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh64_mesh_12.geometry}
            material={materials['0.713725_0.760784_0.800000_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh64_mesh_13.geometry}
            material={materials['0.713725_0.760784_0.800000_0.000000_0.000000']}
          />
        </group>
        <group position={[0.001, 0.002, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh78_mesh.geometry}
            material={materials['0.239216_0.992157_0.035294_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh78_mesh_1.geometry}
            material={materials['0.239216_0.992157_0.035294_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh78_mesh_2.geometry}
            material={materials['0.239216_0.992157_0.035294_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh78_mesh_3.geometry}
            material={materials['0.239216_0.992157_0.035294_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh78_mesh_4.geometry}
            material={materials['0.239216_0.992157_0.035294_0.000000_0.000000']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh78_mesh_5.geometry}
            material={materials['0.239216_0.992157_0.035294_0.000000_0.000000']}
          />
        </group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh0_mesh.geometry}
          material={materials['0.811765_0.858824_0.898039_0.000000_0.000000']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh0_mesh_1.geometry}
          material={materials['0.811765_0.858824_0.898039_0.000000_0.000000']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh0_mesh_2.geometry}
          material={materials['0.811765_0.858824_0.898039_0.000000_0.000000']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh0_mesh_3.geometry}
          material={materials['0.811765_0.858824_0.898039_0.000000_0.000000']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh0_mesh_4.geometry}
          material={materials['0.811765_0.858824_0.898039_0.000000_0.000000']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh0_mesh_5.geometry}
          material={materials['0.811765_0.858824_0.898039_0.000000_0.000000']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh0_mesh_6.geometry}
          material={materials['0.811765_0.858824_0.898039_0.000000_0.000000']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh0_mesh_7.geometry}
          material={materials['0.811765_0.858824_0.898039_0.000000_0.000000']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh0_mesh_8.geometry}
          material={materials['0.811765_0.858824_0.898039_0.000000_0.000000']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh33_mesh.geometry}
          material={materials['0.239216_0.992157_0.035294_0.000000_0.000000']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh33_mesh_1.geometry}
          material={materials['0.239216_0.992157_0.035294_0.000000_0.000000']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh33_mesh_2.geometry}
          material={materials['0.239216_0.992157_0.035294_0.000000_0.000000']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh33_mesh_3.geometry}
          material={materials['0.239216_0.992157_0.035294_0.000000_0.000000']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh33_mesh_4.geometry}
          material={materials['0.239216_0.992157_0.035294_0.000000_0.000000']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh33_mesh_5.geometry}
          material={materials['0.239216_0.992157_0.035294_0.000000_0.000000']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh33_mesh_6.geometry}
          material={materials['0.239216_0.992157_0.035294_0.000000_0.000000']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh33_mesh_7.geometry}
          material={materials['0.239216_0.992157_0.035294_0.000000_0.000000']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh33_mesh_8.geometry}
          material={materials['0.239216_0.992157_0.035294_0.000000_0.000000']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh54_mesh.geometry}
          material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh54_mesh_1.geometry}
          material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh54_mesh_2.geometry}
          material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh54_mesh_3.geometry}
          material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh54_mesh_4.geometry}
          material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh54_mesh_5.geometry}
          material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh54_mesh_6.geometry}
          material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh54_mesh_7.geometry}
          material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh54_mesh_8.geometry}
          material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh54_mesh_9.geometry}
          material={materials['0.400000_0.400000_0.400000_0.000000_0.000000']}
        />
      </group>
    </Center>
  );
}

useGLTF.preload('/tech_door_highlight.gltf');
