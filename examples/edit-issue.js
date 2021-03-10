// This code sample uses the 'node-fetch' library:
// https://www.npmjs.com/package/node-fetch
const fetch = require('node-fetch');

const bodyData = `{
  "historyMetadata": {
    "actor": {
      "avatarUrl": "http://mysystem/avatar/tony.jpg",
      "displayName": "Tony",
      "id": "tony",
      "type": "mysystem-user",
      "url": "http://mysystem/users/tony"
    },
    "extraData": {
      "Iteration": "10a",
      "Step": "4"
    },
    "description": "From the order testing process",
    "generator": {
      "id": "mysystem-1",
      "type": "mysystem-application"
    },
    "cause": {
      "id": "myevent",
      "type": "mysystem-event"
    },
    "activityDescription": "Complete order processing",
    "type": "myplugin:type"
  },
  "update": {
    "summary": [
      {
        "set": "Bug in business logic"
      }
    ],
    "components": [
      {
        "set": ""
      }
    ],
    "timetracking": [
      {
        "edit": {
          "remainingEstimate": "4d",
          "originalEstimate": "1w 1d"
        }
      }
    ],
    "labels": [
      {
        "add": "triaged"
      },
      {
        "remove": "blocker"
      }
    ]
  },
  "fields": {
    "summary": "Completed orders still displaying in pending",
    "customfield_10010": 1,
    "customfield_10000": {
      "type": "doc",
      "version": 1,
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "text": "Investigation underway",
              "type": "text"
            }
          ]
        }
      ]
    }
  },
  "properties": [
    {
      "value": "Order number 10784",
      "key": "key1"
    },
    {
      "value": "Order number 10923",
      "key": "key2"
    }
  ]
}`;

fetch('https://your-domain.atlassian.com/rest/api/3/issue/{issueIdOrKey}', {
  method: 'PUT',
  headers: {
    'Authorization': `Basic ${Buffer.from(
      'email@example.com:<api_token>'
    ).toString('base64')}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: bodyData
})
  .then(response => {
    console.log(
      `Response: ${response.status} ${response.statusText}`
    );
    return response.text();
  })
  .then(text => console.log(text))
  .catch(err => console.error(err));