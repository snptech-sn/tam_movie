import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Post, PostCategory, PostDraft } from '../types';

interface ComposerModalProps {
  open: boolean;
  initialCategory?: PostCategory;
  editingPost?: Post | null;
  prefillFromVideo?: { title: string; youtubeUrl: string; coverImage: string; summary: string } | null;
  onClose: () => void;
  onSave: (draft: PostDraft, editingId?: string) => Promise<void>;
}

const COVER_PRESETS = [
  {
    label: 'រោងមហោស្រពបុរាណ',
    url: '/src/assets/images/khmer_cinema_story_1794842826365.jpg',
  },
  {
    label: 'ស្ទូឌីយ៉ូតន្ត្រី',
    url: '/src/assets/images/khmer_music_vinyl_1794842826945.jpg',
  },
  {
    label: 'ភាពយន្ត និងព័ត៌មាន',
    url: '/src/assets/images/phnom_penh_editorial_1794842826864.jpg',
  },
  {
    label: 'រាត្រីផ្កាឈូក',
    url: '/src/assets/images/folklore_lotus_tale_1794842827440.jpg',
  },
];

export function ComposerModal({
  open,
  initialCategory = 'story',
  editingPost,
  prefillFromVideo,
  onClose,
  onSave,
}: ComposerModalProps) {
  const [category, setCategory] = useState<PostCategory>(initialCategory);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [artist, setArtist] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [coverImage, setCoverImage] = useState(COVER_PRESETS[0].url);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (editingPost) {
      setCategory(editingPost.category);
      setTitle(editingPost.title);
      setAuthor(editingPost.author);
      setArtist(editingPost.artist || '');
      setSummary(editingPost.summary);
      setContent(editingPost.content);
      setLyrics(editingPost.lyrics || '');
      setYoutubeUrl(editingPost.youtubeUrl || '');
      setAudioUrl(editingPost.audioUrl || '');
      setCoverImage(editingPost.coverImage || COVER_PRESETS[0].url);
    } else if (prefillFromVideo) {
      setCategory('story');
      setTitle(prefillFromVideo.title);
      setAuthor('ក្រុមការងារ តាមរឿង');
      setArtist('');
      setSummary(prefillFromVideo.summary);
      setContent(prefillFromVideo.summary);
      setLyrics('');
      setYoutubeUrl(prefillFromVideo.youtubeUrl);
      setAudioUrl('');
      setCoverImage(prefillFromVideo.coverImage);
    } else {
      setCategory(initialCategory);
      setTitle('');
      setAuthor('');
      setArtist('');
      setSummary('');
      setContent('');
      setLyrics('');
      setYoutubeUrl('');
      setAudioUrl('');
      setCoverImage(
        initialCategory === 'song'
          ? COVER_PRESETS[1].url
          : initialCategory === 'news'
          ? COVER_PRESETS[2].url
          : COVER_PRESETS[0].url
      );
    }
  }, [open, initialCategory, editingPost, prefillFromVideo]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('សូមបញ្ចូលចំណងជើង និងខ្លឹមសារឱ្យបានគ្រប់គ្រាន់។');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onSave(
        {
          category,
          title: title.trim(),
          author: author.trim() || 'អ្នកនិពន្ធសហគមន៍',
          artist: category === 'song' ? artist.trim() : undefined,
          summary: summary.trim() || content.trim().slice(0, 140),
          content: content.trim(),
          lyrics: category === 'song' ? lyrics.trim() : undefined,
          youtubeUrl: youtubeUrl.trim() || undefined,
          audioUrl: category === 'song' ? audioUrl.trim() || undefined : undefined,
          coverImage: coverImage.trim(),
        },
        editingPost?.id
      );
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'មានបញ្ហាក្នុងការរក្សាទុក។');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={editingPost ? 'កែសម្រួលមាតិកា' : 'បង្ហោះមាតិកាថ្មី'}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl bg-[#121216] border border-white/10 rounded-xl overflow-hidden shadow-2xl my-4 sm:my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="font-serif text-lg font-bold text-[#F5F2EB]">
            {editingPost ? 'កែសម្រួលមាតិកា' : 'បង្ហោះរឿង បទចម្រៀង ឬព័ត៌មាន'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[#B8B4AB] hover:text-[#F5F2EB] hover:bg-white/10 cursor-pointer"
            aria-label="បិទ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-medium text-[#B8B4AB] mb-2">ប្រភេទមាតិកា</label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-[#18181E] border border-white/10 rounded-lg">
              {(
                [
                  { id: 'story', label: 'រឿង' },
                  { id: 'song', label: 'បទចម្រៀង' },
                  { id: 'news', label: 'ព័ត៌មាន' },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(item.id)}
                  className={`py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer ${
                    category === item.id
                      ? 'bg-[#D99B26] text-[#0B0B0D]'
                      : 'text-[#B8B4AB] hover:text-[#F5F2EB]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="post-title" className="block text-xs font-medium text-[#B8B4AB] mb-1.5">
                ចំណងជើង *
              </label>
              <input
                id="post-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ឧ. រឿងព្រេងខ្មែរ ឬឈ្មោះបទចម្រៀង..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#18181E] border border-white/10 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D99B26]"
              />
            </div>

            <div>
              <label htmlFor="post-author" className="block text-xs font-medium text-[#B8B4AB] mb-1.5">
                អ្នកបង្ហោះ / អ្នកនិពន្ធ
              </label>
              <input
                id="post-author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="ឈ្មោះអ្នកបង្ហោះ"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#18181E] border border-white/10 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D99B26]"
              />
            </div>

            {category === 'song' && (
              <div>
                <label htmlFor="post-artist" className="block text-xs font-medium text-[#B8B4AB] mb-1.5">
                  អ្នកចម្រៀង / សិល្បករ
                </label>
                <input
                  id="post-artist"
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="ឈ្មោះអ្នកចម្រៀង"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#18181E] border border-white/10 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D99B26]"
                />
              </div>
            )}

            <div className={category === 'song' ? 'sm:col-span-2' : ''}>
              <label htmlFor="post-youtube" className="block text-xs font-medium text-[#B8B4AB] mb-1.5">
                តំណ YouTube (ជាជម្រើស)
              </label>
              <input
                id="post-youtube"
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#18181E] border border-white/10 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D99B26]"
              />
            </div>

            {category === 'song' && (
              <div className="sm:col-span-2">
                <label htmlFor="post-audio" className="block text-xs font-medium text-[#B8B4AB] mb-1.5">
                  តំណសំឡេង MP3 / Audio URL (ជាជម្រើស)
                </label>
                <input
                  id="post-audio"
                  type="url"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  placeholder="https://.../song.mp3"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#18181E] border border-white/10 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D99B26]"
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="post-summary" className="block text-xs font-medium text-[#B8B4AB] mb-1.5">
              សេចក្តីសង្ខេបខ្លី
            </label>
            <input
              id="post-summary"
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="សង្ខេបខ្លីៗដើម្បីបង្ហាញលើកាត..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#18181E] border border-white/10 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D99B26]"
            />
          </div>

          <div>
            <label htmlFor="post-content" className="block text-xs font-medium text-[#B8B4AB] mb-1.5">
              {category === 'song' ? 'សេចក្តីពណ៌នាអំពីបទចម្រៀង *' : 'ខ្លឹមសារពេញលេញ *'}
            </label>
            <textarea
              id="post-content"
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="សរសេរសាច់រឿង ឬអត្ថបទព័ត៌មាននៅទីនេះ..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#18181E] border border-white/10 text-sm text-[#F5F2EB] leading-relaxed focus:outline-none focus:border-[#D99B26]"
            />
          </div>

          {category === 'song' && (
            <div>
              <label htmlFor="post-lyrics" className="block text-xs font-medium text-[#B8B4AB] mb-1.5">
                ទំនុកច្រៀង (ជាជម្រើស)
              </label>
              <textarea
                id="post-lyrics"
                rows={5}
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                placeholder="វគ្គទី ១ ..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#18181E] border border-white/10 text-sm text-[#F5F2EB] leading-relaxed focus:outline-none focus:border-[#D99B26]"
              />
            </div>
          )}

          {/* Cover Artwork Picker */}
          <div>
            <label htmlFor="post-cover" className="block text-xs font-medium text-[#B8B4AB] mb-2">
              រូបភាពក្រប (ជ្រើសរើស ឬដាក់តំណរូបភាព)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-2.5">
              {COVER_PRESETS.map((preset) => (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => setCoverImage(preset.url)}
                  className={`relative aspect-[4/3] rounded-lg overflow-hidden border transition-all cursor-pointer ${
                    coverImage === preset.url
                      ? 'border-[#D99B26] ring-2 ring-[#D99B26]/40'
                      : 'border-white/10 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-black/75 px-1.5 py-1 text-[10px] text-[#F5F2EB] truncate">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
            <input
              id="post-cover"
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="/src/assets/images/... ឬ https://..."
              className="w-full px-3.5 py-2 rounded-lg bg-[#18181E] border border-white/10 text-xs text-[#D6D2C9] focus:outline-none focus:border-[#D99B26]"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300">
              {error}
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 min-h-[40px] rounded-lg border border-white/15 text-sm text-[#B8B4AB] hover:text-[#F5F2EB] cursor-pointer"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 min-h-[40px] rounded-lg bg-[#D99B26] text-[#0B0B0D] text-sm font-semibold hover:bg-[#E5AA38] disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'កំពុងរក្សាទុក...' : editingPost ? 'រក្សាទុកការកែប្រែ' : 'បង្ហោះផ្សាយ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
