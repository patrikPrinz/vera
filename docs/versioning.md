# Versioning scheme
Project follows basic semantic versioning scheme (MAJOR.MINOR.PATCH).

To make things simpler, the same version number is used for all the project packages. So it is advised to have corresponding version numbers for all images of you do not use a latest alias.

**Disclaimer**  
Version 1.0.0 should be reached by the time of finishing my Bachelor thesis. Before this time, project is considered unstable and some radical interface changes can happen even between minor versions.

Version meaning:
- Major: Braking API changes or large user interface changes or large scale refactoring.
- Minor: Changes, refactoring and interface changes preserving backwards compatibility.
- Fixing bugs and issues, small refactoring

# Git versioning conventions
## Branches
Branches are named in format type/name. Branch types are specified below. Name is a short meaningful explanation of branch purpose.  Often includes name of packages, which is mainly involved. If name consists of more words, they are separated with "-" symbol (for example server-core, frontend-auth, ...)

Several branch types are allowed based on branch main purpose. Branch introduces bigger changes and can contain some changes which off its purpose. Branch naming is not that strict as a commit naming.
### Branch types
- chore: Regards dependency management, tooling configuration, and other changes. It is. Not intended for large bugmfixes and feature creation.
- feature: Adds groups of related features of larger scale.
- release: final preparations for release
- docs: updating documentation

## Commits
Commits introduce smaller changes. Should not be of a large scale. Commits should keep project in consistent and functional state.

Commit name schema is type: description. Types are specified below. Description contains short summary of important changes. Each commit should have a longer description of introduced changes.

### Commit types
- feature: introduces new features
- fix: fixes bug or inconsistency
- test: adds tests for existing code
- docs: updating documentation
- build: changes tooling, project configuration, packages or CI/CD setup

# Adding changes
For each feature, fix or other changes, there should be a branch according to specification above.
Complete changes are pull-requested into a dev branch for merging and testing changes together. When ready for the next release, last details (like changing version number etc.) are done on branch called release/v<version number>. From here changes are pull-requested into a main branch.
Merging into main branch starts build of docker containers, which are uploaded into GHCR and tagged as latest.

Dev and main branch are protected from direct pushing. Changes can be added only with pull requests. 
On each push and pull request GitHub actions runs QA checks (linter, format checking and testing). All the QA checks are present in the root package.json scripts. Those ran in GitHub actions are prefixed with ci:.
