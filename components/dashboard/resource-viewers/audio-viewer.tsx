import React, { useState } from 'react';

interface AudioViewerProps {
  fileUrl: string;
  title: string;
  resourceId?: string;
}

const AudioViewer: React.FC<AudioViewerProps> = ({ fileUrl }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAudioMimeType = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'mp3':
        return 'audio/mpeg';
      case 'wav':
        return 'audio/wav';
      case 'ogg':
        return 'audio/ogg';
      case 'flac':
        return 'audio/flac';
      case 'm4a':
        return 'audio/mp4';
      case 'opus':
        return 'audio/opus';
      default:
        return `audio/${extension}`;
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 bg-gray-50 rounded-b-lg p-4 flex items-center justify-center relative flex-col">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        )}

        <div className="w-full max-w-lg mb-4">
          <audio
            className="w-full"
            controls
            onLoadedData={() => setIsLoading(false)}
            onError={(e) => {
              console.error('Audio error:', e);
              setError('Failed to load audio file. Format may not be supported by your browser.');
              setIsLoading(false);
            }}
          >
            <source src={fileUrl} type={getAudioMimeType(fileUrl)} />
            Your browser does not support the audio element.
          </audio>
        </div>

        {error && (
          <div className="text-center text-red-500 mb-4">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioViewer;
