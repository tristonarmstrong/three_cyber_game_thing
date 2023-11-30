// alien_char.ts

import CustomMesh from '../src/CustomMesh'

import Engine from './Engine'
import * as THREE from 'three'
import CharacterController from './CharacterController'
import ThirdPersonCamera from './ThirdPersonCamera'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class AlienCharacter extends CustomMesh {
	private _characterController: CharacterController
	private _position: THREE.Vector3
	private _rotation: THREE.Vector3
	clock = new THREE.Clock()
	private _thirdPersonCamera: ThirdPersonCamera | null

	constructor(engine: Engine) {
		super(engine)
		this._thirdPersonCamera = null
		this._position = new THREE.Vector3(3, 0, 0)
		this._rotation = new THREE.Vector3(0, 0 * (Math.PI / 180))
		this._characterController = new CharacterController({ camera: this.engine.camera, scene: this.engine.scene })
		this.engine.addUpdateableItem(this)
		this._characterController.modelLoadCompleteCallbacks.push(() => {
			this._characterController.transportCharacter(this._position, this._rotation)
			this._setupThirdPersonCamera()
		})
	}

	//@ts-ignore
	get position() { return this._position }
	//@ts-ignore
	get rotation() { return this._rotation }

	private _setupThirdPersonCamera = () => {
		if (!this._characterController.target) return
		this._thirdPersonCamera = new ThirdPersonCamera({
			camera: this.engine.camera,
			target: this._characterController.target
		})
		this.engine.addUpdateableItem(this._thirdPersonCamera)
		this._setupCamera()
	}

	update = (timeElapsed: number) => {
		this._characterController.update(timeElapsed)
	}

	private _setupCamera = () => {
		let orbitFolder = this.engine.controlGui.addFolder('Orbit Controls').close()
		let controls: OrbitControls
		this.engine.debugControls.addEventListener('dragging-changed', e => {
			controls.enabled = !e.value
		})

		orbitFolder.add({ orbit: false }, 'orbit').onChange((val: boolean) => {
			this._thirdPersonCamera && this._thirdPersonCamera.setEnabled(!val)
			if (!val) return controls.dispose()
			controls = new OrbitControls(this.engine.camera, this.engine.renderer.domElement);
			controls.enabled = true
			controls.listenToKeyEvents(window); // optional
			controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
			controls.dampingFactor = 0.05;
			controls.screenSpacePanning = true;
			controls.minDistance = 1;
			controls.maxDistance = 100;
			controls.maxPolarAngle = Math.PI / 2;
		})

	}
}