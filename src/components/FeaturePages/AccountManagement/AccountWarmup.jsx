import { useState } from 'react'
import { useAppStore } from '../../../store'
import {
  PageShell, ActionButtons, AccountSelector, SectionCard,
  ConfigPanel, Field, useAutomationTask, TaskProgressView,
} from '../shared/FeatureHelpers'

export default function AccountWarmup({ feature }) {
  const selectedAccountIds = useAppStore((s) => s.selectedAccountIds)
  const [durationMinutes, setDurationMinutes] = useState(10)
  const [actionsPerMinute, setActionsPerMinute] = useState(3)
  const { statusMessage, busy, task, runTask, cancelTask, setStatusMessage } = useAutomationTask()

  const handleAction = async (label) => {
    if (label.toLowerCase().includes('pause')) {
      setStatusMessage('Use Cancel Task to stop the warmup.')
      return
    }
    if (!selectedAccountIds.length) return
    await runTask('warmup', {
      account_id: selectedAccountIds[0],
      duration_minutes: durationMinutes,
      actions_per_minute: actionsPerMinute,
    })
  }

  return (
    <PageShell title={feature.title} description={feature.description} actions={
      <ActionButtons actions={feature.actions} onAction={handleAction} disabled={busy || !selectedAccountIds.length} busy={busy} />
    }>
      <div className="grid lg:grid-cols-[320px_1fr] gap-5">
        <div className="space-y-4">
          <AccountSelector />
          <SectionCard title="Status" icon="📊">
            {statusMessage ? <p className="text-sm text-slate-300 leading-relaxed">{statusMessage}</p>
              : <p className="text-xs text-slate-600">No active task.</p>}
            <TaskProgressView task={task} busy={busy} onCancel={cancelTask} />
          </SectionCard>
        </div>
        <div className="space-y-4">
          <ConfigPanel title="Warmup Settings" icon="🔥">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Duration (minutes)" hint="How long to warm up the account">
                <input className="input" type="number" min={1} max={60} value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))} />
              </Field>
              <Field label="Actions per minute" hint="Browse, scroll, hover — 3 is safe">
                <input className="input" type="number" min={1} max={10} value={actionsPerMinute}
                  onChange={(e) => setActionsPerMinute(Number(e.target.value))} />
              </Field>
            </div>
          </ConfigPanel>
          <SectionCard title="What warmup does" icon="ℹ️">
            <ul className="text-sm text-slate-400 space-y-1.5 list-none">
              {['Navigates Marketplace categories naturally','Scrolls and hovers over listings','Builds trust signals before posting','Reduces ban risk on new accounts'].map((t) => (
                <li key={t} className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span>{t}</li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>
    </PageShell>
  )
}
