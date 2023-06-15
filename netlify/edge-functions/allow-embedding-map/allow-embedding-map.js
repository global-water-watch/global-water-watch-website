
export default async (request, context) => {
  // Get the response
  const response = await context.next()

  // Loop over the headers of our response and remove the X-Frame-Options header
  response.headers.forEach((_, key, object) => {
    if (key === 'X-Frame-Options') {
      object.delete(key)
    }
  })

  return response
}
