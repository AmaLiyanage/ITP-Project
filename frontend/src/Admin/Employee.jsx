import React from 'react';
import { Link } from 'react-router-dom';
import './Employee.css';

function Employee({ employee }) {
  const { _id, name, age, gender, designation, address, email, phone, nicNo, date_joined } = employee;

  return (
    <tr>
      <td className="empd-name">{name}</td>
      <td className="empd-age">{age}</td>
      <td className="empd-gender">{gender}</td>
      <td className="empd-designation">{designation}</td>
      <td className="empd-address">{address}</td>
      <td className="empd-email">{email}</td>
      <td className="empd-phone">{phone}</td>
      <td className="empd-nicNo">{nicNo}</td>
      <td className="empd-date_joined">{new Date(date_joined).toLocaleDateString()}</td>
      <td className="empd-actions">
        <Link className="empd-b1" to={`/adminEmployeeDetails/${_id}`}>Update</Link>
        <Link className="empd-b2" to={`/adminEmployeeDetails/delete/${_id}`}>Delete</Link>
      </td>
    </tr>
  );
}

export default Employee;
