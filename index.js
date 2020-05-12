require('dotenv').config()
var express = require('express')
var axios = require('axios')
var azure = require('azure-storage');
var app = express()

app.use(express.json())
var tableSvc = azure.createTableService('swforders', process.env.KEY);

app.get('/', (req,res)=>{
    res.sendStatus(200)
})

app.post('/orders', async (req,res)=>{
    let webhookData = req.body;

    tableSvc.insertEntity('orders',webhookData, function (error, result, response) {
        if(!error){
          res.sendStatus(200)
        }
        else
            res.json(error)
    });
    
})

app.listen(process.env.PORT, console.log(`App running on ${process.env.PORT}`))