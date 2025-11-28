import React, { useEffect, useMemo, useState, useRef } from 'react';

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
    bookName: '',
    serialNumber: '',
    author: '',
    membershipId: '',
    issueDate: today,
    returnDate: defaultReturn,
    expectedReturnDate: '',
    remarks: '',
    fine: 0,
    finePaid: false
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);
  const bookNameInputRef = useRef();

  useEffect(() => {
    if (
      bookNameInputRef.current &&
      document.activeElement === bookNameInputRef.current &&
      (!values.bookName || values.bookName.length === 0)
    ) {
      setAutocompleteOptions(books);
      setShowAutocomplete(books.length > 0);
    } else if (values.bookName && values.bookName.length > 0) {
      const search = values.bookName.toLowerCase();
      const results = books.filter(b => b.title.toLowerCase().includes(search));
      setAutocompleteOptions(results);
      setShowAutocomplete(results.length > 0);
    } else {
      setShowAutocomplete(false);
    }
  }, [values.bookName, books]);

  useEffect(() => {
    if (memberships.length === 1 && !values.membershipId) {
      setValues(v => ({ ...v, membershipId: memberships[0]._id }));
    }
  }, [memberships]);

  useEffect(() => {
    if (initial && Object.keys(initial).length > 0) {
      const expectedReturnDate = initial.expectedReturnDate ? initial.expectedReturnDate.slice(0, 10) : '';
      const actualReturnDate = initial.returnDate ? initial.returnDate.slice(0, 10) : today;
      
      let fine = 0;
      let finePaid = false;
      if (mode === 'return' && expectedReturnDate && actualReturnDate) {
        const expected = new Date(expectedReturnDate);
        const actual = new Date(actualReturnDate);
        if (actual > expected) {
          const diffDays = Math.ceil((actual - expected) / (1000 * 60 * 60 * 24));
          fine = diffDays * 5; 
          finePaid = false; 
        }
      } else {
        fine = initial.fine || 0;
        finePaid = initial.finePaid || false;
      }
      
      setValues(prev => ({
        ...prev,
        bookName: initial.bookName || prev.bookName,
        serialNumber: initial.serialNumber || prev.serialNumber,
        author: initial.author || prev.author,
        membershipId: initial.membershipId || prev.membershipId,
        issueDate: initial.issueDate ? initial.issueDate.slice(0, 10) : prev.issueDate,
        returnDate: actualReturnDate || prev.returnDate,
        expectedReturnDate: expectedReturnDate || prev.expectedReturnDate,
        remarks: initial.remarks || prev.remarks,
        fine: fine,
        finePaid: finePaid
      }));
    }
  }, [initial, mode, today]);

  useEffect(() => {
    if (mode === 'return' && values.returnDate && values.expectedReturnDate) {
      const expected = new Date(values.expectedReturnDate);
      const actual = new Date(values.returnDate);
      let fine = 0;
      if (actual > expected) {
        const diffDays = Math.ceil((actual - expected) / (1000 * 60 * 60 * 24));
        fine = diffDays * 5; 
      }
      if (values.fine !== fine) {
        setValues(prev => ({ ...prev, fine: fine }));
      }
    }
  }, [values.returnDate, values.expectedReturnDate, mode]);

  const handleBookNameChange = (e) => {
    const value = e.target.value;
    setValues(curr => ({ ...curr, bookName: value }));
    setShowAutocomplete(true);
  };
  const handleBookNameSelect = (book) => {
    setValues(curr => ({
      ...curr,
      bookName: book.title,
      serialNumber: book.serialNumber,
      author: book.author
    }));
    setShowAutocomplete(false);
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setValues(curr => {
      const next = { ...curr, [name]: type === 'checkbox' ? checked : value };
      if (name === 'serialNumber') {
        const match = books.find(b => (b.serialNumber || '').toLowerCase() === value.toLowerCase());
        if (match) {
          next.bookName = match.title;
          next.author = match.author;
        }
      }
      // Calculate fine when return date changes in return mode
      if (name === 'returnDate' && mode === 'return') {
        const expectedReturnDate = next.expectedReturnDate || curr.expectedReturnDate;
        if (expectedReturnDate && value) {
          const expectedReturn = new Date(expectedReturnDate);
          const actualReturn = new Date(value);
          let fine = 0;
          if (actualReturn > expectedReturn) {
            const diffDays = Math.ceil((actualReturn - expectedReturn) / (1000 * 60 * 60 * 24));
            fine = diffDays * 5; 
          }
          next.fine = fine;
        }
      }
      return next;
    });
  };

  function validate() {
    const errs = {};
    if (!values.serialNumber) errs.serialNumber = 'Enter Book Number';
    if (!values.membershipId) errs.membershipId = 'Select a membership';
    if (mode === 'issue') {
      if (!values.issueDate) errs.issueDate = 'Issue Date required';
      if (!values.returnDate) errs.returnDate = 'Return Date required';
    } else if (mode === 'return') {
      if (!values.returnDate) errs.returnDate = 'Return date required';
      if (!values.finePaid && values.fine > 0) errs.finePaid = 'Pay fine to complete';
    }
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (!Object.keys(errs).length && onSubmit) {
      const result = await onSubmit(values);
      if (result && result.message) {
        setSuccessMessage(result.message);
        setValues({
          bookName: '',
          serialNumber: '',
          author: '',
          membershipId: '',
          issueDate: today,
          returnDate: defaultReturn,
          expectedReturnDate: '',
          remarks: '',
          fine: 0,
          finePaid: false
        });
        setTimeout(() => setSuccessMessage(''), 3500);
      }
    }
  }

  const maxReturnDate = useMemo(() => {
    const base = values.issueDate ? new Date(values.issueDate) : new Date();
    base.setDate(base.getDate() + 15);
    return base.toISOString().split('T')[0];
  }, [values.issueDate]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md p-4 bg-white rounded shadow">
      {successMessage && (
        <div className="p-2 mb-2 bg-green-100 text-green-800 rounded">{successMessage}</div>
      )}

      <div style={{ position: 'relative' }}>
        <label className="block font-medium">Book Name</label>
        <input
          ref={bookNameInputRef}
          name="bookName"
          value={values.bookName}
          onChange={handleBookNameChange}
          onFocus={() => setShowAutocomplete(books.length > 0)}
          className="input"
          autoComplete="off"
        />
        {showAutocomplete && (
          <ul className="absolute z-10 bg-white border border-gray-300 w-full max-h-40 overflow-y-auto shadow rounded">
            {autocompleteOptions.map(book => (
              <li
                key={book._id}
                className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
                onClick={() => handleBookNameSelect(book)}
              >
                {book.title} ({book.serialNumber})
              </li>
            ))}
            {autocompleteOptions.length === 0 && <li className="px-2 py-1 text-gray-500">No matches</li>}
          </ul>
        )}
      </div>
      <div>
        <label className="block font-medium">Book Number (Serial Number)</label>
        <input name="serialNumber" value={values.serialNumber} onChange={handleChange} className="input" />
        {errors.serialNumber && <span className="text-red-500 text-xs">{errors.serialNumber}</span>}
      </div>
      <div>
        <label className="block font-medium">Author</label>
        <input name="author" value={values.author} readOnly className="input bg-gray-100 text-gray-500" />
      </div>
      <div>
        <label className="block font-medium">Membership</label>
        <select name="membershipId" value={values.membershipId} onChange={handleChange} className="input" disabled={!memberships.length}>
          {!memberships.length && <option value="">No memberships</option>}
          {memberships.map(member => (
            <option key={member._id} value={member._id}>{member.membershipNumber} - {member.memberName}</option>
          ))}
        </select>
        {errors.membershipId && <span className="text-red-500 text-xs">{errors.membershipId}</span>}
      </div>
      {mode === 'issue' && (
        <>
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
        </>
      )}
      {mode === 'return' && (
        <>
          <div>
            <label className="block font-medium">Issue Date</label>
            <input type="date" name="issueDate" value={values.issueDate} readOnly className="input bg-gray-100 text-gray-500" />
          </div>
          <div>
            <label className="block font-medium">Return Date</label>
            <input type="date" name="returnDate" value={values.returnDate} onChange={handleChange} className="input" min={values.issueDate} max={maxReturnDate} />
            {errors.returnDate && <span className="text-red-500 text-xs">{errors.returnDate}</span>}
          </div>
        </>
      )}
      <div>
        <label className="block font-medium">Remarks</label>
        <input name="remarks" value={values.remarks} onChange={handleChange} className="input" />
      </div>
      <div className='hidden'>
        <label className="block font-medium">Fine</label>
        <input name="fine" value={`Rs. ${Number(values.fine) || 0}`} readOnly className="input bg-gray-100 text-gray-500" />
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