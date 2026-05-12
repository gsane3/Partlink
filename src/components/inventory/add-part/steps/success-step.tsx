import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import { ROUTES } from '@/lib/routes'
import type { FormState } from '../types'

interface SuccessStepProps {
  form: FormState
  sku: string
  onReset: () => void
}

export function SuccessStep({ form, sku, onReset }: SuccessStepProps) {
  return (
    <div className="pt-4 pb-12">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Το ανταλλακτικό προστέθηκε!</h2>
        <p className="text-sm text-slate-500 mt-1.5 max-w-xs mx-auto">
          {form.publishToMarketplace
            ? 'Προστέθηκε στο stock και δημοσιεύτηκε στο marketplace.'
            : 'Προστέθηκε στο stock σου.'}
        </p>
      </div>

      {/* SKU */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 mb-4">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">SKU</p>
        <p className="text-lg font-mono font-bold text-slate-900 tracking-widest">{sku}</p>
        <p className="text-xs text-slate-500 mt-1">
          {form.partName} · {form.make} {form.model} {form.year}
        </p>
      </div>

      {/* QR code */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 flex flex-col items-center">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-4">QR Label</p>
        <div className="p-3 border border-slate-100 rounded-lg bg-white">
          <QRCodeSVG
            value={`partlink:seller-001:${sku}`}
            size={148}
            level="M"
          />
        </div>
        <p className="text-xs font-mono text-slate-500 mt-3 tracking-wider">{sku}</p>
        <p className="text-xs text-slate-400 mt-0.5 text-center">
          {form.make} {form.model} {form.year} · {form.partName}
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() => window.print()}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Εκτύπωση QR label
        </button>

        <Link
          href={ROUTES.SELLER.INVENTORY}
          className="w-full h-11 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 active:bg-slate-100 transition-colors"
        >
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Δες το stock
        </Link>

        <button
          type="button"
          onClick={onReset}
          className="w-full h-11 text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1.5 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Πρόσθεσε άλλο ανταλλακτικό
        </button>
      </div>
    </div>
  )
}
