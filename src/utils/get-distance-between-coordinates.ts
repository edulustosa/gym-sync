interface Coordinate {
  latitude: number
  longitude: number
}

/*
 * The formula to this functions is on this website
 * https://www.movable-type.co.uk/scripts/latlong.html
 */
export function getDistanceBetweenCoordinates(
  from: Coordinate,
  to: Coordinate,
) {
  const R = 6371e3

  const φ1 = (from.latitude * Math.PI) / 180
  const φ2 = (to.latitude * Math.PI) / 180
  const Δφ = ((to.latitude - from.latitude) * Math.PI) / 180
  const Δλ = ((to.longitude - from.longitude) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const dist = R * c

  return dist
}
