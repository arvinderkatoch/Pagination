import { useEffect, useState } from 'react';
import TourCard from '../components/TourCard';
import { getTours } from '../services/toursApi';

function OverviewPage() {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTours() {
            try {
                const data = await getTours();
                setTours(data);
            } catch (error) {
                console.error('Failed to load tours', error);
            } finally {
                setLoading(false);
            }
        }

        loadTours();
    }, []);

    return (
        <section>
            <h1>Overview</h1>
            <p>Placeholder page. Replace with your migrated overview UI.</p>

            {loading ? (
                <p>Loading tours...</p>
            ) : (
                <div className="grid">
                    {tours.map((tour) => (
                        <>
                            <TourCard key={tour.id || tour._id || tour.slug} tour={tour} />

                        </>

                    ))}

                </div>

            )}
        </section>

    );
}

export default OverviewPage;