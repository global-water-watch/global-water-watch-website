/**
 * app header & footer are implemented as modular content (array) for editor experience
 * but the app object should only have a single header & footer, so transforming it
 */
export const transformAppData = appData => ({
  header: appData.header[0],
  footer: appData.footer[0],
  cookies: {
    acceptLabel: appData.cookiesAcceptLabel,
    infoLabel: appData.cookiesInfoLabel,
    infoUrl: appData.cookiesInfoUrl,
  },
})
