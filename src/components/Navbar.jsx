import { Link, NavLink } from 'react-router-dom';
import { useChatbot } from './ChatbotContext';

function Navbar({ isLoggedIn, onLogout }) {
  const { open } = useChatbot();

  return (
    <header className="site-header">
      <nav className="nav container" aria-label="Main navigation">
        <Link className="brand" to="/">Anatomy Visualizer</Link>
        <div className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/anatomy">Anatomy</NavLink>
          <NavLink to="/about">About</NavLink>
          <button className="link-button ai-tutor-link" onClick={open}>
            🤖 AI Tutor
          </button>
          {isLoggedIn && <button className="link-button" onClick={onLogout}>Log out</button>}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;