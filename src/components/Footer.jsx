import React from "react";
import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      className="bg-gray-900 text-gray-300 py-10 mt-16"
      aria-label="Website footer with platform information, contact details, and GitHub repository link"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        

        <div aria-label="Platform introduction">
          <h2 className="text-white text-xl font-bold">Tutorly</h2>
          <p className="mt-3 text-sm">
            Tutorly is an accessible, gamified tutoring platform that connects 
            students with expert tutors. Learn at your own pace, anywhere.
          </p>
        </div>

        {/* Contact */}
        <div aria-label="Contact section">
          <h3 className="text-white text-lg font-semibold">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href="mailto:support@tutorly.com"
                className="hover:text-white"
                aria-label="Email support at support@tutorly.com"
              >
                support@tutorly.com
              </a>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-white"
                aria-label="Go to contact form page"
              >
                Contact Form
              </Link>
            </li>
          </ul>
        </div>

        {/* GitHub */}
        <div aria-label="GitHub section">
          <h3 className="text-white text-lg font-semibold">GitHub</h3>
          <a
            href="https://github.com/bluesoul2003/Ctrl-Z-Us"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 hover:text-white"
            aria-label="Visit GitHub repository Ctrl-Z-Us"
          >
            <FaGithub className="h-5 w-5" aria-hidden="true" />
            Project Repository
          </a>
        </div>
      </div>

    
      <div
        className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-400 flex items-center justify-center gap-2"
        aria-label="Copyright information"
      >
        <FaGithub className="h-4 w-4" aria-hidden="true" />
        © 2025 Ctrl-Z-Us. All rights reserved.
      </div>
    </footer>
  );
}
