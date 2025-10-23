import { useState, useEffect } from 'react'
import axios from 'axios';

// Component to handle in-app notifications/alerts (Added by Gemini)
const Notification = ({ message, type, clearMessage }) => {
    if (!message) return null;

    let style = {
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '5px',
        borderStyle: 'solid',
        borderWidth: '1px',
        color: '#333',
    };

    if (type === 'success') {
        style.backgroundColor = '#d4edda';
        style.borderColor = '#c3e6cb';
        style.color = '#155724';
    } else if (type === 'error') {
        style.backgroundColor = '#f8d7da';
        style.borderColor = '#f5c6cb';
        style.color = '#721c24';
    } else if (type === 'info') {
        style.backgroundColor = '#cce5ff';
        style.borderColor = '#b8daff';
        style.color = '#004085';
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            clearMessage();
        }, 3000);
        return () => clearTimeout(timer);
    }, [message, clearMessage]);

    return (
        <div style={style}>
            {message}
            <button
                onClick={clearMessage}
                style={{
                    marginLeft: '10px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    float: 'right',
                    fontWeight: 'bold',
                    color: style.color
                }}
            >
                X
            </button>
        </div>
    );
};

const Display = ({ persons, search }) => {
    const filterednames = persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <ul style={{ padding: '0' }}>
            {filterednames.length > 0 ? (
                filterednames.map(person => (
                    <DisplayPerson key={person.id} name={person.name} number={person.number} />))) : (<p style={{ color: '#888', fontStyle: 'italic' }}>No contacts match "{search}". </p>)}
        </ul>
    )
}

const DisplayPerson = ({ id, name, number }) => {
    return (
        <li
            style={{
                listStyleType: 'none',
                padding: '8px',
                borderBottom: '1px dotted #ccc',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
            <span style={{ fontWeight: '500' }}>{name}</span> <span>{number}</span>
        </li>
    )
}

const Filter = ({ searchName, searchNewName }) => {
    const handleSearchChange = (event) => {
        searchNewName(event.target.value)
    }
    return (
        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f0f4f8' }}>
            <h3 style={{ marginBottom: '10px', color: '#333' }}>Search</h3>
            <form>
                <label>Search:</label>
                <input
                    type="text"
                    value={searchName}
                    onChange={handleSearchChange}
                    style={{
                        marginLeft: '10px',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        width: 'calc(100% - 70px)'
                    }}
                />
            </form>
        </div>
    )
}

const Add = ({ persons, setPersons, showNotification }) => {
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')


    const addPerson = (event) => {
        event.preventDefault()
        const nameTrimmed = newName.trim()
        const numberTrimmed = newNumber.trim()
        if (!nameTrimmed || !numberTrimmed) {
            showNotification('Name and number cannot be empty.', 'error')
            return
        }
        const phoneRegex = /^(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/;
        if (!phoneRegex.test(numberTrimmed)) {
            showNotification(`"${numberTrimmed}" is not a valid phone number format.`, 'error')
            return
        }
        const existingPerson = persons.find(p => p.name.toLowerCase() === nameTrimmed.toLowerCase())
        if (existingPerson) {
            showNotification(`${nameTrimmed} is already in the phonebook. Number updated.`, 'info')
            const updatedPerson = { ...existingPerson, number: numberTrimmed }
            const updatedPersons = persons.map(p => p.id !== existingPerson.id ? p : updatedPerson)
            setPersons(updatedPersons)
        } else {
            const newId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) + 1 : 1
            const personObj = { name: nameTrimmed, number: numberTrimmed, id: newId }
            setPersons(persons.concat(personObj))
            showNotification(`Added ${nameTrimmed}`, 'success')
        }
        setNewName('')
        setNewNumber('')
    }

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }
    return (
        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <h3 style={{ color: '#333', marginBottom: '15px' }}>Add new Contact</h3>
            <form onSubmit={addPerson} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ width: '60px' }}>Name:</label>
                    <input
                        value={newName}
                        onChange={handleNameChange}
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', flexGrow: 1 }}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ width: '60px' }}>Number:</label>
                    <input
                        value={newNumber}
                        onChange={handleNumberChange}
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', flexGrow: 1 }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        padding: '10px 15px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        marginTop: '10px'
                    }}
                >
                    Add
                </button>
            </form>
        </div>
    )
}

const App = () => {
    const [persons, setPersons] = useState([])
    const BASE_URL = 'http://localhost:3001/persons'
    useEffect(() => {
        axios.get(BASE_URL).then(response => {
            console.log('promise fulfilled')
            setPersons(response.data)})
    } , [])
    console.log('render', persons.length, 'persons');
    const [searchName, setSearchName] = useState('')
    const [notification, setNotification] = useState({ message: null, type: null })

    const showNotification = (message, type) => {
        setNotification({ message, type })
    }

    const clearMessage = () => {
        setNotification({ message: null, type: null })
    }

    const appStyle = {
        maxWidth: '600px',
        margin: '30px auto',
        padding: '25px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#faebd7',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        borderRadius: '12px'
    };

    const numbersSectionStyle = {
        marginTop: '30px',
        borderTop: '2px solid #ddd',
        paddingTop: '20px'
    };

    return (
        <div style={{ backgroundColor: '#87ceeb', margin: '0', minHeight: '100vh' }}>
            <div style={appStyle}>
                <h1 style={{ color: '#2c3e50', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Phonebook</h1>
                <Notification {...notification} clearMessage={clearMessage} />

                <Filter searchName={searchName} searchNewName={setSearchName} />

                <Add persons={persons} setPersons={setPersons} showNotification={showNotification} />

                <div style={numbersSectionStyle}>
                    <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>Numbers</h2>
                    <Display persons={persons} search={searchName} />
                </div>
            </div>
        </div>
    )
}

export default App