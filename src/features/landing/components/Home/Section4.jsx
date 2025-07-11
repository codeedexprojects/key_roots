import React, { useEffect } from 'react';
import { Instagram, Facebook, Phone } from 'lucide-react';
import mockup from '../../assets/mockup.png';
import { FaWhatsapp } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function KeyRoutePage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: false,
      mirror: true
    });
  }, []);

  return (
    <div className="py-16 px-6 md:px-12 lg:px-24 -mt-16 md:-mt-20">
      {/* What we do section */}
      <h1
        className="text-5xl md:text-6xl font-bold text-red-600 mb-10"
        data-aos="fade-right"
        data-aos-delay="100"
      >
        What we do
      </h1>

      <p
        className="text-2xl md:text-3xl text-gray-800 leading-relaxed mb-12 max-w-4xl"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        KeyRoute connects travelers and bus operators through two
        simple apps. Operators can list buses and handle bookings, while
        users can easily book group trips. With support for regional
        languages, the platform helps small operators grow and makes
        group travel easy for everyone.
      </p>

      {/* Mobile app images */}
      <div
        className="flex justify-center mb-20"
        data-aos="zoom-in"
        data-aos-delay="300"
      >
        <div className="relative w-full max-w-2xl">
          <img
            src={mockup}
            alt="KeyRoute mobile apps showing interface on smartphones"
            className="w-full object-contain"
          />
        </div>
      </div>

      {/* Follow us section */}
      

    </div>
  );
}
