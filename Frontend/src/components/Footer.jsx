import React from 'react';
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex items-center">
            {/* Logo placeholder */}
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-3">
              {/* Replace this div with your SVG logo */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" className="w-full h-full">
              <defs>
                {/* Rainbow Gradient */}
                <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF0080">
                    <animate
                      attributeName="stop-color"
                      values="#FF0080;#FF8C00;#FFD700;#FF0080"
                      dur="8s"
                      repeatCount="indefinite"
                    />
                  </stop>
                  <stop offset="25%" stopColor="#FF8C00">
                    <animate
                      attributeName="stop-color"
                      values="#FF8C00;#FFD700;#7CFF00;#FF8C00"
                      dur="8s"
                      repeatCount="indefinite"
                    />
                  </stop>
                  <stop offset="50%" stopColor="#7CFF00">
                    <animate
                      attributeName="stop-color"
                      values="#7CFF00;#00FFD1;#0080FF;#7CFF00"
                      dur="8s"
                      repeatCount="indefinite"
                    />
                  </stop>
                  <stop offset="75%" stopColor="#0080FF">
                    <animate
                      attributeName="stop-color"
                      values="#0080FF;#8000FF;#FF0080;#0080FF"
                      dur="8s"
                      repeatCount="indefinite"
                    />
                  </stop>
                  <stop offset="100%" stopColor="#8000FF">
                    <animate
                      attributeName="stop-color"
                      values="#8000FF;#FF0080;#FF8C00;#8000FF"
                      dur="8s"
                      repeatCount="indefinite"
                    />
                  </stop>
                </linearGradient>

                {/* Neon Glow */}
                <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feFlood result="flood" floodColor="#FF00FF" floodOpacity=".3" />
                  <feComposite
                    in="flood"
                    result="mask"
                    in2="SourceGraphic"
                    operator="in"
                  />
                  <feGaussianBlur in="mask" result="blurred" stdDeviation="3" />
                  <feMerge>
                    <feMergeNode in="blurred" />
                    <feMergeNode in="blurred" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Sparkle Effect */}
                <radialGradient id="sparkle" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFF" stopOpacity="1">
                    <animate
                      attributeName="stopOpacity"
                      values="1;0;1"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </stop>
                  <stop offset="100%" stopColor="#FFF" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Background Circle */}
              <circle
                cx="200"
                cy="200"
                r="190"
                fill="url(#rainbowGradient)"
                opacity="0.15"
              >
                <animate
                  attributeName="r"
                  values="185;195;185"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Dynamic Play Symbol */}
              <path
                d="M160 120 L160 280 L280 200 Z"
                fill="url(#rainbowGradient)"
                filter="url(#neonGlow)"
              >
                <animate
                  attributeName="d"
                  values="M160 120 L160 280 L280 200 Z;M165 125 L165 275 L275 200 Z;M160 120 L160 280 L280 200 Z"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </path>

              {/* Rotating Orbit Rings */}
              <g transform="translate(200, 200)">
                <circle
                  cx="0"
                  cy="0"
                  r="150"
                  fill="none"
                  stroke="url(#rainbowGradient)"
                  strokeWidth="3"
                  strokeDasharray="20 10"
                  opacity="0.7"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0"
                    to="360"
                    dur="15s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx="0"
                  cy="0"
                  r="130"
                  fill="none"
                  stroke="url(#rainbowGradient)"
                  strokeWidth="3"
                  strokeDasharray="15 15"
                  opacity="0.5"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="360"
                    to="0"
                    dur="10s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>

              {/* Sparkle Elements */}
              {[...Array(5)].map((_, i) => (
                <circle
                  key={i}
                  cx={Math.random() * 400}
                  cy={Math.random() * 400}
                  r="3"
                  fill="url(#sparkle)"
                >
                  <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur={`${1 + Math.random()}s`}
                    repeatCount="indefinite"
                    begin={`${Math.random()}s`}
                  />
                </circle>
              ))}
            </svg>
            
            </div>
            <span className="text-xl md:text-4xl font-extrabold text-white ml-2 mr-9 tracking-wider shadow-lg" style={{ fontFamily: '"Dancing Script", cursive' }}>
  PlaySync
</span>
            <p className="text-xl font-semibold">
              Made with ❤️ by <span className="text-pink-500">odk</span> 🚀
            </p>
          </div>
          <div className="flex space-x-6">
            <a
              href="https://github.com/odk1572"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              <FaGithub className="text-2xl" />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://instagram.com/odk_1572"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              <FaInstagram className="text-2xl" />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href="https://www.linkedin.com/in/om-kariya-b1815628a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              <FaLinkedin className="text-2xl" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} PlaySync. All rights reserved.</p>
          <p className="mt-2">Empowering creators, connecting viewers 🎥✨</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
