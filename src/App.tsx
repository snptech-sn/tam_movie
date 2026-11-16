import { useCallback, useEffect, useState } from 'react';
import { ComposerModal } from './components/ComposerModal';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PostReaderModal } from './components/PostReaderModal';
import { PostsSection, type PostFilter } from './components/PostsSection';
import { VideoGallery } from './components/VideoGallery';
import { VideoTheaterModal } from './components/VideoTheaterModal';
import type {
  ChannelInfo,
  ChannelPayload,
  Post,
  PostCategory,
  PostDraft,
  YouTubePlaylist,
  YouTubeVideo,
} from './types';

export default function App() {
  const [channel, setChannel] = useState<ChannelInfo | null>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [playlists, setPlaylists] = useState<YouTubePlaylist[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videosSyncing, setVideosSyncing] = useState(false);
  const [videosError, setVideosError] = useState<string | null>(null);

  const [selectedPlaylist, setSelectedPlaylist] = useState<YouTubePlaylist | null>(null);
  const [playlistVideos, setPlaylistVideos] = useState<YouTubeVideo[]>([]);
  const [playlistLoading, setPlaylistLoading] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [postFilter, setPostFilter] = useState<PostFilter>('all');

  const [activeVideo, setActiveVideo] = useState<YouTubeVideo | null>(null);
  const [theaterQueue, setTheaterQueue] = useState<YouTubeVideo[] | null>(null);
  const [theaterQueueTitle, setTheaterQueueTitle] = useState<string | undefined>(undefined);
  const [activePost, setActivePost] = useState<Post | null>(null);

  const [composerOpen, setComposerOpen] = useState(false);
  const [composerCategory, setComposerCategory] = useState<PostCategory>('story');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [prefillVideo, setPrefillVideo] = useState<{
    title: string;
    youtubeUrl: string;
    coverImage: string;
    summary: string;
  } | null>(null);

  const loadChannel = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) {
      setVideosSyncing(true);
    } else {
      setVideosLoading(true);
    }
    setVideosError(null);
    try {
      const res = await fetch(`/api/channel${forceRefresh ? '?refresh=1' : ''}`);
      if (!res.ok) {
        throw new Error('មិនអាចទាញយកវីដេអូពីឆានែល YouTube @tam_movie បានទេ។');
      }
      const data: ChannelPayload = await res.json();
      setChannel(data.channel);
      setVideos(data.videos || []);
      setPlaylists(data.playlists || []);
    } catch (err) {
      setVideosError(
        err instanceof Error ? err.message : 'មានបញ្ហាក្នុងការទាញយកទិន្នន័យពី YouTube។'
      );
    } finally {
      setVideosLoading(false);
      setVideosSyncing(false);
    }
  }, []);

  const handleSelectPlaylist = useCallback(async (playlist: YouTubePlaylist | null) => {
    setSelectedPlaylist(playlist);
    if (!playlist) {
      setPlaylistVideos([]);
      return;
    }
    setPlaylistLoading(true);
    setPlaylistVideos([]);
    try {
      const res = await fetch(`/api/playlists/${playlist.id}`);
      if (res.ok) {
        const data: { playlistId: string; videos: YouTubeVideo[] } = await res.json();
        setPlaylistVideos(data.videos || []);
      }
    } catch {
      setPlaylistVideos([]);
    } finally {
      setPlaylistLoading(false);
    }
  }, []);

  const handlePlayVideo = useCallback(
    (video: YouTubeVideo, customQueue?: YouTubeVideo[], queueTitle?: string) => {
      setActiveVideo(video);
      setTheaterQueue(customQueue || null);
      setTheaterQueueTitle(queueTitle);
    },
    []
  );

  const loadPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        const data: Post[] = await res.json();
        setPosts(data);
      }
    } catch {
      // Keep current posts if request fails
    }
  }, []);

  useEffect(() => {
    loadChannel(false);
    loadPosts();
  }, [loadChannel, loadPosts]);

  // Sync top-bar category anchors (#posts-story, #posts-song, #posts-news) with PostsSection filter
  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash;
      if (hash === '#posts-story') setPostFilter('story');
      else if (hash === '#posts-song') setPostFilter('song');
      else if (hash === '#posts-news') setPostFilter('news');
    };
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  const handleOpenComposer = (defaultCategory: PostCategory = 'story') => {
    setEditingPost(null);
    setPrefillVideo(null);
    setComposerCategory(defaultCategory);
    setComposerOpen(true);
  };

  const handleWriteAboutVideo = (video: YouTubeVideo) => {
    setActiveVideo(null);
    setEditingPost(null);
    setPrefillVideo({
      title: video.title,
      youtubeUrl: video.url,
      coverImage: video.thumbnail,
      summary: video.description || `ទស្សនា និងចែករំលែកអំពីវីដេអូ «${video.title}» ពីឆានែល តាមរឿង - Tam MOVIE។`,
    });
    setComposerCategory('story');
    setComposerOpen(true);
  };

  const handleSavePost = async (draft: PostDraft, editingId?: string) => {
    const method = editingId ? 'PUT' : 'POST';
    const endpoint = editingId ? `/api/posts/${editingId}` : '/api/posts';

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'មិនអាចរក្សាទុកមាតិកាបានទេ។');
    }

    const saved: Post = await res.json();
    setPosts((prev) => {
      if (editingId) {
        return prev.map((p) => (p.id === saved.id ? saved : p));
      }
      return [saved, ...prev];
    });
    if (activePost?.id === saved.id) {
      setActivePost(saved);
    }
    setPostFilter(saved.category);
  };

  const handleLikePost = async (id: string) => {
    const res = await fetch(`/api/posts/${id}/like`, { method: 'POST' });
    if (!res.ok) return;
    const updated: Post = await res.json();
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (activePost?.id === updated.id) {
      setActivePost(updated);
    }
  };

  const handleDeletePost = async (id: string) => {
    const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    if (!res.ok) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
    if (activePost?.id === id) {
      setActivePost(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0D] text-[#F5F2EB]">
      <Header onOpenComposer={() => handleOpenComposer('story')} />

      <main className="flex-1">
        <HeroSection
          channel={channel}
          featuredVideo={videos[0] || null}
          syncedVideosCount={videos.length}
          playlistsCount={playlists.length}
          postsCount={posts.length}
          onPlayVideo={(v) => handlePlayVideo(v)}
        />

        <VideoGallery
          videos={videos}
          playlists={playlists}
          loading={videosLoading}
          syncing={videosSyncing}
          error={videosError}
          selectedPlaylist={selectedPlaylist}
          playlistVideos={playlistVideos}
          playlistLoading={playlistLoading}
          onRefresh={() => loadChannel(true)}
          onSelectPlaylist={handleSelectPlaylist}
          onPlayVideo={handlePlayVideo}
        />

        <PostsSection
          posts={posts}
          activeFilter={postFilter}
          onChangeFilter={setPostFilter}
          onSelectPost={setActivePost}
          onOpenComposer={handleOpenComposer}
        />
      </main>

      <footer className="border-t border-white/10 bg-[#09090B]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#9C988E]">
          <div>
            <span className="font-semibold text-[#F5F2EB]">តាមរឿង · Tam MOVIE</span>
            <span className="mx-2 text-white/25">·</span>
            <span>វីដេអូភាពយន្ត រឿង បទចម្រៀង និងព័ត៌មានខ្មែរ</span>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <a
              href="https://www.youtube.com/@tam_movie"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D99B26] transition-colors"
            >
              YouTube (@tam_movie)
            </a>
            <a
              href="https://t.me/tam_movie"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D99B26] transition-colors"
            >
              Telegram
            </a>
            <a
              href="https://www.tiktok.com/@tam_movie7"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D99B26] transition-colors"
            >
              TikTok
            </a>
            <a
              href="https://www.facebook.com/tammovies099"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D99B26] transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>
      </footer>

      <VideoTheaterModal
        video={activeVideo}
        upNext={theaterQueue || videos}
        queueTitle={theaterQueueTitle}
        onClose={() => {
          setActiveVideo(null);
          setTheaterQueue(null);
          setTheaterQueueTitle(undefined);
        }}
        onSelectVideo={(v) => setActiveVideo(v)}
        onWriteAboutVideo={handleWriteAboutVideo}
      />

      <PostReaderModal
        post={activePost}
        onClose={() => setActivePost(null)}
        onLike={handleLikePost}
        onEdit={(post) => {
          setActivePost(null);
          setEditingPost(post);
          setPrefillVideo(null);
          setComposerOpen(true);
        }}
        onDelete={handleDeletePost}
      />

      <ComposerModal
        open={composerOpen}
        initialCategory={composerCategory}
        editingPost={editingPost}
        prefillFromVideo={prefillVideo}
        onClose={() => {
          setComposerOpen(false);
          setEditingPost(null);
          setPrefillVideo(null);
        }}
        onSave={handleSavePost}
      />
    </div>
  );
}
