export const getTravelAdvisories = async () => {
  const response = await fetch('https://www.travel-advisory.info/api');
  if (!response.ok) {
    throw new Error('Failed to fetch travel advisories');
  }
  return await response.json();
};
