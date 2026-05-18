// src/pages/Dashboard.jsx

import { useState, useEffect } from "react";
import API from "../services/api";

function Dashboard() {

  const [donations, setDonations] = useState([]);

  const [formData, setFormData] = useState({
    food_name: "",
    quantity: "",
    expiry_time: "",
    location: "",
    donor_id: ""
  });

  const [image, setImage] = useState(null);

  const [search, setSearch] = useState("");


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const fetchDonations = async () => {

    try {

      const response = await API.get("/donations");

      setDonations(response.data);

    } catch (error) {

      console.log(error);

    }
  };


  useEffect(() => {

    fetchDonations();

  }, []);


  const handleSubmit = async (e) => {

    e.preventDefault();

    const data = new FormData();

    data.append("food_name", formData.food_name);
    data.append("quantity", formData.quantity);
    data.append("expiry_time", formData.expiry_time);
    data.append("location", formData.location);
    data.append("donor_id", formData.donor_id);
    data.append("image", image);

    try {

      await API.post("/donate", data);

      alert("Donation added successfully");

      fetchDonations();

    } catch (error) {

      console.log(error);

      alert("Donation failed");

    }
  };


  const handleDelete = async (id) => {

    try {

      await API.delete(`/donation/${id}`);

      alert("Donation deleted");

      fetchDonations();

    } catch (error) {

      console.log(error);

      alert("Delete failed");

    }
  };


  const handleLogout = () => {

    localStorage.removeItem("token");

    window.location.href = "/login";
  };


  const filteredDonations = donations.filter((donation) => {

    return (
      donation.food_name.toLowerCase().includes(search.toLowerCase()) ||
      donation.location.toLowerCase().includes(search.toLowerCase())
    );
  });


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 p-8">

      {/* Navbar */}

      <div className="flex justify-between items-center mb-10 bg-white p-5 rounded-2xl shadow-lg">

        <h1 className="text-4xl font-bold text-green-600">
          SharePlate Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>

      </div>


      {/* Donation Form */}

      <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-xl mx-auto mb-12 border border-white">

        <h2 className="text-2xl font-bold mb-6 text-gray-700">
          Add Food Donation
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="food_name"
            placeholder="Food Name"
            className="w-full p-3 border rounded-lg mb-4"
            onChange={handleChange}
          />

          <input
            type="text"
            name="quantity"
            placeholder="Quantity"
            className="w-full p-3 border rounded-lg mb-4"
            onChange={handleChange}
          />

          <input
            type="text"
            name="expiry_time"
            placeholder="Expiry Time"
            className="w-full p-3 border rounded-lg mb-4"
            onChange={handleChange}
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            className="w-full p-3 border rounded-lg mb-4"
            onChange={handleChange}
          />

          <input
            type="text"
            name="donor_id"
            placeholder="Donor ID"
            className="w-full p-3 border rounded-lg mb-4"
            onChange={handleChange}
          />

          <input
            type="file"
            className="w-full p-3 border rounded-lg mb-6"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-xl hover:scale-105 transition duration-300"
          >
            Submit Donation
          </button>

        </form>

      </div>


      {/* Search Bar */}

      <div className="max-w-xl mx-auto mb-10">

        <input
          type="text"
          placeholder="Search by food or location..."
          className="w-full p-4 rounded-2xl shadow-lg border border-green-200 focus:outline-none focus:ring-4 focus:ring-green-300"
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>


      {/* Donation Cards */}

      <div className="grid md:grid-cols-3 gap-6">

        {filteredDonations.length === 0 && (

          <div className="col-span-3 text-center py-20">

            <h2 className="text-3xl font-bold text-gray-500">
              No Donations Found
            </h2>

            <p className="text-gray-400 mt-4">
              Try adding or searching for donations.
            </p>

          </div>

        )}


        {filteredDonations.map((donation) => (

          <div
            key={donation.id}
            className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden hover:scale-105 hover:shadow-2xl transition duration-300 border border-white"
          >

            <img
              src={donation.image_url}
              alt="Food"
              className="w-full h-56 object-cover"
            />

            <div className="p-5">

              <h3 className="text-2xl font-bold text-green-600 mb-2">
                {donation.food_name}
              </h3>

              <p className="text-gray-600 mb-2">
                Quantity: {donation.quantity}
              </p>

              <p className="text-gray-600 mb-2">
                Expiry: {donation.expiry_time}
              </p>

              <p className="text-gray-600 mb-2">
                Location: {donation.location}
              </p>

              <p className="text-gray-600 mb-2">
                Status: {donation.status}
              </p>

              <button
                onClick={() => handleDelete(donation.id)}
                className="mt-4 w-full bg-gradient-to-r from-red-500 to-red-700 text-white py-2 rounded-xl hover:scale-105 transition duration-300"
              >
                Delete Donation
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Dashboard;