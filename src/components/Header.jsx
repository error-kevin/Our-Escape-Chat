import './Header.css';

function Header({ user, onLogin, onLogout, onProfile }) {
  const initials = user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'E';
  return (
    <header className="site-header">
      <div className="logo">Our Escape Chat</div>
      <div className="header-actions">
        {user ? (
          <>
            <button className="user-chip" onClick={onProfile}>
              <div
                className={`user-avatar ${user.photoURL ? 'with-photo' : ''}`}
                style={user.photoURL ? { backgroundImage: `url(${user.photoURL})` } : undefined}
              >
                {!user.photoURL && initials}
              </div>
              <span className="user-name">{user.displayName || 'Anonymous'}</span>
            </button>
            <button className="ghost-button" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <button className="primary-button" onClick={onLogin}>Login</button>
        )}
      </div>
    </header>
  );
}

export default Header;

