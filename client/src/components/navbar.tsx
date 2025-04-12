import { Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export function Navbar() {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('accessToken');

  const NavLinks = () => (
    <div className="flex items-center gap-2 space-x-4">
      {/* bounties list */}
      <Link
        to="/"
        className={`hover:text-primary transition-colors ${location.pathname === '/' ? 'text-primary font-medium' : ''}`}
      >
        Bounties
      </Link>

      {/* organisations */}
      <Link
        to="/organisations"
        className={`hover:text-primary transition-colors ${location.pathname === '/organisations' ? 'text-primary font-medium' : ''}`}
      >
        Organisations
      </Link>

      {/* add create-bounty and create-organisation links if isAuthenticated */}
      {isAuthenticated && (
        <>
          <Link to="/create-bounty">Create Bounty</Link>
          <Link to="/create-organisation">Create Organisation</Link>
        </>
      )}

      {/* blog */}
      <Link to="/blog">Blog</Link>

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
          <Link to="/" className="text-xl font-bold mr-8">
            Zcash Bounties
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <NavLinks />
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-8">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
