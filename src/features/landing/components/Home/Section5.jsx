import React from 'react';
import { Instagram, Facebook } from 'lucide-react';
import { FaMailchimp, FaWhatsapp } from 'react-icons/fa';
import { IoIosMail } from "react-icons/io";

export default function FollowUs() {
  return (
    <section id="contact">
        <div className="text-center mb-20">
          {/* Follow Us */}
          <div data-aos="fade-up" data-aos-delay="400">
            <h2 className="text-3xl md:text-4xl font-light text-gray-500 mb-6 uppercase tracking-wide">
              Conatct us
            </h2>
    
            <div className="flex justify-center space-x-8">
              <a
                href="https://www.instagram.com/keyroute_expedo?igsh=b24zNHpodXhyY2p3"
                className="text-gray-400 hover:text-gray-700 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={40} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61575838960764"
                className="text-gray-400 hover:text-gray-700 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={40} />
              </a>
              <a
                href="https://wa.me/+917909171770"
                className="text-gray-400 hover:text-gray-700 transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={40} />
              </a>
               <a
                href="https://wa.me/+917909171770"
                className="text-gray-400 hover:text-gray-700 transition-colors"
                aria-label="WhatsApp"
              >
                <IoIosMail size={40} />
              </a>
            </div>
          </div>
    
          {/* Privacy & Terms Links */}
          <div className="mt-16">
            <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base text-gray-400">
              <a
                href="/user-privacy"
                className="hover:text-gray-700 transition-colors underline"
              >
                User Privacy Policy
              </a>
              <a
                href="/vendor-privacy"
                className="hover:text-gray-700 transition-colors underline"
              >
                Vendor Privacy Policy
              </a>
              <a
                href="/user-terms"
                className="hover:text-gray-700 transition-colors underline"
              >
                User Terms & Conditions
              </a>
              <a
                href="/vendor-terms"
                className="hover:text-gray-700 transition-colors underline"
              >
                Vendor Terms & Conditions
              </a>
            </div>
          </div>
        </div>
    </section>
  );
}
