const Router = require('koa-router')
const jsonBody = require('koa-json-body')()
const fs = require('fs')
const co = require('co')

// database conection
const Datastore = require('nedb')

var db = {} 
db.team = new Datastore({ filename: 'store/team'})
for (let key in db)
   db[key].loadDatabase()

// api route
var api = new Router({
  prefix: '/api'
})

api.get('/team/:id', function * () {
   console.log(`getting team ${this.params.id}`)

   yield new Promise( (resolve, reject) => {
      db.team.findOne({ _id: this.params.id }, (err, doc) => {
         if (err != null) {
            this.status = 500
            this.body = `Error searching team\n ${error}`
         }
         if (doc === null) {
            this.status = 404
            this.body = 'team not found'
         }
         else {
            console.log(`team found ${this.params.id}`)
            this.status = 200
            this.body = doc
         }
         resolve()
      })
   })

})

api.post('/team/save', jsonBody, function *() {
   console.log(`saving team ${JSON.stringify(this.request.body)}`)
   if (this.request.body != '')
      yield new Promise((resolve, reject) => {
         db.team.insert(this.request.body, (err, newDoc) => {
            if (err != null) {
               this.status = 500
               this.body = `Error inserting team\n ${error}`
            }
            else {
               this.status = 200
               this.body = newDoc._id
            }
            resolve()
         })
      })
   else {
      this.status = 400
      this.body = 'no team data'
   }
})

module.exports = api

