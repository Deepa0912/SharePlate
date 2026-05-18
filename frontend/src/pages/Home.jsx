// src/pages/Home.jsx

import { Link } from "react-router-dom";

function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50">

      {/* Navbar */}

      <nav className="flex justify-between items-center px-10 py-6 bg-white shadow-md">

        <h1 className="text-4xl font-bold text-green-600">
          SharePlate
        </h1>

        <div className="space-x-4">

          <Link
            to="/login"
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-5 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-100"
          >
            Signup
          </Link>

        </div>

      </nav>


      {/* Hero Section */}

      <div className="flex flex-col items-center justify-center text-center px-6 py-24">

        <h2 className="text-6xl font-extrabold text-gray-800 max-w-4xl leading-tight">

          Reduce Food Waste.
          <span className="text-green-600"> Feed More Lives.</span>

        </h2>

        <p className="text-xl text-gray-600 mt-8 max-w-3xl">

          SharePlate connects food donors, NGOs, and volunteers
          to distribute excess food efficiently using modern technology.

        </p>

        <div className="mt-10 flex gap-6">

          <Link
            to="/signup"
            className="px-8 py-4 bg-green-600 text-white rounded-xl text-lg hover:bg-green-700 shadow-lg"
          >
            Start Donating
          </Link>

          <Link
            to="/login"
            className="px-8 py-4 border border-green-600 text-green-600 rounded-xl text-lg hover:bg-green-100"
          >
            Login
          </Link>

        </div>

      </div>


      {/* Statistics Section */}

      <div className="grid md:grid-cols-3 gap-8 px-10 pb-20">

        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">

          <h3 className="text-5xl font-extrabold text-green-600 mb-4">
            500+
          </h3>

          <p className="text-xl text-gray-600">
            Food Donations
          </p>

        </div>


        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">

          <h3 className="text-5xl font-extrabold text-green-600 mb-4">
            120+
          </h3>

          <p className="text-xl text-gray-600">
            NGOs Connected
          </p>

        </div>


        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">

          <h3 className="text-5xl font-extrabold text-green-600 mb-4">
            10K+
          </h3>

          <p className="text-xl text-gray-600">
            Meals Saved
          </p>

        </div>

      </div>


      {/* Features Section */}

      <div className="grid md:grid-cols-3 gap-8 px-10 pb-20">

        <div className="bg-white p-8 rounded-2xl shadow-lg">

          <h3 className="text-2xl font-bold text-green-600 mb-4">
            Food Donation
          </h3>

          <p className="text-gray-600">
            Easily donate excess food with image upload and location details.
          </p>

        </div>


        <div className="bg-white p-8 rounded-2xl shadow-lg">

          <h3 className="text-2xl font-bold text-green-600 mb-4">
            NGO Support
          </h3>

          <p className="text-gray-600">
            NGOs can quickly identify nearby food donations and collect them.
          </p>

        </div>


        <div className="bg-white p-8 rounded-2xl shadow-lg">

          <h3 className="text-2xl font-bold text-green-600 mb-4">
            Volunteer Network
          </h3>

          <p className="text-gray-600">
            Volunteers help deliver food to people in need efficiently.
          </p>

        </div>

      </div>


      {/* Footer */}

      <footer className="bg-white py-6 text-center text-gray-500">

        © 2026 SharePlate. All rights reserved.

      </footer>

    </div>
  );
}

export default Home;