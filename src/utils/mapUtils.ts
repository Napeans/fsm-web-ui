export const extractLatLng = (text: string) => {
  if (!text?.trim()) {
    return null;
  }

  const value = decodeURIComponent(text.trim());

  // https://www.google.com/maps/@12.34,56.78,17z
  const atMatch = value.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (atMatch) {
    return { latitude: Number(atMatch[1]), longitude: Number(atMatch[2]) };
  }

  // Embed and place URLs often include !3dLAT!4dLNG
  const bangMatch = value.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  if (bangMatch) {
    return { latitude: Number(bangMatch[1]), longitude: Number(bangMatch[2]) };
  }

  // Query patterns: q=lat,lng / ll=lat,lng / center=lat,lng / destination=lat,lng / query=lat,lng
  const pairMatch = value.match(
    /(?:[?&](?:q|ll|center|query|destination)=)(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/i
  );
  if (pairMatch) {
    return { latitude: Number(pairMatch[1]), longitude: Number(pairMatch[2]) };
  }

  return null;
};
