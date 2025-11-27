import React, { useEffect, useState } from 'react';
import TransactionsForm from '../components/TransactionsForm';
import {
  getTransactions,
  issueBookTxn,
  returnBookTxn,
  getBooks,
  getMemberships,
  getCurrentUser
} from '../services/api';

export default function Transactions() {
  const [mode, setMode] = useState('issue');
  const [recent, setRecent] = useState([]);
  const [books, setBooks] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const user = getCurrentUser();

  const refreshTransactions = async () => {
    const data = await getTransactions();
    setRecent(data);
  };

  useEffect(() => {
    refreshTransactions();
    const fetchLookups = async () => {
      const [bookData, memberData] = await Promise.all([getBooks(), getMemberships()]);
      setBooks(bookData);
      setMemberships(memberData);
    };
    fetchLookups();
  }, []);

  const filteredMemberships = user?.role === 'admin'
    ? memberships
    : memberships.filter(m => m.memberName === user?.name);

  useEffect(() => {
    if (mode === 'issue') setSelectedTxn(null);
  }, [mode]);

  const handleTxnSubmit = async (formValues) => {
    try {
      if (mode === 'issue' && !user?.id) {
        setError('Session expired. Please log in again.');
        return;
      }
      let result;
      if (mode === 'issue') {
        result = await issueBookTxn({
          serialNumber: formValues.serialNumber,
          membershipId: formValues.membershipId,
          userId: user?.id,
          issueDate: formValues.issueDate,
          returnDate: formValues.returnDate,
          remarks: formValues.remarks
        });
      } else {
        result = await returnBookTxn({
          serialNumber: formValues.serialNumber,
          returnDate: formValues.returnDate,
          remarks: formValues.remarks,
          finePaid: formValues.finePaid
        });
      }
      setSelectedTxn(null);
      setError('');
      await refreshTransactions();
      if (result?.message) {
        setSuccessMessage(result.message);
        setTimeout(() => setSuccessMessage(''), 3500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed. Please check your inputs.');
    }
  };

  const handleTxnClick = (txn) => {
    if (mode !== 'return') return;
    setSelectedTxn({
      serialNumber: txn.book?.serialNumber,
      membershipId: txn.membership?._id,
      bookName: txn.book?.title,
      author: txn.book?.author,
      issueDate: txn.issueDate,
      returnDate: txn.returnDate,
      remarks: txn.remarks,
      fine: txn.fine,
      finePaid: txn.finePaid
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Transactions</h2>
      <div className="flex gap-4 mb-4">
        <button className={`px-4 py-2 rounded ${mode==='issue'?'bg-blue-500 text-white':'bg-gray-200'}`} onClick={()=>setMode('issue')}>Issue Book</button>
        <button className={`px-4 py-2 rounded ${mode==='return'?'bg-blue-500 text-white':'bg-gray-200'}`} onClick={()=>setMode('return')}>Return Book</button>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {successMessage && <div className="p-2 mb-2 bg-green-100 text-green-800 rounded">{successMessage}</div>}
      {!books.length && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">No books available to issue. Please add books in Maintenance.</div>
      )}
      {!filteredMemberships.length && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">No membership linked to your profile. Contact an admin.</div>
      )}
      <TransactionsForm
        mode={mode}
        books={books}
        memberships={filteredMemberships}
        initial={mode === 'return' ? selectedTxn || {} : {}}
        onSubmit={handleTxnSubmit}
      />
      <h3 className="font-bold mt-6 mb-2">Recent Transactions</h3>
      <p className="text-sm text-gray-600 mb-2">Click a transaction while in Return mode to prefill the form.</p>
      <ul className="space-y-2">
        {recent.slice(-5).reverse().map(txn =>
          <li
            key={txn._id}
            className="p-3 bg-white rounded shadow-sm cursor-pointer hover:bg-gray-50"
            onClick={() => handleTxnClick(txn)}
          >
            <div className="font-medium">{txn.book?.title || 'Book'} ({txn.book?.serialNumber || 'N/A'})</div>
            <div className="text-sm text-gray-600">By {txn.user?.name || 'User'} on {txn.issueDate?.slice(0, 10)}</div>
          </li>
        )}
      </ul>
    </div>
  );
}
