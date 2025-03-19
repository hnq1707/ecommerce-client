import Link from 'next/link';
import Menu from './Menu';
import SearchBar from './SearchBar';
import NavIcons from './NavIcons';

const Navbar = () => {
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/list', label: 'Shop' },
    { href: '/deals', label: 'Deals' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="h-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 fixed top-0 left-0 w-full bg-white shadow-md z-40">
      <div className="max-w-screen-2xl mx-auto h-full">
        {/* MOBILE */}
        <div className="h-full flex items-center justify-between md:hidden">
          <Link href="/" className="flex items-center">
            <span className="text-3xl font-semibold tracking-wide">LAMA</span>
          </Link>
          <div className="flex items-center gap-3">
            <SearchBar compact />
            <Menu />
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center justify-between h-full">
          {/* LEFT */}
          <div className="flex items-center gap-16">
            <Link href="/" className="flex items-center">
              <span className="text-3xl font-semibold tracking-wide">HNQ</span>
            </Link>
            <nav className="hidden xl:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="relative py-1.5 text-base font-medium text-gray-700 hover:text-black transition-colors duration-200 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full" />
                </Link>
              ))}
            </nav>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-6 lg:gap-10">
            <SearchBar />
            <NavIcons />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
