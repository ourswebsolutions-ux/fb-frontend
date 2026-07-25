import { useState } from 'react'
import { useAppStore } from '../../../store'
import {
  PageShell,
  ActionButtons,
  AccountTable,
  ConfigPanel,
  Field,
  useAutomationTask,
  TaskProgressView,
} from '../shared/FeatureHelpers'

export default function OpenAccounts({ feature }) {
  const selectedAccountIds = useAppStore((s) => s.selectedAccountIds)
  const [action, setAction] = useState('verify')
  const [activeAction, setActiveAction] = useState('')
  const { statusMessage, busy, task, runTask, cancelTask, setStatusMessage } = useAutomationTask()

  const handleAction = async (label) => {
    if (label.toLowerCase().includes('refresh')) {
      setStatusMessage('Refresh the account list on the left to see latest status.')
      return
    }
    if (!selectedAccountIds.length) return
    setActiveAction(label)
    await runTask('open-accounts', {
      account_ids: selectedAccountIds,
      action,
    })
  }

  return (
    <PageShell title={feature.title} description={feature.description} actions={
      <ActionButtons actions={feature.actions} onAction={handleAction} disabled={busy || !selectedAccountIds.length} busyAction={activeAction} busy={busy} />
    }>
      <div className="grid lg:grid-cols-2 gap-4">
        <AccountTable />
        <div className="space-y-3">
          {statusMessage && <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-slate-300">{statusMessage}</div>}
          <TaskProgressView task={task} busy={busy} onCancel={cancelTask} />
          <ConfigPanel>
            <Field label="Open account action">
              <select className="input" value={action} onChange={(e) => setAction(e.target.value)}>
                <option value="verify">Verify</option>
                <option value="open">Open</option>
                <option value="refresh">Refresh</option>
              </select>
            </Field>
            <Field label="Selected accounts">
              <p className="text-sm text-slate-400">{selectedAccountIds.length} accounts will be processed.</p>
            </Field>
          </ConfigPanel>
        </div>
      </div>
    </PageShell>
  )
}
