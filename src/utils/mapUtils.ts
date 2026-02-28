export const extractLatLng = (text: string) => {
  const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const match = text.match(regex);

  if (match) {
    return {
      latitude: parseFloat(match[1]),
      longitude: parseFloat(match[2]),
    };
  }

  return null;
};