"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

const EditTravel = () => {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    from_location: "",
    to_location: "",
    time: "",
    price: "",
    seats: "",
    image: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTravel = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8000/travels/travels/all`);
        const travel = res.data.find((item) => item.id === parseInt(id));

        if (travel) {
          setForm({
            ...travel,
            time: travel.time?.slice(0, 16) || ""
          });
        } else {
          alert("Travel not found!");
        }
      } catch (error) {
        console.error("Error fetching travel:", error);
        alert("Failed to load travel data");
      }
      setLoading(false);
    };

    if (id) fetchTravel();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`http://localhost:8000/travels/travels/update/${id}`, form);
      alert("✅ Travel updated successfully!");
      router.push("/admin/book-now");
    } catch (error) {
      console.error("Update failed:", error);
      alert("❌ Failed to update travel");
    }

    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>⏳ Loading...</div>
      ) : (
        <form onSubmit={handleSubmit} className="edit-travel-form">
          <h2>Edit Travel</h2>

          <label>
            From Location:
            <input type="text" name="from_location" value={form.from_location} onChange={handleChange} required />
          </label>

          <label>
            To Location:
            <input type="text" name="to_location" value={form.to_location} onChange={handleChange} required />
          </label>

          <label>
            Travel Time:
            <input type="datetime-local" name="time" value={form.time} onChange={handleChange} required />
          </label>

          <label>
            Price:
            <input type="number" name="price" value={form.price} onChange={handleChange} required />
          </label>

          <label>
            Seats:
            <input type="number" name="seats" value={form.seats} onChange={handleChange} required />
          </label>

          <label>
            Image URL:
            <input type="text" name="image" value={form.image} onChange={handleChange} required />
          </label>

          <button type="submit">Update Travel</button>
        </form>
      )}
    </>
  );
};

export default EditTravel;
