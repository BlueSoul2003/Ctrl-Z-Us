import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div>
      <section className="relative isolate overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Tutorly - Online Tutoring Platform
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Connect students with expert tutors. Learn at your own pace with our accessible, 
              gamified learning platform designed for all users.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-4">
              <Link
                to="/signup"
                className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Get started by creating an account"
              >
                Get Started
              </Link>
              <Link
                to="/signin"
                className="rounded-md px-5 py-3 text-sm font-semibold text-blue-700 ring-1 ring-inset ring-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Sign in to existing account"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Platform features">
            <FeatureCard
              title="Accessible Design"
              description="Full keyboard navigation, ARIA labels, high contrast, and visible focus indicators."
              iconBg="bg-blue-100"
            />
            <FeatureCard
              title="Multiple Roles"
              description="Students, tutors, and administrators each have tailored experiences and dashboards."
              iconBg="bg-green-100"
            />
            <FeatureCard
              title="Gamified Learning"
              description="Earn points, complete modules, and care for your virtual pet as you learn."
              iconBg="bg-yellow-100"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, description, iconBg }) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm" tabIndex={0} aria-label={title}>
      <div className={`mb-4 h-10 w-10 rounded ${iconBg}`} aria-hidden="true" />
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </article>
  );
}
