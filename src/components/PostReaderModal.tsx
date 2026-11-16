import { useEffect, useState } from 'react';
import { Edit3, Heart, Trash2, X } from 'lucide-react';
import type { Post, PostCategory } from '../types';
import { SafeImage } from './SafeImage';

interface PostReaderModalProps {
  post: Post | null;
  onClose: () => void;
  onLike: (id: string) => Promise<void>;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => Promise<void>;
}

const CATEGORY_LABELS: Record<PostCategory, string> = {
  story: 'រឿង',
  song: 'បទចម្រៀង',
  news: 'ព័ត៌មានផ្សេងៗ',
};

export function PostReaderModal({
  post,
  onClose,
  onLike,
  onEdit,
  onDelete,
}: PostReaderModalProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setConfirmDelete(false);
  }, [post?.id]);

  useEffect(() => {
    if (!post) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [post, onClose]);

  if (!post) return null;

  const formattedDate = (() => {
    try {
      return new Date(post.createdAt).toLocaleDateString('km-KH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return post.createdAt;
    }
  })();

  const handleConfirmDelete = async () => {
    setBusy(true);
    try {
      await onDelete(post.id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={post.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <article className="w-full max-w-3xl bg-[#121216] border border-white/10 rounded-xl overflow-hidden shadow-2xl my-4 sm:my-8">
        {/* Top Close Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs text-[#9C988E]">
            <span className="text-[#D99B26] font-semibold">{CATEGORY_LABELS[post.category]}</span>
            <span aria-hidden="true">·</span>
            <span>{formattedDate}</span>
            {post.readTime && (
              <>
                <span aria-hidden="true">·</span>
                <span>{post.readTime}</span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[#B8B4AB] hover:text-[#F5F2EB] hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="បិទ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Stage */}
        {post.youtubeId ? (
          <div className="aspect-video w-full bg-black border-b border-white/10">
            <iframe
              src={`https://www.youtube.com/embed/${post.youtubeId}?rel=0`}
              title={post.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="aspect-[16/9] w-full bg-[#0B0B0D] border-b border-white/10 overflow-hidden">
            <SafeImage
              src={post.coverImage}
              alt={post.title}
              fallbackTitle={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Editorial Body */}
        <div className="p-6 sm:p-10">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F2EB] leading-snug">
            {post.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#B8B4AB]">
            <span>ដោយ {post.author}</span>
            {post.artist && (
              <>
                <span aria-hidden="true">·</span>
                <span>សិល្បករ៖ {post.artist}</span>
              </>
            )}
          </div>

          {post.audioUrl && (
            <div className="mt-6 p-4 rounded-lg bg-[#18181E] border border-white/10">
              <div className="text-xs font-medium text-[#D99B26] mb-2">ស្តាប់បទចម្រៀង</div>
              <audio controls src={post.audioUrl} className="w-full" />
            </div>
          )}

          <div className="mt-7 font-serif text-[16.5px] leading-[1.9] text-[#E8E4DC] max-w-prose whitespace-pre-line">
            {post.content}
          </div>

          {post.lyrics && (
            <div className="mt-8 py-6 border-y border-white/10 max-w-prose">
              <h2 className="text-sm font-semibold text-[#D99B26] mb-4">ទំនុកច្រៀង</h2>
              <div className="font-serif text-[15.5px] leading-[2] text-[#D6D2C9] whitespace-pre-line">
                {post.lyrics}
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onLike(post.id)}
              className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-lg bg-[#1A1A20] border border-white/10 text-sm font-medium text-[#F5F2EB] hover:border-[#D99B26]/60 transition-colors tabular-nums cursor-pointer"
            >
              <Heart className="w-4 h-4 text-[#D99B26]" />
              <span>ចូលចិត្ត ({post.likes})</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit(post)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-lg border border-white/15 text-xs font-medium text-[#E8E4DC] hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>កែសម្រួល</span>
              </button>

              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-lg border border-red-500/30 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>លុប</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={handleConfirmDelete}
                    className="px-3.5 py-2 min-h-[40px] rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-500 disabled:opacity-50 cursor-pointer"
                  >
                    {busy ? 'កំពុងលុប...' : 'បញ្ជាក់ការលុប'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-3 py-2 min-h-[40px] rounded-lg border border-white/15 text-xs text-[#B8B4AB] hover:text-white cursor-pointer"
                  >
                    បោះបង់
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
