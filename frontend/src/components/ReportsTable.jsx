import React from 'react';

export default function ReportsTable({ data = [], columns = [] }) {
  return (
    <table className="min-w-full bg-white mt-6 rounded shadow">
      <thead>
        <tr>
          {columns.map(col => (
            <th className="px-4 py-2 border-b text-left" key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="even:bg-gray-100">
            {columns.map(col => (
              <td className="px-4 py-2 border-b" key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}


