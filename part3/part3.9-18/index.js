require('dotenv').config()
const express = require('express')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(express.static('dist'))

app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
      `)
    })
    .catch(error => next(error))
})

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

app.post('/api/persons' , async (req , res , next) => {
    const body = req.body
    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'name or number missing' })
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    })
    person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
  .catch(error => next(error))
})

app.put('/api/persons/:id' , (req , res , next) => {
  const body = req.body
    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'name or number missing' })
    }
    
  Person.findById(req.params.id).then(person => {
    if(!person){
      return res.status(404).end()
    }
    person.name = body.name
    person.number = body.number

    return person.save().then((
      savedPerson => {
        res.json(savedPerson)
      }
    ))
  }).catch(error => next(error))

})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id).then(
    result => {
      res.status(204).end()
  }).catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({error : error.message})
  }
  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


