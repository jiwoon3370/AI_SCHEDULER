import React, { useState, useEffect } from 'react'
import UserProfile from './UserProfile'
import FileSection from './FileSection'

export default function Sidebar({ collapsed, setCollapsed }){
  const [isCollapsed, setIsCollapsed] = useState(collapsed)

  useEffect(() => setIsCollapsed(collapsed), [collapsed])

  function toggle() {
    setIsCollapsed(prev => {
      const nv = !prev
      setCollapsed(nv)
      return nv
    })
  }

  return (
    <aside className={`bg-white border-r transition-all duration-200 ${isCollapsed ? 'w-20' : 'w-72'} h-screen p-4`}>
      <div className="flex items-center justify-between mb-6">
  <h2 className={`text-lg font-semibold ${isCollapsed ? 'hidden' : ''}`}>{import.meta.env.VITE_SITE_NAME || ''}</h2>
        <button onClick={toggle} className="p-2 rounded hover:bg-slate-100">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className={`${isCollapsed ? 'opacity-0 pointer-events-none' : ''} transition-opacity`}>
        <UserProfile />
        <div className="mt-6">
          <FileSection />
        </div>
      </div>

      {/* collapsed 상태일때 아이콘 전용 영역 */}
      {isCollapsed && (
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="w-10 h-10 bg-slate-100 rounded" />
          <div className="w-10 h-10 bg-slate-100 rounded" />
        </div>
      )}
    </aside>
  )
}
