export default ({ $config }) => {
  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${$config.gtmCode}`
  script.async = true
  document.getElementsByTagName('head')[0].appendChild(script)
  window.dataLayer = window.dataLayer || []

  function gtag () { window.dataLayer.push(arguments) }

  gtag('js', new Date())
  gtag('config', `${$config.gtmCode}`)
}
