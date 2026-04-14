'use client';

import { motion } from 'framer-motion';
import {
  Lock,
  BookOpen,
  FileText,
  Video,
  Code,
  Download,
  ChevronRight,
  Layers,
  Zap,
  BookMarked,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const ResourcesSection = () => {
  const resourceCategories = [
    {
      name: 'E-Books & Guides',
      icon: <BookOpen className="h-6 w-6" />,
      count: 120,
      color: 'blue',
    },
    {
      name: 'Lecture Notes',
      icon: <FileText className="h-6 w-6" />,
      count: 85,
      color: 'amber',
    },
    {
      name: 'Tutorial Videos',
      icon: <Video className="h-6 w-6" />,
      count: 64,
      color: 'blue',
    },
    {
      name: 'Code Samples',
      icon: <Code className="h-6 w-6" />,
      count: 230,
      color: 'amber',
    },
    {
      name: 'Software Tools',
      icon: <Download className="h-6 w-6" />,
      count: 46,
      color: 'blue',
    },
    {
      name: 'Practice Projects',
      icon: <Layers className="h-6 w-6" />,
      count: 37,
      color: 'amber',
    },
  ];

  return (
    <section id="resources" className="relative py-24 overflow-hidden">
      {/*==================== Subtle Dot Pattern ====================*/}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(30,64,175,1) 1px, transparent 0)',
          backgroundSize: '30px 30px',
        }}
      ></div>
      {/*==================== End of Subtle Dot Pattern ====================*/}

      {/*==================== Decorative Background Elements ====================*/}
      <div className="absolute inset-0 -z-5 opacity-50">
        {/*==================== Technology circuit pattern - top right ====================*/}
        <div className="absolute top-0 right-0 w-2/3 h-2/3 overflow-hidden">
          {/*==================== Circuit Lines ====================*/}
          <div className="absolute top-16 right-16 w-[500px] h-[500px]">
            <div className="absolute top-0 left-[30%] w-1 h-[70%] bg-linear-to-b from-blue-700/0 via-blue-700/90 to-blue-700/0"></div>
            <div className="absolute top-[30%] left-0 w-[70%] h-1 bg-linear-to-r from-blue-700/0 via-amber-500/90 to-amber-700/0"></div>

            {/*==================== Circuit Nodes ====================*/}
            <div className="absolute top-[30%] left-[30%] w-4 h-4 rounded-full border-2 border-blue-700/90 bg-white"></div>
            <div className="absolute top-[30%] left-[50%] w-3 h-3 rounded-full border border-blue-700/90 bg-white"></div>
            <div className="absolute top-[30%] left-[70%] w-2 h-2 rounded-full bg-blue-700/90"></div>
            <div className="absolute top-[50%] left-[30%] w-3 h-3 rounded-full border border-blue-700/90 bg-white"></div>
            <div className="absolute top-[70%] left-[30%] w-2 h-2 rounded-full bg-blue-700/90"></div>
            {/*==================== End of Circuit Nodes ====================*/}
          </div>
          {/*==================== End of Circuit Lines ====================*/}
        </div>

        {/*==================== Book/learning Pattern - Bottom Left ====================*/}
        <div className="absolute bottom-0 left-0 w-2/3 h-2/3 overflow-hidden">
          <div className="absolute bottom-0 left-16 w-[500px] h-[500px]">
            {/* Book Spine Lines */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`book-${index}`}
                className="absolute h-[2px]"
                style={{
                  bottom: `${20 + index * 12}%`,
                  left: '5%',
                  width: `${30 + index * 10}%`,
                  background: `linear-gradient(to right, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, ${0.05 + index * 0.02}))`,
                }}
              ></div>
            ))}

            {/*==================== Book Icons ====================*/}
            <div className="absolute bottom-[31.85%] left-[15%] opacity-60">
              <BookMarked strokeWidth={1.5} className="w-16 h-16 text-amber-500" />
            </div>
            <div className="absolute bottom-[20%] left-[35%] opacity-70 rotate-12">
              <BookMarked strokeWidth={1.5} className="w-10 h-10 text-amber-500" />
            </div>
            <div className="absolute bottom-[20%] left-[2%] opacity-70 -rotate-12">
              <BookMarked strokeWidth={1.5} className="w-10 h-10 text-amber-500" />
            </div>
            {/*==================== End of Book Icons ====================*/}
          </div>
        </div>
        {/*==================== End of Book/learning Pattern - Bottom Left ====================*/}
      </div>
      {/*==================== End of Decorative Background Elements ====================*/}

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="inline-block text-blue-700 font-semibold mb-2">ACADEMIC SUPPORT</span>
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Learning <span className="text-amber-500">Resources</span>
          </h2>
          <div className="mx-auto h-1 w-24 bg-linear-to-r from-blue-700 via-amber-500 to-blue-700 rounded-full mb-6"></div>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Access our comprehensive collection of learning materials, tools, and resources designed
            to enhance your journey in the ICT field.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/*==================== Left Column - Resources Categories ====================*/}
          <motion.div
            className="lg:col-span-2"
            viewport={{ once: true }}
            initial={{ opacity: 0, x: -70 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-transparent rounded-2xl p-8 h-full">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Zap className="mr-2 h-5 w-5 text-amber-500" />
                Available Resource Categories
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {resourceCategories.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                    className={`group relative overflow-hidden rounded-xl border ${
                      category.color === 'blue'
                        ? 'border-blue-100 bg-blue-50/50'
                        : 'border-amber-100 bg-amber-50/50'
                    } p-4 hover:shadow-md transition-all duration-300`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`mr-4 p-3 rounded-lg ${
                          category.color === 'blue'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {category.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{category.name}</h4>
                        <div className="mt-1 flex items-center">
                          <span
                            className={`text-sm ${
                              category.color === 'blue' ? 'text-blue-700' : 'text-amber-700'
                            }`}
                          >
                            {category.count}+ resources
                          </span>
                          <Lock className="ml-2 h-3 w-3 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-linear-to-r from-blue-700 to-amber-500 transition-all duration-300"></div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 text-center text-sm text-gray-500">
                <p>Over 500+ resources available for ITCA members</p>
              </div>
            </div>
          </motion.div>
          {/*==================== End of Left Column - Resources Categories ====================*/}

          {/*==================== Right Column - Login Card ====================*/}
          <motion.div
            viewport={{ once: true }}
            initial={{ opacity: 0, x: 70 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-linear-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-8 shadow-xl h-full flex flex-col">
              <div className="flex-1">
                <div className="inline-block p-3 bg-amber-500/20 rounded-xl mb-6">
                  <Lock className="h-8 w-8 text-amber-500" />
                </div>

                <h3 className="text-2xl font-bold mb-3">Unlock Premium Resources</h3>

                <p className="text-gray-300 mb-8">
                  Sign in to your ITCA account to access our complete library of learning resources,
                  downloadable materials, and exclusive content.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center">
                    <div className="mr-3 h-6 w-6 rounded-full bg-blue-700/20 flex items-center justify-center">
                      <ChevronRight className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="text-gray-300">Access to all resources</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-3 h-6 w-6 rounded-full bg-blue-700/20 flex items-center justify-center">
                      <ChevronRight className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="text-gray-300">Download materials for offline use</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-3 h-6 w-6 rounded-full bg-blue-700/20 flex items-center justify-center">
                      <ChevronRight className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="text-gray-300">Track your learning progress</span>
                  </div>
                </div>
              </div>

              <Link
                href={'/auth'}
                className="group relative block w-full overflow-hidden rounded-lg bg-blue-700 px-6 py-3 text-center font-medium text-white transition-all hover:bg-blue-600"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Login to Access
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 -z-10 translate-y-full bg-amber-500 transition-transform duration-300 group-hover:translate-y-0"></span>
              </Link>

              <div className="mt-4 text-center">
                <Link
                  href="/auth/sign-up"
                  className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Not a member yet? Join ITCA today
                </Link>
              </div>
            </div>
          </motion.div>
          {/*==================== End of Right Column - Login Card ====================*/}
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
