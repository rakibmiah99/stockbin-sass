'use client'

import { useState } from 'react'

export function Toggle({ on, onChange, disabled }: { on: boolean; onChange?: (next: boolean) => void; disabled?: boolean }) {
  const [uncontrolledActive, setUncontrolledActive] = useState(on)
  // Controlled when a caller wants to react to the change (e.g. persist it);
  // otherwise stays self-contained for purely decorative toggles.
  const active = onChange ? on : uncontrolledActive

  function toggle() {
    if (disabled) return
    const next = !active
    if (onChange) {
      onChange(next)
    } else {
      setUncontrolledActive(next)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={disabled}
      className={`relative rounded-full transition-colors ${active ? 'bg-primary' : 'bg-border'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{ height: 22, width: 40 }}
    >
      <span
        className="absolute bg-white rounded-full shadow transition-[left] duration-200"
        style={{ width: 18, height: 18, top: 2, left: active ? 18 : 2 }}
      />
    </button>
  )
}
