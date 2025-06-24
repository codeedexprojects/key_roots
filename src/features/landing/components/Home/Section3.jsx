import { useEffect, useRef, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import phone_mockup from '../../assets/phone_mockup.png';
import phone_mockup2 from '../../assets/phone_mockup2.png';


export default function KeyRouteAboutSection() {
  const sectionRef = useRef(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const images = [
    phone_mockup,
    phone_mockup2 // Add your second image here
   
  ];

  useEffect(() => {
    AOS.init();
    
    const handleScroll = () => {
      if (sectionRef.current) {
        const section = sectionRef.current;
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Calculate how much of the section is visible
        const visibleRatio = Math.min(1, Math.max(0, (windowHeight - sectionTop) / sectionHeight));
        
        // Determine which image to show based on scroll position
        const newIndex = Math.floor(visibleRatio * (images.length - 1));
        setActiveImageIndex(newIndex);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [images.length]);

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="py-24 md:py-40 bg-white sticky top-0 h-screen flex items-center"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Text Content */}
          <div className="w-full md:w-1/2 mb-16 md:mb-0 pr-0 md:pr-16">
            <h2 
              data-aos="fade-up"
              data-aos-duration="1000"
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-red-600 mb-10"
            >
              About us
            </h2>
            
            <p 
              data-aos="fade-up"
              data-aos-duration="1200"
              className="text-2xl md:text-3xl text-gray-800 leading-relaxed max-w-xl"
            >
              KeyRoute is your smart travel companion for effortless group journeys. 
              From tours to local trips, we make it easy to find, compare, and book buses—quickly 
              and transparently, all in one place.
            </p>
          </div>
          
          {/* Phone Images Container */}
          <div className="w-full md:w-1/2 flex justify-center relative h-[500px]">
            {images.map((image, index) => (
              <div 
                key={index}
                className={`absolute w-72 md:w-96 lg:w-[30rem] xl:w-[34rem] transition-all duration-500 ${
                  index === activeImageIndex 
                    ? 'opacity-100 translate-y-0' 
                    : index < activeImageIndex 
                      ? 'opacity-0 -translate-y-10' 
                      : 'opacity-0 translate-y-10'
                }`}
              >
                <img 
                  src={image}
                  alt={`KeyRoute App Screenshot ${index + 1}`}
                  className="w-full h-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}