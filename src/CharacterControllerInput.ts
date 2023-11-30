//CharacterControllerInput.ts

export type InputKeysNamesType = 'forward' | 'backward' | 'left' | 'right' | 'space' | 'shift'

export type InputKeysType = Record<InputKeysNamesType, boolean>

export default class CharacterControllerInput {
	private _keys: InputKeysType

	constructor() {
		this._keys = {} as InputKeysType
		this._init()
	}

	get keys() {
		return this._keys
	}

	private _init = () => {
		document.addEventListener('keydown', e => this._onKeyDown(e), false)
		document.addEventListener('keyup', e => this._onKeyUp(e), false)
		this._keys = {
			forward: false,
			backward: false,
			left: false,
			right: false,
			space: false,
			shift: false
		}
	}

	private _onKeyDown = (e: KeyboardEvent) => {
		switch (e.keyCode) {
			case 87: //'w' || 'W':
				this._keys.forward = true
				break
			case 65: //'a' || 'A':
				this._keys.left = true
				break
			case 83: //'s'||'S':
				this._keys.backward = true
				break
			case 68: //'d' || 'D':
				this._keys.right = true
				break
			case 32: //'Space':
				this._keys.space = true
				break
			case 16: //'Shift':
				this._keys.shift = true
				break
		}
	}

	private _onKeyUp = (e: KeyboardEvent) => {
		switch (e.keyCode) {
			case 87: //'w' || 'W':
				this._keys.forward = false
				break
			case 65: //'a' || 'A':
				this._keys.left = false
				break
			case 83: //'s' || 'S':
				this._keys.backward = false
				break
			case 68: //'d' || 'D':
				this._keys.right = false
				break
			case 32: //'Space':
				this._keys.space = false
				break
			case 16: //'Shift':
				this._keys.shift = false
				break
		}

	}
}
