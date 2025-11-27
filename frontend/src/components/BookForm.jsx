import React, { useState } from 'react';

export default function BookForm({ initial = {}, onSubmit }) {
  const [values, setValues] = useState({
    title: initial.title || '',
    author: initial.author || '',
    type: initial.type || 'book',
    serialNumber: initial.serialNumber || '',
    available: typeof initial.available === 'boolean' ? initial.available : true
  });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setValues(vals => ({
      ...vals,
      [name]: type === 'checkbox' ? checked : value
    }));
  }
  function validate() {
    const errs = {};
    if (!values.title) errs.title = 'Required';
    if (!values.author) errs.author = 'Required';
    if (!values.serialNumber) errs.serialNumber = 'Required';
    return errs;
  }
  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0 && onSubmit) {
      onSubmit(values);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md p-4 bg-white rounded shadow">
      <div>
        <label className="block font-medium">Title</label>
        <input name="title" value={values.title} onChange={handleChange} className="input w-full" />
        {errors.title && <span className="text-red-500 text-xs">{errors.title}</span>}
      </div>
      <div>
        <label className="block font-medium">Author</label>
        <input name="author" value={values.author} onChange={handleChange} className="input w-full" />
        {errors.author && <span className="text-red-500 text-xs">{errors.author}</span>}
      </div>
      <div>
        <span className="block font-medium">Type</span>
        <label className="mr-2">
          <input type="radio" name="type" value="book" checked={values.type==='book'} onChange={handleChange} /> Book
        </label>
        <label>
          <input type="radio" name="type" value="movie" checked={values.type==='movie'} onChange={handleChange} /> Movie
        </label>
      </div>
      <div>
        <label className="block font-medium">Serial Number</label>
        <input name="serialNumber" value={values.serialNumber} onChange={handleChange} className="input w-full" />
        {errors.serialNumber && <span className="text-red-500 text-xs">{errors.serialNumber}</span>}
      </div>
      <div>
        <label>
          <input type="checkbox" name="available" checked={values.available} onChange={handleChange} /> Available
        </label>
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">Submit</button>
    </form>
  );
}


