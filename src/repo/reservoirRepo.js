import qs from 'qs'
import { capitalize } from '@/lib/primitive-helpers'

export default function (axios) {
  return {
    // Get reservoir by id (fid)
    getById: id => axios.$get(`reservoir/${id}`),

    // Get only the service water area (raw data)
    getTimeSeriesById: id =>
      axios
        .$get(`reservoir/${id}/ts/surface_water_area`)
        .then(timeSeries => formatTimeSeries(id, timeSeries)),

    getByGeometry: geometry =>
      axios.post('reservoir/geometry', geometry).then(({ data }) => data),

    getTimeSeriesByGeometry: (geometry, variableName, period) =>
      axios.post(`reservoir/geometry/ts/${variableName}?agg_period=${period}`, geometry).then(formatMultipleTimeSeries),

    getByIds: ids => axios.$get(`reservoir/?${qs.stringify({ ids, limit: ids.length }, { indices: false })}`),

    getTimeSeriesByIds: (ids, variableName, period) => {
      return axios
        .$get(`ts/?${qs.stringify({
          reservoir_ids: ids,
          variable_name: variableName,
          agg_period: period,
        }, { indices: false })}`)
        .then(formatMultipleTimeSeries)
    },
  }
}

// TODO: make sure this km2 comes from the backend again as an unit
// const valueUnit = timeSeries[0]?.unit
const valueUnit = 'km2'

const timeSeriesAxis = (yAxisName) => {
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
        name: `${yAxisName} (${valueUnit})`,
        type: 'value',
      },
    ],
  }
}

const parseTimeSeriesData = (data) => {
  return (data || []).map(({ t, value: valueInM2 }) => {
    const value = (valueInM2 / 1000000).toFixed(2)
    return [t, value]
  })
}

const formatTimeSeries = (id, timeSeries) => {
  const valueName = `${timeSeries[0]?.name?.split('_').map(capitalize).join(' ')} (#${id})`

  const data = parseTimeSeriesData(timeSeries)

  return {
    ...timeSeriesAxis(valueName),
    series: [
      {
        name: valueName,
        type: 'line',
        data,
      },
    ],
  }
}

const formatMultipleTimeSeries = (response) => {
  const data = response.request ? response.data : response
  if (!data) { return null }

  const series = []

  const valueName = data?.variable_name
    ?.split('_')
    .map(capitalize)
    .join(' ')

  if (data?.data?.length > 0) {
    series.push({
      name: 'Sum',
      type: 'line',
      areaStyle: {},
      data: parseTimeSeriesData(data?.data),
    })
  }

  if (data.source_data) {
    Object.keys(data.source_data).forEach((key) => {
      series.push({
        name: `${valueName} (#${key})`,
        type: 'line',
        data: parseTimeSeriesData(data.source_data[key]),
      })
    })
  }

  return {
    ...timeSeriesAxis(valueName),
    series,
  }
}
