export default function (axios) {
  return {
    getSatelliteImage: geometry => axios
      .post('images/satellite/t', geometry)
      .then(({ data }) => data)
      .catch((error) => {
        console.error(error)
      }),
  }
}
