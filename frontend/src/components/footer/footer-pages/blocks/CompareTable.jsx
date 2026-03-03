import React from 'react';
import './CompareTable.css';

export default function CompareTable({ columns, rows, highlightColumn }) {
  return (
    <div className="CompareTable__wrap">
      <table className="CompareTable">
        <thead>
          <tr>
            <th scope="col" className="CompareTable__label-col">Feature</th>
            {columns.map((col, i) => (
              <th key={i} scope="col" className={highlightColumn === i ? 'CompareTable__highlight' : ''}>
                {col}
                {highlightColumn === i && (
                  <span className="CompareTable__badge">Most users start here</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td className="CompareTable__label-col">{row.label}</td>
              {row.cells.map((cell, j) => (
                <td key={j} className={highlightColumn === j ? 'CompareTable__highlight' : ''}>
                  {Array.isArray(cell) ? cell.join(', ') : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
