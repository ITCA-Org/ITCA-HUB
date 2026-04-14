import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code,
  Radio,
  Users,
  Check,
  Clock,
  BookOpen,
  Database,
  ChevronDown,
  GraduationCap,
} from 'lucide-react';

type Degree = {
  id: number;
  title: string;
  level: 'Undergraduate';
  duration: string;
  description: string;
  image: string;
  highlights: string[];
  icon: React.ReactNode;
};

const degrees: Degree[] = [
  {
    id: 1,
    title: 'Computer Science',
    level: 'Undergraduate',
    duration: '4 years',
    description:
      "A comprehensive program covering programming, algorithms, data structures, and software engineering principles. Develop the technical skills necessary to design and build software systems that power today's digital economy.",
    image: '/images/degree-1.jpg',
    highlights: [
      'Specializations in AI, Cybersecurity, or Software Engineering',
      'Industry-partnered capstone projects',
      'Internship opportunities with leading tech companies',
      'Strong foundation in computational theory and practice',
      'Advanced algorithms and data structures',
    ],
    icon: <Code className="w-5 h-5" />,
  },
  {
    id: 2,
    title: 'Information Systems',
    level: 'Undergraduate',
    duration: '4 years',
    description:
      'Focus on bridging technology and business needs by designing, implementing, and managing information systems that support organizational operations. Learn to analyze business problems and develop technology solutions.',
    image: '/images/degree-2.jpg',
    highlights: [
      'Business process modeling and analysis',
      'Database design and management',
      'Project management methodologies',
      'Enterprise systems integration',
      'IT service management',
    ],
    icon: <Database className="w-5 h-5" />,
  },
  {
    id: 3,
    title: 'Telecommunications',
    level: 'Undergraduate',
    duration: '4 years',
    description:
      'Master the science and technology of communication at a distance through electronic transmission of information. Focus on network design, wireless communications, signal processing, and telecommunications infrastructure.',
    image: '/images/degree-3.jpg',
    highlights: [
      'Network architecture and protocols',
      'Wireless communications systems',
      'Signal processing techniques',
      'Optical communication technologies',
      'Telecommunications regulations and standards',
    ],
    icon: <Radio className="w-5 h-5" />,
  },
];

const DegreesSection = () => {
  const [selectedDegree, setSelectedDegree] = useState<Degree | null>(null);
  const [hoveredTab, setHoveredTab] = useState<number | null>(null);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 640);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!selectedDegree && degrees.length > 0) {
      setSelectedDegree(degrees[0]);
    }
  }, [selectedDegree]);

  return (
    <section id="degrees" className="relative py-24 overflow-hidden">
      {/*==================== Dynamic Background with geometric shapes ====================*/}
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-white to-gray-100"></div>

      {/*==================== Prominent Geometric Elements - Top Right ====================*/}
      <div className="absolute top-0 right-0 w-2/3 h-full overflow-hidden -z-5">
        <div className="absolute top-10 right-0 w-full h-full">
          <div className="absolute top-10 right-[-200px] h-[500px] w-[500px] rounded-full border-40 border-amber-500/5 animate-pulse"></div>
          <div
            className="absolute top-40 right-[-150px] h-[400px] w-[400px] rounded-full border-30 border-blue-700/5 animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className="absolute top-60 right-[-100px] h-[300px] w-[300px] rounded-full border-20 border-amber-500/5 animate-pulse"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>
      </div>
      {/*==================== End of Prominent Geometric Elements - Top Right ====================*/}

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          viewport={{ once: true }}
          className="mb-16 text-center"
          transition={{ duration: 0.6 }}
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <span className="inline-block text-blue-700 font-semibold mb-2">ACADEMIC EXCELLENCE</span>
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Our <span className="text-amber-500">Undergraduate</span> Programs
          </h2>
          <div className="mx-auto h-1 w-24 bg-linear-to-r from-blue-700 via-amber-500 to-blue-700 rounded-full mb-6"></div>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Explore our comprehensive undergraduate degree programs designed to prepare you for the
            rapidly evolving technology landscape.
          </p>
        </motion.div>

        {/*==================== Tab Navigation ====================*/}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16 relative"
        >
          {/*==================== Mobile Dropdown Selector ====================*/}
          {isMobileView && (
            <div className="relative mx-auto max-w-sm mb-8">
              <button
                onClick={() => setShowMobileDropdown(!showMobileDropdown)}
                className="w-full flex items-center justify-between p-4 bg-white/70 rounded-xl shadow-md shadow-blue-700/5 text-gray-800"
              >
                <div className="flex items-center">
                  {selectedDegree && (
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">{selectedDegree.icon}</div>
                  )}
                  <span className="font-medium">
                    {selectedDegree ? selectedDegree.title : 'Select a program'}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${showMobileDropdown ? 'rotate-180' : ''}`}
                />
              </button>

              {/*==================== Dropdown Menu ====================*/}
              <AnimatePresence>
                {showMobileDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-20 top-full left-0 right-0 mt-1 bg-white/90 rounded-xl overflow-hidden"
                  >
                    {degrees.map((degree) => (
                      <div
                        key={degree.id}
                        onClick={() => {
                          setSelectedDegree(degree);
                          setShowMobileDropdown(false);
                        }}
                        className={`flex items-center p-4 cursor-pointer transition-colors hover:bg-blue-50 ${
                          selectedDegree?.id === degree.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg mr-3 ${
                            selectedDegree?.id === degree.id ? 'bg-blue-100' : 'bg-gray-100'
                          }`}
                        >
                          {degree.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{degree.title}</h4>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{degree.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              {/*==================== End of Dropdown Menu ====================*/}
            </div>
          )}
          {/*==================== End of Mobile Dropdown Selector ====================*/}

          {/*==================== Desktop Tabs ====================*/}
          {!isMobileView && (
            <div className="relative flex justify-center mx-auto w-full backdrop-blur-sm rounded-2xl p-2 shadow-lg shadow-blue-700/5 overflow-hidden">
              {/*==================== Active Tab Indicator ====================*/}
              {selectedDegree && (
                <motion.div
                  initial={false}
                  animate={{
                    x: tabRefs.current[selectedDegree.id - 1]?.offsetLeft || 0,
                    width: tabRefs.current[selectedDegree.id - 1]?.offsetWidth || 0,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="absolute top-0 left-0 h-full z-0 rounded-xl bg-linear-to-r from-blue-700/90 to-blue-600/90 shadow-md"
                />
              )}
              {/*==================== End of Active Tab Indicator ====================*/}

              {degrees.map((degree, index) => (
                <motion.div
                  key={degree.id}
                  whileTap={{ scale: 0.98 }}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  onMouseLeave={() => setHoveredTab(null)}
                  onClick={() => setSelectedDegree(degree)}
                  onMouseEnter={() => setHoveredTab(degree.id)}
                  className={`relative z-10 px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 cursor-pointer transition-all duration-300 flex-1 flex flex-col items-center rounded-xl
                    ${selectedDegree?.id === degree.id ? 'text-white' : 'text-gray-700 hover:text-blue-700'}`}
                >
                  <div
                    className={`flex items-center justify-center mb-2 transition-all duration-300 ${
                      selectedDegree?.id === degree.id
                        ? 'scale-110'
                        : hoveredTab === degree.id
                          ? 'scale-105'
                          : ''
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        selectedDegree?.id === degree.id ? 'bg-white/20' : 'bg-blue-100'
                      }`}
                    >
                      {degree.icon}
                    </div>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base lg:text-lg text-center">
                    {degree.title}
                  </h3>

                  <div className="flex items-center mt-1 text-xs opacity-80">
                    <Clock className="w-3 h-3 mr-1" />
                    <span className="whitespace-nowrap">{degree.duration}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          {/*==================== End of Desktop Tabs ====================*/}
        </motion.div>
        {/*==================== End of Tab Navigation ====================*/}

        {/*==================== Program Details ====================*/}
        <AnimatePresence mode="wait">
          {selectedDegree ? (
            <motion.div
              key={selectedDegree.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl shadow-blue-700/5 overflow-hidden mx-auto max-w-7xl"
            >
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-2/5 relative">
                  <div className="h-64 lg:h-full w-full relative">
                    <Image
                      fill
                      className="object-cover"
                      alt={selectedDegree.title}
                      src={selectedDegree.image || '/placeholder.svg'}
                    />

                    {/*==================== Dark gradient overlay ====================*/}
                    <div className="absolute inset-0 bg-linear-to-r from-black/80 to-transparent lg:bg-linear-to-t"></div>

                    {/*==================== Content overlay ====================*/}
                    <div className="absolute bottom-0 left-0 w-full p-6 z-10">
                      <div className="mb-2 inline-block px-3 py-1.5 rounded-lg bg-linear-to-r from-blue-700 to-blue-600 text-xs font-semibold uppercase text-white shadow-md">
                        {selectedDegree.level}
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1 drop-shadow-md">
                        {selectedDegree.title}
                      </h3>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <div className="flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                          <Clock className="mr-2 h-4 w-4 text-amber-400" />
                          <span className="text-white font-medium">
                            Duration: {selectedDegree.duration}
                          </span>
                        </div>

                        <div className="flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                          <Users className="mr-2 h-4 w-4 text-amber-400" />
                          <span className="text-white font-medium">200+ Students</span>
                        </div>
                      </div>
                    </div>
                    {/*==================== End of Content overlay ====================*/}
                  </div>
                </div>

                {/*==================== RightSide Content ====================*/}
                <div className="lg:w-3/5 p-4 sm:p-6 md:px-8 md:py-6">
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <GraduationCap className="w-6 h-6 text-blue-700 mr-2" />
                      <h4 className="text-xl font-bold text-gray-900">Program Overview</h4>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{selectedDegree.description}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <BookOpen className="w-5 h-5 text-amber-500 mr-2" />
                      What You{"'"}ll Learn
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedDegree.highlights.map((highlight, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="flex items-start p-3 rounded-lg bg-linear-to-r from-gray-50 to-white border border-gray-100"
                        >
                          <div className="mr-3 mt-0.5 h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                            <Check className="h-3 w-3 text-green-600" />
                          </div>
                          <span className="text-gray-700 text-sm">{highlight}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
                {/*==================== End of RightSide Content ====================*/}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 flex flex-col items-center justify-center min-h-[300px] max-w-3xl mx-auto"
            >
              <BookOpen className="w-16 h-16 text-blue-700/20 mb-6" />
              <h3 className="text-xl font-medium text-gray-400 mb-4 text-center">
                Select a program to view details
              </h3>
              <p className="text-gray-400 text-center max-w-md">
                Click on one of the program icons above to explore our undergraduate offerings and
                discover which path is right for you.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        {/*==================== End of Program Details ====================*/}
      </div>
    </section>
  );
};

export default DegreesSection;
