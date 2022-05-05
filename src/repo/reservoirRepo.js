import timeSeries from './DUMMY_DATA/time_series_area.json'

export default {
  getTimeSeries () {
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
  },
}
