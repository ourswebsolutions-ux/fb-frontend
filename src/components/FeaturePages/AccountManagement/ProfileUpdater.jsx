import { useState, useRef } from 'react'
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

function ImageUpload({ label, onFile, preview }) {
  const inputRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      onFile(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-16 h-16 rounded-lg object-cover border border-white/10"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-xs text-slate-600">
            No image
          </div>
        )}
        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
          <button
            type="button"
            className="btn-secondary text-xs"
            onClick={() => inputRef.current?.click()}
          >
            Choose from gallery
          </button>
          {preview && (
            <button
              type="button"
              className="btn-ghost text-xs ml-2"
              onClick={() => onFile('')}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </Field>
  )
}

export default function ProfileUpdater({ feature }) {
  const selectedAccountIds = useAppStore((s) => s.selectedAccountIds)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [profilePic, setProfilePic] = useState('')
  const [coverPic, setCoverPic] = useState('')
  const [activeAction, setActiveAction] = useState('')
  const { statusMessage, busy, task, runTask, cancelTask, setStatusMessage } = useAutomationTask()

  const handleAction = async (label) => {
    if (label.toLowerCase().includes('select')) {
      setStatusMessage('Accounts are listed on the left — use checkboxes to select.')
      return
    }
    if (label.toLowerCase().includes('upload')) {
      setStatusMessage('Use the image pickers below to upload profile and cover photos.')
      return
    }
    if (!selectedAccountIds.length) return
    setActiveAction(label)
    await runTask('profile-updater', {
      account_id: selectedAccountIds[0],
      name: name || null,
      bio: bio || null,
      location: location || null,
      profile_pic_url: profilePic || null,
      cover_pic_url: coverPic || null,
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
            <Field label="Full name">
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="New display name" />
            </Field>
            <Field label="Bio / About">
              <textarea className="input min-h-[80px]" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Short profile bio" />
            </Field>
            <Field label="Location">
              <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City or region" />
            </Field>
            <ImageUpload
              label="Profile picture"
              onFile={setProfilePic}
              preview={profilePic}
            />
            <ImageUpload
              label="Cover image"
              onFile={setCoverPic}
              preview={coverPic}
            />
          </ConfigPanel>
        </div>
      </div>
    </PageShell>
  )
}
