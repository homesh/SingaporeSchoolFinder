import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';

const AdminDashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session || !session.user.isAdmin) {
    router.push('/');
    return null;
  }

  return (
    <AdminLayout>
      <h1>Admin Dashboard</h1>
      <div className="admin-menu">
        <Link href="/admin/schools">
          <a className="admin-menu-item">Manage Schools</a>
        </Link>
        <Link href="/admin/users">
          <a className="admin-menu-item">Manage Users</a>
        </Link>
        <Link href="/admin/ratings">
          <a className="admin-menu-item">Manage Ratings</a>
        </Link>
      </div>
      <div className="admin-stats">
        <h2>Quick Statistics</h2>
        {/* Add quick statistics here, e.g., total schools, users, ratings */}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';

const ManageSchools: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    const fetchSchools = async () => {
      const response = await fetch('/api/schools');
      const data = await response.json();
      setSchools(data);
    };

    fetchSchools();
  }, []);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session || !session.user.isAdmin) {
    router.push('/');
    return null;
  }

  return (
    <AdminLayout>
      <h1>Manage Schools</h1>
      <Link href="/admin/schools/new">
        <a className="btn btn-primary">Add New School</a>
      </Link>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Average Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {schools.map((school) => (
            <tr key={school._id}>
              <td>{school.name}</td>
              <td>{school.address}</td>
              <td>{school.averageRating}</td>
              <td>
                <Link href={`/admin/schools/${school._id}`}>
                  <a className="btn btn-sm btn-secondary">Edit</a>
                </Link>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteSchool(school._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
};

export default ManageSchools;
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!token || !token.isAdmin) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/AdminLayout';

const EditSchool: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [school, setSchool] = useState({
    name: '',
    description: '',
    address: '',
    location: { lat: 0, lng: 0 },
    logo: '',
    photos: [],
    attachments: []
  });

  useEffect(() => {
    const fetchSchool = async () => {
      if (id) {
        const response = await fetch(`/api/schools/${id}`);
        const data = await response.json();
        setSchool(data);
      }
    };

    fetchSchool();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSchool(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`/api/schools/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(school)
    });

    if (response.ok) {
      router.push('/admin/schools');
    } else {
      // Handle error
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session || !session.user.isAdmin) {
    router.push('/');
    return null;
  }

  return (
    <AdminLayout>
      <h1>Edit School</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={school.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={school.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={school.address}
            onChange={handleInputChange}
            required
          />
        </div>
        {/* Add more fields for location, logo, photos, and attachments */}
        <button type="submit">Update School</button>
      </form>
    </AdminLayout>
  );
};

export default EditSchool;import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session || !session.user.isAdmin) {
    router.push('/');
    return null;
  }

  return (
    <div className="admin-layout">
      <nav className="admin-sidebar">
        <ul>
          <li>
            <Link href="/admin">
              <a>Dashboard</a>
            </Link>
          </li>
          <li>
            <Link href="/admin/schools">
              <a>Manage Schools</a>
            </Link>
          </li>
          <li>
            <Link href="/admin/users">
              <a>Manage Users</a>
            </Link>
          </li>
          <li>
            <Link href="/admin/ratings">
              <a>Manage Ratings</a>
            </Link>
          </li>
        </ul>
      </nav>
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
