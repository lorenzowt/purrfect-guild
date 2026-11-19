import { useState } from 'react'
import { Badge, Button, Card, Dialog, EmptyState, Field, Input, LoadingIndicator, Panel, Select, Textarea } from '../components/ui'

export function App() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <main className="min-h-screen bg-vanilla-cream px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 text-center">
          <span className="pixel-sparkle text-soft-lavender" aria-hidden="true" />
          <h1 className="pixel-heading mt-3 text-xl text-cocoa-plum sm:text-2xl">Purrfect Guild</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-cocoa-plum/80">Temporary UI showcase for the cozy pixel RPG design system.</p>
        </header>

        <div className="grid gap-6">
          <Panel>
            <ShowcaseHeading title="Buttons" />
            <div className="flex flex-wrap gap-3">
              <Button>Start adventure</Button><Button variant="secondary">Secondary</Button><Button variant="magic">Magic</Button><Button variant="success">Heal</Button><Button variant="danger">Retire</Button><Button variant="ghost">Ghost</Button><Button loading>Saving</Button><Button disabled>Unavailable</Button>
            </div>
          </Panel>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card interactive>
              <ShowcaseHeading title="Cards & badges" />
              <p className="mb-4 text-cocoa-plum/80">Warm, readable panels use caramel borders and pixel shadows.</p>
              <div className="flex flex-wrap gap-2"><Badge variant="available">Available</Badge><Badge variant="on_mission">On mission</Badge><Badge variant="injured">Injured</Badge><Badge variant="deactivated">Deactivated</Badge></div>
            </Card>
            <Card>
              <ShowcaseHeading title="Loading" />
              <LoadingIndicator label="Preparing the guild hall…" />
            </Card>
          </div>

          <Panel>
            <ShowcaseHeading title="Form controls" />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Guild name" hint="A name fit for a cozy tavern."><Input placeholder="Whiskerwind Guild" /></Field>
              <Field label="Favourite class" error="Choose a class to continue."><Select defaultValue=""><option value="" disabled>Select a class</option><option>Warrior</option><option>Mage</option><option>Rogue</option><option>Cleric</option></Select></Field>
              <div className="md:col-span-2"><Field label="Guild notice"><Textarea placeholder="Share a friendly note…" /></Field></div>
            </div>
          </Panel>

          <EmptyState title="Nothing here yet" description="Empty states leave room for a warm explanation and a clear next step." action={<Button size="sm" onClick={() => setDialogOpen(true)}>Open dialog example</Button>} />
        </div>
      </div>

      <Dialog open={dialogOpen} title="A cozy modal" onClose={() => setDialogOpen(false)} footer={<Button onClick={() => setDialogOpen(false)}>Got it</Button>}>
        Dialogs keep their focusable close control first, close with Escape, and can be dismissed by selecting the backdrop.
      </Dialog>
    </main>
  )
}

function ShowcaseHeading({ title }: { title: string }) {
  return <h2 className="pixel-heading mb-4 text-xs text-cocoa-plum">{title}</h2>
}
