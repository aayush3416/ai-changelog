# AI-Powered Changelog Generator

## Overview
This project provides an efficient solution for developers to generate and maintain changelogs using AI technology. By analyzing git commits, it automatically generates user-friendly changelog entries and provides a clean public interface for end-users.

## Features

- **AI-powered changelog generation**
- **Automatic commit fetching from GitHub repositories**
- **Real-time changelog generation**
- **Smart categorization of changes**
- **Clean, responsive public changelog view**
- **Search and filter capabilities**
- **Version management system**

## Tech Stack

- **Frontend:** React.js, React Router, Axios
- **Backend:** Flask, Python
- **AI Integration:** OpenAI GPT-3.5
- **Version Control:** GitHub API

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Python 3.8+
- Node.js 14+
- OpenAI API key
- GitHub Personal Access Token

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/changelog-generator.git
   cd changelog-generator
   ```
2. Set up environment variables:
   ```sh
   export OPENAI_API_KEY=your_key
   export GITHUB_TOKEN=your_token
   ```
3. Start the backend:
   ```sh
   cd backend
   flask run
   ```
4. Start the frontend:
   ```sh
   cd frontend
   npm install
   npm start
   ```

## Usage

1. Enter a GitHub repository name (format: `owner/repo`).
2. Specify the number of days to fetch commits for.
3. Click "Fetch Commits" to retrieve recent commits.
4. Generate changelog using AI.
5. Review and edit the generated changelog if needed.
6. Add a version number and save.
7. View the public changelog page.
