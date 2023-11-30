// CharacterControllerProxy.ts

import { AnimationClip } from "three"

export type AnimationsType = Record<string, { clip: THREE.AnimationClip, action: THREE.AnimationAction }>

export default class CharacterControllerProxy {
	private _animations: AnimationsType
	constructor(animations: AnimationsType) {
		this._animations = animations
	}
	get animations() {
		return this._animations
	}
}
