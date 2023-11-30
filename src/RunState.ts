// RunState.ts

import { NameType } from "./CharacterController";
import CharacterControllerInput from "./CharacterControllerInput";
import CharacterStateMachine from "./CharacterStateMachine";
import { State } from "./State";

export default class RunState extends State {
	constructor(parent: CharacterStateMachine) {
		super(parent)
	}

	public get name() {
		return NameType.RUN
	}

	public enter = (prevState: State | null) => {
		const curAction = this.parent.characterControllerProxy.animations[NameType.RUN].action
		if (!prevState) throw new Error("Something went wrong - there should be a previous state prior to Run:: RunState:19")
		const prevAction = this.parent.characterControllerProxy.animations[prevState.name].action
		curAction.enabled = true

		if (prevState.name !== NameType.WALK) {
			curAction.time = 0.0
			curAction.setEffectiveTimeScale(1.0)
			curAction.setEffectiveWeight(1.0)
		} else {
			const ratio = curAction.getClip().duration / prevAction.getClip().duration
			curAction.time = prevAction.time * ratio
		}

		curAction.crossFadeFrom(prevAction, .09, true)
		curAction.play()
	}

	public exit = () => {
		const action = this.parent.characterControllerProxy.animations[NameType.RUN].action
		action.getMixer().removeEventListener('finished', e => console.log('CLEANUP: ', e))
	}

	public update = (_timeElapsed: number, input: CharacterControllerInput) => {
		if (!input.keys.shift) {
			this.parent.setState(NameType.WALK)
		}
	}
}