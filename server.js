var express = require('express'),
  app = express(),
  path = require('path'),
  bodyParser = require('body-parser'),
  port = 3000

var setupRoutes = require(path.join(__dirname+'/public/routes.js'))

// parse types
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// setup routes
setupRoutes(app)

app.listen(port, () => console.log(`Server listening on port ${port}!`))