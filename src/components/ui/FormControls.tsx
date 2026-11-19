import { cloneElement, useId } from 'react'
import type { InputHTMLAttributes, ReactElement, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

const controlClassName = 'w-full rounded-lg border-2 border-soft-caramel bg-vanilla-cream px-3 py-2 text-cocoa-plum placeholder:text-cocoa-plum/60 transition-colors hover:border-cocoa-plum focus:border-cocoa-plum disabled:cursor-not-allowed disabled:bg-soft-caramel/30 disabled:opacity-70 motion-reduce:transition-none'

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${controlClassName} ${className}`} {...props} />
}

export function Textarea({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${controlClassName} min-h-24 resize-y ${className}`} {...props} />
}

export function Select({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`${controlClassName} ${className}`} {...props}>{children}</select>
}

interface FieldProps {
  label: string
  hint?: string
  error?: string
  children: ReactNode
}

export function Field({ label, hint, error, children }: FieldProps) {
  const id = useId()
  const descriptionId = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  const control = children as ReactElement<{ id?: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean }>

  return (
    <div className="grid gap-1.5">
      <label className="font-bold text-cocoa-plum" htmlFor={id}>{label}</label>
      {cloneElement(control, { id, 'aria-describedby': descriptionId, 'aria-invalid': Boolean(error) || undefined })}
      {error ? <p id={`${id}-error`} className="text-sm font-bold text-berry-red" role="alert">{error}</p> : hint ? <p id={`${id}-hint`} className="text-sm text-cocoa-plum/75">{hint}</p> : null}
    </div>
  )
}
