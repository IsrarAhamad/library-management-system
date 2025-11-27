import React, { useState, useEffect } from 'react';

export default function MembershipForm({ initial = {}, onSubmit }) {
  const [values, setValues] = useState({
    membershipNumber: initial.membershipNumber || '',
    memberName: initial.memberName || '',
    active: typeof initial.active === 'boolean' ? initial.active : true,
    startDate: initial.startDate ? initial.startDate.substr(0,10) : '',
    endDate: initial.endDate ? initial.endDate.substr(0,10) : '',
    cancelled: initial.cancelled || false,
    extend: false,
    duration: initial.duration || '6m',
    extendDuration: '6m',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues({
      membershipNumber: initial.membershipNumber || '',
      memberName: initial.memberName || '',
      active: typeof initial.active === 'boolean' ? initial.active : true,
      startDate: initial.startDate ? initial.startDate.substr(0,10) : '',
      endDate: initial.endDate ? initial.endDate.substr(0,10) : '',
      cancelled: initial.cancelled || false,
      extend: false,
      duration: initial.duration || '6m',
      extendDuration: '6m',
    });
  }, [initial]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setValues(v => ({ ...v, [name]: type === 'checkbox' ? checked : value }));
  }
  function validate() {
    const errs = {};
    if (!values.membershipNumber) errs.membershipNumber = 'Required';
    if (!values.memberName) errs.memberName = 'Required';
    if (!values.startDate) errs.startDate = 'Required';
    if (!values.endDate) errs.endDate = 'Required';
    return errs;
  }
  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0 && onSubmit) {
      onSubmit(values);
      setValues({
        membershipNumber: '', memberName: '', active: true, startDate: '', endDate: '', cancelled: false, extend: false, duration: '6m', extendDuration: '6m',
      });
    }
  }

  useEffect(() => {
    if (!values.startDate || !values.duration) return;
    const d = new Date(values.startDate);
    if (values.duration==='6m') d.setMonth(d.getMonth()+6);
    if (values.duration==='1y') d.setFullYear(d.getFullYear()+1);
    if (values.duration==='2y') d.setFullYear(d.getFullYear()+2);
    setValues(v=> ({ ...v, endDate: d.toISOString().slice(0,10) }));
  }, [values.startDate, values.duration]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md p-4 bg-white rounded shadow">
      <div>
        <label className="block font-medium">Membership Number</label>
        <input name="membershipNumber" value={values.membershipNumber} onChange={handleChange} className="input w-full" />
        {errors.membershipNumber && <span className="text-red-500 text-xs">{errors.membershipNumber}</span>}
      </div>
      <div>
        <label className="block font-medium">Member Name</label>
        <input name="memberName" value={values.memberName} onChange={handleChange} className="input w-full" />
        {errors.memberName && <span className="text-red-500 text-xs">{errors.memberName}</span>}
      </div>
      <div>
        <label>
          <input type="checkbox" name="active" checked={values.active} onChange={handleChange} /> Active
        </label>
      </div>
      <div>
        <label className="block font-medium">Start Date</label>
        <input type="date" name="startDate" value={values.startDate} onChange={handleChange} className="input w-full" />
        {errors.startDate && <span className="text-red-500 text-xs">{errors.startDate}</span>}
      </div>
      <div>
        <label className="block font-medium">End Date</label>
        <input type="date" name="endDate" value={values.endDate} onChange={handleChange} className="input w-full" />
        {errors.endDate && <span className="text-red-500 text-xs">{errors.endDate}</span>}
      </div>
      <div><span className="block font-medium">Membership Duration</span>
<label><input type="radio" name="duration" value="6m" checked={values.duration==='6m'} onChange={handleChange}/>6 Months</label>
<label className="ml-4"><input type="radio" name="duration" value="1y" checked={values.duration==='1y'} onChange={handleChange}/>1 Year</label>
<label className="ml-4"><input type="radio" name="duration" value="2y" checked={values.duration==='2y'} onChange={handleChange}/>2 Years</label>
</div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">Submit</button>
    </form>
  );
}


