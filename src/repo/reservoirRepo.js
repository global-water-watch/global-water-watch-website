import { capitalize } from '@/lib/primitive-helpers'

const formatTimeSeries = (timeSeries) => {
  const valueName = timeSeries[0]?.name?.split('_').map(capitalize).join(' ')

  // TODO: make sure this km2 comes from the backend again as an unit
  // const valueUnit = timeSeries[0]?.unit
  const valueUnit = 'km2'

  const data = timeSeries.map(({ t, value: valueInM2 }) => {
    const value = (valueInM2 / 1000000).toFixed(2)
    return [t, value]
  })

  return {
    xAxis: [
      {
        type: 'time',
        axisPointer: {
          label: {
            show: true,
          },
          handle: {
            show: true,
          },
        },
      },
    ],
    yAxis: [
      {
        name: `${valueName} (${valueUnit})`,
        type: 'value',
      },
    ],
    series: [
      {
        name: valueName,
        type: 'line',
        data,
      },
    ],
  }
}

export default function (axios) {
  return {
    // Get reservoir by id (fid)
    getById: id => axios.$get(`reservoir/${id}`),

    // Get only the service water area (raw data)
    getTimeSeriesById: id =>
      axios
        .$get(`reservoir/${id}/ts/surface_water_area`)
        .then(formatTimeSeries),

    getByGeometry: geometry =>
      axios.post('reservoir/geometry', geometry).then(({ data }) => data),
  }
}
