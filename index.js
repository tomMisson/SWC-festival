require('dotenv').config()
var express = require('express')
var app = express()

app.get('/', (req,res)=>{
    res.sendStatus(200)
})

app.post('/orders', async (req,res)=>{
    console.log()
})

app.listen(process.env.PORT, console.log(`App running on ${process.env.PORT}`))