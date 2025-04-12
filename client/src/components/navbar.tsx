import { Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export function Navbar() {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('accessToken');

  const NavLinks = () => (
    <div className="flex items-center gap-8 md:gap-2 space-x-0 md:space-x-4 flex-col md:flex-row">
      {/* bounties list */}
      <Link
        to="/"
        className={`hover:text-primary text-xl md:text-base transition-colors w-full md:w-auto text-center md:text-left ${
          location.pathname === '/' ? 'text-primary font-medium' : ''
        }`}
      >
        Bounties
      </Link>

      {/* organisations */}
      <Link
        to="/organisations"
        className={`hover:text-primary text-xl md:text-base transition-colors w-full md:w-auto text-center md:text-left ${
          location.pathname === '/organisations' ? 'text-primary font-medium' : ''
        }`}
      >
        Organisations
      </Link>

      {/* add create-bounty and create-organisation links if isAuthenticated */}
      {isAuthenticated && (
        <>
          <Link
            to="/create-bounty"
            className="hover:text-primary text-lg md:text-base transition-colors w-full md:w-auto text-center md:text-left"
          >
            Create Bounty
          </Link>
          <Link
            to="/create-organisation"
            className="hover:text-primary text-lg md:text-base transition-colors w-full md:w-auto text-center md:text-left"
          >
            Create Organisation
          </Link>
        </>
      )}

      {/* blog */}
      {/* <Link to="/blog">Blog</Link> */}

      <ThemeToggle />

      {/* {isAuthenticated ? (
        <Link
          to="/home"
          className={`hover:text-primary transition-colors ${location.pathname === '/home' ? 'text-primary font-medium' : ''}`}
        >
          Dashboard
        </Link>
      ) : (
        <Link
          to="/login"
          className={`hover:text-primary transition-colors ${location.pathname === '/login' ? 'text-primary font-medium' : ''}`}
        >
          Login
        </Link>
      )} */}
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="text-xl font-bold">
            Zcash Bounties
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <NavLinks />
          </nav>
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="ml-2">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80%] sm:w-[350px]">
            <nav className="flex flex-col mt-8">
              <NavLinks />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
