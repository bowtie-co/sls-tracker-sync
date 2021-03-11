'use strict';

require('dotenv').config();

const { JIRA_USER_ID, JIRA_PROJECT_KEY } = process.env;

const { createIssue, editIssue, findIssue, transitionIssue, debugStuff } = require('./src/bitbucket');

module.exports.sync = async event => {
  console.log('Sync with event', event);

  try {
    const payload = JSON.parse(event.body);

    console.log('Payload', payload);

    // Loop through payload changes?
    /**
     * payload.highlight (added, edited, estimated, delivered, accepted, rejected)
     * payload.changes = [
     *  {
     *    kind: 'story',
     *    change_type: 'create',
     *    id: 177290623,
     *    new_values: [Object],
     *    name: 'This is a bug',
     *    story_type: 'bug'
     *  }
     * ]
     */

    switch (payload.kind) {
      // https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-post
      case 'story_create_activity':
        const createChanges = payload.changes.find((change) => change.kind === 'story');

        if (createChanges) {
          const newIssueData = {
            fields: {
              project: {
                key: JIRA_PROJECT_KEY
              },
              summary: `[pt_${createChanges.id}] ${createChanges.new_values.name}`,
              description: createChanges.new_values.description,
              issuetype: {
                name: createChanges.story_type === 'bug' ? 'Bug' : 'Task'
              },
              assignee: {
                id: JIRA_USER_ID
              }
            }
          };

          const createIssueResponse = await createIssue(newIssueData);

          console.log('Created Jira issue:', createIssueResponse);
        }

        break;
      // https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-put
      case 'story_update_activity':
        const updateChanges = payload.changes.find((change) => change.kind === 'story');

        let existingIssue;
        const existingIssues = await findIssue(`pt_${updateChanges.id}`);

        console.log('Find existing issue:', existingIssues);

        if (existingIssues.sections.length && existingIssues.sections[0].issues.length > 0) {
          existingIssue = existingIssues.sections[0].issues[0];
        }

        if (existingIssue && updateChanges) {
          const updateData = {
            // Name
            // Description
            // Comment
          };

          if (updateChanges.new_values.current_state) {
            let transitionId = 11;

            if (['started', 'finished'].includes(updateChanges.new_values.current_state)) {
              transitionId = 21;
            } else if (['accepted'].includes(updateChanges.new_values.current_state)) {
              transitionId = 31;
            } else if (['delivered'].includes(updateChanges.new_values.current_state)) {
              transitionId = 41;
            }

            await transitionIssue(existingIssue.key, { transition: { id: transitionId } });
          }

          // const debugResponse = await debugStuff('FB-55');

          // console.log('Debug resp:', debugResponse);
        }

        break;
      case 'comment_create_activity':
        const commentChanges = payload.changes.filter((change) => change.kind === 'comment')
        break;
    }

    console.log('Returning 200 OK');

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
    console.log('CAUGHT ERR', err);
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
