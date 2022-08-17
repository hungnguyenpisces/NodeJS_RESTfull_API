const newman = require('newman');

newman.run({
  collection: './tests/Mock_project_team_1.json',
  reporters: ['cli', 'htmlextra'],
  iterationCount: 2,
});
