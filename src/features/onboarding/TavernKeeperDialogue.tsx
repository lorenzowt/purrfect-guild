import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Badge, Button, Panel } from '../../components/ui'
import type { OnboardingStep } from './onboardingSteps'

interface TavernKeeperDialogueProps {
  step: OnboardingStep
  currentStep: number
  totalSteps: number
  onBack: () => void
  onNext: () => void
  onSkip: () => void
}

export function TavernKeeperDialogue({ step, currentStep, totalSteps, onBack, onNext, onSkip }: TavernKeeperDialogueProps) {
  const reduceMotion = useReducedMotion()
  const isLastStep = currentStep === totalSteps - 1

  return (
    <Panel className="overflow-hidden p-0">
      <div className="grid md:grid-cols-[12rem_1fr]">
        <div className="keeper-portrait grid min-h-48 place-items-center border-b-2 border-soft-caramel p-6 text-center md:border-r-2 md:border-b-0" aria-hidden="true">
          <span className="text-7xl">🐈</span>
          <span className="pixel-heading mt-3 text-[0.55rem]">Bramble</span>
        </div>
        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge variant="magic">Bramble, retired keeper</Badge>
            <p className="text-sm font-bold text-cocoa-plum/70">Step {currentStep + 1} of {totalSteps}</p>
          </div>
          <div className="mt-5 min-h-44" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentStep}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <h1 className="pixel-heading text-sm sm:text-base">{step.title}</h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-cocoa-plum/85">{step.dialogue}</p>
                <p className="mt-5 inline-flex rounded-full border border-cocoa-plum bg-soft-caramel/45 px-3 py-1 text-sm font-extrabold">{step.highlight}</p>
                {step.destination && <Link className="mt-5 block w-fit font-bold text-cocoa-plum underline" to={step.destination.to}>{step.destination.label}</Link>}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t-2 border-soft-caramel pt-5">
            <Button variant="ghost" onClick={onSkip}>Skip tour</Button>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={onBack} disabled={currentStep === 0}>Back</Button>
              <Button onClick={onNext}>{isLastStep ? 'Explore the Guild Hall' : 'Next'}</Button>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  )
}
