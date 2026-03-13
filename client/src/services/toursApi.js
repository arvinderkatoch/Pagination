import apiClient from './apiClient';

export async function getTours() {
  const res = await apiClient.get('/tours');
  return res.data?.data?.data || [];
}

export async function getTourBySlug(slug) {
  const tours = await getTours();
  return tours.find((tour) => tour.slug === slug) || null;
}

