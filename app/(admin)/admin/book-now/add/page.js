"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AddTravel() {
  const router = useRouter();
  const [form, setForm] = useState({
    from_location: "",
    to_location: "",
    time: "",
    price: "",
    seats: "",
    image: "",
  });
  const [errors, setErrors] = useState({});

  const convertToISOTime = (timeStr) => {
    const now = new Date();
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    now.setHours(hours, minutes, 0, 0);
    return now.toISOString().split(".")[0];
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.from_location) newErrors.from_location = "From Location is required";
    if (!form.to_location) newErrors.to_location = "To Location is required";
    if (!form.time) newErrors.time = "Time is required";
    if (!form.price) newErrors.price = "Price is required";
    if (!form.seats) newErrors.seats = "Seats is required";
    if (!form.image) newErrors.image = "Image URL is required";

    if (form.price && isNaN(form.price)) newErrors.price = "Price must be a number";
    if (form.seats && isNaN(form.seats)) newErrors.seats = "Seats must be a number";

    if (form.time && !/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i.test(form.time)) {
      newErrors.time = "Time must be in HH:MM AM/PM format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors first");
      return;
    }

    const isoTime = convertToISOTime(form.time);

    try {
      const res = await fetch(`http://localhost:8000/travels/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, time: isoTime }),
      });

      if (!res.ok) throw new Error("Failed to add travel");

      toast.success("Travel added successfully!");
      setForm({ from_location: "", to_location: "", time: "", price: "", seats: "", image: "" });
    } catch (err) {
      toast.error("Error while adding travel");
    }
  };

  return (
    <div className="form-container">
      <button className="back-button" onClick={() => router.back()}>&larr; Back</button>
      <h2>Add New Travel</h2>
      <form onSubmit={handleSubmit}>
        {[
          { name: "from_location", label: "From Location" },
          { name: "to_location", label: "To Location" },
          { name: "time", label: "Time (e.g. 06:30 PM)" },
          { name: "price", label: "Price" },
          { name: "seats", label: "Seats" },
          { name: "image", label: "Image URL" },
        ].map((field) => (
          <div key={field.name} className="form-group">
            <label htmlFor={field.name}>{field.label}</label>
            <input
              type="text"
              id={field.name}
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              required
            />
            {errors[field.name] && <p className="error-text">{errors[field.name]}</p>}
          </div>
        ))}
        <button type="submit" className="submit-btn">Add Travel</button>
      </form>
    </div>
  );
}
