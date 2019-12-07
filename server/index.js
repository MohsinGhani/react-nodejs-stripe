const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 8085

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))