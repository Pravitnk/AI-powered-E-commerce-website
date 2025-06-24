import express from 'express'
import { login, logut, register } from '../controllers/auth.controller.js'

const authRoute = express.Router()

authRoute.post('/register', register)
authRoute.post('/login', login)
authRoute.get('/logout', logut)

export default authRoute