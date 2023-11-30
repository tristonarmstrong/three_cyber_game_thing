// State.ts

import CharacterControllerInput, { InputKeysNamesType } from "./CharacterControllerInput";
import CharacterStateMachine from "./CharacterStateMachine";



export class State {
	private _parent: CharacterStateMachine;
	constructor(parent: CharacterStateMachine) {
		this._parent = parent
	}
	get name() {
		return 'unset_name'
	}
	get parent() {
		return this._parent
	}
	public enter = (prevState: State | null) => { }
	public exit = () => { }
	public update = (time: number, input: CharacterControllerInput) => { }
}