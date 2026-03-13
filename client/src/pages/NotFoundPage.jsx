import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section>
      <h1>404 - Page not found</h1>
      <p>This is a placeholder not-found screen.</p>
      <Link to="/">Go to overview</Link>
    </section>
  );
}

export default NotFoundPage;