import './Auth.css';

function Auth({ onLogin }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p>Sign in to start chatting with the Escape community.</p>
        <button onClick={onLogin}>Continue with Google</button>
      </div>
    </div>
  );
}

export default Auth;

