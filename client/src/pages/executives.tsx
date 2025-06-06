import React, { useState } from 'react';
import { Link } from 'wouter';
import Navbar from '../components/Navbar';

interface Executive {
  name: string;
  designation: string;
  image?: string;
  initials: string;
}

const executives: Executive[] = [
  {
    name: 'Tpl. Queen Imalue Phillips FNITP',
    designation: 'Chairman',
    initials: 'QP'
  },
  {
    name: 'Tpl. Gabriel Ameh FNITP',
    designation: '1st Vice Chairman',
    initials: 'GA'
  },
  {
    name: 'Tpl. Dr. Kanu Kingsley MNITP',
    designation: '2nd Vice Chairman',
    initials: 'KK'
  },
  {
    name: 'Tpl. Grace Bitrus MNITP',
    designation: 'General Secretary',
    initials: 'GB'
  },
  {
    name: 'Tpl. Aisha Abubakar Aliyu FNITP',
    designation: 'Assistant General Secretary',
    initials: 'AA'
  },
  {
    name: 'Tpl. Mansurah Akintayo MNITP',
    designation: 'Financial Secretary',
    initials: 'MA'
  },
  {
    name: 'Tpl. Alabi Opeyemi MNITP',
    designation: 'Treasurer',
    initials: 'AO'
  },
  {
    name: 'Tpl. Nzelu Evelyn Ebubedike MNITP',
    designation: 'Auditor',
    initials: 'NE'
  },
  {
    name: 'Tpl. Emmanuel Gaji Mutah MNITP',
    designation: 'Public Relations Secretary',
    initials: 'EM'
  },
  {
    name: 'Tpl. Halimatu Sadiya Muhammad MNITP',
    designation: 'Assistant Public Relations Secretary',
    initials: 'HM'
  },
  {
    name: 'Tpl. Abolaji Shittu Mutiu MNITP',
    designation: 'Chairman Practice & Ethics Committee',
    initials: 'AM'
  },
  {
    name: 'Tpl. Lami P. K. Ayuba FNITP',
    designation: 'Ex-officio I',
    initials: 'LA'
  },
  {
    name: 'Tpl. Dairo Ayorinde Rasaki MNITP',
    designation: 'Ex-officio II',
    initials: 'DR'
  }
];

const Executives = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar showLoginModal={() => setShowLoginModal(true)} />
      
      {/* Header Section - Adjusted padding-top to account for fixed navbar */}
      <div className="bg-primary relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Meet Our Executive Council
            </h1>
            <p className="text-xl text-white/90">
              The NITP Abuja Chapter is led by a dynamic team of seasoned town planning professionals 
              dedicated to advancing the institute's objectives and fostering sustainable urban development 
              within the Federal Capital Territory.
            </p>
          </div>
        </div>
      </div>

      {/* Executives Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 xl:gap-10">
          {executives.map((executive, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
            >
              <div className="p-6">
                {/* Profile Image/Initials */}
                <div className="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-primary/20 bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden group-hover:border-primary/40 transition-colors">
                  {executive.image ? (
                    <img
                      src={executive.image}
                      alt={executive.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-semibold text-gray-600 dark:text-gray-300">
                      {executive.initials}
                    </span>
                  )}
                </div>

                {/* Executive Info */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {executive.name}
                  </h3>
                  <p className="text-sm font-medium text-primary uppercase tracking-wider">
                    {executive.designation}
                  </p>
                </div>

                {/* Optional: Add a subtle hover effect for future expansion */}
                <div className="mt-4 text-center">
                  <button className="text-sm text-primary hover:text-primary-dark font-medium transition-colors opacity-0 group-hover:opacity-100">
                    View Profile →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Statement Section */}
      <div className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Commitment
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Our executive council's collective expertise guides our initiatives, ensures adherence to 
              professional ethics, and drives impactful contributions to our community. Together, we work 
              towards creating sustainable and livable environments for all.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 dark:bg-gray-900 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <p className="text-gray-300">
                NITP Abuja Chapter Secretariat<br />
                Plot 123, Example Street<br />
                Abuja, Nigeria<br />
                Phone: +234 123 456 7890<br />
                Email: info@nitp-abuja.afrinict.com
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-300 hover:text-yellow-400">About Us</Link></li>
                <li><Link href="/events" className="text-gray-300 hover:text-yellow-400">Events</Link></li>
                <li><Link href="/members" className="text-gray-300 hover:text-yellow-400">Members</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-yellow-400">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-300 hover:text-yellow-400">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-300 hover:text-yellow-400">Terms of Service</Link></li>
                <li><Link href="/ethics" className="text-gray-300 hover:text-yellow-400">Code of Ethics</Link></li>
                <li><Link href="/sitemap" className="text-gray-300 hover:text-yellow-400">Sitemap</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-yellow-400">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.75 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-yellow-400">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-yellow-400">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-yellow-400">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} NITP Abuja Chapter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Executives; 