// Lights.ts
import * as THREE from 'three'
import Engine from "./Engine"
import { CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export default class Lights {
	engine: Engine
	sunlight: THREE.DirectionalLight
	sunlightHelper: THREE.DirectionalLightHelper
	ambientLight: THREE.AmbientLight

	constructor(engine: Engine) {
		this.engine = engine
		this.sunlight = new THREE.DirectionalLight("#ffffff", 0.3)
		this.sunlightHelper = new THREE.DirectionalLightHelper(this.sunlight, 1, "#ffffff")
		this.ambientLight = new THREE.AmbientLight("#26009c", 0.25)
		this._init()
	}

	_init = () => {
		this.engine.scene.add(this.sunlight)
		this.engine.scene.add(this.sunlight.target)
		this.engine.scene.add(this.sunlightHelper);
		this.engine.scene.add(this.ambientLight);
		this._setupDirectional()
		this._setupFoodStandLights()
	}

	_setupDirectional = () => {
		const config = { pos: { x: 10, y: 10, z: 5 }, rotation: { x: 0, y: 0, z: 0 } }
		this.sunlight.position.set(config.pos.x, config.pos.y, config.pos.z);
		this.sunlight.target.position.set(0, 0, 0)
		this.sunlight.castShadow = true
	}

	_setupFoodStandLights = () => {
		const pointlights = [
			[new THREE.PointLight(0xffffff, 1, 2), new THREE.Vector3(3, 1, 2)],
			[new THREE.PointLight(0xffffff, 1, 2), new THREE.Vector3(3.5, 1, 3.5)],
			[new THREE.PointLight(0xffffff, 1, 2), new THREE.Vector3(3.5, 1, 5)],
			[new THREE.PointLight(0xffffff, 1, 2), new THREE.Vector3(10, 1, 10)],
		] as const
		pointlights.forEach(([light, pos], i) => {
			light.position.set(pos.x, pos.y, pos.z)
			// text code here start
			const labelRenderer = new CSS2DRenderer()
			labelRenderer.setSize(window.innerWidth, window.innerHeight)
			labelRenderer.domElement.style.position = 'absolute'
			labelRenderer.domElement.style.top = '0px'
			labelRenderer.domElement.style.pointerEvents = 'none'
			document.body.appendChild(labelRenderer.domElement)
			const p = document.createElement('p')
			p.textContent = `${pos.x},${pos.y},${pos.z}`
			const label = new CSS2DObject(p)
			this.engine.scene.add(label)
			label.position.set(pos.x, pos.y, pos.z)
			// test code here end
			this.engine.debugControls.attach(light)
			this.engine.scene.add(light);
			this.engine.scene.add(new THREE.PointLightHelper(light, 0.5))
		})
	}
}