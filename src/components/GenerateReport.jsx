import React, { forwardRef } from "react";

const GenerateReport = forwardRef((props, ref) => {
  return (
    <div ref={ref}>
      <table className="border w-full mt-4">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">1</td>
            <td className="border p-2">John Doe</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

export default   GenerateReport;
