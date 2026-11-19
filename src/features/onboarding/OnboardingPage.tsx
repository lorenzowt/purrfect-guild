import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TavernKeeperDialogue } from './TavernKeeperDialogue'
import { onboardingSteps } from './onboardingSteps'

export function OnboardingPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)

  function returnToGuildHall() {
    navigate('/guild', { replace: true })
  }

  function goNext() {
    if (currentStep === onboardingSteps.length - 1) returnToGuildHall()
    else setCurrentStep((step) => step + 1)
  }

  return (
    <section className="mx-auto max-w-4xl py-2" aria-label="Guild welcome tour">
      <p className="mb-3 font-bold text-cocoa-plum/70">A short welcome from the former owner</p>
      <TavernKeeperDialogue
        step={onboardingSteps[currentStep]}
        currentStep={currentStep}
        totalSteps={onboardingSteps.length}
        onBack={() => setCurrentStep((step) => Math.max(0, step - 1))}
        onNext={goNext}
        onSkip={returnToGuildHall}
      />
    </section>
  )
}
