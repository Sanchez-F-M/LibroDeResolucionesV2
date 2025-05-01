import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'

import routes from './src/routes/routes.js'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000

app.use('/api', routes)

app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`)
  console.log('Defined routes:')
  console.log(`[GET] http://localhost:${PORT}`)
})
