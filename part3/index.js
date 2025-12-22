const express = require('express')
const app = express()

app.use(express.json())

let contacts = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons' , (request , response) => {
    response.json(contacts)
})

app.get('/api/info' , (request , response) => {
    let info = `<h1>Phonebook has ${contacts.length} people</h1>
    <h2>${new Date()};</h2>`
    response.send(info)
})

app.get('/api/persons/:id' , (request , response) => {
    const id = request.params.id
    const person = contacts.find(n => n.id === id) 
    if (person) {
        response.json(person)
    } else {
        response.statusMessage = "Invalid Contact ID";
        response.status(404).end()
    }
})

app.delete('/api/persons/:id' , (request , response) => {
    try {
    const id = request.params.id
    const personExists = contacts.find(n => n.id === id);
    if (!personExists) {
        return response.status(404).json({ 
          error: `id ${id} is invalid or does not exist` 
        });
      }
    contacts = contacts.filter(contact => contact.id !== id);
    response.status(204).end();
  } catch (error) {
    console.log(error)
    response.status(500).json({error : 'Internal Server Error'})
  }
})

app.post('/api/persons' , (request , response) => {
    const body = request.body
    if(!body.name || !body.number) {
        return response.status(400).json({ 
        error: 'name or number is missing' 
    })
    }

    const duplicate = contacts.find(p => p.name === body.name)
    if (duplicate) {
        return response.status(400).json({ 
        error: 'name must be unique' 
        })
    }

    const person = {
        name : body.name,
        number : body.number,
        id : String(Math.floor(Math.random() * 10000))
    }
    contacts = contacts.concat(person)
    console.log(person);
    response.status(201).json(person)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})