
export default async (request, context) => {
  console.log('Removing X-Frame-Options header for: ' + request.url)

  // Get the response
  const response = await context.next()

  // Loop over the headers of our response and remove the X-Frame-Options header
  response.headers.forEach((_, key, object) => {
    if (key === 'x-frame-options') {
      object.delete(key)
    }
  })

  console.log('New response headers:', response.headers)

  return response
}
