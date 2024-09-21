const [isEditing, setIsEditing] = useState(false);
const [name, setName] = useState(user.name);
const [email, setEmail] = useState(user.email);

const handleEdit = () => {
  setIsEditing(true);
};

const handleSave = async () => {
  try {
    const response = await fetch('/api/users/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });

    if (response.ok) {
      setIsEditing(false);
      // Update user context or refetch user data
    } else {
      console.error('Failed to update profile');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
  }
};

return (
  <div className="profile-info">
    {isEditing ? (
      <>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSave}>Save</button>
      </>
    ) : (
      <>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <button onClick={handleEdit}>Edit</button>
      </>
    )}
  </div>
);
