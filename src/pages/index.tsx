import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { School } from '../types';
import { SearchBar } from '../components/SearchBar';import { Layout } from '../components/Layout';
import { SchoolList } from '../components/SchoolList';
import { SchoolMap } from '../components/SchoolMap';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);

  useEffect(() => {
    // Fetch schools data from API
    const fetchSchools = async () => {
      const response = await fetch('/api/schools');
      const data = await response.json();
      setSchools(data);
    };
    fetchSchools();
  }, []);

  const handleSchoolSelect = (school) => {
    setSelectedSchool(school);
  };

  return (
    <Layout>
      <h1>International School Finder</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SchoolList />
        <SchoolMap />
      </div>
    </Layout>
  );
}
