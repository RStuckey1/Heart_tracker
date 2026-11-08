import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../CSS/Landing.css';

const Landing = () => {
  const { isLoggedIn, User } = useAuth();

  return (
    <div className="landing">
      {isLoggedIn ? (
        <section className="welcome-panel">
          <div className="welcome-copy">
            <p className="eyebrow">Your health, in one place</p>
            <h1 className="page-title">Welcome back{User?.username ? `, ${User.username}` : ''}.</h1>
            <p className="page-description">
              Keep your daily readings organized and ready to share with your care team.
            </p>
            <div className="welcome-actions">
              <Link className="button" to="/NewHeartData">Add a reading</Link>
              <Link className="button button-secondary" to="/DisplayRecords">View my readings</Link>
            </div>
          </div>
          <div className="welcome-art" aria-hidden="true">
            <div className="pulse-icon">♥</div>
            <div className="pulse-line" />
            <span>Small steps. Better insight.</span>
          </div>
        </section>
      ) : (
        <section className="hero-panel">
          <div className="hero-copy">
            <p className="eyebrow">A clearer picture, day by day</p>
            <h1>Make tracking your heart health feel simpler.</h1>
            <p className="hero-description">
              Keep blood pressure, pulse, and weight readings together in a private,
              easy-to-use journal you can review over time.
            </p>
            <div className="hero-actions">
              <Link className="button" to="/signup">Create your account</Link>
              <Link className="button button-secondary" to="/login">Log in</Link>
            </div>
            <p className="hero-note">Designed to make everyday tracking easier—not replace medical advice.</p>
          </div>
          <div className="hero-visual" aria-label="Illustration of a heart-health reading">
            <div className="reading-card">
              <div className="reading-card-heading">
                <span className="reading-icon" aria-hidden="true">♥</span>
                <div>
                  <strong>Your health journal</strong>
                  <span>A simple view of your readings</span>
                </div>
              </div>
              <div className="reading-stat">
                <span>Blood pressure</span>
                <strong>— / — <small>mmHg</small></strong>
              </div>
              <div className="reading-stat">
                <span>Pulse</span>
                <strong>— <small>bpm</small></strong>
              </div>
              <div className="reading-footer">
                <span className="status-dot" />
                Your records, organized over time
              </div>
            </div>
            <div className="visual-decoration visual-decoration-one" />
            <div className="visual-decoration visual-decoration-two" />
          </div>
        </section>
      )}
      {!isLoggedIn && (
        <section className="landing-features" aria-label="How Heart Tracker helps">
          <article>
            <span className="feature-number">01</span>
            <h2>Record</h2>
            <p>Add everyday readings with a clear, straightforward form.</p>
          </article>
          <article>
            <span className="feature-number">02</span>
            <h2>Review</h2>
            <p>Find your history in one readable place whenever you need it.</p>
          </article>
          <article>
            <span className="feature-number">03</span>
            <h2>Share</h2>
            <p>Use your records as a helpful reference in conversations with your clinician.</p>
          </article>
        </section>
      )}
    </div>
  );
};

export default Landing;
