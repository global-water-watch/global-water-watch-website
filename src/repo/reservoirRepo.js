const formatTimeSeries = (timeSeries) => {
  const timeSeriesData = timeSeries.reduce((accObj, { t, value }) => {
    const xAxisData = accObj.xAxisData || []
    const seriesData = accObj.seriesData || []
    return {
      xAxisData: [
        ...xAxisData,
        new Date(t).toLocaleDateString('en', { year: 'numeric', month: 'numeric', day: 'numeric' }),
      ],
      seriesData: [...seriesData, value],
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
    // Get reservoir by id (fid)
    getById: id => axios.$get(`reservoir/${id}`),

    getTimeSeriesById: id => axios.$get(`reservoir/${id}/ts`)
      .then(formatTimeSeries)
    ,
  }
}
