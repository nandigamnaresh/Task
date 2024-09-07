import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  
  const [email, setEmail] = useState('');
  const [availability, setAvailability] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [newSlot, setNewSlot] = useState({ day: '', start: '', end: '' });

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSlot({ ...newSlot, [name]: value });
  };

  
  
  const addAvailability = () => {
    const { day, start, end } = newSlot;
    if (day && start && end) {
      setAvailability([
        ...availability,
        { day, slots: [{ start, end }] }
      ]);
      setNewSlot({ day: '', start: '', end: '' });
    }
  };



  const saveAvailability = () => {
    axios.post('/api/availability', { email, availability })
      .then(response => alert('Availability saved successfully!'))
      .catch(err => console.error(err));
  };

  

  const fetchSessions = () => {
    axios.get('/api/sessions')
      .then(response => setSessions(response.data))
      .catch(err => console.error(err));
  };

  


  React.useEffect(() => {
    fetchSessions();
  }, []);



  return (
    <div>
      <h1>User Availability</h1>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Enter email"
      />
      
      <h2>Add Availability Slot</h2>
      <input
        type="text"
        name="day"
        value={newSlot.day}
        onChange={handleChange}
        placeholder="Day (e.g., Monday)"
      />
      <input
        type="time"
        name="start"
        value={newSlot.start}
        onChange={handleChange}
        placeholder="Start Time"
        id='d'
      />
      <input
        type="time"
        name="end"
        value={newSlot.end}
        onChange={handleChange}
        placeholder="End Time"
        id='c'
      />
      <button onClick={addAvailability} id="a">Add Slot</button>
      <button onClick={saveAvailability} id='b'>Save Availability</button>

      <h2>Scheduled Sessions</h2>
      <ul>
        {sessions.map(session => (
          <li key={session._id}>
            {session.user} has a session from {new Date(session.start).toLocaleString()} to {new Date(session.end).toLocaleString()}.
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
