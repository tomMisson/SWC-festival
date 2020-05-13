require('dotenv').config()
var express = require('express')
var axios = require('axios')
var azure = require('azure-storage');
var app = express()

app.use(express.json())
var tableSvc = azure.createTableService('swforders', process.env.KEY);

app.get('/', (req,res)=>{
    res.sendStatus(200);
})

app.post('/orders', async (req,res)=>{

    let data={
        PartitionKey : {'_':req.body.number},
        RowKey : {'_':req.body.number},
        content : {'_':JSON.stringify(req.body)}
    };

    tableSvc.insertEntity('ordersDump',data, function (error, result, response) {
        if(!error){
        }
    });
    
    data = req.body;

    let customer = data.shipping.first_name+ " " + data.shipping.last_name + " " + data.billing.email + " " + data.billing.phone 
    let shipping =  data.shipping.address_1+ ", " + data.shipping.address_2 + ", " + data.shipping.city + ", " + data.shipping.state + ", " + data.shipping.postcode
    let items = data.line_items 

    for(var i=0; i<items.length; i++)
    {
        let currentItem = items[i].name + " x" + items[i].quantity + " @  £"+ items[i].price + " = "+ items[i].total
        let dataToSave = {
            PartitionKey: {'_':data.number},
            RowKey: {'_':i+""},
            customerdetails: {'_': customer},
            shippingInfo: {'_':shipping},
            orderedItems: {'_':currentItem},
        }

        tableSvc.insertEntity('orders',dataToSave, function (error, result, response) {
            if(!error){
            }
            else
                res.json(error)
        });
    }
    res.sendStatus(200)
})

app.listen(process.env.PORT, console.log(`App running on ${process.env.PORT}`))