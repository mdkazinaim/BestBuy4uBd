import React from 'react';
import { ProductVideo } from '@/types/Product/Product';

interface VideoPlayerProps {
  video: ProductVideo;
  autoplay?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, autoplay = false }) => {
  /**
   * Extract video ID from YouTube URL
   */
  const getYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  /**
   * Extract video ID from Vimeo URL
   */
  const getVimeoId = (url: string): string | null => {
    const regExp = /vimeo.*\/(\d+)/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  /**
   * Determine platform from URL if not specified
   */
  const detectPlatform = (url: string): 'youtube' | 'vimeo' | 'direct' => {
    if (video.platform) return video.platform;
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('vimeo.com')) return 'vimeo';
    return 'direct';
  };

  const platform = detectPlatform(video.url);

  // Render YouTube embed
  if (platform === 'youtube') {
    const videoId = getYouTubeId(video.url);
    if (!videoId) return null;

    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}${autoplay ? '?autoplay=1&mute=1' : ''}`}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Render Vimeo embed
  if (platform === 'vimeo') {
    const videoId = getVimeoId(video.url);
    if (!videoId) return null;

    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://player.vimeo.com/video/${videoId}${autoplay ? '?autoplay=1&muted=1' : ''}`}
          title={video.title}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Render direct video
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
      <video
        className="w-full h-full object-cover"
        controls
        autoPlay={autoplay}
        muted={autoplay}
        poster={video.thumbnail}
      >
        <source src={video.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
