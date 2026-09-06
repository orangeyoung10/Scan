import { AFFILIATE_CONFIG, getAffiliateUrl } from '../../config/affiliates';
import { ShoppingBag, ExternalLink } from 'lucide-react';

interface AffiliateCardProps {
  title?: string;
  description?: string;
  productKey?: keyof typeof AFFILIATE_CONFIG.products;
  t?: any;
}

export function AffiliateCard({
  title,
  description,
  productKey = 'bundlePack',
  t
}: AffiliateCardProps) {
  const url = getAffiliateUrl(productKey);
  const displayTitle = title || t?.affiliate?.black_beads || '6,000-Bead Black & White Value Tub';
  const displayDesc = description || t?.export_modal?.amazon_recommendation_desc || 'Stock up on opaque fuse beads for large QR projects without running out.';

  return (
    <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-black border border-black flex items-center justify-center shrink-0 text-white shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]">
            <ShoppingBag className="w-5 h-5 text-yellow-300" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase font-black tracking-widest px-1.5 py-0.5 bg-red-500 text-white">
                {t?.affiliate?.badge || 'Crafter Pick'}
              </span>
            </div>
            <h4 className="text-sm font-black text-black group-hover:text-red-500 transition-colors">
              {displayTitle}
            </h4>
            <p className="text-xs text-gray-600 max-w-sm leading-relaxed font-sans">
              {displayDesc}
            </p>
          </div>
        </div>

        <a
          href={url}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 bg-black hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(255,107,107,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer mt-1"
        >
          <span>{t?.affiliate?.amazon_link_text || 'Amazon →'}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-200 text-[10px] text-gray-500 font-mono">
        {t?.affiliate?.disclaimer || 'As an Amazon Associate we earn from qualifying purchases.'}
      </div>
    </div>
  );
}
