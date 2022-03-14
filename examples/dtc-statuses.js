/**
 * Map out available statuses and transitions...
 */

let transitionId = 11;

if (['started', 'finished'].includes(updateChanges.new_values.current_state)) {
  transitionId = 21;
} else if (['accepted'].includes(updateChanges.new_values.current_state)) {
  transitionId = 31;
} else if (['delivered'].includes(updateChanges.new_values.current_state)) {
  transitionId = 41;
}

const backlogTransitions = {
  11: {
    id: '11',
    name: 'Backlog',
    to: {
      id: '10210',
      name: 'Backlog',
      statusCategory: {
        id: 2,
        key: 'new',
        name: 'To Do'
      }
    }
  },
  91: {
    id: '91',
    name: 'Mark Closed',
    to: {
      id: '6',
      name: 'Closed',
      statusCategory: {
        id: 3,
        key: 'done',
        name: 'Done'
      }
    }
  },
  101: {
    id: '101',
    name: 'Reopen',
    to: {
      id: '4',
      name: 'Backlog',
      statusCategory: {
        id: 2,
        key: 'new',
        name: 'To Do'
      }
    }
  },
  141: {
    id: '141',
    name: 'Selected for Development',
    to: {
      id: '10211',
      name: 'Prioritized',
      statusCategory: {
        id: 2,
        key: 'new',
        name: 'To Do'
      }
    }
  },
  271: {
    id: '271',
    name: 'Start Work',
    to: {
      id: '10338',
      name: 'In Development',
      statusCategory: {
        id: 4,
        key: 'indeterminate',
        name: 'In Progress'
      }
    }
  }
};

const startedTransitions = {
  11: {
    id: '11',
    name: 'Backlog',
    to: {
      id: '10210',
      name: 'Backlog',
      statusCategory: {
        id: 2,
        key: 'new',
        name: 'To Do'
      }
    }
  },
  91: {
    id: '91',
    name: 'Mark Closed',
    to: {
      id: '6',
      name: 'Closed',
      statusCategory: {
        id: 3,
        key: 'done',
        name: 'Done'
      }
    }
  },
  101: {
    id: '101',
    name: 'Reopen',
    to: {
      id: '4',
      name: 'Backlog',
      statusCategory: {
        id: 2,
        key: 'new',
        name: 'To Do'
      }
    }
  },
  161: {
    id: '161',
    name: 'Request Review',
    to: {
      id: '10396',
      name: 'Code Review',
      statusCategory: {
        id: 4,
        key: 'indeterminate',
        name: 'In Progress'
      }
    }
  },
  281: {
    id: '281',
    name: 'Done',
    to: {
      id: '10338',
      name: 'Done',
      statusCategory: {
        id: 3,
        key: 'done',
        name: 'Done'
      }
    }
  }
};

const reviewTransitions = {
  11: {
    id: '11',
    name: 'Backlog',
    to: {
      id: '10210',
      name: 'Backlog',
      statusCategory: {
        id: 2,
        key: 'new',
        name: 'To Do'
      }
    }
  },
  91: {
    id: '91',
    name: 'Mark Closed',
    to: {
      id: '6',
      name: 'Closed',
      statusCategory: {
        id: 3,
        key: 'done',
        name: 'Done'
      }
    }
  },
  101: {
    id: '101',
    name: 'Reopen',
    to: {
      id: '4',
      name: 'Backlog',
      statusCategory: {
        id: 2,
        key: 'new',
        name: 'To Do'
      }
    }
  },
  201: {
    id: '201',
    name: 'Ready for Testing',
    to: {
      id: '10399',
      name: 'FB Testing',
      statusCategory: {
        id: 4,
        key: 'indeterminate',
        name: 'In Progress'
      }
    }
  },
  261: {
    id: '261',
    name: 'Merge to Staging',
    to: {
      id: '10338',
      name: 'STG Testing',
      statusCategory: {
        id: 4,
        key: 'indeterminate',
        name: 'In Progress'
      }
    }
  },
  171: {
    id: '171',
    name: 'Back to Development',
    to: {
      id: '10338',
      name: 'In Development',
      statusCategory: {
        id: 4,
        key: 'indeterminate',
        name: 'In Progress'
      }
    }
  }
};

const doneTransitions = {
  11: {
    id: '11',
    name: 'Backlog',
    to: {
      id: '10210',
      name: 'Backlog',
      statusCategory: {
        id: 2,
        key: 'new',
        name: 'To Do'
      }
    }
  },
  91: {
    id: '91',
    name: 'Mark Closed',
    to: {
      id: '6',
      name: 'Closed',
      statusCategory: {
        id: 3,
        key: 'done',
        name: 'Done'
      }
    }
  },
  101: {
    id: '101',
    name: 'Reopen',
    to: {
      id: '4',
      name: 'Backlog',
      statusCategory: {
        id: 2,
        key: 'new',
        name: 'To Do'
      }
    }
  },
  161: {
    id: '161',
    name: 'Request Review',
    to: {
      id: '10396',
      name: 'Code Review',
      statusCategory: {
        id: 4,
        key: 'indeterminate',
        name: 'In Progress'
      }
    }
  },
  281: {
    id: '281',
    name: 'Done',
    to: {
      id: '10338',
      name: 'Done',
      statusCategory: {
        id: 3,
        key: 'done',
        name: 'Done'
      }
    }
  }
};

const statusMap = {
  Backlog: [],

};
