const fetch = require('node-fetch');

const { JIRA_API_URL, JIRA_API_USER, JIRA_API_TOKEN } = process.env;

module.exports.createIssue = async (bodyData) => {
  const response = await fetch(`${JIRA_API_URL}/rest/api/2/issue`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(
        `${JIRA_API_USER}:${JIRA_API_TOKEN}`
      ).toString('base64')}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyData)
  });

  return await response.json();
};

module.exports.editIssue = async (id, bodyData) => {
  const response = await fetch(`${JIRA_API_URL}/rest/api/2/issue/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Basic ${Buffer.from(
        `${JIRA_API_USER}:${JIRA_API_TOKEN}`
      ).toString('base64')}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyData)
  });

  return await response.json();
};

module.exports.findIssue = async (query) => {
  const response = await fetch(`${JIRA_API_URL}/rest/api/2/issue/picker?query=${query}`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${Buffer.from(
        `${JIRA_API_USER}:${JIRA_API_TOKEN}`
      ).toString('base64')}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  return await response.json();
};

module.exports.transitionIssue = async (id, bodyData) => {
  const response = await fetch(`${JIRA_API_URL}/rest/api/2/issue/${id}/transitions`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(
        `${JIRA_API_USER}:${JIRA_API_TOKEN}`
      ).toString('base64')}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyData)
  });

  return await response.text();
};


module.exports.debugStuff = async (key) => {
  const response = await fetch(`${JIRA_API_URL}/rest/api/2/issue/${key}/transitions`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${Buffer.from(
        `${JIRA_API_USER}:${JIRA_API_TOKEN}`
      ).toString('base64')}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  return await response.json();
};
