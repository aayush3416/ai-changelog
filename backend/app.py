from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import openai
import os
from github import Github
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

openai.api_key = os.getenv("OPENAI_API_KEY")
github_token = os.getenv("GITHUB_TOKEN")
g = Github(github_token)

changelogs = []


@app.route('/fetch-commits', methods=['POST'])
def fetch_commits():
    try:
        data = request.get_json()
        if not data or 'repo' not in data:
            return jsonify({"error": "Repository name is required"}), 400

        repo_name = data['repo']
        days = int(data.get('days', 7))

        repo = g.get_repo(repo_name)
        since_date = datetime.now() - timedelta(days=days)
        commits = repo.get_commits(since=since_date)

        commit_messages = [
            {
                "message": commit.commit.message,
                "date": commit.commit.author.date.isoformat(),
                "author": commit.commit.author.name
            }
            for commit in commits
        ]
        return jsonify({"commits": commit_messages})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/generate-changelog', methods=['POST'])
def generate_changelog():
    try:
        data = request.get_json()
        if not data or 'commits' not in data:
            return jsonify({"error": "Commits data is required"}), 400

        commits = data['commits']

        # Using ChatCompletion instead of Completion
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Using a supported chat model
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that generates changelogs from git commits."
                },
                {
                    "role": "user",
                    "content": f"Generate a changelog based on these Git commits. Focus on user-facing changes and format as bullet points.\nGroup changes into categories like 'Features', 'Bug Fixes', and 'Improvements'.\nCommits: {commits}"
                }
            ],
            temperature=0.7
        )

        # Accessing the response content correctly for ChatCompletion
        changelog = response.choices[0].message['content'].strip()
        return jsonify({"changelog": changelog})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/save-changelog', methods=['POST'])
def save_changelog():
    try:
        data = request.get_json()
        if not data or 'version' not in data or 'content' not in data:
            return jsonify({"error": "Version and content are required"}), 400

        changelog_entry = {
            "version": data['version'],
            "content": data['content'],
            "date": datetime.now().isoformat(),
            "id": len(changelogs) + 1
        }
        changelogs.append(changelog_entry)
        return jsonify({"message": "Changelog saved successfully", "id": changelog_entry["id"]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/changelogs', methods=['GET'])
def get_changelogs():
    try:
        sort_by = request.args.get('sort', 'date')
        order = request.args.get('order', 'desc')

        sorted_logs = sorted(
            changelogs,
            key=lambda x: x[sort_by],
            reverse=(order == 'desc')
        )
        return jsonify(sorted_logs)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    app.run(debug=True)
