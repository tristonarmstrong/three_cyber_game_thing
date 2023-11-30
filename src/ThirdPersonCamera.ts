// ThirdPersonCamera.ts
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js'
import * as THREE from 'three'
import { Group } from 'three'
import CharacterController from './CharacterController'

export default class ThirdPersonCamera {
	private _params: { camera: THREE.PerspectiveCamera, target: CharacterController['target']}
	private _camera: THREE.PerspectiveCamera
	private _currentPosition: THREE.Vector3
	private _currentLookat: THREE.Vector3
	private _enabled: boolean
	constructor(params: { camera: THREE.PerspectiveCamera, target: CharacterController['target']}) {
		this._params = params
		this._camera = params.camera
		this._enabled = false // TODO make sure im true

		const { position } = this._params.target as Group
		this._currentPosition = new THREE.Vector3(position.x, position.y, position.z)
		this._currentLookat = new THREE.Vector3(position.x, position.y, position.z)
	}

	public setEnabled = (value: boolean) => {
		this._enabled = value
	}

	update = (timeElapsed: number) => {
		if (!this._enabled) return
		const idealOffset = this._calculateIdealOffset()
		const idealLookup = this._calculateIdealLookat()

		// framerate normalizing coefficient
		const lerpCoefficient = 0.05 - Math.pow(.001, timeElapsed)

		if (!idealOffset || !idealLookup) throw new Error("idealOffset or idealLookat should not be falsy :: ThirdPersonCamera:28")

		this._currentPosition.lerp(idealOffset, lerpCoefficient)
		this._currentLookat.lerp(idealLookup, lerpCoefficient)

		this._camera.position.copy(this._currentPosition)
		this._camera.lookAt(this._currentLookat)
	}

	private _calculateIdealLookat() {
		const idealLookat = new THREE.Vector3(0, 1, 0)
		if (!this._params.target?.rotation) return
		idealLookat.applyEuler(this._params.target.rotation)
		idealLookat.add(this._params.target.position)
		return idealLookat
	}

	private _calculateIdealOffset() {
		const idealOffset = new THREE.Vector3(-3, 2, 0)
		if (!this._params.target?.rotation) return
		idealOffset.applyEuler(this._params.target.rotation)
		idealOffset.add(this._params.target.position)
		return idealOffset
	}

	private _setupControls = () => {
		const controls = new GUI()
		controls.addFolder('ThirdPersonCamera')

	}
}
