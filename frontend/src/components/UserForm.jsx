import React, { useState } from 'react';

export default function UserForm({ initial = {}, onSubmit }) {
  const [values, setValues] = useState({
    name: initial.name || '',
    username: initial.username || '',
    password: '', // never prefill
    email: initial.email || '',
    role: initial.role || 'user'
  });
  const [errors, setErrors] = useState({});
  function handleChange(e) {
    const { name, value } = e.target;
    setValues(vals => ({ ...vals, [name]: value }));
  }
  function validate() {
    const errs = {};
    if (!values.name) errs.name = 'Required';
    if (!values.username) errs.username = 'Required';
    if (!values.email) errs.email = 'Required';
    if (initial._id === undefined && !values.password) errs.password = 'Required';
    return errs;
  }
  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (!Object.keys(errs).length && onSubmit) onSubmit(values);
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md p-4 bg-white rounded shadow">
      <div>
        <label className="block font-medium">Name</label>
        <input name="name" value={values.name} onChange={handleChange} className="input w-full" />
        {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
      </div>
      <div>
        <label className="block font-medium">Username</label>
        <input name="username" value={values.username} onChange={handleChange} className="input w-full" />
        {errors.username && <span className="text-red-500 text-xs">{errors.username}</span>}
      </div>
      {initial._id === undefined && (
        <div>
          <label className="block font-medium">Password</label>
          <input type="password" name="password" value={values.password} onChange={handleChange} className="input w-full" />
          {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
        </div>
      )}
      <div>
        <label className="block font-medium">Email</label>
        <input type="email" name="email" value={values.email} onChange={handleChange} className="input w-full" />
        {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
      </div>
      <div>
        <span className="block font-medium">Role</span>
        <label className="mr-2"><input type="radio" name="role" value="user" checked={values.role==='user'} onChange={handleChange}/> User</label>
        <label><input type="radio" name="role" value="admin" checked={values.role==='admin'} onChange={handleChange}/> Admin</label>
      </div>
      <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">Submit</button>
    </form>
  );
}


