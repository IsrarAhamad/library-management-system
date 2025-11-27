import React, { useEffect, useMemo, useState } from 'react';

export default function TransactionsForm({
  mode = 'issue',
  books = [],
  memberships = [],
  initial = {},
  onSubmit
}) {
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const defaultReturn = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 15);
    return date.toISOString().split('T')[0];
  }, []);

  const [values, setValues] = useState({
    bookId: initial.bookId || '',
    membershipId: initial.membershipId || '',
    transactionId: initial.transactionId || '',
    bookName: initial.bookName || '',
    serialNumber: initial.serialNumber || '',
    author: initial.author || '',
    issueDate: initial.issueDate ? initial.issueDate.slice(0, 10) : today,
    returnDate: initial.returnDate ? initial.returnDate.slice(0, 10) : defaultReturn,
    remarks: initial.remarks || '',
    fine: initial.fine || 0,
    finePaid: initial.finePaid || false
  });
  const [errors, setErrors] = useState({});

  const maxReturnDate = useMemo(() => {
    const base = values.issueDate ? new Date(values.issueDate) : new Date();
    base.setDate(base.getDate() + 15);
    return base.toISOString().split('T')[0];
  }, [values.issueDate]);

  useEffect(() => {
    if (books.length && !values.bookId) {
      applyBook(books[0]);
    }
  }, [books, values.bookId]);

  useEffect(() => {
    if (memberships.length && !values.membershipId) {
      setValues(prev => ({ ...prev, membershipId: memberships[0]._id }));
    }
  }, [memberships, values.membershipId]);

  useEffect(() => {
    setValues(prev => ({
      ...prev,
      ...initial,
      issueDate: initial.issueDate ? initial.issueDate.slice(0, 10) : prev.issueDate,
      returnDate: initial.returnDate ? initial.returnDate.slice(0, 10) : prev.returnDate
    }));
  }, [initial, mode]);

  const applyBook = (book) => {
    if (!book) return;
    setValues(prev => ({
      ...prev,
      bookId: book._id,
      bookName: book.title,
      serialNumber: book.serialNumber,
      author: book.author
    }));
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setValues(curr => {
      const next = { ...curr, [name]: type === 'checkbox' ? checked : value };
      if (name === 'bookName') {
        const match = books.find(b => (b.title || '').toLowerCase() === value.toLowerCase());
        if (match) {
          next.bookId = match._id;
          next.serialNumber = match.serialNumber;
          next.author = match.author;
        }
      }
      if (name === 'serialNumber') {
        const match = books.find(b => (b.serialNumber || '').toLowerCase() === value.toLowerCase());
        if (match) {
          next.bookId = match._id;
          next.bookName = match.title;
          next.author = match.author;
        }
      }
      return next;
    });
  };

  const handleBookSelect = (e) => {
    const book = books.find(b => b._id === e.target.value);
    applyBook(book);
  };

  const handleMembershipSelect = (e) => {
    setValues(prev => ({ ...prev, membershipId: e.target.value }));
  };

  function validate() {
    const errs = {};
    if (!values.bookId) errs.bookId = 'Select a book';
    if (!values.membershipId) errs.membershipId = 'Select a membership';
    if (mode === 'issue') {
      if (!values.issueDate) errs.issueDate = 'Issue Date required';
      if (!values.returnDate) errs.returnDate = 'Return Date required';
    } else if (mode === 'return') {
      if (!values.transactionId) errs.transactionId = 'Transaction ID required';
      if (!values.returnDate) errs.returnDate = 'Return date required';
      if (!values.finePaid && values.fine > 0) errs.finePaid = 'Pay fine to complete';
    }
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
        <label className="block font-medium">Choose Book</label>
        <select name="bookId" value={values.bookId} onChange={handleBookSelect} className="input" disabled={!books.length}>
          {!books.length && <option value="">No books available</option>}
          {books.map(book => (
            <option key={book._id} value={book._id}>{book.title} ({book.serialNumber})</option>
          ))}
        </select>
        {errors.bookId && <span className="text-red-500 text-xs">{errors.bookId}</span>}
      </div>
      <div>
        <label className="block font-medium">Book Name</label>
        <input name="bookName" value={values.bookName} onChange={handleChange} className="input" />
      </div>
      <div>
        <label className="block font-medium">Serial Number</label>
        <input name="serialNumber" value={values.serialNumber} onChange={handleChange} className="input" />
      </div>
      <div>
        <label className="block font-medium">Author</label>
        <input name="author" value={values.author} readOnly className="input bg-gray-100 text-gray-500" />
      </div>
      <div>
        <label className="block font-medium">Membership</label>
        <select name="membershipId" value={values.membershipId} onChange={handleMembershipSelect} className="input" disabled={!memberships.length}>
          {!memberships.length && <option value="">No memberships</option>}
          {memberships.map(member => (
            <option key={member._id} value={member._id}>{member.membershipNumber} - {member.memberName}</option>
          ))}
        </select>
        {errors.membershipId && <span className="text-red-500 text-xs">{errors.membershipId}</span>}
      </div>
      {mode === 'return' && (
        <div>
          <label className="block font-medium">Transaction ID</label>
          <input name="transactionId" value={values.transactionId} onChange={handleChange} className="input" />
          {errors.transactionId && <span className="text-red-500 text-xs">{errors.transactionId}</span>}
        </div>
      )}
      <div>
        <label className="block font-medium">Issue Date</label>
        <input type="date" name="issueDate" value={values.issueDate} onChange={handleChange} className="input" min={today} />
        {errors.issueDate && <span className="text-red-500 text-xs">{errors.issueDate}</span>}
      </div>
      <div>
        <label className="block font-medium">Return Date</label>
        <input type="date" name="returnDate" value={values.returnDate} onChange={handleChange} className="input" min={values.issueDate} max={maxReturnDate} />
        {errors.returnDate && <span className="text-red-500 text-xs">{errors.returnDate}</span>}
      </div>
      <div>
        <label className="block font-medium">Remarks</label>
        <input name="remarks" value={values.remarks} onChange={handleChange} className="input" />
      </div>
      <div>
        <label className="block font-medium">Fine</label>
        <input name="fine" value={values.fine} readOnly type="number" className="input bg-gray-100 text-gray-500" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" name="finePaid" checked={values.finePaid} onChange={handleChange} />
        <span>Fine Paid</span>
        {errors.finePaid && <span className="text-red-500 text-xs"> {errors.finePaid}</span>}
      </div>
      <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">Submit</button>
    </form>
  );
}