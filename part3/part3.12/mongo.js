const mongoose = require('mongoose')

async function main() {
    if(process.argv.length < 3) {
        console.log("Enter password");
        return;
    }
    const password = encodeURIComponent(process.argv[2])
    const url = `mongodb+srv://biprarshib:${password}@cluster0.d1urv1c.mongodb.net/Contacts?retryWrites=true&w=majority`

    await mongoose.connect(url , {family : 4})
    console.log("connected to mongodb");

    const personSchema = new mongoose.Schema({
            name: String,
            number: String,
            id: Number
        })
    const Person = mongoose.model('Person', personSchema)


    const persons = await Person.find({})
    const maxId = persons.length > 0 ? Math.max(...persons.map(p => p.id || 0)) : 0

    if(process.argv.length == 5) { // new note 
        const new_name = process.argv[3]
        const new_number = process.argv[4]

        const highestIdPerson = await Person.findOne().sort({ id: -1 })
        const nextId = highestIdPerson ? highestIdPerson.id + 1 : 1

        const person = new Person({
                name: new_name,
                number: new_number,
                id: nextId
            })
        await person.save()
        console.log(`Added ${new_name} number ${new_number} to phonebook`);

    } else {
        const persons = await Person.find({})
        console.log('phonebook:');
        persons.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        })
    }

    await mongoose.connection.close()
}

main()