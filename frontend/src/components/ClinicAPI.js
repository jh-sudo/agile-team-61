export const getClinics = async () => {
    const response = await fetch('https://singapore-clinics.p.rapidapi.com/clinics');
    if (!response.ok) {
      throw new Error('Failed to fetch clinics');
    }
    return await response.json();
  };