import qs from 'qs'
import { capitalize } from '@/lib/primitive-helpers'

const units = {
  m2: {
    conversionUnit: 'km2',
    conversionFactor: 1000000,
  },
  m3: {
    conversionUnit: 'km3',
    conversionFactor: 1000000000,
  },
}

const valueConversion = ({ t, value, unit }) => {
  if (units[unit]) {
    return [t, (value / units[unit].conversionFactor).toFixed(2)]
  } else {
    return [t, value]
  }
}

const unitConversion = (unit) => {
  return units[unit] ? units[unit].conversionUnit : unit
}

const timeSeriesAxis = (yAxisName, yAxisUnit) => {
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
        name: `${yAxisName} (${yAxisUnit})`,
        type: 'value',
        nameLocation: 'middle',
        nameGap: 50,
      },
    ],
  }
}

const formatTimeSeries = (id, timeSeries) => {
  if (timeSeries.length === 0) { return null }
  const valueName = timeSeries[0]?.name?.split('_').map(capitalize).join(' ')

  const valueUnit = unitConversion(timeSeries[0].unit)

  const data = timeSeries.map(valueConversion)

  return {
    ...timeSeriesAxis(valueName, valueUnit),
    series: [
      {
        name: `${valueName} (#${id})`,
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

  const valueUnit = unitConversion(data?.variable_unit)

  if (data?.data?.length > 0) {
    series.push({
      name: 'Sum',
      type: 'line',
      areaStyle: {},
      data: data?.data?.map(valueConversion),
    })
  }

  if (data.source_data) {
    Object.keys(data.source_data).forEach((key) => {
      series.push({
        name: `${valueName} (#${key})`,
        type: 'line',
        data: data.source_data[key].map(valueConversion),
      })
    })
  }

  return {
    ...timeSeriesAxis(valueName, valueUnit),
    series,
  }
}

export default function (axios) {
  return {
    // Get reservoir by id (fid)
    getById: id => axios.$get(`reservoir/${id}`),

    getTimeSeriesById: (id, variableName) =>
      axios
        .$get(`reservoir/${id}/ts/${variableName}`)
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
