const client = new Apinator({
  cluster: 'us',
  authEndpoint: '/api/realtime/auth'
})

client.connect()

// Public channel
const alerts = client.subscribe('alerts')
alerts.bind('new-alert',(data) => {
  alert(data.text)
})
