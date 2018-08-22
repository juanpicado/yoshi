const tempy = require('tempy');
const execa = require('execa');
const chalk = require('chalk');
const Answers = require('../src/Answers');
const { createApp, verifyRegistry, getProjectTypes } = require('../src/index');
const prompts = require('prompts');

// verbose logs and output
const verbose = process.env.VERBOSE_TESTS;
// A regex pattern to run a focus test on the matched projects types
const focusProjectPattern = process.env.FOCUS_PATTERN;

verbose && console.log(`using ${chalk.yellow('VERBOSE')} mode`);

const stdio = verbose ? 'inherit' : 'pipe';

verifyRegistry();

const projectTypes = getProjectTypes().filter(
  projectType =>
    !focusProjectPattern ? true : projectType.match(focusProjectPattern),
);

focusProjectPattern &&
  console.log(
    `using the pattern ${chalk.magenta(
      focusProjectPattern,
    )} to filter projects`,
  );

console.log('Running e2e tests for the following projects:\n');
projectTypes.forEach(type => console.log(`> ${chalk.cyan(type)}`));

const testTemplate = mockedAnswers => {
  describe(mockedAnswers.fullProjectType, () => {
    const tempDir = tempy.directory();

    before(() => prompts.inject(mockedAnswers));

    it('should create the project', async () => {
      verbose && console.log(chalk.cyan(tempDir));
      await createApp(tempDir);
    });

    it(`should run npm test`, () => {
      console.log('running npm test...');
      execa.shellSync('npm test', {
        cwd: tempDir,
        stdio,
      });
    });
  });
};

describe('create-yoshi-app + yoshi e2e tests', () => {
  projectTypes
    .map(
      projectType =>
        new Answers({
          projectName: `test-${projectType}`,
          authorName: 'rany',
          authorEmail: 'rany@wix.com',
          organization: 'wix',
          projectType: projectType.replace('-typescript', ''),
          transpiler: projectType.endsWith('-typescript')
            ? 'typescript'
            : 'babel',
        }),
    )
    .forEach(testTemplate);
});