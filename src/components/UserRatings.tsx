const UserRatings: React.FC = () => {
  const [ratings, setRatings] = useState<Rating[]>([]);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch('/api/users/ratings');
        if (response.ok) {
          const data = await response.json();
          setRatings(data.ratings);
        }
      } catch (error) {
        console.error('Error fetching user ratings:', error);
      }
    };

    fetchRatings();
  }, []);

  return (
    <div className="user-ratings">
      <h2>Your Ratings</h2>
      {ratings.length === 0 ? (
        <p>You haven't rated any schools yet.</p>
      ) : (
        <ul>
          {ratings.map((rating) => (
            <li key={rating.id}>
              <span>{rating.schoolName}: </span>
              <span>{rating.value} stars</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserRatings;import React, { useState, useEffect } from 'react';

interface UserInfo {
  name: string;
  email: string;
  bio: string;
}

const ProfileInfo: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', email: '', bio: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/users/profile');
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserInfo(prevInfo => ({ ...prevInfo, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInfo),
      });
      if (response.ok) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };

  return (
    <div className="profile-info">
      <h2>Profile Information</h2>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userInfo.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userInfo.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="bio">Bio:</label>
            <textarea
              id="bio"
              name="bio"
              value={userInfo.bio}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          <p><strong>Name:</strong> {userInfo.name}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>Bio:</strong> {userInfo.bio}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
};
import React from 'react';
import ProfileInfo from '../../components/ProfileInfo';
import UserRatings from '../../components/UserRatings';
import ProfileImageUpload from '../../components/ProfileImageUpload';

const Profile: React.FC = () => {
  return (
    <div className="profile-page">
      <h1>User Profile</h1>
      <ProfileImageUpload />
      <ProfileInfo />
      <UserRatings />
    </div>
  );
};

export default Profile;
import React, { useState, useEffect } from 'react';

interface Rating {
  id: string;
  schoolName: string;
  value: number;
}

const UserRatings: React.FC = () => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch('/api/users/ratings');
        if (!response.ok) {
          throw new Error('Failed to fetch ratings');
        }
        const data = await response.json();
        setRatings(data.ratings);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user ratings:', error);
        setError('Failed to load ratings. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchRatings();
  }, []);

  if (isLoading) {
    return <div>Loading ratings...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="user-ratings">
      <h2>Your Ratings</h2>
      {ratings.length === 0 ? (
        <p>You haven't rated any schools yet.</p>
      ) : (
        <ul className="ratings-list">
          {ratings.map((rating) => (
            <li key={rating.id} className="rating-item">
              <span className="school-name">{rating.schoolName}: </span>
              <span className="rating-value">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={index < rating.value ? 'star filled' : 'star'}
                  >
                    ★
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserRatings;
