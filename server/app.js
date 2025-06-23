import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
const port = process.env.PORT || 8000

app.get('/', (req, res) => {
    res.send('hello')
})
app.listen(port, ()=>{
    console.log('app is running on port ', port);
    
})