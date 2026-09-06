import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { SavedPattern, BeadColorCode, BeadSizeSpec, InputMode, ErrorCorrectionLevel } from '../../types';
import {
  getSavedPatterns,
  savePattern,
  deleteSavedPattern,
  exportPatternsJson,
  importPatternsJson,
  buildShareUrl
} from '../../utils/storage';
import { DARK_BEAD_OPTIONS } from '../../utils/beadColors';
import {
  X,
  Bookmark,
  Trash2,
  Download,
  Upload,
  Share2,
  Check,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface SavedPatternsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: {
    mode: InputMode;
    urlText?: string;
    wifi?: any;
    vcard?: any;
    ecl: ErrorCorrectionLevel;
    darkBead: BeadColorCode;
    beadSize: BeadSizeSpec;
    isMirrored?: boolean;
    dimension: number;
    totalBeads: number;
    darkCount: number;
  };
  onLoadPattern: (pattern: SavedPattern) => void;
  t: any;
}

export function SavedPatternsModal({
  isOpen,
  onClose,
  currentConfig,
  onLoadPattern,
  t
}: SavedPatternsModalProps) {
  const [patterns, setPatterns] = useState<SavedPattern[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedShareUrl, setCopiedShareUrl] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPatterns(getSavedPatterns());
      setNewTitle(
        currentConfig.mode === 'wifi'
          ? `Wi-Fi (${currentConfig.wifi?.ssid || 'Guest'})`
          : currentConfig.mode === 'vcard'
          ? `vCard (${currentConfig.vcard?.fullName || 'Contact'})`
          : `QR (${currentConfig.urlText?.slice(0, 22) || 'Link'})`
      );
    }
  }, [isOpen, currentConfig]);

  if (!isOpen) return null;

  const handleSaveCurrent = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const saved = savePattern({
      title: newTitle.trim(),
      mode: currentConfig.mode,
      urlText: currentConfig.urlText,
      wifi: currentConfig.wifi,
      vcard: currentConfig.vcard,
      ecl: currentConfig.ecl,
      darkBeadId: currentConfig.darkBead.id,
      beadSize: currentConfig.beadSize,
      isMirrored: currentConfig.isMirrored,
      dimension: currentConfig.dimension,
      totalBeads: currentConfig.totalBeads,
      darkCount: currentConfig.darkCount
    });

    setPatterns(getSavedPatterns());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDelete = (id: string) => {
    const updated = deleteSavedPattern(id);
    setPatterns(updated);
  };

  const handleExportJson = () => {
    const jsonStr = exportPatternsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scanbeads_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importPatternsJson(content);
      if (res.success) {
        setPatterns(getSavedPatterns());
        setImportStatus(`Imported ${res.count} patterns!`);
      } else {
        setImportStatus('Invalid JSON file format.');
      }
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  const handleCopyShareUrl = () => {
    const url = buildShareUrl({
      mode: currentConfig.mode,
      urlText: currentConfig.urlText,
      ecl: currentConfig.ecl,
      darkBeadId: currentConfig.darkBead.id,
      beadSize: currentConfig.beadSize,
      isMirrored: currentConfig.isMirrored
    });
    navigator.clipboard.writeText(url);
    setCopiedShareUrl(true);
    setTimeout(() => setCopiedShareUrl(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b-3 border-black bg-yellow-300">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-black" />
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-black">
                Pattern Library & Saves (本地图纸库)
              </h2>
              <p className="text-[11px] text-gray-800 font-medium">
                Saved offline in your browser &bull; Zero server tracking
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 bg-white hover:bg-red-500 hover:text-white border-2 border-black transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Save Current Design Banner */}
        <form onSubmit={handleSaveCurrent} className="p-4 border-b-2 border-black bg-gray-50 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Design Title (e.g. My Guest WiFi Keytag)..."
              maxLength={40}
              className="w-full px-3 py-2 text-xs font-mono border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button
            type="submit"
            className={`w-full sm:w-auto px-4 py-2 text-xs font-black uppercase tracking-wider border-2 border-black whitespace-nowrap transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 ${
              savedSuccess ? 'bg-emerald-400 text-black' : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save Current Pattern</span>
              </>
            )}
          </button>
        </form>

        {/* Action Toolbar */}
        <div className="px-4 py-2 border-b-2 border-black bg-white flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyShareUrl}
              className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider border border-black bg-gray-100 hover:bg-gray-200 flex items-center gap-1 cursor-pointer"
            >
              {copiedShareUrl ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                  <span className="text-emerald-700">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3 h-3 text-black" />
                  <span>Copy Shareable URL</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider border border-black bg-gray-100 hover:bg-gray-200 flex items-center gap-1 cursor-pointer"
              title="Backup patterns to JSON"
            >
              <Download className="w-3 h-3 text-black" />
              <span>Export JSON</span>
            </button>

            <label className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider border border-black bg-gray-100 hover:bg-gray-200 flex items-center gap-1 cursor-pointer">
              <Upload className="w-3 h-3 text-black" />
              <span>Import JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJson}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {importStatus && (
          <div className="px-4 py-1.5 bg-yellow-100 text-[11px] font-bold text-yellow-900 border-b border-black">
            {importStatus}
          </div>
        )}

        {/* Pattern List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {patterns.length === 0 ? (
            <div className="text-center py-12 space-y-3 bg-gray-50 border-2 border-dashed border-gray-300 p-6">
              <Layers className="w-8 h-8 text-gray-400 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-black uppercase tracking-wider text-gray-700">
                  No Saved Patterns Yet
                </p>
                <p className="text-xs text-gray-500 font-sans">
                  Type a title above and click "Save Current Pattern" to store your favorite designs.
                </p>
              </div>
            </div>
          ) : (
            patterns.map(pattern => {
              const darkColor = DARK_BEAD_OPTIONS.find(c => c.id === pattern.darkBeadId) || DARK_BEAD_OPTIONS[0];
              const dateFormatted = new Date(pattern.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={pattern.id}
                  className="bg-white border-2 border-black p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:border-red-500 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full border border-black shrink-0"
                        style={{ backgroundColor: darkColor.hex }}
                        title={darkColor.name}
                      />
                      <h4 className="text-xs sm:text-sm font-black uppercase text-black">
                        {pattern.title}
                      </h4>
                      <span className="text-[9px] uppercase font-mono bg-gray-100 px-1.5 py-0.5 border border-gray-300">
                        {pattern.mode}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-600 font-mono">
                      <span>{pattern.dimension}×{pattern.dimension} ({pattern.totalBeads} beads)</span>
                      <span>&bull;</span>
                      <span>{pattern.beadSize}</span>
                      <span>&bull;</span>
                      <span>ECC {pattern.ecl}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-0.5 text-gray-400">
                        <Calendar className="w-2.5 h-2.5" />
                        {dateFormatted}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onLoadPattern(pattern);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-black text-white hover:bg-red-500 text-xs font-black uppercase tracking-wider border-2 border-black transition-colors cursor-pointer flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(239,68,68,1)] active:translate-x-0.5 active:translate-y-0.5"
                    >
                      <span>Load</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(pattern.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 border border-transparent hover:border-black transition-colors cursor-pointer"
                      title="Delete pattern"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-100 border-t-2 border-black text-[11px] text-gray-700 flex items-center justify-between font-sans">
          <span>Patterns are saved to local browser storage (up to 50 patterns).</span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-black uppercase tracking-wider text-black underline hover:text-red-500 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
