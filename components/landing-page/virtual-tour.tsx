import {
  Camera,
  ChevronLeft,
  ChevronRight,
  CuboidIcon as Cube,
  Maximize2,
  Pause,
  Play,
} from 'lucide-react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

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
    name: 'ITCA Week opening',
    description:
      'Speakers, panels, and project demos during UTG-ITCA Week—three days of community and innovation.',
    image: '/ITCA_WEEK/IMG_4094.jpg',
    type: 'image',
  },
  {
    id: 2,
    name: 'Summer Bootcamp',
    description:
      'Hands-on learning with peers at the UTG ITCA Summer Bootcamp—laptops open, ideas flowing.',
    image: '/ITCA_BOOTCAMP/IMG_9041.jpg',
    type: 'image',
  },
  {
    id: 3,
    name: 'Trials & Thrills',
    description:
      'ITCA Football Club and sporting events that keep campus life balanced and competitive.',
    image: '/ITCA_SPORTS/IMG_8212.jpg',
    type: 'image',
  },
  {
    id: 4,
    name: 'ITCA Retreat',
    description:
      'Time away from lectures to connect—shared meals, conversations, and friendships that last.',
    image: '/ITCA_RETREAT/KG__0436.jpg',
    type: 'image',
  },
  {
    id: 5,
    name: 'Retreat hangouts',
    description:
      'Casual moments that make the School of ICT feel like a real community, not just a timetable.',
    image: '/ITCA_RETREAT/KG__0265.jpg',
    type: 'image',
  },
  {
    id: 6,
    name: 'Together outdoors',
    description:
      'Students gathering, serving food, and looking out for each other at ITCA socials and retreats.',
    image: '/ITCA_RETREAT/KG__0418.jpg',
    type: 'image',
  },
  {
    id: 7,
    name: 'Week energy',
    description:
      'The buzz of ITCA Week—crowds, conversations, and School of ICT pride across campus.',
    image: '/ITCA_WEEK/IMG_4517.jpg',
    type: 'image',
  },
  {
    id: 8,
    name: 'In the lecture hall',
    description:
      'Packed sessions during ITCA Week where students learn from speakers and from each other.',
    image: '/ITCA_WEEK/IMG_4374.jpg',
    type: 'image',
  },
  {
    id: 9,
    name: 'Workshop focus',
    description:
      'Heads down on real projects—skills practice that goes beyond the classroom timetable.',
    image: '/ITCA_WEEK/IMG_4237.jpg',
    type: 'image',
  },
  {
    id: 10,
    name: 'Bootcamp collaboration',
    description:
      'Pairing up, debugging together, and shipping something by the end of the weekend.',
    image: '/ITCA_BOOTCAMP/IMG_8761.jpg',
    type: 'image',
  },
  {
    id: 11,
    name: 'Campus sports day',
    description:
      'Cheering, competing, and representing the School of ICT on the field.',
    image: '/ITCA_SPORTS/IMG_8179.jpg',
    type: 'image',
  },
  {
    id: 12,
    name: 'Retreat circle',
    description:
      'Gathering as one community—listening, laughing, and building friendships that last.',
    image: '/ITCA_RETREAT/retreat-circle.jpg',
    type: 'image',
  },
  {
    id: 13,
    name: 'Shared meals',
    description:
      'Breaking bread together at retreat—because community is built in the quiet moments too.',
    image: '/ITCA_RETREAT/retreat-lunch.jpg',
    type: 'image',
  },
  {
    id: 14,
    name: 'New connections',
    description:
      'Handshakes, hellos, and the network you find when ICT students show up for each other.',
    image: '/ITCA_RETREAT/retreat-handshake.jpg',
    type: 'image',
  },
  {
    id: 15,
    name: 'Campus gathering',
    description:
      'Faraba Banta moments—students from every ICT programme, already part of ITCA.',
    image: '/IMG_4410.jpg',
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
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleToggleVideo = () => {
    if (currentLocation.type === 'video' && videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } else if (isVideoLoaded) {
        videoRef.current
          .play()
          .then(() => setIsVideoPlaying(true))
          .catch(() => setIsVideoPlaying(false));
      }
    }
  };

  return (
    <section id="virtual-tour" className="bg-white px-4 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          className="mb-8 flex flex-col gap-3 sm:mb-10 sm:gap-4 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="max-w-xl text-3xl font-bold leading-tight text-[#0A1628] sm:text-4xl md:text-5xl">
            Moments from ITCA life
          </h2>
          <p className="landing-mono max-w-md text-sm leading-relaxed text-[#0A1628]/70 sm:text-base">
            Bootcamps, ITCA Week, sports days, retreats, and the people who make the School of ICT
            community feel like home.
          </p>
        </motion.div>

        <div ref={containerRef} className="overflow-hidden rounded-[1.5rem] bg-[#0A1628] sm:rounded-[2rem]">
          <div className="relative aspect-[4/5] w-full sm:aspect-[4/3] lg:aspect-video">
            {currentLocation.type === 'video' && (
              <div className={`absolute inset-0 ${isVideoPlaying ? 'block' : 'hidden'}`}>
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  playsInline
                  controls={false}
                  preload="auto"
                  onLoadedData={() => setIsVideoLoaded(true)}
                >
                  <source
                    src={currentLocation.videoSrc || '/videos/hero-vid.mp4'}
                    type="video/mp4"
                  />
                </video>
              </div>
            )}

            <AnimatePresence mode="wait">
              {(!isVideoPlaying || currentLocation.type !== 'video') && (
                <motion.div
                  key={`image-${currentIndex}`}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 1400px"
                    alt={currentLocation.name}
                    src={currentLocation.image}
                    className="object-cover object-center"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {currentLocation.type === 'video' && (
              <button
                type="button"
                onClick={handleToggleVideo}
                disabled={!isVideoLoaded}
                aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
                className="absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#FF6A00] text-white sm:h-16 sm:w-16"
              >
                {isVideoPlaying ? <Pause className="h-6 w-6 sm:h-7 sm:w-7" /> : <Play className="h-6 w-6 sm:h-7 sm:w-7" />}
              </button>
            )}

            {/* Desktop overlay caption */}
            <div className="absolute inset-x-6 bottom-6 z-20 hidden items-end justify-between gap-4 rounded-[1.5rem] bg-[#0A1628]/80 p-5 text-white backdrop-blur-sm md:flex">
              <div>
                <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FF6A00]">
                  {currentLocation.type === 'image' && <Camera className="h-4 w-4" />}
                  {currentLocation.type === 'video' && <Play className="h-4 w-4" />}
                  {currentLocation.type === '3d' && <Cube className="h-4 w-4" />}
                  {currentLocation.type}
                </div>
                <h3 className="text-2xl font-bold lg:text-3xl">{currentLocation.name}</h3>
                <p className="mt-1 max-w-xl text-sm text-white/70 lg:text-base">
                  {currentLocation.description}
                </p>
              </div>
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label="Toggle fullscreen"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous location"
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#FF6A00] text-white sm:left-4 sm:h-11 sm:w-11"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Next location"
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#FF6A00] text-white sm:right-4 sm:h-11 sm:w-11"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile caption below image */}
          <div className="flex items-start justify-between gap-3 p-4 text-white md:hidden">
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#FF6A00]">
                {currentLocation.type === 'image' && <Camera className="h-3.5 w-3.5" />}
                {currentLocation.type === 'video' && <Play className="h-3.5 w-3.5" />}
                {currentLocation.type === '3d' && <Cube className="h-3.5 w-3.5" />}
                {currentLocation.type}
              </div>
              <h3 className="text-xl font-bold leading-tight">{currentLocation.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                {currentLocation.description}
              </p>
            </div>
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label="Toggle fullscreen"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden">
          {tourLocations.map((location, index) => (
            <button
              key={location.id}
              type="button"
              onClick={() => goToLocation(index)}
              aria-label={`View ${location.name}`}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-2xl sm:h-20 sm:w-28 ${
                currentIndex === index ? 'ring-2 ring-[#FF6A00] ring-offset-2' : 'opacity-70'
              }`}
            >
              <Image fill alt={location.name} src={location.image} className="object-cover" sizes="112px" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VirtualTour;
