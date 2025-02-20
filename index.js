const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const {Schema} = mongoose;

mongoose.connect(process.env.MONGO_URI)

const UserSchema = new Schema({
  username: String,
})

const ExerciseSchema = new Schema ({
  username: String,
  description: String,
  duration: Number,
  date: String
})

const LogSchema = new Schema ({
  username: String,
  count: Number,
  _id: String,
  log: []
})

const Exercise = mongoose.model("Exercise",ExerciseSchema)
const User = mongoose.model("User", UserSchema)

app.use(cors())
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', async (req,res)=>{
  const user = req.body.username;
  const userObj = new User({
    username: user
  })
  try{
  const add_user = await userObj.save()
  res.json(userObj)
  }
  catch(err){
  console.log(err)
  }
  
})

app.get('/api/users', async(req,res)=>{
  const userList = await User.find()
  res.json(userList)
})

app.post('/api/users/:_id/exercises', async(req,res)=>{
  const id = req.params._id
  const desc = req.body.description
  const duration = req.body.duration
  try{
  const user = await User.findById(id,"username")
  let date = req.body.date
  
  if(!desc){res.json({error: "no description added"})}
  else if(!duration){res.json({error: "no duration added"})}
  else{
  const exObj = new Exercise({
    username: user.username,
    description: desc,
    duration: parseInt(duration),
    date: (date ? new Date(date) : new Date()).toDateString()
  })
  const add_ex = await exObj.save()
   res.json(exObj)
}
  }catch(err){
  console.log(err)
  res.json({error: "invalid id"})
  }
})

app.get('/api/users/:_id/logs', async(req,res)=>{
  try{
    const id = req.params._id
    const user = await User.findById(id)
    const {from,to,limit} = req.query
    const dateObj = {}
    if(from){
      dateObj["$gte"] = new Date(from)
    }
    if(to){
      dateObj["$lte"] = new Date(to)
    }
    let filter = {
      username: user.username}
    if(from || to){
        filter.date= dateObj
      }
      console.log(dateObj)
    const logs = await Exercise.find(filter).limit(limit)
    const logObj = {
      username: user.username,
      count: logs.length,
      log: logs
    }
    res.json(logObj)
  }catch(err){
    res.json({error: err})}
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
