import React, { useEffect, useState } from "react";
import ReportsTable from "../components/ReportsTable";
import { getReports, getBooks, getMemberships } from "../services/api";

export default function Reports() {
  const [tab, setTab] = useState("transactions");
  const [txns, setTxns] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [transactions, bookList, memberList] = await Promise.all([
        getReports(),
        getBooks(),
        getMemberships(),
      ]);
      setTxns(transactions);
      setBooks(bookList);
      setMembers(memberList);
    };
    fetchData();
  }, []);

  const txnCols = [
    {
      label: "Type",
      key: "type",
      render: (x) => (x.finePaid ? "Returned" : "Issued"),
    },
    { label: "User", key: "user", render: (x) => x.user?.name || "" },
    { label: "Book", key: "book", render: (x) => x.book?.title || "" },
    {
      label: "Date",
      key: "issueDate",
      render: (x) => x.issueDate?.slice(0, 10),
    },
  ];
  const bookCols = [
    { label: "Title", key: "title" },
    { label: "Author", key: "author" },
    { label: "Type", key: "type" },
    {
      label: "Available",
      key: "available",
      render: (x) => (x.available ? "Yes" : "No"),
    },
  ];
  const memberCols = [
    { label: "Member Name", key: "memberName" },
    { label: "Membership", key: "membershipNumber" },
    {
      label: "Active",
      key: "active",
      render: (x) => (x.active ? "Yes" : "No"),
    },
    {
      label: "End",
      key: "endDate",
      render: (x) => (x.endDate || "").slice(0, 10),
    },
  ];

  let data =
    tab === "transactions"
      ? [...txns].reverse()
      : tab === "books"
      ? books
      : members;
  let columns =
    tab === "transactions" ? txnCols : tab === "books" ? bookCols : memberCols;

  return (
    <div className="w-full flex justify-start pl-24 mt-1">
      <div className="w-full max-w-[868px]">
        <h2 className="text-xl font-bold mb-4">Reports</h2>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab("transactions")}
            className={`px-4 py-2 rounded ${
              tab === "transactions" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Transactions
          </button>

          <button
            onClick={() => setTab("books")}
            className={`px-4 py-2 rounded ${
              tab === "books" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Books
          </button>

          <button
            onClick={() => setTab("members")}
            className={`px-4 py-2 rounded ${
              tab === "members" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Members
          </button>
        </div>

        <div className="bg-white border rounded-lg">
          <ReportsTable data={data} columns={columns} />
        </div>
      </div>
    </div>
  );
}
