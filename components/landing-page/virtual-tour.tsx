import {
  Map,
  Play,
  Pause,
  Globe,
  Camera,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  CuboidIcon as Cube,
} from 'lucide-react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TourLocation = {
  id: number;
  name: string;
  description: string;
  image: string;
  videoSrc?: string;
  type: 'image' | 'video' | '3d';
};

const tourLocations: TourLocation[] = [
  {
    id: 1,
    name: 'Main ICT Building',
    description:
      'Our state-of-the-art ICT building houses modern classrooms, labs, and collaborative spaces.',
    image: '/images/main-building.jpeg',
    type: 'image',
  },
  {
    id: 2,
    name: 'Computer Labs',
    description:
      'Equipped with the latest hardware and software for hands-on learning experiences.',
    image: '/images/main-building.jpeg',
    type: 'image',
  },
  {
    id: 3,
    name: 'Innovation Hub',
    description:
      'A dedicated space for students to work on projects and collaborate with industry partners.',
    image: '/images/main-building.jpeg',
    videoSrc: '/videos/hero-vid.mp4',
    type: 'video',
  },
  {
    id: 4,
    name: 'Networking Lab',
    description:
      'Specialized lab for network configuration, security testing, and infrastructure design.',
    image: '/images/main-building.jpeg',
    type: '3d',
  },
  {
    id: 5,
    name: 'Student Lounge',
    description: 'Relaxation and social space for students to unwind and connect between classes.',
    image: '/images/main-building.jpeg',
    type: 'image',
  },
];

const VirtualTour = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentLocation = tourLocations[currentIndex];

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    setIsVideoPlaying(false);
    setIsVideoLoaded(false);
  }, [currentIndex]);

  const goToNext = () => {
    if (isVideoPlaying && videoRef.current) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
    setCurrentIndex((prev) => (prev + 1) % tourLocations.length);
  };

  const goToPrevious = () => {
    if (isVideoPlaying && videoRef.current) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
    setCurrentIndex((prev) => (prev - 1 + tourLocations.length) % tourLocations.length);
  };

  const goToLocation = (index: number) => {
    if (isVideoPlaying && videoRef.current) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
    setCurrentIndex(index);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleToggleVideo = () => {
    if (currentLocation.type === 'video' && videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        if (isVideoLoaded) {
          videoRef.current
            .play()
            .then(() => {
              setIsVideoPlaying(true);
            })
            .catch((error) => {
              console.error('Error playing video:', error);
              setIsVideoPlaying(false);
            });
        }
      }
    }
  };

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
  };

  return (
    <section id="virtual-tour" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-gray-50 to-white"></div>

      <div className="absolute top-0 left-0 w-1/2 h-1/2 overflow-hidden opacity-30 -z-5">
        <div className="absolute top-0 left-0 h-full w-full">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`lat-${index}`}
              className="absolute h-px bg-blue-700/40"
              style={{
                top: `${20 + index * 15}%`,
                left: '0',
                width: '100%',
                transform: `rotate(${index * 3 - 6}deg)`,
                transformOrigin: 'center left',
              }}
            ></div>
          ))}

          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`long-${index}`}
              className="absolute w-px bg-blue-700/40"
              style={{
                left: `${20 + index * 15}%`,
                top: '0',
                height: '100%',
                transform: `rotate(${index * 3 - 6}deg)`,
                transformOrigin: 'top center',
              }}
            ></div>
          ))}

          <div className="absolute top-[15%] left-[15%] opacity-10">
            <Globe className="w-40 h-40 text-blue-700" strokeWidth={1} />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 overflow-hidden opacity-30 -z-5">
        <div className="absolute bottom-0 right-0 w-full h-full">
          <div className="absolute bottom-20 right-20 h-64 w-64 rounded-full border border-dashed border-amber-500/30"></div>
          <div className="absolute bottom-[25%] right-[25%] h-48 w-48 rounded-full border border-dashed border-blue-700/20"></div>
          <div className="absolute bottom-[30%] right-[30%] h-32 w-32 rounded-full border border-dashed border-amber-500/30"></div>

          <div className="absolute bottom-[25%] right-[25%] h-80 w-1 bg-linear-to-t from-transparent via-amber-500/20 to-transparent transform rotate-45"></div>
          <div className="absolute bottom-[25%] right-[25%] h-80 w-1 bg-linear-to-t from-transparent via-blue-700/20 to-transparent transform rotate-135"></div>

          <div className="absolute bottom-[15%] right-[15%] opacity-10">
            <Map className="w-40 h-40 text-amber-500" strokeWidth={1} />
          </div>
        </div>
      </div>

      <div
        className="absolute inset-0 -z-5 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)',
          backgroundSize: '30px 30px',
        }}
      ></div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Virtual <span className="text-blue-700">Tour</span>
          </h2>
          <div className="mx-auto h-1 w-24 bg-linear-to-r from-blue-700 via-amber-500 to-blue-700 rounded-full mb-6"></div>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Explore our facilities and get a feel for the ITCA environment without leaving your
            home.
          </p>
        </motion.div>

        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mb-8 overflow-hidden rounded-xl bg-black shadow-xl"
        >
          <div className="relative aspect-video w-full">
            {/* Always render video element if current location is video type, but hide it */}
            {currentLocation.type === 'video' && (
              <div className={`absolute inset-0 z-0 ${isVideoPlaying ? 'block' : 'hidden'}`}>
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  playsInline
                  controls={false}
                  preload="auto"
                  onLoadedData={handleVideoLoaded}
                >
                  <source
                    src={currentLocation.videoSrc || '/videos/hero-vid.mp4'}
                    type="video/mp4"
                  />
                </video>
              </div>
            )}

            {/* Show image when video is not playing */}
            <AnimatePresence mode="wait">
              {(!isVideoPlaying || currentLocation.type !== 'video') && (
                <motion.div
                  key={`image-${currentIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 z-0"
                >
                  <Image
                    src={currentLocation.image || '/placeholder.svg'}
                    alt={currentLocation.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {currentLocation.type === 'video' && (
              <button
                onClick={handleToggleVideo}
                className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-blue-700/80 text-white transition-transform hover:scale-110 z-10"
                aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
                disabled={currentLocation.type === 'video' && !isVideoLoaded}
              >
                {isVideoPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
              </button>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-6 text-white z-20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-1 flex items-center">
                    {currentLocation.type === 'image' && (
                      <Camera className="mr-2 h-4 w-4 text-amber-500" />
                    )}
                    {currentLocation.type === 'video' && (
                      <Play className="mr-2 h-4 w-4 text-amber-500" />
                    )}
                    {currentLocation.type === '3d' && (
                      <Cube className="mr-2 h-4 w-4 text-amber-500" />
                    )}
                    <span className="text-sm font-medium uppercase tracking-wider text-amber-500">
                      {currentLocation.type === 'image'
                        ? 'Photo'
                        : currentLocation.type === 'video'
                          ? 'Video'
                          : '3D Model'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold">{currentLocation.name}</h3>
                  <p className="mt-1 text-sm text-gray-300">{currentLocation.description}</p>
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                  aria-label="Toggle fullscreen"
                >
                  <Maximize2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30 z-10"
              aria-label="Previous location"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30 z-10"
              aria-label="Next location"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {tourLocations.map((location, index) => (
            <motion.button
              key={location.id}
              onClick={() => goToLocation(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`relative h-16 w-24 overflow-hidden rounded-md transition-all ${
                currentIndex === index
                  ? 'ring-2 ring-blue-700 ring-offset-2'
                  : 'opacity-70 hover:opacity-100'
              }`}
              aria-label={`View ${location.name}`}
            >
              <Image
                src={location.image || '/placeholder.svg'}
                alt={location.name}
                fill
                className="object-cover"
              />
              {location.type !== 'image' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  {location.type === 'video' && <Play className="h-4 w-4 text-white" />}
                  {location.type === '3d' && <Cube className="h-4 w-4 text-white" />}
                </div>
              )}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default VirtualTour;
