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

    let {order,} = req.body

    let dataToSave = {
        PartitionKey: {'_':'hometasks'},
        RowKey: {'_': '1'},
        description: {'_':'Wash the dishes'},
        dueDate: {'_':new Date(2015, 6, 20)}
    }

    tableSvc.insertEntity('orders',dataToSave, function (error, result, response) {
        if(!error){
          res.sendStatus(200)
        }
        else
            res.json(error)
    });
    
})

app.listen(process.env.PORT, console.log(`App running on ${process.env.PORT}`))