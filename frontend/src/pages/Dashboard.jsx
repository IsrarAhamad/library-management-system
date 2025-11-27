import React, { useEffect, useState } from 'react';
import { getCurrentUser, getTransactions } from '../services/api';

export default function Dashboard() {
  const user = getCurrentUser();
  const [myIssues, setMyIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      if (!user?.id) return;
      try {
        const allTransactions = await getTransactions();
        const mine = allTransactions
          .filter(txn => txn.user?._id === user.id)
          .filter(txn => !txn.finePaid);
        setMyIssues(mine);
      } catch {
        setMyIssues([]);
      }
    };
    fetchIssues();
  }, [user?.id]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Welcome, {user?.name}!</h2>
      <div className="text-gray-700 mb-4">You are logged in as <span className="font-semibold">{user?.role}</span>.</div>
      <ul className="space-y-2 mb-6">
        <li>Go to <b>Transactions</b> to Issue/Return books.</li>
        <li>See <b>Reports</b> for library statistics.</li>
        {user?.role === 'admin' && <>
          <li>Manage <b>Books &amp; Memberships</b> in Maintenance.</li>
          <li>Maintain <b>User Management</b> for registering or updating users.</li>
        </>}
      </ul>

      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Books currently issued to you</h3>
        {myIssues.length === 0 ? (
          <p className="text-sm text-gray-600">No active issues. All books are returned.</p>
        ) : (
          <ul className="space-y-2">
            {myIssues.map(issue => (
              <li key={issue._id} className="flex justify-between border-b pb-2">
                <span>{issue.book?.title} ({issue.book?.serialNumber})</span>
                <span className="text-sm text-gray-600">Due: {issue.returnDate?.slice(0,10)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

