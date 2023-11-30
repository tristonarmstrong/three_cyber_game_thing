// IdleState.ts

import { NameType } from "./CharacterController"
import CharacterControllerInput from "./CharacterControllerInput"
import CharacterStateMachine from "./CharacterStateMachine"
import { State } from "./State"


export default class IdleState extends State {
	constructor(parent: CharacterStateMachine) {
		super(parent)
	}

	public get name() {
		return NameType.IDLE
	}


	public enter = (prevState: State | null) => {
		const idleAction = this.parent.characterControllerProxy.animations[NameType.IDLE].action
		if (!prevState) {
			idleAction.play()
			return
		}
		const prevAction = this.parent.characterControllerProxy.animations[prevState.name].action
		idleAction.time = 0.0
		idleAction.enabled = true
		idleAction.setEffectiveTimeScale(1.0)
		idleAction.setEffectiveWeight(1.0)
		idleAction.crossFadeFrom(prevAction, 0.5, true)
		idleAction.play()
	}

	public exit = () => {
		const action = this.parent.characterControllerProxy.animations[NameType.IDLE].action
		action.getMixer().removeEventListener('finished', e => console.log('CLEANUP: ', e))
	}

	public update = (_elapsedTime: number, input: CharacterControllerInput) => {
		if (input.keys.forward || input.keys.backward) {
			this.parent.setState(NameType.WALK)
		} else if (input.keys.space) {
			//TODO add jump state
			//			this.parent.setState('jump')
		}
	}
}