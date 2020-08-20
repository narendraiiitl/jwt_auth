const redis = require('redis')
const client = redis.createClient({
    port:6379,
    host:"127.0.0.1"
})

client.on('connect',()=>{
    console.log("client connected to redis")
})
client.on('ready',()=>{
    console.log("client redis is ready")
})
client.on('err',(err)=>{
    console.log(err.message)
})
client.on('end',()=>{
    console.log("Redis client disconnected")
})
process.on('SIGINT',()=>{
    client.quit()
})

module.exports = client
