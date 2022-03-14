'use strict';

require('dotenv').config();

const { JIRA_USER_ID, JIRA_PROJECT_KEY, JIRA_PARENT_KEY, JIRA_PREFIX = 'pt_' } = process.env;

const statusMap = require('./src/status-map');
const { createIssue, editIssue, findIssue, transitionIssue, getTransitions, addComment } = require('./src/bitbucket');

const ticketPrefix = (id) => JIRA_PREFIX + id;
const genSummary = (id, title) => `[${ticketPrefix(id)}] ${title}`;

const buildIssueData = (data) => {
  if (JIRA_PARENT_KEY) {
    Object.assign(data.fields, {
      parent: { key: JIRA_PARENT_KEY }
    });
  }

  return data;
};

module.exports.sync = async event => {
  // console.log('Sync with event', event);

  try {
    const payload = JSON.parse(event.body);

    console.log('Payload', payload);

    if (payload.changes) {
      payload.changes.forEach(change => {
        console.log('Handle change:', change);
      });
    }

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

          const createIssueResponse = await createIssue(buildIssueData(newIssueData));

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
            const editResponse = await editIssue(existingIssue.key, buildIssueData({ fields: updateData }));

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

            existingIssue = await createIssue(buildIssueData({ fields: newIssueFields }));

            console.log('Created issue (from edit)', existingIssue);
          }
        }

        /**
         * Handle move/epic/icebox/labels? (kind = 'story_move_activity' | highlight = 'moved')
         */

        /**
         * Handle estimate changes (highligh = 'estimated')
         */
        if (updateChanges && updateChanges.new_values.estimate) {
          // Update estimate?
        }

        /**
         * Handle status/state changes (use updateChanges.highlight??)
         * - started
         * - unstarted
         * - finished
         * - delivered
         * - rejected
         * - accepted
         * - unscheduled (icebox)
         */
        if (existingIssue && updateChanges && updateChanges.new_values.current_state) {
          const newStatus = updateChanges.new_values.current_state;
          const {transitions} = await getTransitions(existingIssue.id);

          console.log('Available transitions', transitions.map(t => ({ id: t.id, name: t.name })));

          if (statusMap[newStatus]) {
            const fallback = statusMap[newStatus].or;
            const targetId = statusMap[newStatus].to;
            let transition = transitions.find(t => t.id === targetId.toString());

            if (!transition) {
              transition = transitions.find(t => t.to && t.to.statusCategory && t.to.statusCategory.id == fallback);
              console.log(`[FALLBACK] Transitioning: ${newStatus}->${targetId} (fallback: ${fallback})`);
            }

            if (transition) {
              await transitionIssue(existingIssue.key, { transition: { id: transition.id } });
              console.log(`Transition: ${newStatus}->${targetId} --- [${transition.id}]](${transition.name} ==> [${transition.to.id}] ${transition.to.name})`);
            }
          } else {
            console.error(`Missing/invalid status (cannot map to transition)`);
          }
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
