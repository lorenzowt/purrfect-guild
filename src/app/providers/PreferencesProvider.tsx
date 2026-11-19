import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'

const preferencesStorageKey = 'purrfect-guild:preferences'

export interface PlayerPreferences {
  soundEffects: boolean
  reduceMotion: boolean
}

const defaultPreferences: PlayerPreferences = {
  soundEffects: true,
  reduceMotion: false,
}

interface PreferencesContextValue extends PlayerPreferences {
  setSoundEffects: (enabled: boolean) => void
  setReduceMotion: (enabled: boolean) => void
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null)

function readPreferences(): PlayerPreferences {
  try {
    const stored = window.localStorage.getItem(preferencesStorageKey)
    if (!stored) return defaultPreferences
    const parsed = JSON.parse(stored) as Partial<PlayerPreferences>
    return {
      soundEffects: typeof parsed.soundEffects === 'boolean' ? parsed.soundEffects : defaultPreferences.soundEffects,
      reduceMotion: typeof parsed.reduceMotion === 'boolean' ? parsed.reduceMotion : defaultPreferences.reduceMotion,
    }
  } catch {
    return defaultPreferences
  }
}

export function PreferencesProvider({ children }: PropsWithChildren) {
  const [preferences, setPreferences] = useState<PlayerPreferences>(readPreferences)

  useEffect(() => {
    window.localStorage.setItem(preferencesStorageKey, JSON.stringify(preferences))
    document.documentElement.toggleAttribute('data-reduced-motion', preferences.reduceMotion)
  }, [preferences])

  const value = useMemo<PreferencesContextValue>(() => ({
    ...preferences,
    setSoundEffects: (soundEffects) => setPreferences((current) => ({ ...current, soundEffects })),
    setReduceMotion: (reduceMotion) => setPreferences((current) => ({ ...current, reduceMotion })),
  }), [preferences])

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePlayerPreferences() {
  const context = useContext(PreferencesContext)
  if (!context) throw new Error('usePlayerPreferences must be used within PreferencesProvider')
  return context
}
