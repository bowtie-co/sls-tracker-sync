/**
 * Handle status/state changes (use updateChanges.highlight??)
 *
 * TYPES:
 * - 2 = To Do
 * - 3 = Done
 * - 4 = In Progress
 *
 * DEFAULTS:
 * - 11   Backlog [2] (To Do)
 * - 101  Reopen  [2] (To Do)
 * - 91   Closed  [3] (Done)
 *
 * AVAILABLE:
 * - 141  Development   [2] (To Do)
 * - 271  Start Work    [4] (In Progress)
 * - 161  Req Review    [4] (In Progress)
 * - 201  Ready Testing [4] (In Progress)
 * - 261  Merge Staging [4] (In Progress)
 * - 171  Development   [4] (In Progress)
 * - 211  Test Passed   [4] (In Progress)
 * - 231  Development   [4] (In Progress)
 * - 191  Merge Staging [4] (In Progress)
 * - 241  Close         [3] (Done)
 * - 281  Done          [3] (Done)
 * - 221  Release       [3] (Done)
 *
 * PIVOTAL STATUS MAP: (fallback: 101 - "backlog")
 * - unscheduled  (backlog)           11
 * - unstarted    (selected)          141 (or find type=2 - "to do")
 * - started      (in progress)       271 (or find type=4 - "in progress")
 * - finished     (req review)        161 (or find type=4 - "in progress")
 * - delivered    (ready testing)     261 (or find type=4 - "in progress")
 * - rejected     (back to develop)   171 (or find type=4 - "in progress")
 * - accepted     (ready for staging) 221 (or find type=3 - "done")
 */

// Export status map summary with actionable object data
module.exports = {
  unscheduled: { to: 11, or: null },
  unstarted: { to: 141, or: 2 },
  started: { to: 271, or: 4 },
  finished: { to: 161, or: 4 },
  delivered: { to: 261, or: 4 },
  rejected: { to: 171, or: 4 },
  accepted: { to: 251, or: 3 }
};

// module.exports = {
//   unscheduled: { to: 11, or: null },
//   unstarted: { to: 141, or: null },
//   started: { to: 271, or: null },
//   finished: { to: 161, or: null },
//   delivered: { to: 261, or: null },
//   rejected: { to: 171, or: null },
//   accepted: { to: 221, or: null }
// };
