// Cube.ts
import CustomMesh from '../src/CustomMesh'
import Engine from '../src/Engine'
import * as THREE from 'three'

export default class Cube extends CustomMesh {
	geometry = new THREE.BoxGeometry(2, 2, 2)
	material = new THREE.MeshMatcapMaterial({ color: 0x00ff00 })
	constructor(engine: Engine) {
		super(engine)
		this.position.set(0, 0, 0)
		this.castShadow = true
		this.receiveShadow = true
		this.engine.addUpdateableItem(this)
		this.engine.debugControls.attach(this)
	}

	update = () => {
		//this.position.set(0,0,0)
		this.rotateX(.05)
		this.rotateY(0.01)
	}
}