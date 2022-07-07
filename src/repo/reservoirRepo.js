import timeSeriesArea from './DUMMY_DATA/time_series_area.json'
import timeSeriesAreaMonthly from './DUMMY_DATA/time_series_area_monthly.json'

const formatTimeSeries = (timeSeries) => {
  const timeSeriesData = timeSeries.reduce((accObj, { time, area }) => {
    const xAxisData = accObj.xAxisData || []
    const seriesData = accObj.seriesData || []
    return {
      xAxisData: [...xAxisData, time.replace(' ', '\n')],
      seriesData: [...seriesData, Math.round(area)],
    }
  }, {})

  return {
    xAxis: [{
      data: timeSeriesData.xAxisData,
    }],
    yAxis: [
      {
        name: 'Area [m^2]',
        type: 'value',
      },
    ],
    series: [{
      name: 'Area',
      type: 'line',
      data: timeSeriesData.seriesData,
    }],
  }
}

export default function (axios) {
  return {
    // Get timeseries
    getTimeSeries: () => formatTimeSeries(timeSeriesArea),

    // Get monthly timeseries
    getTimeSeriesMonthly: () => formatTimeSeries(timeSeriesAreaMonthly),

    // Get reservoir by id (fid)
    getReservoirById: id => axios.$get(`reservoir/${id}`),

    getByGeometry: geometry => axios
      .post('reservoir/geometry', geometry)
      .then(({ data }) => data),
  }
}
