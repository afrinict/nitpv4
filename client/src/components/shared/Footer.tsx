import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <div className="bg-white p-1 rounded">
                <span className="text-primary font-accent font-semibold text-xl">NITP</span>
              </div>
              <span className="ml-2 text-white font-medium">Nigerian Institute of Town Planners</span>
            </div>
            <p className="mt-4 text-neutral-200">
              The Nigerian Institute of Town Planners (NITP) Abuja Chapter is dedicated to promoting sustainable urban development and ethical practices in planning.
            </p>
            <div className="mt-6 flex space-x-6">
              <a href="#" className="text-neutral-200 hover:text-white" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-neutral-200 hover:text-white" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral-200 hover:text-white" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-neutral-200 hover:text-white" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about">
                  <a className="text-neutral-300 hover:text-white">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/membership">
                  <a className="text-neutral-300 hover:text-white">Membership</a>
                </Link>
              </li>
              <li>
                <Link href="/resources">
                  <a className="text-neutral-300 hover:text-white">Resources</a>
                </Link>
              </li>
              <li>
                <Link href="/news">
                  <a className="text-neutral-300 hover:text-white">News & Events</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-neutral-300 hover:text-white">Contact Us</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider">Contact Info</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <MapPin className="mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                <span>NITP Building, Plot 234, Central Business District, Abuja, Nigeria</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 flex-shrink-0" />
                <span>+234-123-456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 flex-shrink-0" />
                <span>info@nitpabuja.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-700 pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-base text-neutral-300">&copy; {new Date().getFullYear()} Nigerian Institute of Town Planners, Abuja Chapter. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/privacy-policy">
              <a className="text-neutral-300 hover:text-white">Privacy Policy</a>
            </Link>
            <Link href="/terms-of-service">
              <a className="text-neutral-300 hover:text-white">Terms of Service</a>
            </Link>
            <Link href="/cookie-policy">
              <a className="text-neutral-300 hover:text-white">Cookie Policy</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
