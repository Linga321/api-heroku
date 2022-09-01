import express from 'express'
import path from 'path'
import session from 'express-session'
import cors from 'cors'
import fileUpload from 'express-fileupload'

// import lusca from 'lusca' will be used later
import dotenv from 'dotenv'

import apiErrorHandler from './middlewares/apiErrorHandler'
import productRouter from './routers/productRoute'
import userRoute from './routers/userRoute'
import imageRoute from './routers/imageRoute'

import cartRouter from './routers/cartRoute'
import categoryRouter from './routers/categoryRoute'

import authRoute from './routers/authRoute'

dotenv.config({ path: '.env' })

const app = express()
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}
// Express configuration
app.set('port', process.env.PORT || 3000)

// Global middleware
app.use(express.json())

//middleware
app.use(cors(corsOptions))
app.use(
  fileUpload({
    createParentPath: true,
    limits: { fileSize: 50 * 1024 * 1024 },
    abortOnLimit: true,
  })
)
app.set('uploads', path.join(__dirname, 'uploads')) // set the folder name to
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.text())
app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'uploads')))

//config passport
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
)
// app.use(passport.initialize())
// app.use(passport.session())

// route
app.use('/products', productRouter)

app.use('/carts', cartRouter)
app.use('/category', categoryRouter)

//swagger api docs
app.use('/users', userRoute)
app.use('/images', imageRoute)
app.use('/auth', authRoute)

// Custom API error handler
app.use(apiErrorHandler)

export default app
