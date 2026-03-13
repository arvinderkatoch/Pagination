import { useEffect, useRef } from 'react';

function TourMap({ locations }) {
    const mapRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current || !locations?.length) return;

        const L = window.L;
        if (!L) return;

        const map = L.map(mapRef.current, { zoomControl: false });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap',
        }).addTo(map);

        const bounds = [];

        locations.forEach((loc) => {
            const [lng, lat] = loc.coordinates;
            bounds.push([lat, lng]);

            L.marker([lat, lng])
                .addTo(map)
                .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, { autoClose: false })
                .openPopup();
        });

        map.fitBounds(bounds, { padding: [100, 100] });
        map.scrollWheelZoom.disable();

        return () => map.remove();

    }, [locations]);

    return (
        <section className="section-map">
            <div ref={mapRef} id="map" style={{ height: '65rem' }} />
        </section>
    );
}

export default TourMap;