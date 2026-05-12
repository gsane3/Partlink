'use client'

import { useRef } from 'react'
import type { FormState } from '../types'

interface PhotosStepProps {
  photos: FormState['photos']
  onAdd: (urls: string[]) => void
  onRemove: (index: number) => void
}

export function PhotosStep({ photos, onAdd, onRemove }: PhotosStepProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const urls = files.map((f) => URL.createObjectURL(f))
    onAdd(urls)
    e.target.value = ''
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="sr-only"
        onChange={handleChange}
      />

      {photos.length < 8 && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full h-44 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-colors mb-4"
        >
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-600">Τράβηξε ή επίλεξε φωτογραφία</p>
            <p className="text-xs text-slate-400 mt-0.5">Έως 8 φωτογραφίες</p>
          </div>
        </button>
      )}

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {photos.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(i)}
                aria-label="Αφαίρεση φωτογραφίας"
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {i === 0 && (
                <span className="absolute bottom-1.5 left-1.5 text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-medium">
                  Κύρια
                </span>
              )}
            </div>
          ))}
          {photos.length < 8 && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              aria-label="Προσθήκη φωτογραφίας"
              className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-300 hover:text-slate-500 transition-colors"
            >
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>
      )}

      <p className="text-center text-xs text-slate-400">
        {photos.length === 0
          ? 'Η πρώτη φωτογραφία γίνεται η κύρια εικόνα στο marketplace'
          : `${photos.length} φωτογραφία${photos.length !== 1 ? 'ι' : ''} · Η πρώτη είναι η κύρια εικόνα`}
      </p>
    </div>
  )
}
