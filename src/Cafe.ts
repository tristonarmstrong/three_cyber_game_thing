// Cafe.ts
import CustomMesh from '../src/CustomMesh'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import Engine from './Engine'
import * as THREE from 'three'

export default class Cafe extends CustomMesh {
	loader = new FBXLoader()
	constructor(engine: Engine) {
		super(engine)
		this.loader.load('assets/models/FBX/SM_Bld_Cafe_01.fbx', this._handleObjectload)
	}

	_handleObjectload = (object: THREE.Object3D<THREE.Event>) => {
		object.traverse(this._manageObjectLoadChild)
		object.scale.set(.1, .1, .1)
		object.castShadow = true
		this.engine.scene.add(object)
	}

	_manageObjectLoadChild = (child: { isMesh: any; castShadow: boolean; receiveShadow: boolean; material: { map: THREE.Texture } }) => {
			//@ts-ignore
			if (!child.isMesh) return
			child.castShadow = true
			child.receiveShadow = true
			//@ts-ignore
			new THREE.TextureLoader().loadAsync('assets/models/Textures/Polygon_Texture_01_A.png').then(texture => child.material.map = texture)
	}
}