import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTourBySlug } from '../services/toursApi';
import TourMap from './TourMap';
import { bookTour } from '../services/Stripe';
type Guide = { name?: string; photo?: string; role?: string };
type Review = { _id?: string; review?: string; rating?: number; user?: { name?: string; photo?: string } };
type Location = { _id?: string; day?: number; description?: string };

type Tour = {
    _id?: string;
    id?: string;
    name?: string;
    summary?: string;
    description?: string;
    imageCover?: string;
    image?: string[];
    duration?: number;
    difficulty?: string;
    maxGroupSize?: number;
    ratingsAverage?: number;
    price?: number;
    startDate?: string[];
    startLocation?: { description?: string };
    guides?: Guide[];
    review?: Review[];
    reviews?: Review[];
    locations?: Location[];
};

function TourPage({ user }: { user: any }) {
    const { slug = '' } = useParams();
    const [tour, setTour] = useState<Tour | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTour() {
            setLoading(true);
            try {
                const data = await getTourBySlug(slug);
                setTour(data);
            } catch (error) {
                console.error('Failed to load tour', error);
                setTour(null);
            } finally {
                setLoading(false);
            }
        }

        if (slug) loadTour();
    }, [slug]);

    if (loading) return <p>Loading tour details...</p>;
    if (!tour)
        return (
            <section>
                <h1>Tour not found</h1>
                <Link to="/">Back to overview</Link>
            </section>
        );

    const date = tour.startDate?.[0]
        ? new Date(tour.startDate[0]).toLocaleString('en-us', { month: 'long', year: 'numeric' })
        : '-';
    const reviews = tour.review || tour.reviews || [];
    const paragraphs = (tour.description || '').split('\n').filter(Boolean);

    return (
        <article className="card" style={{ marginBottom: '1rem' }}>
            <h2>{tour.name}</h2>
            <p>{tour.summary}</p>

            <div className="imageRow">
                {(tour.image ?? []).map((img, i) => (
                    <img
                        key={img}
                        src={`/img/tours/${img}`}
                        alt={`${tour.name} ${i + 1}`}
                        className="tourImage"
                    />
                ))}
            </div>
            <TourMap locations={tour.locations} />
            <ul>
                <li>
                    <strong>Duration:</strong> {tour.duration ?? '-'} days
                </li>
                <li>
                    <strong>Difficulty:</strong> {tour.difficulty ?? '-'}
                </li>
                <li>
                    <strong>Participants:</strong> {tour.maxGroupSize ?? '-'}
                </li>
                <li>
                    <strong>Rating:</strong> {tour.ratingsAverage ?? '-'} / 5
                </li>
                <li>
                    <strong>Price:</strong> {tour.price ?? '-'}
                </li>
                <li>
                    <strong>Next date:</strong> {date}
                </li>
                <li>
                    <strong>Start location:</strong> {tour.startLocation?.description || '-'}
                </li>
            </ul>

            <h3>About this tour</h3>
            {paragraphs.length ? paragraphs.map((p, i) => <p key={i}>{p}</p>) : <p>{tour.description}</p>}

            <h3>Guides</h3>
            <ul>
                {(tour.guides || []).map((guide, i) => (
                    <li key={`${guide.name}-${i}`}>
                        {guide.name} ({guide.role || 'guide'})
                    </li>
                ))}
            </ul>

            <h3>Locations</h3>
            <ul>
                {(tour.locations || []).map((loc, i) => (
                    <li key={loc._id || i}>Day {loc.day}: {loc.description}</li>
                ))}
            </ul>
            <div className="cta">
                <div className="cta__content">
                    <h2 className="heading-secondary">What are you waiting for?</h2>
                    <p className="cta__text">
                        {tour.duration} days. 1 adventure. Infinite memories. Make it yours today!
                    </p>
                    {user ? (
                        <button
                            className="btn btn--green span-all-rows"
                            onClick={() => bookTour(tour.id || tour._id)}
                        >
                            Book tour now!
                        </button>
                    ) : (
                        <a className="btn btn--green span-all-rows" href="/login">
                            Book tour now!
                        </a>
                    )}
                </div>
            </div>
            <h3>Reviews</h3>
            <ul>
                {reviews.map((r, i) => (
                    <li key={r._id || i}>
                        <strong>{r.user?.name || 'User'}:</strong> {r.review} ({r.rating}/5)
                    </li>
                ))}
            </ul>
        </article>
    );
}

export default TourPage;