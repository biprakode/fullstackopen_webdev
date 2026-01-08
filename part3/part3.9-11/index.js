import path from 'path'
import express from 'express'

const app = express()
app.use(express.json())
app.use(express.static('dist'))

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": "1"
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": "3"
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": "4"
    },
    {
      "name": "Biprarshi",
      "number": "7895412055",
      "id": "5"
    },
    {
      "name": "Rasoshree",
      "number": "9875432123",
      "id": "6"
    }
]

app.get('/api/persons' , (req , res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const person = persons.find(person => person.id === req.params.id)
    person ? res.json(person) : res.status(404).end()
})

app.post('/api/persons' , (req , res) => {
    const body = req.body
    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'name or number missing' })
    }
    const person = {
        ...req.body,
        id:Date.now().toString()
    }
    persons = persons.concat(person)
    res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  persons = persons.filter(p => p.id !== req.params.id)
  res.status(204).end()
})


const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


