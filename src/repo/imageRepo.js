export default function (axios) {
  return {
    getSatelliteImage: geometry => axios
      .post('images/satellite/t', geometry)
      .then(({ data }) => data)
      .catch(() => { return { error: 'Failed generating satellite image for reservoir' } }),
  }
}
