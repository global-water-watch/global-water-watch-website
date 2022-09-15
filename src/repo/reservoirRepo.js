import { capitalize } from '@/lib/primitive-helpers'

const formatTimeSeries = (timeSeries) => {
  const timeSeriesData = timeSeries.reduce((accObj, { t, value }) => {
    const xAxisData = accObj.xAxisData || []
    const seriesData = accObj.seriesData || []
    return {
      xAxisData: [
        ...xAxisData,
        t,
      ],
      seriesData: [...seriesData, value],
    }
  }, {})

  const valueName = timeSeries[0]?.name
    ?.split('_')
    .map(capitalize)
    .join(' ')

  const valueUnit = timeSeries[0]?.unit

  return {
    xAxis: [{
      data: timeSeriesData.xAxisData,
    }],
    yAxis: [
      {
        name: `${valueName} (${valueUnit})`,
        type: 'value',
      },
    ],
    series: [{
      name: valueName,
      type: 'line',
      data: timeSeriesData.seriesData,
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
