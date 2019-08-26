require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/persons')

app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})
app.use(
  morgan(
    ':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'
  )
)
let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4
  }
]

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})

app.get('/info', (req, res) => {
  const info = `<p>Phonebook has ${
    persons.length
  } persons</p><p>${new Date()}</p>`
  res.send(info)
})

app.get('/api/persons/:id', (res, response) => {
  Person.findById(request.params.id)
    .then(person => {
      response.json(person.toJSON())
    })
    .catch(error => response.status(400).send('error'))
})

// app.get('/api/persons/:id', (req, res) => {
//   const id = Number(req.params.id)
//   const person = persons.find(person => person.id === id)
//   if (person) return res.send(person)
//   res.status(204).send('error')
// })

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  console.log('persons before filter', persons)
  persons = persons.filter(person => person.id !== id)
  console.log('persons after filter', persons)
  res.status(204).end()
})

// const getID = (min, max) => {
//   min = Math.ceil(min)
//   max = Math.floor(max)
//   return Math.floor(Math.random() * (max - min)) + min
// }

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.number === undefined || body.name === undefined) {
    return response.status(400).json({ error: 'required filed missing' })
  }

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' })
  }
  if (persons.find(person => person.name === body.name)) {
    return res
      .status(400)
      .json({ error: 'name already exsists in the phonebook' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson.toJSON())
  })
})

// app.post('/api/persons', (req, res) => {
//   console.log('post starting')
//   const body = req.body

//   if (!body.name || !body.number) {
//     return res.status(400).json({ error: 'name or number missing' })
//   }
//   if (persons.find(person => person.name === body.name)) {
//     return res
//       .status(400)
//       .json({ error: 'name already exsists in the phonebook' })
//   }
//   const person = {
//     name: body.name,
//     number: body.number,
//     id: getID(0, 99999)
//   }
//   persons = persons.concat(person)
//   res.json(person)
// })

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`)
})
