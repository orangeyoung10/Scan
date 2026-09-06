import { CheckCircle2, X, Coffee, Printer, Sparkles, Ruler } from 'lucide-react';
import { AffiliateCard } from '../common/AffiliateCard';
import { AFFILIATE_CONFIG } from '../../config/affiliates';
import { BeadSizeSpec } from '../../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportType: 'pdf' | 'png' | null;
  isMirrored?: boolean;
  beadSize?: BeadSizeSpec;
  t: any;
}

export function ExportModal({ isOpen, onClose, exportType, isMirrored, beadSize = '5.0mm', t }: ExportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6 text-black">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 border-2 border-black bg-white hover:bg-red-500 hover:text-white transition-colors cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-black border-2 border-black flex items-center justify-center shrink-0 text-yellow-300 shadow-[3px_3px_0px_0px_rgba(255,107,107,1)]">
            <CheckCircle2 className="w-6 h-6 text-red-500" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black uppercase tracking-tight text-black flex items-center gap-2">
              <span>{t.export_modal.title}</span>
              <Sparkles className="w-4 h-4 text-red-500" />
            </h3>
            <p className="text-xs text-gray-700 font-sans font-medium">
              {exportType === 'pdf' ? t.export_modal.pdf_downloaded : t.export_modal.png_downloaded}
            </p>
            <div className="flex items-center gap-1.5 flex-wrap mt-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-black bg-gray-100 px-2 py-0.5 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                {beadSize === '2.6mm' ? '2.6mm Mini Scale' : '5.0mm Midi Scale'}
              </span>
              {isMirrored && (
                <span className="text-[10px] font-black uppercase tracking-wider text-white bg-red-600 px-2 py-0.5 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  🪞 Pre-Mirrored (Tape Method)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 1:1 Scale Print Reminder Banner */}
        {exportType === 'pdf' && (
          <div className="p-4 bg-yellow-100 border-2 border-black text-xs text-black leading-relaxed shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-sans space-y-2">
            <div className="flex items-start gap-2.5">
              <Printer className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <div>
                <strong className="font-black uppercase tracking-wider block mb-0.5 text-black">
                  Print Setting: Actual Size (100% Scale)
                </strong>
                <span className="text-gray-800">
                  Disable "Fit to Page" or "Shrink to Printable Area" in your print dialog to prevent scale distortion.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2 border-t border-black/20 text-gray-900">
              <Ruler className="w-4 h-4 shrink-0 text-black mt-0.5" />
              <div>
                <strong>Verify 50mm Calibration Ruler:</strong> Use a physical ruler on the top right calibration box on Page 1. It must measure exactly 50mm (5.0cm) before placing beads.
              </div>
            </div>

            {isMirrored && (
              <p className="pt-2 border-t border-black/20 text-red-900 font-bold">
                🪞 Tape Method Reminder: The pattern is pre-mirrored horizontally. Place beads, lift with painter tape, flip over, and iron the rear!
              </p>
            )}
          </div>
        )}

        {/* Amazon Affiliate Recommendation Card */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-black uppercase tracking-widest text-red-500">
            Recommended Supplies
          </div>
          <AffiliateCard
            title={t.export_modal.amazon_recommendation_title}
            description={t.export_modal.amazon_recommendation_desc}
            productKey="bundlePack"
            t={t}
          />
        </div>

        {/* Buy Me a Coffee Section */}
        <div className="p-4 bg-gray-50 border-2 border-black flex items-center justify-between gap-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <div className="space-y-0.5">
            <div className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
              <Coffee className="w-4 h-4 text-red-500" />
              <span>{t.export_modal.coffee_title}</span>
            </div>
            <p className="text-[11px] text-gray-700 max-w-xs leading-relaxed font-sans">
              {t.export_modal.coffee_desc}
            </p>
          </div>

          <a
            href={AFFILIATE_CONFIG.buyMeACoffeeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 py-2 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black font-black text-xs uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <span>{t.export_modal.coffee_btn}</span>
          </a>
        </div>

        {/* Modal Close Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-black text-white hover:bg-red-500 font-black text-xs uppercase tracking-wider transition-colors shadow-[3px_3px_0px_0px_rgba(255,107,107,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            {t.export_modal.close}
          </button>
        </div>
      </div>
    </div>
  );
}
