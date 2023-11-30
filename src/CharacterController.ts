//CharacterController.ts

import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import CharacterControllerInput from "./CharacterControllerInput";
import CharacterControllerProxy, { AnimationsType } from "./CharacterControllerProxy";
import CharacterStateMachine from "./CharacterStateMachine";


export enum NameType {
	IDLE = 'idle',
	WALK = 'walk',
	RUN = "run"
}

export default class CharacterController {
	private _input: CharacterControllerInput;
	private _stateMachine: CharacterStateMachine;
	private _target: THREE.Group | null;
	private _params: { camera: THREE.Camera, scene: THREE.Scene };
	private _manager: THREE.LoadingManager;
	private _mixer: THREE.AnimationMixer | null;
	private _animations: AnimationsType;
	private _decceleration: THREE.Vector3;
	private _acceleration: THREE.Vector3;
	private _velocity: THREE.Vector3;

	// temp code
	clock = new THREE.Clock()
	modelLoadCompleteCallbacks: Array<()=>void> = [];

	constructor(params: { camera: THREE.Camera, scene: THREE.Scene }) {
		this._params = params
		this._manager = new THREE.LoadingManager()
		this._target = null
		this._mixer = null
		this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0)
		this._acceleration = new THREE.Vector3(1, 0.25, 4.0)
		this._velocity = new THREE.Vector3(0, 0, 0)
		this._animations = {}
		this._input = new CharacterControllerInput()
		this._stateMachine = new CharacterStateMachine(new CharacterControllerProxy(this._animations))
		this._loadModels()
	}

	get target(){
		return this._target
	}

	private _loadModels = () => {
		const loader = new FBXLoader()
		loader.setPath('assets/test/')
		loader.load('alienchar.fbx', fbx => {
			fbx.scale.set(.5,.5,.5)
			fbx.traverse(c => {
				c.castShadow = true
				if (c instanceof THREE.SkinnedMesh) {
					c.material = new THREE.MeshStandardMaterial()
					c.material.map = new THREE.TextureLoader().load("assets/test/PolygonScifi_01_A.png")
				}
			})
			this._target = fbx
			this._params.scene.add(this._target)
			this._mixer = new THREE.AnimationMixer(this._target)
			this._manager.onLoad = () => {
				this.modelLoadCompleteCallbacks?.forEach(cb => cb())
				this._stateMachine.setState(NameType.IDLE)
			}


			const loader = new FBXLoader(this._manager)
			loader.setPath('assets/test/')
			loader.load('walk.fbx', a => this.OnLoad(NameType.WALK, a))
			loader.load('idle.fbx', a => this.OnLoad(NameType.IDLE, a))
			loader.load('run.fbx', a => this.OnLoad(NameType.RUN, a))
		})
	}

	public transportCharacter = (location: THREE.Vector3, rotation: THREE.Vector3 = new THREE.Vector3()) => {
		if (!this._target) {
			return
		}
		this._target.position.set(location.x, location.y, location.z)
		this._target.rotation.set(rotation.x, rotation.y, rotation.z)
	}

	OnLoad = (animationName: NameType, animation: THREE.Group) => {
		const clip = animation.animations[0]
		const action = this._mixer?.clipAction(clip)
		if (!action) throw new Error("There is no action present :: CharacterController:68")
		this._animations[animationName] = { clip, action }
	}

	update = (_timeElapsed: number) => {
		if (!this._target) return
		let timeElapsed = this.clock.getDelta()
		this._stateMachine.update(timeElapsed, this._input)

		const velocity = this._velocity
		const frameDecceleration = new THREE.Vector3(
			velocity.x * this._decceleration.x,
			velocity.y * this._decceleration.y,
			velocity.z * this._decceleration.z
		)
		frameDecceleration.multiplyScalar(timeElapsed)
		frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(Math.abs(frameDecceleration.z), Math.abs(velocity.z))
		velocity.add(frameDecceleration)

		const controlObject = this._target
		if (controlObject === null) { throw new Error("target is falsy > need target :: CharacterController:89") }
		const _Q = new THREE.Quaternion()
		const _A = new THREE.Vector3()
		const _R = controlObject.quaternion.clone()

		const acc = this._acceleration.clone()

		if (this._input.keys.shift) {
			acc.multiplyScalar(2.0)
		}
		if (this._stateMachine.currentState?.name === 'dance') {
			acc.multiplyScalar(0.0)
		}
		if (this._input.keys.forward) {
			velocity.z += acc.z * timeElapsed
		}
		if (this._input.keys.backward) {
			velocity.z -= acc.z * timeElapsed
		}
		if (this._input.keys.left) {
			_A.set(0, 1, 0)
			_Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeElapsed * this._acceleration.y)
			_R.multiply(_Q)
		}
		if (this._input.keys.right) {
			_A.set(0, 1, 0)
			_Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeElapsed * this._acceleration.y)
			_R.multiply(_Q)
		}

		controlObject.quaternion.copy(_R)
		const oldPosition = new THREE.Vector3()
		oldPosition.copy(controlObject.position)

		const forward = new THREE.Vector3(0, 0, 1)
		forward.applyQuaternion(controlObject.quaternion)
		forward.normalize()

		const sideways = new THREE.Vector3(1, 0, 0)
		sideways.applyQuaternion(controlObject.quaternion)
		sideways.normalize()

		sideways.multiplyScalar(velocity.x * timeElapsed)
		forward.multiplyScalar(velocity.z * timeElapsed)

		controlObject.position.add(forward)
		controlObject.position.add(sideways)

		oldPosition.copy(controlObject.position)
		this._mixer && this._mixer.update(timeElapsed)
	}
}