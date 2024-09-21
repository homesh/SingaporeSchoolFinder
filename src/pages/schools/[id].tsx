import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '../../components/Layout';
import { School } from '../../types/School';

const SchoolDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [school, setSchool] = useState<School | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (id) {
      fetchSchoolDetails();
    }
  }, [id]);

  const fetchSchoolDetails = async () => {
    try {
      const response = await fetch(`/api/schools/${id}`);
      if (response.ok) {
        const data = await response.json();
        setSchool(data);
      } else {
        console.error('Failed to fetch school details');
      }
    } catch (error) {
      console.error('Error fetching school details:', error);
    }
  };

  if (!school) {
    return <Layout>Loading...</Layout>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">{school.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src={school.logo || '/placeholder-logo.png'}
              alt={`${school.name} logo`}
              className="w-full h-auto mb-4"
            />
            <p className="text-gray-700 mb-4">{school.description}</p>
            <p className="font-semibold">Address:</p>
            <p className="text-gray-700 mb-4">{school.address}</p>
            <p className="font-semibold">Average Rating:</p>
            <p className="text-gray-700 mb-4">{school.averageRating.toFixed(1)} / 5</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Photos</h2>
            <div className="grid grid-cols-2 gap-4">
              {school.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`${school.name} photo ${index + 1}`}
                  className="w-full h-auto"
                />
              ))}
            </div>
          </div>
        </div>
        {session && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Rate this school</h2>
            {/* Add rating component here */}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default function SchoolDetail() {
  const [userRating, setUserRating] = useState<number | null>(null);

  const handleRatingChange = async (newRating: number) => {
    setUserRating(newRating);
    try {
      const response = await fetch(`/api/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          schoolId: id,
          rating: newRating,
        }),
      });
      if (response.ok) {
        fetchSchoolDetails(); // Refresh school details to update average rating
      } else {
        console.error('Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* ... existing code ... */}
        {session && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Rate this school</h2>
            <RatingComponent
              initialRating={userRating}
              onRatingChange={handleRatingChange}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}
