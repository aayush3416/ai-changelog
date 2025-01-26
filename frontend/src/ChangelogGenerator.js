import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ChangelogGenerator.css';

function ChangelogGenerator() {
  const [repoName, setRepoName] = useState('');
  const [days, setDays] = useState(7);
  const [commits, setCommits] = useState('');
  const [changelog, setChangelog] = useState('');
  const [version, setVersion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasChangelogs, setHasChangelogs] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkChangelogs();
  }, []);

  const checkChangelogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/changelogs');
      setHasChangelogs(response.data.length > 0);
    } catch (error) {
      setError('Error checking changelogs');
    }
  };

  const suggestVersion = () => {
    const date = new Date();
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  const fetchCommits = async () => {
    if (!repoName) {
      setError('Please enter a repository name');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/fetch-commits', {
        repo: repoName,
        days: days
      });
      const commitMessages = response.data.commits.map(commit =>
        `${commit.message} (${new Date(commit.date).toLocaleDateString()})`
      ).join('\n');
      setCommits(commitMessages);
    } catch (error) {
      setError(error.response?.data?.error || 'Error fetching commits');
    } finally {
      setIsLoading(false);
    }
  };

  const generateChangelog = async () => {
    if (!commits.trim()) {
      setError('Please fetch or enter commits first');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/generate-changelog',
        { commits: commits }
      );
      setChangelog(response.data.changelog);
    } catch (error) {
      setError(error.response?.data?.error || 'Error generating changelog');
    } finally {
      setIsLoading(false);
    }
  };

  const saveChangelog = async () => {
    if (!version.trim()) {
      setError('Please enter a version number');
      return;
    }
    if (!changelog.trim()) {
      setError('Please generate a changelog first');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await axios.post('http://localhost:5000/save-changelog', {
        version: version,
        content: changelog
      });
      alert('Changelog saved successfully!');
      setVersion('');
      setHasChangelogs(true);
    } catch (error) {
      setError(error.response?.data?.error || 'Error saving changelog');
    } finally {
      setIsLoading(false);
    }
  };

  const viewPublicChangelog = () => {
    window.location.href = 'http://localhost:3000/changelogs';
  };

  return (
    <div className="changelog-container">
      <div className="header">
        <h1>AI-Powered Changelog Generator</h1>
        <p>Generate meaningful changelogs from your Git commits</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="input-section">
        <div className="input-group">
          <input
            type="text"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
            placeholder="owner/repo (e.g., facebook/react)"
            className="text-input"
          />
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            placeholder="Number of days"
            className="number-input"
          />
          <button
            onClick={fetchCommits}
            className="button primary"
            disabled={isLoading}
          >
            {isLoading ? 'Fetching...' : 'Fetch Commits'}
          </button>
        </div>

        <div className="version-suggestion">
          <button
            onClick={() => setVersion(suggestVersion())}
            className="button secondary"
          >
            Suggest Version
          </button>
        </div>

        <div className="textarea-container">
          <textarea
            value={commits}
            onChange={(e) => setCommits(e.target.value)}
            placeholder="Fetched commits will appear here"
            className="commits-textarea"
          />
        </div>

        <button
          onClick={generateChangelog}
          className="button secondary"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Changelog'}
        </button>

        <div className="changelog-section">
          <h2>Generated Changelog:</h2>
          <pre className="changelog-preview">{changelog}</pre>
        </div>

        <div className="save-section">
          <input
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="Enter version (e.g., 1.0.0)"
            className="version-input"
          />
          <button
            onClick={saveChangelog}
            className="button primary"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changelog'}
          </button>
        </div>

        <div className="view-public-section">
          <button
            onClick={viewPublicChangelog}
            className="button secondary view-public-button"
            disabled={!hasChangelogs}
          >
            View Public Changelog
          </button>
          {!hasChangelogs && (
            <span className="helper-text">Save a changelog first to view public page</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChangelogGenerator;
