import React from 'react';

export default function ReportsTable({ data = [], columns = [], rowRadioName = 'selected', onRowSelect }) {
  // columns: [{label,key}], data: [{key:val,...}]
  return (
    <table className="min-w-full bg-white mt-6 rounded shadow">
      <thead>
        <tr>
          <th></th>
          {columns.map(col => (
            <th className="px-4 py-2 border-b text-left" key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="even:bg-gray-100">
            <td className="px-2"><input type="radio" name={rowRadioName} value={row.id || i} onChange={()=>onRowSelect&&onRowSelect(row)} /></td>
            {columns.map(col => (
              <td className="px-4 py-2 border-b" key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}


