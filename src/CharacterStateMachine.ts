// CharacterStateMachine.ts

import { NameType } from "./CharacterController";
import CharacterControllerProxy from "./CharacterControllerProxy";
import IdleState from "./IdleState";
import RunState from "./RunState";
import { State } from "./State";
import StateMachine, { StateMachineStatesType } from "./StateMachine";
import WalkState from "./WalkState";

export default class CharacterStateMachine extends StateMachine {
	private _characterControllerProxy: CharacterControllerProxy;
	constructor(characterControllerProxy: CharacterControllerProxy) {
		super()
		this._characterControllerProxy = characterControllerProxy
		this._init()
	}

	get characterControllerProxy() {
		return this._characterControllerProxy
	}

	private _init = () => {
		//TODO add more states
		this.addState(NameType.IDLE, IdleState)
		this.addState(NameType.WALK, WalkState)
		this.addState(NameType.RUN, RunState)
	}
}

