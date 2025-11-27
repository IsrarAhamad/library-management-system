import React, { useEffect, useState } from 'react';
import BookForm from '../components/BookForm';
import MembershipForm from '../components/MembershipForm';
import {
  getBooks, addBook, updateBook, deleteBook,
  getMemberships, addMembership, updateMembership, deleteMembership,
} from '../services/api';

export default function Maintenance() {
  const [tab, setTab] = useState('books');
  const [books, setBooks] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const [booksData, membershipData] = await Promise.all([getBooks(), getMemberships()]);
      setBooks(booksData);
      setMemberships(membershipData);
    };
    fetchData();
  }, []);

  const refreshBooks = async () => {
    const data = await getBooks();
    setBooks(data);
  };

  const refreshMemberships = async () => {
    const data = await getMemberships();
    setMemberships(data);
  };

  const handleBookSubmit = async (book) => {
    setError('');
    setMessage('');
    try {
      if (selectedBook) {
        await updateBook(selectedBook._id, book);
        setMessage('Book updated successfully.');
      } else {
        await addBook(book);
        setMessage('Book added successfully.');
      }
      await refreshBooks();
      setSelectedBook(null);
    } catch (err) {
      setError('Could not save book. Please check fields.');
    }
  };

  const handleMembershipSubmit = async (membership) => {
    setError('');
    setMessage('');
    try {
      if (selectedMembership) {
        await updateMembership(selectedMembership._id, membership);
        setMessage('Membership updated successfully.');
      } else {
        await addMembership(membership);
        setMessage('Membership added successfully.');
      }
      await refreshMemberships();
      setSelectedMembership(null);
    } catch (err) {
      setError('Unable to save membership. Ensure all fields are correct.');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Maintenance</h2>
      <div className="flex gap-4 mb-6">
        <button className={`px-4 py-2 rounded ${tab==='books'?'bg-blue-500 text-white':'bg-gray-200'}`} onClick={() => setTab('books')}>Books/Movies</button>
        <button className={`px-4 py-2 rounded ${tab==='members'?'bg-blue-500 text-white':'bg-gray-200'}`} onClick={() => setTab('members')}>Memberships</button>
      </div>
      {message && <div className="mb-4 text-green-600">{message}</div>}
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {tab === 'books' ? (
        <>
          <BookForm initial={selectedBook || {}} onSubmit={handleBookSubmit} />
          <ul className="mt-6 space-y-2">
            {books.map(b => (
              <li key={b._id} className="flex justify-between bg-gray-50 rounded px-2 py-1">
                <span>{b.title} ({b.type})</span>
                <div>
                  <button className="text-blue-600 mr-2" onClick={() => setSelectedBook(b)}>Edit</button>
                  <button className="text-red-600" onClick={async () => { await deleteBook(b._id); await refreshBooks(); }}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <MembershipForm initial={selectedMembership || {}} onSubmit={handleMembershipSubmit} />
          <ul className="mt-6 space-y-2">
            {memberships.map(m => (
              <li key={m._id} className="flex justify-between bg-gray-50 rounded px-2 py-1">
                <span>{m.memberName} ({m.membershipNumber})</span>
                <div>
                  <button className="text-blue-600 mr-2" onClick={() => setSelectedMembership(m)}>Edit</button>
                  <button className="text-red-600" onClick={async () => { await deleteMembership(m._id); await refreshMemberships(); }}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
