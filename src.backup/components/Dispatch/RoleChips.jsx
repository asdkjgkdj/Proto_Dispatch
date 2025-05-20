import React from 'react'
import { Button } from '../ui/button'
export default function RoleChips({ roles }) {
  return (
    <div className="flex flex-wrap gap-2">
      {roles.map(r=>(
        <Button key={r} className="px-2 py-1 text-sm">{r}</Button>
      ))}
    </div>
  )
}