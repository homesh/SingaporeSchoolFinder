const { data: session, status } = useSession();
const [userProfile, setUserProfile] = useState(null);
const [isEditing, setIsEditing] = useState(false);

useEffect(() => {
  if (status === 'authenticated') {
    fetchUserProfile();
  }
}, [status]);

const fetchUserProfile = async () => {
  try {
    const response = await fetch('/api/users/profile');
    if (response.ok) {
      const data = await response.json();
      setUserProfile(data);
    } else {
      console.error('Failed to fetch user profile');
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
};

const handleEdit = () => {
  setIsEditing(true);
};

const handleSave = async (updatedProfile) => {
  try {
    const response = await fetch('/api/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProfile),
    });

    if (response.ok) {
      setUserProfile(updatedProfile);
      setIsEditing(false);
    } else {
      console.error('Failed to update user profile');
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
};

if (status === 'loading') {
  return <div>Loading...</div>;
}

if (status === 'unauthenticated') {
  return <div>Please sign in to view your profile</div>;
}

return (
  <div>
    <h1>User Profile</h1>
    {userProfile ? (
      <>
        <ProfileInfo
          profile={userProfile}
          isEditing={isEditing}
          onEdit={handleEdit}
          onSave={handleSave}
        />
        <UserRatings userId={userProfile.id} />
      </>
    ) : (
      <div>Loading profile...</div>
    )}
  </div>
);<ProfileImageUpload
  userId={userProfile?.id}
  currentImageUrl={userProfile?.profileImage}
  onImageUpload={(imageUrl) => {
    setUserProfile((prev) => ({ ...prev, profileImage: imageUrl }));
  }}
/>
