export const getPageContent = ({ areaType }) => {
  switch (areaType) {
    case 'boundary':
      return {
        title: 'Boundary',
        description: 'Administrative Region',
      }
    case 'reservoirs':
      return {
        title: 'Reservoirs',
        description: 'Reservoirs description',
      }
    case 'basin':
      return {
        title: 'Basin',
        description: 'Basin description',
      }
    case 'custom-selection':
      return {
        title: 'Custom selection',
        description: 'Reservoirs within and intersecting with a customly drawn geometry',
      }
    default:
      return {
        title: `Unknown ${areaType}`,
        description: `Unknown ${areaType} description`,
      }
  }
}
