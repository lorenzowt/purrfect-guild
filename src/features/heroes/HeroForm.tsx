import type { FormEvent } from 'react'
import { Button, Field, Input, Select } from '../../components/ui'
import type { HeroCreateInput } from './heroesApi'

interface HeroFormProps {
  initialValues?: HeroCreateInput
  errors?: Record<string, string>
  isSubmitting?: boolean
  submitLabel: string
  onSubmit: (input: HeroCreateInput) => void
}

export function HeroForm({ initialValues, errors = {}, isSubmitting = false, submitLabel, onSubmit }: HeroFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    onSubmit({ name: String(form.get('name')), hero_class: String(form.get('hero_class')) as HeroCreateInput['hero_class'] })
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
      <Field label="Adventurer name" hint="Up to 45 characters." error={errors.name}><Input name="name" defaultValue={initialValues?.name} maxLength={45} required autoComplete="off" /></Field>
      <Field label="Class" error={errors.hero_class}><Select name="hero_class" defaultValue={initialValues?.hero_class ?? 'warrior'} required><option value="warrior">Warrior</option><option value="cleric">Cleric</option><option value="mage">Mage</option><option value="rogue">Rogue</option></Select></Field>
      <Button type="submit" loading={isSubmitting}>{submitLabel}</Button>
    </form>
  )
}
