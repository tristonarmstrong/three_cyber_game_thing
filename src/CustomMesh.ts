// CustomMesh.ts
import * as THREE from 'three'
import Engine from './Engine'

export default class CustomMesh extends THREE.Object3D<THREE.Event> {
	engine: Engine
	update: (...args: any[]) => void
	constructor(engine: Engine) {
		super()
		this.engine = engine
		this.update = (...args: any[]) => {}
	}
}
