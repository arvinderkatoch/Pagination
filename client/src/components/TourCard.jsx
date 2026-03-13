import { Link } from 'react-router-dom';

function TourCard({ tour }) {

  return (
    <article className="card">
      <img
        key={tour.slug}

src={`https://arvindercode.in/img/tours/${tour.imageCover}`}
 style={{ maxWidth: '420px', width: '100%', borderRadius: '8px' }}
      />
      <h3>{tour.name}</h3>
      <p>{tour.summary}</p>
      <Link to={`/tour/${tour.slug}`}>View full tour details</Link>
    </article>
  );
}

export default TourCard;
