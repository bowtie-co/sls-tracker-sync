'use strict';

require('dotenv').config();

const { JIRA_USER_ID, JIRA_PROJECT_KEY, JIRA_PREFIX = 'pt_' } = process.env;

const { createIssue, editIssue, findIssue, transitionIssue, addComment, debugStuff } = require('./src/bitbucket');

const ticketPrefix = (id) => JIRA_PREFIX + id;
const genSummary = (id, title) => `[${ticketPrefix(id)}] ${title}`;

module.exports.sync = async event => {
  console.log('Sync with event', event);

  try {
    const payload = JSON.parse(event.body);

    console.log('Payload', payload);

    let existingIssue;

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
              summary: genSummary(createChanges.id, createChanges.new_values.name),
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
        const existingIssues = await findIssue(ticketPrefix(updateChanges.id));

        console.log('Find existing issue:', existingIssues);

        if (existingIssues.issues.length) {
          existingIssue = existingIssues.issues[0];
        }

        if (updateChanges) {
          const updateData = {
            summary: genSummary(updateChanges.id, updateChanges.name),
            issuetype: {
              name: updateChanges.story_type === 'bug' ? 'Bug' : 'Task'
            },
          };

          if (updateChanges.new_values.description) {
            updateData.description = updateChanges.new_values.description;
          }

          if (existingIssue) {
            const editResponse = await editIssue(existingIssue.key, { fields: updateData });

            console.log('Edited issue', editResponse);
          } else {
            const newIssueFields = Object.assign({
              project: {
                key: JIRA_PROJECT_KEY
              },
              summary: genSummary(updateChanges.id, updateChanges.name),
              issuetype: {
                name: updateChanges.story_type === 'bug' ? 'Bug' : 'Task'
              },
              assignee: {
                id: JIRA_USER_ID
              }
            }, updateData);

            existingIssue = await createIssue({ fields: newIssueFields });

            console.log('Created issue (from edit)', existingIssue);
          }
        }

        if (existingIssue && updateChanges && updateChanges.new_values.current_state) {
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

        break;
      case 'comment_create_activity':
        const commentChanges = payload.changes.find((change) => change.kind === 'comment');

        if (commentChanges && commentChanges.new_values.text) {
          const existingIssues2 = await findIssue(ticketPrefix(commentChanges.new_values.story_id));

          console.log('Find existing issue:', existingIssues2);

          if (existingIssues2.issues.length) {
            existingIssue = existingIssues2.issues[0];
          }

          if (existingIssue && commentChanges && commentChanges.new_values.text) {
            const addCommentResponse = await addComment(existingIssue.key, { body: commentChanges.new_values.text });

            console.log('Add Comment:', addCommentResponse);
          }
        }

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
