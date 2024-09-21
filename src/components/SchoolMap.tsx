import React, * as react from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface School {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
}

interface SchoolMapProps {
  schools: School[];
}

const SchoolMap: React.FC<SchoolMapProps> = ({ schools }) => {
  const [center, setCenter] = react.useState({ lat: 0, lng: 0 });

  react.useEffect(() => {
    if (schools.length > 0) {
      setCenter(schools[0].location);
    }
  }, [schools]);

  const mapStyles = {
    height: '400px',
    width: '100%'
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={13}
        center={center}
      >
        {schools.map((school) => (
          <Marker
            key={school.id}
            position={school.location}
            title={school.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default SchoolMap;import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import Rating from '../../../models/Rating';

export default function SchoolMap({ schools }: SchoolMapProps) {
  const [center, setCenter] = react.useState({ lat: 0, lng: 0 });

  react.useEffect(() => {
    if (schools.length > 0) {
      setCenter(schools[0].location);
    }
  }, [schools]);

  const mapStyles = {
    height: '400px',
    width: '100%'
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={13}
        center={center}
      >
        {schools.map((school) => (
          <Marker
            key={school.id}
n={school.location}
            title={school.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const { schoolId } = req.query;
        const ratings = await Rating.find({ schoolId });
        res.status(200).json({ success: true, data: ratings });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const rating = await Rating.create(req.body);
        res.status(201).json({ success: true, data: rating });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import School from '../../../models/School';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const schools = await School.find({});
        res.status(200).json({ success: true, data: schools });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const school = await School.create(req.body);
        res.status(201).json({ success: true, data: school });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
import React, { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'International School Finder' }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <nav>
          <Link href="/">
            <a>Home</a>
          </Link>{' '}
          |{' '}
          <Link href="/schools">
            <a>Schools</a>
          </Link>{' '}
          |{' '}
          <Link href="/about">
            <a>About</a>
          </Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <hr />
        <span>International School Finder © 2023</span>
      </footer>
    </div>
  );
};

export default Layout;
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'POST':
      try {
        const user = await User.create(req.body);
        res.status(201).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'GET':
      try {
        const users = await User.find({});
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
import React from 'react';
import Link from 'next/link';

interface School {
  id: string;
  name: string;
  description: string;
  averageRating: number;
}

interface SchoolListProps {
  schools: School[];
}

const SchoolList: React.FC<SchoolListProps> = ({ schools }) => {
  return (
    <div>
      <h2>Schools</h2>
      <ul>
        {schools.map((school) => (
          <li key={school.id}>
            <Link href={`/schools/${school.id}`}>
              <a>
                <h3>{school.name}</h3>
                <p>{school.description}</p>
                <p>Average Rating: {school.averageRating.toFixed(1)}</p>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SchoolList;
