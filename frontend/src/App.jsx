import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [token, setToken] = useState(null);
  const [records, setRecords] = useState([]);

  const login = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const res = await axios.post('/api/login', { email, password });
    setToken(res.data.token);
  };

  const punch = async (tipo) => {
    await axios.post('/api/fichajes', { tipo }, { headers: { Authorization: `Bearer ${token}` } });
    loadRecords();
  };

  const loadRecords = async () => {
    const res = await axios.get('/api/fichajes/mis-registros', { headers: { Authorization: `Bearer ${token}` } });
    setRecords(res.data);
  };

  useEffect(() => {
    if (token) loadRecords();
  }, [token]);

  if (!token) {
    return (
      <form onSubmit={login}>
        <input name="email" placeholder="Email" />
        <input name="password" type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    );
  }

  return (
    <div>
      <button onClick={() => punch('ENTRADA')}>Entrada</button>
      <button onClick={() => punch('SALIDA')}>Salida</button>
      <ul>
        {records.map(r => (
          <li key={r.id}>{r.tipo} - {r.fecha} {r.horaEntrada || r.horaSalida}</li>
        ))}
      </ul>
    </div>
  );
}