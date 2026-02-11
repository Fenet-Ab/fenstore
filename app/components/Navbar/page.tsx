"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, User } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Replace this with real auth state later
  const isLoggedIn = false;
  const cartCount = 2;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Electronics", href: "/category/electronics" },
    { name: "Clothes", href: "/category/clothes" },
    { name: "Shoes", href: "/shoes" },
    { name: "Accessories", href: "/accessories" },
  ];

  return (
    <nav className="w-full bg-white  shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center py-2">
            <img
              src='/logo.png'
              alt="Logo"
              className="h-12 md:h-16 w-auto object-contain transition-all duration-300 hover:scale-105 filter drop-shadow-[0_4px_12px_rgba(212,175,55,0.3)]"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-all duration-200 hover:text-[#D4AF37] relative group ${pathname === link.href ? "text-[#D4AF37]" : "text-gray-600"
                  }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#D4AF37] transition-all duration-300 ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}></span>
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-8">

            {/* Cart */}
            <Link href="/cart" className="relative group text-gray-600 hover:text-[#D4AF37] transition-colors">
              <ShoppingCart className="w-6 h-6 transition-transform group-hover:scale-110" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Buttons */}
            {!isLoggedIn ? (
              <div className="flex items-center space-x-6">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-[#D4AF37] transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-[#D4AF37] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#B8860B] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Register
                </Link>
              </div>
            ) : (
              <Link href="/profile" className="text-gray-600 hover:text-[#D4AF37] transition-colors group">
                <User className="w-6 h-6 transition-transform group-hover:scale-110" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-[#D4AF37] transition-colors p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[400px] border-t border-gray-100" : "max-h-0"
          }`}
      >
        <div className="bg-white px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block text-base font-medium transition-colors ${pathname === link.href ? "text-[#D4AF37]" : "text-gray-600"
                }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-100 flex flex-col space-y-4">
            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between text-gray-600"
            >
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Cart</span>
              </div>
              {cartCount > 0 && (
                <span className="bg-[#D4AF37] text-white text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            {!isLoggedIn ? (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#D4AF37] rounded-lg"
                >
                  Register
                </Link>
              </div>
            ) : (
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 text-gray-600"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
