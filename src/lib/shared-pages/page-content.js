export const getPageContent = ({ areaType }) => {
  switch (areaType) {
    case 'boundary':
      return {
        title: 'Boundary',
        description: 'Boundary description',
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
    default:
      return {
        title: `Unknown ${areaType}`,
        description: `Unknown ${areaType} description`,
      }
  }
}
