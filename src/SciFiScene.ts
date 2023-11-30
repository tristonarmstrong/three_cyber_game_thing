//SciFiScene.ts


import CustomMesh from '../src/CustomMesh'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import Engine from './Engine'
import * as THREE from 'three'

export default class SciFiScene extends CustomMesh {
	loader = new GLTFLoader()
	draco = new DRACOLoader()
	constructor(engine: Engine) {
		super(engine)
		this.draco.setDecoderPath('node_modules/three/examples/jsm/libs/draco/gltf/')
		this.loader.setDRACOLoader(this.draco)
		this.loader.load('assets/test/ScyFiPort.glb', this._handleObjectload)
	}

	_handleObjectload = (gltf: { scene: THREE.Object3D<THREE.Event> }): void => {
		const { scene } = gltf
		scene.scale.set(.5,.5,.5)
		scene.children.forEach(child => {
			child.receiveShadow = true
			child.castShadow = true
			if (child instanceof THREE.Mesh) {
				child.material.metalness = 0
				return
			}
			if (child instanceof THREE.Group) {
				child.children.forEach((subChild: THREE.Object3D<THREE.Event>) => {
					subChild.receiveShadow = true
					subChild.castShadow = true
					//@ts-ignore
					subChild.material.metalness = 0
				})
				return
			}
		})
		this.engine.scene.add(scene)
		scene.receiveShadow = true
		scene.castShadow = true
	}
}