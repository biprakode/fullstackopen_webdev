import { useState, useEffect } from 'react'
import axios from 'axios';
import serve from './server/serve.js'

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

const Display = ({ persons, search, handleDelete }) => {
    const filterednames = persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <ul style={{ padding: '0' }}>
            {filterednames.length > 0 ? (
                filterednames.map(person => (
                    <DisplayPerson 
                        key={person.id} 
                        person={person}
                        handleDelete={handleDelete}
                    />
                ))) : (
                <p style={{ color: '#888', fontStyle: 'italic' }}>No contacts match "{search}". </p>
            )}
        </ul>
    )
}

const DisplayPerson = ({ person, handleDelete }) => {
    return (
        <li
            style={{
                listStyleType: 'none',
                padding: '8px',
                borderBottom: '1px dotted #ccc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
            <div style={{ flexGrow: 1 }}>
                <span style={{ fontWeight: '500' }}>{person.name}</span> <span>{person.number}</span>
            </div>
            
            <button
                onClick={() => handleDelete(person.id, person.name)} 
                style={{
                    padding: '3px 8px',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    marginLeft: '10px'
                }}
            >
                Delete
            </button>
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
            serve.update(existingPerson.id, updatedPerson)
                    .then(returnedPerson => {
                        setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
                        showNotification(`Updated ${nameTrimmed}'s number.`, 'success')
                    }).catch(error => {
                        showNotification(`Error updating ${nameTrimmed}. Person may have already been removed from the server.`, 'error')
                        personsService.getAll().then(data => setPersons(data));
            })
        } else {
            const personObj = { name: nameTrimmed, number: numberTrimmed}
            serve.create(personObj)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson)) 
                    showNotification(`Added ${nameTrimmed}`, 'success')
                })
                .catch(error => {
                    showNotification(`Error adding ${nameTrimmed}. Check server connection.`, 'error')
                    console.error("Creation error:", error)
                })
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
    const [searchName, setSearchName] = useState('')
    const [notification, setNotification] = useState({ message: null, type: null })

    useEffect(() => {
        serve
            .getAll()
            .then(initialPersons => {
                console.log('promise fulfilled, setting initial persons')
                setPersons(initialPersons)
            })
            .catch(error => {
                console.error("Failed to fetch initial data:", error);
                showNotification("Failed to load data from server. Is the server running on port 3002?", 'error');
            })
    } , [])
    
    const handleDelete = (id, name) => {
        if (window.confirm(`Delete ${name}?`)) {
            serve.remove(id)
                .then(() => {
                    setPersons(persons.filter(p => p.id !== id))
                    showNotification(`Deleted ${name}`, 'success')
                })
                .catch(error => {
                    if (error.response && error.response.status === 404) {
                        showNotification(`${name} was already removed from server.`, 'error')
                        setPersons(persons.filter(p => p.id !== id))
                    } else {
                        showNotification(`Error deleting ${name}. Check server console.`, 'error')
                        console.error("Deletion error:", error)
                    }
                })
        }
    }

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
                    <Display persons={persons} search={searchName} handleDelete={handleDelete}/>
                </div>
            </div>
        </div>
    )
}

export default App