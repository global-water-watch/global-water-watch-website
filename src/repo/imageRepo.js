export default function (axios) {
  return {
    getSatelliteImage: (geometry, extraBuffer = 0) => axios
      .post(`images/satellite/t?extra_buffer=${extraBuffer}`, geometry)
      .then(({ data }) => data)
      .catch(() => { return { error: 'Failed generating satellite image for reservoir' } }),
  }
}
