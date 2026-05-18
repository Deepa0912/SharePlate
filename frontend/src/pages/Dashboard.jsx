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

  return (
    <div className="min-h-screen bg-green-50 p-8">

      <h1 className="text-4xl font-bold text-green-600 mb-8 text-center">
        SharePlate Dashboard
      </h1>

      {/* Donation Form */}

      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-xl mx-auto mb-10">

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
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
          >
            Submit Donation
          </button>

        </form>
      </div>

      {/* Donations List */}

      <div className="grid md:grid-cols-3 gap-6">

        {donations.map((donation) => (

          <div
            key={donation.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
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

              <p className="text-gray-600">
                Status: {donation.status}
              </p>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Dashboard;