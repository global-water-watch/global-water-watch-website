import qs from 'qs'
import { capitalize } from '@/lib/primitive-helpers'

const formatTimeSeries = (id, timeSeries) => {
  const valueName = `${timeSeries[0]?.name?.split('_').map(capitalize).join(' ')} (#${id})`

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

const formatMultipleTimeSeries = (response) => {
  const data = response.request ? response.data : response
  if (!data) { return null }

  const series = []

  const valueName = data?.variable_name
    ?.split('_')
    .map(capitalize)
    .join(' ')

  // TODO: make sure this km2 comes from the backend again as an unit
  // const valueUnit = timeSeries[0]?.unit
  const valueUnit = 'km2'

  if (data?.data?.length > 0) {
    series.push({
      name: 'Sum',
      type: 'line',
      areaStyle: {},
      data: data?.data?.map(({ t, value: valueInM2 }) => {
        const value = (valueInM2 / 1000000).toFixed(2)
        return [t, value]
      }),
    })
  }

  if (data.source_data) {
    Object.keys(data.source_data).forEach((key) => {
      series.push({
        name: `${valueName} (#${key})`,
        type: 'line',
        data: data.source_data[key].map(({ t, value: valueInM2 }) => {
          const value = (valueInM2 / 1000000).toFixed(2)
          return [t, value]
        }),
      })
    })
  }

  return {
    xAxis: [{
      type: 'time',
      axisPointer: {
        label: {
          show: true,
        },
        handle: {
          show: true,
        },
      },
    }],
    yAxis: [
      {
        name: `${valueName} (${valueUnit})`,
        type: 'value',
      },
    ],
    series,
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
        .then(timeSeries => formatTimeSeries(id, timeSeries)),

    getByGeometry: geometry =>
      axios.post('reservoir/geometry_fc', geometry).then(({ data }) => data),

    getTimeSeriesByGeometry: (geometry, variableName, period) =>
      axios.post(`reservoir/geometry/ts/${variableName}?agg_period=${period}`, geometry).then(formatMultipleTimeSeries),

    getByIds: ids => axios.$get(`reservoir?${qs.stringify({ ids, limit: ids.length }, { indices: false })}`),

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
