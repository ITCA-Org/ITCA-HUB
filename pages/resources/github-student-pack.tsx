import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import LandingLayout from '@/components/landing-page/landing-layout';
import GithubStudentPackGuide from '@/components/landing-page/github-student-pack-guide';

const GithubStudentPackPage = () => {
  return (
    <LandingLayout
      path="/resources/github-student-pack"
      title="GitHub Student Developer Pack | ITCA Hub"
      description="Step-by-step guide for UTG School of ICT students to apply for the GitHub Student Developer Pack, claim IntelliJ IDEA, and renew student benefits."
      showFloatingCta={false}
    >
      <div className="bg-white px-4 pt-10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[900px]">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A1628]/60 hover:text-[#0A1628]"
          >
            <ArrowLeft className="h-4 w-4" />
            All resources
          </Link>
        </div>
      </div>

      <GithubStudentPackGuide />
    </LandingLayout>
  );
};

export default GithubStudentPackPage;
