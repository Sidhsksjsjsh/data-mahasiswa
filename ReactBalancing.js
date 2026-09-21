const client = new Apinator({
  cluster: 'us',
  appId: '6d0f5089-b726-424d-a40f-de94928b3f72',
  key: 'app_a3bb62f84efd241f687d00cf7a851a38b152a355',
  secret: '56765c6b06d18969abe5d6a6ec70b79894910cf19d9b885f69433cd803f83d1d'
  //authEndpoint: '/api/realtime/auth'
})

client.connect()

// Public channel
const alerts = client.subscribe('alerts')
alerts.bind('new-alert',(data) => {
  alert(data.text)
})
alert("success load all modules.")
