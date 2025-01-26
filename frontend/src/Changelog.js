import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Changelog() {
  const [changelogs, setChangelogs] = useState([]);

  useEffect(() => {
    fetchChangelogs();
  }, []);

  const fetchChangelogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/changelogs');
      setChangelogs(response.data);
    } catch (error) {
      console.error('Error fetching changelogs:', error);
    }
  };

  return (
    <div className="Changelog">
      <h1>Changelog</h1>
      {changelogs.map((log, index) => (
        <div key={index}>
          <h2>{log.version}</h2>
          <pre>{log.content}</pre>
        </div>
      ))}
    </div>
  );
}

export default Changelog;
