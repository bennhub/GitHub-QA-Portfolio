# Version Control

This section showcases my use of GitHub for version control, with a primary focus on building, testing, and deploying automation scripts. Below are some key elements that demonstrate my approach to version control in a QA context:

## Branching Strategy
I use GitHub to manage branches primarily for developing and deploying automation scripts. Each branch represents a specific feature, automation update, or enhancement to ensure smooth integration into the QA repository. 

- **Automation branches:** Used for developing and updating automation tests.
- **Feature branches:** Managed for testing new features or enhancements in the automation pipeline.
- **Bugfix branches:** Used when resolving issues encountered during automation and unit testing.

## Pull Requests and Code Review
I actively create pull requests (PRs) for the automation scripts I develop. Each PR includes detailed documentation and testing scenarios, ensuring that the automation scripts are thoroughly reviewed before being merged.

- **Pull request structure:** Each PR contains automation tests, relevant commits, and links to issues related to automation or unit testing.
- **Issue tracking:** I use GitHub Issues to track problems found during automation and unit testing, linking them directly to PRs for resolution.
- **Collaborative feedback:** Reviewers provide feedback on the automation scripts, ensuring the quality and efficiency of the tests before merging.

## Continuous Integration (CI)
I maintain continuous integration (CI) workflows using GitHub Actions (GHA), which are crucial for building, testing, and deploying automation scripts. The automated pipelines ensure that all new changes are properly tested before being merged.

- **GitHub Actions:** I set up and maintain CI pipelines to automatically build and test automation scripts upon each push or pull request.
- **Automated checks:** Playwright and other automation tests are run as part of the CI pipelines to validate changes and ensure stability.

## Merging and Conflict Resolution
Although I don't directly merge branches, I play an integral role in verifying the success of automation tests before a branch is merged. My work in maintaining CI ensures that the main branch remains stable and that the automation scripts are reliable.
