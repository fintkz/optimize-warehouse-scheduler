
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Truck, Calendar, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container-lg flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Truck className="h-8 w-8 text-warehouse-blue" />
          <span className="text-xl font-bold text-warehouse-dark">WarehouseAI</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-warehouse-gray hover:text-warehouse-blue font-medium">Home</Link>
          <Link to="/dashboard" className="text-warehouse-gray hover:text-warehouse-blue font-medium">Dashboard</Link>
          <Link to="/features" className="text-warehouse-gray hover:text-warehouse-blue font-medium">Features</Link>
          <Link to="/about" className="text-warehouse-gray hover:text-warehouse-blue font-medium">About</Link>
          <Button variant="default" className="bg-warehouse-blue hover:bg-warehouse-lightBlue">Login</Button>
        </div>
        
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-50 animate-fade-in">
          <div className="container py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-warehouse-gray hover:text-warehouse-blue font-medium p-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/dashboard" 
              className="text-warehouse-gray hover:text-warehouse-blue font-medium p-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/features" 
              className="text-warehouse-gray hover:text-warehouse-blue font-medium p-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/about" 
              className="text-warehouse-gray hover:text-warehouse-blue font-medium p-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Button className="bg-warehouse-blue hover:bg-warehouse-lightBlue mt-2">Login</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
