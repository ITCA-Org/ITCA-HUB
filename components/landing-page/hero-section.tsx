import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Target, Eye, ChevronRight } from 'lucide-react';

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
    }
  }, []);

  return (
    <section
      id="hero-section"
      className="relative min-h-screen w-full overflow-hidden bg-linear-to-b from-gray-900 to-black"
    >
      {/*==================== Background Video With Overlay ====================*/}
      <div className="absolute inset-0 z-0">
        <video
          loop
          muted
          autoPlay
          playsInline
          ref={videoRef}
          className="h-full w-full object-cover opacity-30"
        >
          <source type="video/mp4" src="/videos/hero-vid.mp4" />
        </video>
        <div className="absolute inset-0 bg-linear-to-r from-gray-900/80 via-transparent to-gray-900/80"></div>
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-gray-900/40"></div>
      </div>
      {/*==================== End of Background Video With Overlay ====================*/}

      {/*==================== Particle Effect ====================*/}
      <div className="absolute inset-0 z-5 opacity-20">
        {Array.from({ length: 45 }).map((_, index) => (
          <div
            key={index}
            className="absolute h-1 w-1 rounded-full bg-blue-500"
            style={{
              opacity: 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float 3s infinite ease-in-out`,
            }}
          ></div>
        ))}
        {Array.from({ length: 45 }).map((_, index) => (
          <div
            key={`amber-${index}`}
            className="absolute h-1 w-1 rounded-full bg-amber-500"
            style={{
              opacity: 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float 2s infinite ease-in-out`,
            }}
          ></div>
        ))}
      </div>
      {/*==================== End of Particle Effect ====================*/}

      {/*==================== Content ====================*/}
      <div className="relative z-20 flex h-full min-h-screen flex-col items-center justify-center px-4 py-16 sm:py-24 md:py-32 text-white">
        {/*==================== Welcome Subtitle ====================*/}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-2 text-sm sm:text-base text-blue-400 uppercase tracking-widest font-medium"
        >
          Welcome to
        </motion.p>

        {/*==================== Main Title ====================*/}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-4 sm:mb-6 md:mb-8 text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight"
        >
          <span className="text-blue-700">Information</span>{' '}
          <span className="xs:inline">Technology</span>{' '}
          <span className="text-amber-500">Communication</span>{' '}
          <span className="block xs:inline">Association</span>
        </motion.h1>
        {/*==================== End of Main Title ====================*/}

        {/*==================== Decorative Line ====================*/}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: '120px' }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="h-1 bg-linear-to-r from-blue-700 via-amber-500 to-blue-700 rounded-full mb-6 sm:mb-8"
        ></motion.div>
        {/*==================== End of Decorative Line ====================*/}

        {/*==================== Tagline ====================*/}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-gray-300 text-sm sm:text-base md:text-lg max-w-xl text-center mb-8 sm:mb-10"
        >
          Empowering students with cutting-edge technology skills and fostering innovation through
          collaboration.
        </motion.p>
        {/*==================== End of Tagline ====================*/}

        {/*==================== Misson && Vision Cards ====================*/}
        <motion.div
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-6 sm:mb-8 md:mb-12 grid gap-4 sm:gap-6 md:gap-8 md:grid-cols-2 w-full max-w-4xl px-2 sm:px-4"
        >
          {/*==================== Mission Card ====================*/}
          <div className="group relative overflow-hidden rounded-xl border border-blue-700/30 bg-gray-900/30 p-4 sm:p-6 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-blue-700/60 hover:shadow-lg hover:shadow-blue-700/10">
            <div className="mb-2 sm:mb-4 flex items-center">
              <div className="mr-3 sm:mr-4 flex h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-blue-700/20">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-blue-500">Our Mission</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-300">
              To empower students with cutting-edge technology skills and foster innovation in the
              ICT sector through practical learning, industry collaboration, and community
              engagement.
            </p>
            <div className="absolute -bottom-2 -right-2 h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full bg-blue-700/10 blur-2xl"></div>
          </div>
          {/*==================== End of Mission Card ====================*/}

          {/*==================== Vision Card ====================*/}
          <div className="group relative overflow-hidden rounded-xl border border-amber-500/30 bg-gray-900/30 p-4 sm:p-6 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-amber-500/60 hover:shadow-lg hover:shadow-amber-500/10">
            <div className="mb-2 sm:mb-4 flex items-center">
              <div className="mr-3 sm:mr-4 flex h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-amber-500/20">
                <Eye className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-amber-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-amber-500">Our Vision</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-300">
              To be the leading technology association that bridges academic knowledge with industry
              practices, creating a generation of tech professionals who drive innovation and
              digital transformation.
            </p>
            <div className="absolute -bottom-2 -right-2 h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full bg-amber-500/10 blur-2xl"></div>
          </div>
          {/*==================== End of Vision Card ====================*/}
        </motion.div>
        {/*==================== End of Misson && Vision Cards ====================*/}

        {/*==================== Hero Section CTA ====================*/}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row w-full max-w-xs sm:max-w-md space-y-3 sm:space-y-0 sm:space-x-4 justify-center"
        >
          <button className="group relative overflow-hidden rounded-full bg-blue-700 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base text-white transition-all duration-300 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-700/30">
            <Link href={'/#degrees'} className="relative z-10 flex items-center justify-center">
              Learn More about ITCA
              <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <span className="absolute inset-0 -z-10 translate-y-full bg-amber-500 transition-transform duration-300 group-hover:translate-y-0"></span>
          </button>
          <button className="group relative overflow-hidden rounded-full border-2 border-amber-500 bg-transparent px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base text-amber-500 transition-all duration-300 hover:text-white hover:shadow-lg hover:shadow-amber-500/30">
            <Link href="/auth/sign-up" className="relative z-10 flex items-center justify-center">
              Join ITCA
              <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <span className="absolute inset-0 -z-10 translate-y-full bg-amber-500 transition-transform duration-300 group-hover:translate-y-0"></span>
          </button>
        </motion.div>
        {/*==================== End of Hero Section CTA ====================*/}
      </div>
      {/*==================== End of Content ====================*/}

      {/*===================== Floating Stats =====================*/}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-gray-800/30 bg-black/30 backdrop-blur-md hidden lg:block">
        <div className="container mx-auto">
          <div className="grid grid-cols-4 divide-x divide-gray-800/30">
            {/*==================== Stats Card 1 ====================*/}
            <div className="p-4 text-center">
              <div className="flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-blue-500">20+</span>
                <span className="text-xs text-gray-400">Members</span>
              </div>
            </div>
            {/*==================== End of Stats Card 1 ====================*/}

            {/*==================== Stats Card 2 ====================*/}
            <div className="p-4 text-center">
              <div className="flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-amber-500">15+</span>
                <span className="text-xs text-gray-400">Resources</span>
              </div>
            </div>
            {/*==================== End of Stats Card 2 ====================*/}

            {/*==================== Stats Card 3 ====================*/}
            <div className="p-4 text-center">
              <div className="flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-blue-500">3</span>
                <span className="text-xs text-gray-400">Partners</span>
              </div>
            </div>
            {/*==================== End of Stats Card 3 ====================*/}

            {/*==================== Stats Card 4 ====================*/}
            <div className="p-4 text-center">
              <div className="flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-amber-500">30+</span>
                <span className="text-xs text-gray-400">Events</span>
              </div>
            </div>
            {/*==================== End of Stats Card 4 ====================*/}
          </div>
        </div>
      </div>
      {/*===================== End of Floating Stats =====================*/}
    </section>
  );
};

export default HeroSection;
