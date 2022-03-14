const fetch = require('node-fetch');

const { JIRA_API_URL, JIRA_API_USER, JIRA_API_TOKEN } = process.env;

const BASE_API_URL = JIRA_API_URL + '/rest/api/2';

const headers = {
  'Authorization': `Basic ${Buffer.from(
    `${JIRA_API_USER}:${JIRA_API_TOKEN}`
  ).toString('base64')}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

const api = async (method, route, body) => {
  const options = {
    method,
    headers
  };

  if (body) {
    // TODO: Verify method? Or allow user derp fail?
    options.body = JSON.stringify(body);
  }

  return await fetch(`${BASE_API_URL}/${route}`, options);
};

module.exports.createIssue = async (bodyData) => {
  return await (await api('POST', 'issue', bodyData)).json();
};

module.exports.editIssue = async (id, bodyData) => {
  return await (await api('PUT', `issue/${id}`, bodyData)).text();
};

module.exports.findIssue = async (query) => {
  return await (await api('GET', `search?jql=summary~${query}`)).json();
};

module.exports.transitionIssue = async (id, bodyData) => {
  return await (await api('POST', `issue/${id}/transitions`, bodyData)).text();
};

module.exports.addComment = async (id, bodyData) => {
  return await (await api('POST', `issue/${id}/comment`, bodyData)).json();
};

module.exports.getTransitions = async (id) => {
  return await (await api('GET', `issue/${id}/transitions`)).json();
};
