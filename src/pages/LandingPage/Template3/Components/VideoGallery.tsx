import React, { useState } from 'react';
import { ProductVideo } from '@/types/Product/Product';
import VideoPlayer from './VideoPlayer';

interface VideoGalleryProps {
  videos: ProductVideo[];
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ videos }) => {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

  if (!videos || videos.length === 0) return null;

  const selectedVideo = videos[selectedVideoIndex];

  return (
    <div className="space-y-4">
      {/* Main Video Player */}
      <VideoPlayer video={selectedVideo} />

      {/* Video Title */}
      <div className="text-center">
        <h3 className="text-lg md:text-xl font-bold text-gray-800">
          {selectedVideo.title}
        </h3>
      </div>

      {/* Video Thumbnails/Selector (if multiple videos) */}
      {videos.length > 1 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {videos.map((video, index) => (
            <button
              key={index}
              onClick={() => setSelectedVideoIndex(index)}
              className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                selectedVideoIndex === index
                  ? 'border-green-600 ring-2 ring-green-300 scale-105'
                  : 'border-gray-200 hover:border-green-400'
              }`}
            >
              {/* Thumbnail */}
              <div className="relative w-full h-full bg-gray-100">
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                )}

                {/* Play Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-all">
                  <div className="w-10 h-10 rounded-full bg-white bg-opacity-90 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-600 ml-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Video Title */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                <p className="text-white text-xs font-medium truncate">
                  {video.title}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoGallery;
