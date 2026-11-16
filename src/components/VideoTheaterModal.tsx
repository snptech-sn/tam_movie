import { useEffect, useState } from 'react';
import { ExternalLink, PenLine, Play, X } from 'lucide-react';
import type { YouTubeVideo } from '../types';
import { SafeImage } from './SafeImage';

interface VideoTheaterModalProps {
  video: YouTubeVideo | null;
  upNext: YouTubeVideo[];
  queueTitle?: string;
  onClose: () => void;
  onSelectVideo: (video: YouTubeVideo) => void;
  onWriteAboutVideo: (video: YouTubeVideo) => void;
}

export function VideoTheaterModal({
  video,
  upNext,
  queueTitle,
  onClose,
  onSelectVideo,
  onWriteAboutVideo,
}: VideoTheaterModalProps) {
  const [expandedDesc, setExpandedDesc] = useState(false);

  useEffect(() => {
    setExpandedDesc(false);
  }, [video?.id]);

  useEffect(() => {
    if (!video) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [video, onClose]);

  if (!video) return null;

  const queue = queueTitle ? upNext : upNext.filter((v) => v.id !== video.id).slice(0, 24);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[1200px] bg-[#121216] border border-white/10 rounded-xl overflow-hidden shadow-2xl my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs text-[#B8B4AB] min-w-0">
            <span className="text-[#D99B26] font-medium whitespace-nowrap">តាមរឿង - Tam MOVIE</span>
            {queueTitle && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#F5F2EB] truncate">{queueTitle}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span className="truncate font-mono">{video.id}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[#B8B4AB] hover:text-[#F5F2EB] hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            aria-label="បិទផ្ទាំងវីដេអូ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theater Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Main Player & Details */}
          <div className="lg:col-span-8 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-white/10">
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-black border border-white/10">
              <iframe
                key={video.id}
                src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
                title={video.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="mt-5">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F5F2EB] leading-snug">
                {video.title}
              </h2>

              <div className="mt-2.5 flex flex-wrap items-center gap-2.5 text-xs text-[#9C988E] font-mono tabular-nums">
                {video.views && <span>{video.views} views</span>}
                {video.publishedText && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{video.publishedText}</span>
                  </>
                )}
                {video.duration && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>រយៈពេល {video.duration}</span>
                  </>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onWriteAboutVideo(video)}
                  className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-lg bg-[#D99B26] text-[#0B0B0D] text-xs font-semibold hover:bg-[#E5AA38] transition-colors cursor-pointer"
                >
                  <PenLine className="w-3.5 h-3.5" />
                  <span>បង្ហោះរឿង ឬអត្ថបទអំពីវីដេអូនេះ</span>
                </button>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-lg border border-white/15 text-[#E8E4DC] text-xs font-medium hover:bg-white/5 transition-colors"
                >
                  <span>មើលលើ YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {video.description && (
                <div className="mt-5 pt-4 border-t border-white/10">
                  <p
                    className={`text-sm text-[#B8B4AB] leading-relaxed whitespace-pre-line ${
                      expandedDesc ? '' : 'line-clamp-3'
                    }`}
                  >
                    {video.description}
                  </p>
                  {video.description.length > 160 && (
                    <button
                      type="button"
                      onClick={() => setExpandedDesc((v) => !v)}
                      className="mt-2 text-xs font-medium text-[#D99B26] hover:underline cursor-pointer"
                    >
                      {expandedDesc ? 'បង្រួមអត្ថបទ' : 'អានបន្ថែម'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Up Next / Playlist Queue */}
          <div className="lg:col-span-4 p-4 sm:p-5 bg-[#0E0E12] max-h-[540px] lg:max-h-[640px] overflow-y-auto">
            <h3 className="text-sm font-semibold text-[#F5F2EB] mb-4">
              {queueTitle ? `បញ្ជីភាគ · ${queueTitle} (${queue.length})` : 'វីដេអូបន្ទាប់ពីឆានែល @tam_movie'}
            </h3>
            <div className="space-y-2.5">
              {queue.map((item, idx) => {
                const isCurrent = item.id === video.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectVideo(item)}
                    className={`w-full flex items-start gap-3 p-2 rounded-lg text-left transition-colors group cursor-pointer ${
                      isCurrent ? 'bg-[#D99B26]/15 border border-[#D99B26]/40' : 'hover:bg-white/5'
                    }`}
                  >
                    {queueTitle && (
                      <span className="w-5 text-[11px] font-mono tabular-nums text-[#9C988E] pt-1 shrink-0 text-right">
                        {idx + 1}.
                      </span>
                    )}
                    <div className="relative w-28 aspect-video rounded-md overflow-hidden shrink-0 bg-[#18181D] border border-white/10">
                      <SafeImage
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[10px] font-mono tabular-nums bg-black/80 text-white rounded">
                        {item.duration}
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-4 h-4 text-[#D99B26] fill-current" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className={`text-xs font-medium line-clamp-2 leading-snug ${
                          isCurrent ? 'text-[#D99B26]' : 'text-[#F5F2EB] group-hover:text-[#D99B26]'
                        }`}
                      >
                        {item.title}
                      </div>
                      <div className="mt-1 text-[11px] text-[#9C988E] font-mono tabular-nums">
                        {item.views} · {item.publishedText}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
