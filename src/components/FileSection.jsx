import React, { useState, useEffect } from 'react'

export default function FileSection(){
  const [files, setFiles] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ai_scheduler_files') || '[]')
    } catch {
      return []
    }
  })

  const [desc, setDesc] = useState('')

  useEffect(() => {
    localStorage.setItem('ai_scheduler_files', JSON.stringify(files))
  }, [files])

  function handleUpload(e){
    const f = e.target.files[0]
    if(!f) return
    const url = URL.createObjectURL(f)
    const item = {
      id: Date.now(),
      name: f.name,
      size: f.size,
      type: f.type,
      url,
      description: desc,
      uploadedAt: new Date().toISOString()
    }
    setFiles(prev => [item, ...prev])
    setDesc('')
  }

  function handleDownload(file){
    const a = document.createElement('a')
    a.href = file.url
    a.download = file.name
    a.click()
  }

  return (
    <div>
      <label className="block mb-3">
        <input type="file" onChange={handleUpload} className="hidden" id="fileupload" />
        <div className="flex gap-2">
          <button onClick={() => document.getElementById('fileupload').click()} className="px-3 py-2 bg-slate-100 rounded">
            파일 선택
          </button>
          <input
            className="flex-1 border px-2 py-1 rounded"
            placeholder="파일 설명을 입력하세요"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
      </label>

      <div className="space-y-2 max-h-56 overflow-auto">
        {files.length === 0 && <p className="text-sm text-slate-500">업로드된 파일이 없습니다.</p>}
        {files.map(f => (
          <div key={f.id} className="flex items-center justify-between p-2 border rounded">
            <div>
              <div className="font-medium text-sm">{f.name}</div>
              <div className="text-xs text-slate-500">{new Date(f.uploadedAt).toLocaleString()}</div>
            </div>
            <div>
              <button onClick={() => handleDownload(f)} className="text-sm underline">다운로드</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
