import React, { useState, useEffect } from "react";

export default function BookForm({ initial = {}, onSubmit }) {
  const [values, setValues] = useState({
    title: initial.title || "",
    author: initial.author || "",
    type: initial.type || "book",
    serialNumber: initial.serialNumber || "",
    available:
      typeof initial.available === "boolean" ? initial.available : true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues({
      title: initial.title || "",
      author: initial.author || "",
      type: initial.type || "book",
      serialNumber: initial.serialNumber || "",
      available:
        typeof initial.available === "boolean" ? initial.available : true,
    });
  }, [initial]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setValues((vals) => ({
      ...vals,
      [name]: type === "checkbox" ? checked : value,
    }));
  }
  function validate() {
    const errs = {};
    if (!values.title) errs.title = "Required";
    if (!values.author) errs.author = "Required";
    if (!values.serialNumber) errs.serialNumber = "Required";
    if (!values.type) errs.type = "Required";
    return errs;
  }
  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0 && onSubmit) {
      onSubmit(values);
      setValues({
        title: "",
        author: "",
        type: "book",
        serialNumber: "",
        available: true,
      });
    }
  }
  return (
    <div className="w-full flex justify-start pl-15 mt-1">
      <form
        onSubmit={handleSubmit}
        className="space-y-5 w-full max-w-[768px] p-6 bg-white border rounded-lg"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              name="title"
              value={values.title}
              onChange={handleChange}
              className="input w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.title && (
              <span className="text-red-500 text-xs">{errors.title}</span>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Author</label>
            <input
              name="author"
              value={values.author}
              onChange={handleChange}
              className="input w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.author && (
              <span className="text-red-500 text-xs">{errors.author}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Serial Number</label>
            <input
              name="serialNumber"
              value={values.serialNumber}
              onChange={handleChange}
              className="input w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.serialNumber && (
              <span className="text-red-500 text-xs">
                {errors.serialNumber}
              </span>
            )}
          </div>

          <div>
            <span className="block font-medium mt-4">Type</span>

            <div className="flex gap-12 mt-1">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="type"
                  value="book"
                  checked={values.type === "book"}
                  onChange={handleChange}
                />
                Book
              </label>

              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="type"
                  value="movie"
                  checked={values.type === "movie"}
                  onChange={handleChange}
                />
                Movie
              </label>
            </div>

            {errors.type && (
              <span className="text-red-500 text-xs">{errors.type}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="available"
            checked={values.available}
            onChange={handleChange}
          />
          <span>Available</span>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
