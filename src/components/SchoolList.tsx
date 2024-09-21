
import React from 'react';
import { School } from '../types/School';
import Link from 'next/link';

interface SchoolListProps {
  schools: School[];
}

const SchoolList: React.FC<SchoolListProps> = ({ schools }) => {
  return (
    <div className="school-list">
      <h2>Schools</h2>
      {schools.length === 0 ? (
        <p>No schools found.</p>
      ) : (
        <ul>
          {schools.map((school) => (
            <li key={school._id}>
              <Link href={`/schools/${school._id}`}>
                <a>
                  <h3>{school.name}</h3>
                  <p>{school.address}</p>
                  <p>Rating: {school.averageRating.toFixed(1)}/5</p>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SchoolList as React.FC<SchoolListProps>;
