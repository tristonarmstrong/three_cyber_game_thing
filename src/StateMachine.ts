// StateMachine.ts

import { NameType } from "./CharacterController";
import CharacterControllerInput, { InputKeysNamesType } from "./CharacterControllerInput";
import IdleState from "./IdleState";
import { State } from "./State";
import WalkState from "./WalkState";

export type StateMachineStatesType = new (parent: any) => IdleState | WalkState

export default class StateMachine {
	private _currentState: State | null;
	private _states: Record<NameType, StateMachineStatesType>;

	constructor() {
		this._states = {} as Record<NameType, StateMachineStatesType>
		this._currentState = null
	}

	public get currentState() {
		return this._currentState
	}

	public addState = (name: NameType, type: StateMachineStatesType): void => {
		this._states[name] = type
	}

	public setState = (name: NameType) => {
		const prevState = this._currentState
		if (prevState) {
			if (prevState.name == name) {
				return
			}
			prevState.exit()
		}

		//@ts-ignore
		const state = new this._states[name](this)
		this._currentState = state
		state.enter(prevState)
	}

	public update = (timeElapsed: number, input: CharacterControllerInput) => {
		if (!this._currentState) return
		this._currentState.update(timeElapsed, input)
	}
}

