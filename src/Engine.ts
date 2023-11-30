import * as THREE from 'three'
//@ts-ignore lil gui exists just no type defs
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import Stats from 'three/examples/jsm/libs/stats.module.js' //TODO remove me

export interface UpdateableType extends Object {
	update: (...args: any[]) => any
}

let stats = Stats()
document.body.appendChild(stats.dom)
export default class Engine {
	scene = new THREE.Scene()
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
	renderer = new THREE.WebGL1Renderer({ antialias: false })
	/** any gameobjects that need to be updated on the clock go here */
	updateableItems = new Array<UpdateableType>()
	controlGui = new GUI()
	debugControls: TransformControls
	private _previousRun: number | null

	constructor() {
		let doc = document.querySelector<HTMLDivElement>("#app")
		doc?.appendChild(this.renderer.domElement)

		this.debugControls = new TransformControls(this.camera, this.renderer.domElement)
		this._previousRun = null
		this._initScene()
		this._initRenderer()
		this._initControls()
		this._initEventListeners()

		// temporary code
		const axesHelper = new THREE.AxesHelper(5);
		this.scene.add(axesHelper);
		const size = 20;
		const divisions = 20;

		const gridHelper = new THREE.GridHelper(size, divisions);
		this.scene.add(gridHelper);

	}

	/** This is the games main loop where everything that needs to be updated is updated e.g. object transforms */
	run = () => {
		requestAnimationFrame(t => {
			if (this._previousRun === null) {
				this._previousRun = t
			}
			this.run()
			this.renderer.render(this.scene, this.camera)
			this._step(t)
			stats.update() // TODO remove me
		})
	}

	private _step = (timeElapsed: number) => {
		this.updateableItems?.forEach((mesh) => mesh.update(timeElapsed))
	}

	addUpdateableItem = (item: UpdateableType | THREE.Object3D<THREE.Event>) => {
		this.updateableItems.push(item as UpdateableType)
		if (item instanceof THREE.Object3D) {
			this.scene.add(item)
		}
	}

	_initEventListeners = () => {
		window.addEventListener('resize', this._handleResize)
	}

	_initScene = () => {
		this.scene.background = new THREE.Color(0x000000)
		this.scene.fog = new THREE.FogExp2(0x000000, 0.1)
		//this.scene.environment = new THREE.PMREMGenerator(this.renderer).fromScene(new RoomEnvironment()).texture
	}

	_initRenderer = () => {
		this.renderer.setPixelRatio(window.devicePixelRatio)
		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.renderer.shadowMap.enabled = true
		this.renderer.shadowMap.type = THREE.BasicShadowMap
		this.renderer.toneMappingExposure = 1
		this.renderer.outputEncoding = THREE.sRGBEncoding
		this.renderer.physicallyCorrectLights = true
	}

	_initControls = () => {
		this.camera.position.set(-2, 2, 0)
		this.camera.rotateY(-90 * (Math.PI / 180))
		this.scene.add(this.debugControls)
	}


	_handleResize = () => {
		this.camera.aspect = window.innerWidth / window.innerHeight
		this.camera.updateProjectionMatrix()
		this.renderer.setSize(window.innerWidth, window.innerHeight)
	}
}