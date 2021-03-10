'use strict';

module.exports.sync = async event => {
  console.log('Sync with event', event);

  try {
    const payload = JSON.parse(event.body);

    console.log('Payload', payload);

    // Loop through payload changes?
    // payload.changes = []

    switch (payload.kind) {
      // https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-post
      case 'story_create_activity':
        break;
      // https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-put
      case 'story_update_activity':
        break;
    }

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Done with sync',
        },
        null,
        2
      ),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          message: err.message,
        },
        null,
        2
      ),
    };
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
