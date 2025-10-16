import React from 'react'

export default function UserProfile(){
  const user = JSON.parse(localStorage.getItem('ai_scheduler_user') || '{}')
  const name = user.email ? user.email.split('@')[0] : 'G'

  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-sky-200 flex items-center justify-center text-white font-bold">
        {name[0]?.toUpperCase() || 'G'}
      </div>
      <div>
        <div className="font-semibold">{name}</div>
        <div className="text-sm text-slate-500">{user.email || 'no-email'}</div>
      </div>
    </div>
  )
}
