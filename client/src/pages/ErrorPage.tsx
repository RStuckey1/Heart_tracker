import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <section className="error-page card">
      <p className="eyebrow">Page not found</p>
      <h1 className="page-title">We couldn’t find that page.</h1>
      <p className="page-description">The address may have changed, or the page may no longer be available.</p>
      <Link className="button" to="/">Return to Heart Tracker</Link>
    </section>
  );
};

export default ErrorPage;
