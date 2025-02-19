const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const {MongoClient} = require('mongodb')
const client = new MongoClient(process.env.MongoClient)

app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users',(req,res)=>{
  const user = 
  res.json({
    username: "user",
    _id: "id"
  })
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
