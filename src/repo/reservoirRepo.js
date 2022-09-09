import { capitalize } from '@/lib/primitive-helpers'

const formatTimeSeries = (timeSeries) => {
  const valueName = timeSeries[0]?.name
    ?.split('_')
    .map(capitalize)
    .join(' ')

  const valueUnit = timeSeries[0]?.unit

  const series = timeSeries.map(({ t, value }) => {
    return [t, value]
  })

  return {
    xAxis: [
      {
        data: series.t,
        type: 'time',
      },
    ],
    yAxis: [
      {
        name: `${valueName} (${valueUnit})`,
        type: 'value',
      },
    ],
    series: [{
      name: valueName,
      type: 'line',
      data: series,
    }],
  }
}

export default function (axios) {
  return {
    // Get reservoir by id (fid)
    getById: id => axios.$get(`reservoir/${id}`),

    getTimeSeriesById: id => axios.$get(`reservoir/${id}/ts`)
      .then(formatTimeSeries),

    getByGeometry: geometry => axios
      .post('reservoir/geometry', geometry)
      .then(({ data }) => data),
  }
}
