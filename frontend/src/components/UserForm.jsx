import React, { useState, useEffect } from "react";

export default function UserForm({ initial = {}, onSubmit }) {
  const [values, setValues] = useState({
    name: initial.name || "",
    username: initial.username || "",
    password: "",
    email: initial.email || "",
    role: initial.role || "user",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues({
      name: initial.name || "",
      username: initial.username || "",
      password: "",
      email: initial.email || "",
      role: initial.role || "user",
    });
  }, [initial]);
  function handleChange(e) {
    const { name, value } = e.target;
    setValues((vals) => ({ ...vals, [name]: value }));
  }
  function validate() {
    const errs = {};
    if (!values.name) errs.name = "Required";
    if (!values.username) errs.username = "Required";
    if (!values.email) errs.email = "Required";
    if (initial._id === undefined && !values.password)
      errs.password = "Required";
    return errs;
  }
  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (!Object.keys(errs).length && onSubmit) onSubmit(values);
  }
  return (
    <div className="w-full flex justify-start pl-15 mt-1">
      <form
        onSubmit={handleSubmit}
        className="space-y-5 w-full max-w-[768px] p-6 bg-white border rounded-lg"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              name="name"
              value={values.name}
              onChange={handleChange}
              className="input w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.name && (
              <span className="text-red-500 text-xs">{errors.name}</span>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Username</label>
            <input
              name="username"
              value={values.username}
              onChange={handleChange}
              className="input w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.username && (
              <span className="text-red-500 text-xs">{errors.username}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {initial._id === undefined ? (
            <div>
              <label className="block font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                className="input w-full border border-gray-300 rounded px-3 py-2"
              />
              {errors.password && (
                <span className="text-red-500 text-xs">{errors.password}</span>
              )}
            </div>
          ) : (
            <div className="flex flex-col justify-center text-gray-500 text-sm">
              <span>Password unchanged</span>
            </div>
          )}

          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              className="input w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.email && (
              <span className="text-red-500 text-xs">{errors.email}</span>
            )}
          </div>
        </div>

        <div>
          <span className="block font-medium mb-1">Role</span>
          <div className="flex gap-6">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="role"
                value="user"
                checked={values.role === "user"}
                onChange={handleChange}
              />
              User
            </label>

            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={values.role === "admin"}
                onChange={handleChange}
              />
              Admin
            </label>
          </div>
        </div>

        <button className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  );
}
