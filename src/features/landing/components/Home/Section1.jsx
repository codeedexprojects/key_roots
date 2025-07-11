import { useState, useEffect } from 'react';
import background from '../../assets/key_root.gif'

export default function KeyrouteHeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Background Image with Grid Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-white">
          {/* Grid Background Image */}
          <img
            src={background}
            alt="Grid Background"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-screen px-4 text-center">
        <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-2 max-w-4xl mx-auto transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-red-600">KEYROUTE</span>
          <span className="text-gray-600"> - Where every journey begins with</span>
          <br />
          <span className="text-gray-600">comfort</span>
        </h1>

        {/* Sketch-style Underline */}
        <div className="relative w-64 h-4 mx-auto mb-8">
          <svg className="w-full" viewBox="0 0 320 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.5,12.7 C73.5,5.9 161.5,10.7 311.5,9.7"
              stroke="#CC0000"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{
                strokeDasharray: 320,
                strokeDashoffset: isLoaded ? 0 : 320,
                transition: 'stroke-dashoffset 1.2s ease-in-out'
              }}
            />
          </svg>
        </div>

        <p className={`text-gray-700 mb-12 max-w-2xl mx-auto text-lg md:text-xl transition-opacity duration-700 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          Book your group bus trip in seconds – perfect for weekend getaways or daily commutes.
          Safe, smooth, and affordable!
        </p>

        {/* App Store Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
          {/* App Store - in progress */}
          {/* <a
            href="#"
            className="bg-black text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center px-6 py-3 opacity-50 cursor-not-allowed"
            aria-disabled="true"
          >
            <span className="mr-2">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"></path>
              </svg>
            </span>
            <div className="flex flex-col items-start">
              <span className="text-xs">Coming Soon on</span>
              <span className="text-lg font-semibold">App Store</span>
            </div>
          </a> */}
           <a
            href="https://play.google.com/store/apps/details?id=com.keyroute.vendor&hl=en"
            className="bg-black text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center px-6 py-3"
          >
            <span className="mr-2">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
            </span>
            <div className="flex flex-col items-start">
              <span className="text-xs">Vendor App</span>
              <span className="text-lg font-semibold">Play Store</span>
            </div>
          </a>

          {/* User App */}
           <a
            href="https://play.google.com/store/apps/details?id=com.keyroute.user&hl=en"
            className="bg-black text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center px-6 py-3"
          >
            <span className="mr-2">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
            </span>
            <div className="flex flex-col items-start">
              <span className="text-xs">User App</span>
              <span className="text-lg font-semibold">Play Store</span>
            </div>
          </a>

          {/* Play Store */}
          <a
            href="#"
            className="bg-black text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center px-6 py-3 opacity-50 cursor-not-allowed"
            aria-disabled="true"
          >
            <span className="mr-2">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"></path>
              </svg>
            </span>
            <div className="flex flex-col items-start">
              <span className="text-xs">Coming Soon on</span>
              <span className="text-lg font-semibold">App Store</span>
            </div>
          </a>

          {/* Vendor App */}
          
        </div>

      </div>
    </section>
  );
}