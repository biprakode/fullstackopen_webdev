require('dotenv').config()
const express = require('express')
const path = require('path')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(express.static('dist'))


app.get('/api/persons' , (req , res) => {
    Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
  .catch(error => next(error))
})

app.post('/api/persons' , async (req , res) => {
    const body = req.body
    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'name or number missing' })
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    })
    person.save().then(savedPerson => {
      res.json(savedPerson)
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id).then(
    result => {
      res.status(204).end()
  }).catch(error => next(error))
})


const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


