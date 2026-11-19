import { useState } from 'react'
import { Dialog } from '../../components/ui'
import { HeroForm } from './HeroForm'
import { heroErrorMessage, heroValidationErrors, useHeroMutations } from './useHeroMutations'

export function HeroRecruitmentDialog({ open, onClose, onRecruit }: { open: boolean; onClose: () => void; onRecruit: (name: string) => void }) {
  const { createMutation } = useHeroMutations()
  const [errors, setErrors] = useState<Record<string, string>>({})

  function close() {
    if (createMutation.isPending) return
    setErrors({})
    onClose()
  }

  function recruit(input: { name: string; hero_class: 'warrior' | 'cleric' | 'mage' | 'rogue' }) {
    setErrors({})
    createMutation.mutate(input, {
      onSuccess: () => { onClose(); onRecruit(input.name) },
      onError: (error) => {
        const validation = heroValidationErrors(error)
        setErrors(validation)
        if (Object.keys(validation).length === 0) setErrors({ form: heroErrorMessage(error, 'Recruitment did not go through. Please try again.') })
      },
    })
  }

  return <Dialog open={open} title="Recruit an adventurer" onClose={close}>{errors.form && <p role="alert" className="mb-4 rounded-lg bg-dusty-pink/40 p-3 font-bold">{errors.form}</p>}<HeroForm submitLabel="Welcome to the guild" isSubmitting={createMutation.isPending} errors={errors} onSubmit={recruit} /></Dialog>
}
