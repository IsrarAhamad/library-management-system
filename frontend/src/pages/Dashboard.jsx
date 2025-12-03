import React, { useEffect, useState } from "react";
import { getCurrentUser, getTransactions } from "../services/api";

export default function Dashboard() {
  const user = getCurrentUser();
  const [myIssues, setMyIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      if (!user?.id) return;
      try {
        const allTransactions = await getTransactions();
        const mine = allTransactions
          .filter((txn) => txn.user?._id === user.id)
          .filter((txn) => !txn.finePaid);
        setMyIssues(mine);
      } catch {
        setMyIssues([]);
      }
    };
    fetchIssues();
  }, [user?.id]);

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-3xl space-y-8">
        <div className="bg-white border rounded-lg shadow-sm p-5">
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome, {user?.name}
          </h2>
          <p className="text-gray-600 mt-1">
            You are logged in as{" "}
            <span className="font-medium">{user?.role}</span>.
          </p>
        </div>

        <div className="bg-white border rounded-lg shadow-sm p-5">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Quick Navigation
          </h3>

          <ul className="space-y-2 text-gray-700">
            <li>
              Go to <b>Transactions</b> to Issue/Return books.
            </li>
            <li>
              See <b>Reports</b> for library statistics.
            </li>

            {user?.role === "admin" && (
              <>
                <li>
                  Manage <b>Books & Memberships</b> in Maintenance.
                </li>
                <li>
                  Maintain <b>User Management</b> for registering or updating
                  users.
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="bg-white border rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Books currently issued to you
          </h3>

          {myIssues.length === 0 ? (
            <p className="text-gray-600 text-sm">
              No active issues. All books are returned.
            </p>
          ) : (
            <ul className="space-y-3">
              {myIssues.map((issue) => (
                <li
                  key={issue._id}
                  className="flex justify-between items-center border rounded-lg p-3 bg-gray-50"
                >
                  <span className="font-medium text-gray-800">
                    {issue.book?.title}{" "}
                    <span className="text-gray-500">
                      ({issue.book?.serialNumber})
                    </span>
                  </span>
                  <span className="text-xs text-gray-600">
                    Due: {issue.returnDate?.slice(0, 10)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
