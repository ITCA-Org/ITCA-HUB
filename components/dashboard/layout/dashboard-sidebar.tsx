import {
  X,
  Users,
  FileText,
  Calendar,
  User2Icon,
  HelpCircle,
  LayoutDashboardIcon,
  ScanLine,
  WalletCards,
  Mail,
  MessageSquare,
  BadgeCheck,
  Package,
  ShoppingBag,
  QrCode,
  ScrollText,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { NavItem } from '@/types';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { DashboardSidebarProps } from '@/types/interfaces/dashboard';

const adminNavItems: NavItem[] = [
  { name: 'Hackathon', href: '/admin/hackathon', icon: <Calendar className="h-5 w-5" /> },
  {
    name: 'Overview',
    href: '/admin',
    icon: <LayoutDashboardIcon className="h-5 w-5" />,
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: <Users className="h-5 w-5" />,
  },
  {
    name: 'Newsletter',
    href: '/admin/newsletter',
    icon: <Mail className="h-5 w-5" />,
  },
  {
    name: 'Feedback',
    href: '/admin/feedback',
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    name: 'Events',
    href: '/admin/events',
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    name: 'Ticket Scanner',
    href: '/admin/ticket-scanner',
    icon: <ScanLine className="h-5 w-5" />,
  },
  {
    name: 'Semester Dues',
    href: '/admin/dues',
    icon: <WalletCards className="h-5 w-5" />,
  },
  {
    name: 'Dues Scanner',
    href: '/admin/dues-scanner',
    icon: <BadgeCheck className="h-5 w-5" />,
  },
  {
    name: 'Shop Products',
    href: '/admin/shop/products',
    icon: <Package className="h-5 w-5" />,
  },
  {
    name: 'Shop Orders',
    href: '/admin/shop/orders',
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    name: 'Shop Scanner',
    href: '/admin/shop/scanner',
    icon: <QrCode className="h-5 w-5" />,
  },
  {
    name: 'Past Papers',
    href: '/admin/past-papers',
    icon: <ScrollText className="h-5 w-5" />,
  },
  {
    name: 'Resources',
    href: '/admin/resources',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: 'Profile',
    href: '/admin/profile',
    icon: <User2Icon className="h-5 w-5" />,
  },
  {
    name: 'Help',
    href: '/admin/help',
    icon: <HelpCircle className="h-5 w-5" />,
  },
];

const facultyNavItems: NavItem[] = [
  {
    name: 'Semester Dues',
    href: '/admin/dues',
    icon: <WalletCards className="h-5 w-5" />,
  },
  {
    name: 'Dues Scanner',
    href: '/admin/dues-scanner',
    icon: <BadgeCheck className="h-5 w-5" />,
  },
];

const Sidebar = ({ open, setOpen, role }: DashboardSidebarProps) => {
  const router = useRouter();
  const navItems = role === 'faculty_officer' ? facultyNavItems : adminNavItems;
  const homeHref = role === 'faculty_officer' ? '/admin/dues' : '/admin';

  const isActive = (href: string) => {
    if (href === '/admin') {
      return router.pathname === href;
    }
    return router.pathname === href || router.pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    if (open) document.addEventListener('keydown', onKey);
    router.events.on('routeChangeStart', close);
    return () => {
      document.removeEventListener('keydown', onKey);
      router.events.off('routeChangeStart', close);
    };
  }, [open, setOpen, router.events]);
  const groups =
    role === 'faculty_officer'
      ? [{ label: 'Finance', items: navItems }]
      : [
          {
            label: 'Workspace',
            items: navItems.filter((i) =>
              ['Overview', 'Users', 'Newsletter', 'Feedback'].includes(i.name)
            ),
          },
          {
            label: 'Content & community',
            items: navItems.filter((i) =>
              ['Events', 'Hackathon', 'Resources', 'Past Papers'].includes(i.name)
            ),
          },
          {
            label: 'Payments & check-in',
            items: navItems.filter((i) =>
              [
                'Semester Dues',
                'Dues Scanner',
                'Ticket Scanner',
                'Shop Products',
                'Shop Orders',
                'Shop Scanner',
              ].includes(i.name)
            ),
          },
          { label: 'Account', items: navItems.filter((i) => ['Profile', 'Help'].includes(i.name)) },
        ];
  return (
    <>
      {open && (
        <button
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-[#0A1628]/45 backdrop-blur-sm min-[968px]:hidden"
        />
      )}
      <aside
        id="admin-navigation"
        aria-label="Dashboard navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] shrink-0 flex-col border-r border-[#0A1628]/10 bg-white transition-transform duration-200 min-[968px]:static min-[968px]:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full max-[967px]:invisible'}`}
      >
        <div className="flex h-24 shrink-0 items-center justify-between px-6">
          <Link href={homeHref} aria-label="ITCA dashboard home">
            <Image
              priority
              width={156}
              height={50}
              alt="ITCA"
              src="/itca-logo.png"
              className="h-auto w-[156px]"
            />
          </Link>
          <button
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="rounded-full p-2 hover:bg-[#D4E6F2] min-[968px]:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="landing-mono mx-6 mb-4 flex items-center gap-2 border-b border-[#0A1628]/10 pb-5 text-[10px] uppercase tracking-[0.16em]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A00]" />
          {role === 'faculty_officer' ? 'Faculty workspace' : 'Admin workspace'}
        </div>
        <nav className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 pb-6">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="landing-mono mb-2 px-3 text-[10px] uppercase tracking-[0.12em] text-[#005080]">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${isActive(item.href) ? 'bg-[#0A1628] font-semibold text-white' : 'text-[#0A1628]/70 hover:bg-[#D4E6F2]/50 hover:text-[#005080]'}`}
                  >
                    <span className={isActive(item.href) ? 'text-[#FF6A00]' : 'text-[#005080]'}>
                      {item.icon}
                    </span>
                    {item.name}
                    {isActive(item.href) && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#FF6A00]" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="shrink-0 border-t border-[#0A1628]/10 p-4">
          <Link
            href="/"
            className="flex justify-between rounded-xl bg-[#D4E6F2]/40 px-4 py-3 text-sm font-medium text-[#005080]"
          >
            View public website <span aria-hidden="true">&nearr;</span>
          </Link>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
