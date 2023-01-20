//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//

window.GOVUKPrototypeKit.documentReady(() => {
  window.GOVUKFrontend.initAll()
  if (window.console && window.console.info) {
    window.console.info('GOV.UK Prototype Kit - do not use for production')
  }
})
