import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';

// Mock data for news and events
const newsItems = [
  {
    id: 1,
    title: 'NITP Abuja Concludes Annual Summit on Smart City Initiatives',
    summary: 'The chapter successfully hosted its annual summit, bringing together urban planning experts to discuss smart city development.',
    date: 'May 20, 2025',
    image: '/images/Slider1.jpg'
  },
  {
    id: 2,
    title: 'New Policy Framework for Green Spaces in FCT Announced',
    summary: 'A comprehensive policy framework for managing and expanding green spaces in the Federal Capital Territory has been unveiled.',
    date: 'May 15, 2025',
    image: '/images/Slider2.jpg'
  },
  {
    id: 3,
    title: 'Call for Papers: 2025 Urban Development Journal',
    summary: 'Submit your research papers for consideration in our upcoming journal publication on urban development and planning.',
    date: 'May 10, 2025',
    image: '/images/Slider3.jpg'
  }
];

const upcomingEvents = [
  {
    id: 1,
    title: 'Webinar: Digital Tools for Master Planning',
    date: 'June 15, 2025',
    time: '2:00 PM WAT',
    location: 'Virtual Event',
    description: 'Learn about the latest digital tools and technologies transforming master planning processes.',
    action: 'Register Now'
  },
  {
    id: 2,
    title: 'NITP Abuja Annual General Meeting (AGM)',
    date: 'July 1, 2025',
    time: '10:00 AM WAT',
    location: 'NITP Abuja Chapter Secretariat',
    description: 'Join us for our annual general meeting to discuss chapter activities and future plans.',
    action: 'View Details'
  }
];

const membershipCategories = [
  {
    title: 'Student',
    benefits: 'Access to learning resources and mentorship programs',
    action: 'Register as Student'
  },
  {
    title: 'Associate',
    benefits: 'Professional development and networking opportunities',
    action: 'Register as Associate'
  },
  {
    title: 'Professional',
    benefits: 'Full membership benefits and practice rights',
    action: 'Register as Professional'
  },
  {
    title: 'Fellow',
    benefits: 'Recognition for outstanding contributions to the profession',
    action: 'Register as Fellow'
  }
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = [
    {
      title: "Shaping Tomorrow's Cities",
      subtitle: "Innovative Urban Planning for a Sustainable Abuja",
      image: '/images/Slider1.jpg'
    },
    {
      title: "Excellence in Practice",
      subtitle: "Upholding Professional Standards in Town Planning",
      image: '/images/Slider2.jpg'
    },
    {
      title: "Connecting Planners",
      subtitle: "Your Hub for Professional Growth and Collaboration",
      image: '/images/Slider3.jpg'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/images/logo.png" alt="NITP Logo" className="h-16 w-auto" />
            <span className="ml-4 text-xl font-semibold text-gray-800 dark:text-gray-200 hidden md:block">
              Nigerian Institute of Town Planners
              <span className="block text-sm text-gray-600 dark:text-gray-400">Abuja Chapter</span>
            </span>
          </div>
          <nav className="flex items-center space-x-6">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors">
              About Us
            </Link>
            <Link href="/events" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors">
              Events
            </Link>
            <Link href="/executives" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors">
              Executives
            </Link>
            <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark font-medium transition-colors">
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-2xl md:text-3xl text-white/90 mb-10 font-light">
                    {slide.subtitle}
                  </p>
                  <div className="flex space-x-6">
                    <Link href="/register">
                      <button className="px-10 py-4 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all transform hover:scale-105 shadow-lg">
                        Join NITP
                      </button>
                    </Link>
                    <Link href="/about">
                      <button className="px-10 py-4 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all transform hover:scale-105 backdrop-blur-sm border border-white/20">
                        Learn More
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-12 left-0 right-0">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center space-x-4">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all transform hover:scale-110 ${
                    index === currentSlide ? 'bg-white scale-110' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <section className="py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
              Welcome to NITP Abuja Chapter
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
              Leading the Future of Urban Planning in Nigeria's Capital. We are dedicated to promoting best practices, 
              fostering professional excellence, and advocating for sustainable and livable environments.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="p-8 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Professional Development</h3>
                <p className="text-gray-600 dark:text-gray-300">Access to training, workshops, and certification programs.</p>
              </div>
              <div className="p-8 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Networking</h3>
                <p className="text-gray-600 dark:text-gray-300">Connect with fellow planners and industry experts.</p>
              </div>
              <div className="p-8 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Advocacy</h3>
                <p className="text-gray-600 dark:text-gray-300">Shape the future of urban planning in Abuja.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News & Events Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* News Feed */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">
                Latest News & Insights
              </h3>
              <div className="space-y-10">
                {newsItems.map((news) => (
                  <div key={news.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="object-cover w-full h-56"
                      />
                    </div>
                    <div className="p-8">
                      <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                        {news.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                        {news.summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {news.date}
                        </span>
                        <button className="text-primary hover:text-primary-dark font-medium transition-colors">
                          Read More →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Events Feed */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">
                Upcoming Events
              </h3>
              <div className="space-y-8">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                      {event.title}
                    </h4>
                    <div className="space-y-4 text-gray-600 dark:text-gray-300 mb-6">
                      <p className="flex items-center text-lg">
                        <svg className="w-6 h-6 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {event.date} at {event.time}
                      </p>
                      <p className="flex items-center text-lg">
                        <svg className="w-6 h-6 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </p>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                      {event.description}
                    </p>
                    <button className="text-primary hover:text-primary-dark font-medium transition-colors text-lg">
                      {event.action} →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Join Our Community of Planners
            </h2>
            <p className="text-xl text-white/90 mb-12">
              Become a member of NITP Abuja Chapter and be part of the movement shaping the future of urban planning in Nigeria's capital.
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/register">
                <button className="px-10 py-4 bg-white text-primary rounded-lg font-medium hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
                  Register Now
                </button>
              </Link>
              <Link href="/about">
                <button className="px-10 py-4 bg-primary-dark text-white rounded-lg font-medium hover:bg-primary-darker transition-all transform hover:scale-105 shadow-lg">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h4 className="text-xl font-semibold mb-6">Contact Us</h4>
              <p className="text-gray-400 space-y-3">
                <span className="block">NITP Abuja Chapter Secretariat</span>
                <span className="block">Plot 123, Example Street</span>
                <span className="block">Abuja, Nigeria</span>
                <span className="block">Phone: +234 123 456 7890</span>
                <span className="block">Email: info@nitp-abuja.afrinict.com</span>
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-gray-400 hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/events" className="text-gray-400 hover:text-primary transition-colors">Events</Link></li>
                <li><Link href="/members" className="text-gray-400 hover:text-primary transition-colors">Members</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-6">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="/ethics" className="text-gray-400 hover:text-primary transition-colors">Code of Ethics</Link></li>
                <li><Link href="/sitemap" className="text-gray-400 hover:text-primary transition-colors">Sitemap</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-6">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} NITP Abuja Chapter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;