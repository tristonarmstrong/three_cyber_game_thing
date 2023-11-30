// WalkState.ts

import { NameType } from "./CharacterController";
import CharacterControllerInput from "./CharacterControllerInput";
import CharacterStateMachine from "./CharacterStateMachine";
import { State } from "./State";

export default class WalkState extends State {
	constructor(parent: CharacterStateMachine) {
		super(parent)
	}

	public get name() {
		return NameType.WALK
	}

	public enter = (prevState: State | null) => {
		const curAction = this.parent.characterControllerProxy.animations[NameType.WALK].action
		if (!prevState) throw new Error("Something went wrong - there should be a previous state prior to Walk :: WalkState:19")
		const prevAction = this.parent.characterControllerProxy.animations[prevState.name].action
		curAction.enabled = true

		if (prevState.name !== NameType.RUN) {
			curAction.time = 0.0
			curAction.setEffectiveTimeScale(1.0)
			curAction.setEffectiveWeight(1.0)
		} else {
			const ratio = curAction.getClip().duration / prevAction.getClip().duration
			curAction.time = prevAction.time * ratio
		}

		curAction.crossFadeFrom(prevAction, 0.5, true)
		curAction.play()
	}

	public exit = () => {
		const action = this.parent.characterControllerProxy.animations[NameType.WALK].action
		action.getMixer().removeEventListener('finished', e => console.log('CLEANUP: ', e))
	}

	public update = (_timeElapsed: number, input: CharacterControllerInput) => {
		if (input.keys.forward || input.keys.backward) {
			if (input.keys.shift) {
				this.parent.setState(NameType.RUN)
			}
		} else {
			this.parent.setState(NameType.IDLE)
		}
	}
}