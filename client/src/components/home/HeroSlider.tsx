import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const slides = [
  {
    id: 1,
    image: '/images/Slider1.jpg',
    title: 'Welcome to NITP Abuja Chapter',
    description: 'Empowering urban planning professionals in Nigeria'
  },
  {
    id: 2,
    image: '/images/Slider2.jpg',
    title: 'Professional Development',
    description: 'Advancing the practice of urban and regional planning'
  },
  {
    id: 3,
    image: '/images/Slider3.jpg',
    title: 'Community Impact',
    description: 'Building sustainable and resilient communities'
  }
];

const HeroSlider: React.FC = () => {
  return (
    <div className="relative w-full h-[500px]">
      <Carousel
        showArrows={true}
        showStatus={false}
        showThumbs={false}
        infiniteLoop={true}
        autoPlay={true}
        interval={5000}
        stopOnHover={true}
        className="h-full"
      >
        {slides.map((slide) => (
          <div key={slide.id} className="relative h-[500px]">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-8">
              <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
              <p className="text-xl">{slide.description}</p>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroSlider; 