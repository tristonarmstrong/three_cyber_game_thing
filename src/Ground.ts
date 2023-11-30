// Ground.ts

import CustomMesh from "./CustomMesh";
import Engine from "./Engine";
import * as THREE from 'three'

export default class Ground extends CustomMesh {
	geometry = new THREE.PlaneGeometry(100, 100)
	material = new THREE.MeshToonMaterial()
	constructor(engine: Engine){
		super(engine)
		this.engine = engine
		this.engine.addUpdateableItem(this)
		this.rotateX(-90*(Math.PI/180))
		this.receiveShadow = true
	}
}
