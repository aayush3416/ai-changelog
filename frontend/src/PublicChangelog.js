import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChangelogGenerator.css';

function PublicChangelog() {
  const [changelogs, setChangelogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchChangelogs();
  }, [sortOrder]);

  const fetchChangelogs = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/changelogs?order=${sortOrder}`);
      setChangelogs(response.data);
    } catch (error) {
      setError('Error fetching changelogs');
    } finally {
      setLoading(false);
    }
  };

  const filteredChangelogs = changelogs.filter(log =>
    log.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.version.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="changelog-container">
      <div className="header">
        <h1>Changelog</h1>
        <p>Latest updates and improvements</p>
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="Search changelogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="sort-select"
        >
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading changelogs...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="changelog-list">
          {filteredChangelogs.map((log) => (
            <div key={log.id} className="changelog-item">
              <div className="changelog-header">
                <h2 className="version">Version {log.version}</h2>
                <span className="date">
                  {new Date(log.date).toLocaleDateString()}
                </span>
              </div>
              <pre className="changelog-content">{log.content}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PublicChangelog;
