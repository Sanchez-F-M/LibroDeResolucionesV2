import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import routes from './src/routes/routes.js'

const app = express()

app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const PORT = 3000

app.use('/api', routes)

app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`)
  console.log('Defined routes:')
  console.log(`[GET] http://localhost:${PORT}`)
})
