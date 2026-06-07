import React, { useEffect, useState } from 'react'

interface CopyableUrlProps {
  url?: string
  label?: string
}

export default function CopyableUrl({ url = '', label = 'URL' }: CopyableUrlProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch (e) {
      console.error('Copy failed', e)
    }
  }

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(t)
  }, [copied])

  return (
    <div className="flex items-center gap-2">
      <label className="sr-only">{label}</label>
      <input
        readOnly
        value={url}
        onClick={(e) => (e.currentTarget as HTMLInputElement).select()}
        className="w-full rounded border px-3 py-2 text-sm"
        placeholder="No URL yet"
        aria-label={label}
      />
      <button
        type="button"
        onClick={handleCopy}
        className="ml-2 rounded bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}
