import reservoirRepo from '~/repo/reservoirRepo'
import imageRepo from '~/repo/imageRepo'

/**
 * Create repository function that passes axios from nuxt/axios
 * @param axios
 * @returns {{reservoir: (*|{getById(*): *, getTimeSeriesMonthly(): {yAxis: [{name: string, type: string}], xAxis: [{data: *}], series: [{data: *, name: string, type: string}]}, getTimeSeries(): {yAxis: [{name: string, type: string}], xAxis: [{data: *}], series: [{data: *, name: string, type: string}]}})}}
 */
export default function createRepo (axios) {
  return {
    reservoir: reservoirRepo(axios),
    image: imageRepo(axios),
  }
}
