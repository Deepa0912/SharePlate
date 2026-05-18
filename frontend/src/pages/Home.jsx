import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col">

      <nav className="flex justify-between items-center p-6 bg-white shadow">

        <h1 className="text-3xl font-bold text-green-600">
          SharePlate
        </h1>

        <div className="space-x-4">

          <Link
            to="/login"
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-4 py-2 border border-green-500 text-green-500 rounded-lg"
          >
            Signup
          </Link>

        </div>
      </nav>

      <div className="flex flex-1 flex-col justify-center items-center text-center px-6">

        <h2 className="text-5xl font-bold text-gray-800 mb-6">
          Reduce Food Waste,
          Feed More People
        </h2>

        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          SharePlate connects food donors, NGOs,
          and volunteers using AI-powered food redistribution.
        </p>

        <Link
          to="/signup"
          className="px-8 py-4 bg-green-600 text-white rounded-xl text-lg hover:bg-green-700"
        >
          Get Started
        </Link>

      </div>
    </div>
  );
}

export default Home;