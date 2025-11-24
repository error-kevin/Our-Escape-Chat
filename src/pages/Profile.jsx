import { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import './Profile.css';

function Profile({ user, onBack }) {
  const [photoURL, setPhotoURL] = useState(user.photoURL || '');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      await updateProfile(user, {
        photoURL: photoURL.trim() || null
      });
      setStatus('Profile photo updated');
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <button className="back-link" onClick={onBack}>← Back to chat</button>
      <div className="profile-card">
        <div className="profile-photo">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" />
          ) : (
            <div className="placeholder">{(user.displayName || 'E').charAt(0)}</div>
          )}
        </div>
        <div className="profile-info">
          <h2>{user.displayName || 'Anonymous user'}</h2>
          <p>{user.email}</p>
        </div>
        <form className="photo-form" onSubmit={handleSubmit}>
          <label>Update photo URL</label>
          <input
            type="url"
            value={photoURL}
            onChange={(event) => setPhotoURL(event.target.value)}
            placeholder="https://example.com/avatar.png"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </form>
        {status && <p className="status-text">{status}</p>}
      </div>
    </div>
  );
}

export default Profile;

