# vo.6.2
- Updated session store on server
- Minor UI/UX changes

# v0.6.1
- add proper timeouts and loading indicator for file import pages.
- fix typo in changelog of previous version heading

# v0.6.0
In this version I've resolved some problems with startup and initialization of the project:
  - Added creation of admin user from env variables if there is no user yet
  - Manage container dependencies and healthchecks to start in right order and timing
  - Update logging
  - Add import of texts to user interface
  - Fix PWA related issues

# v0.5.0
With this version app introduces more comfortable access to psalms and Bible passages. 
Also I've made more different UI and UX improvements. 

# v0.4.0
This version adds new features to user and admin interface. Also improves groups, where group roles can be managed now.
Also this version introduces passages and psalter section.

# v0.3.0
Version introduces basic functionality for role management and groups, also
adds admin panel with group, role and user management. Groups are not usable
yet, since they have no contnent and group roles are not implemented yet too.

Version also introduces bunch of smaller UI improvements.

# v0.2.0
Version introduces authentication and user accounts and also a 
new features for Bible reader

## Features:
- Authentication with email and password
- Verse highlighting
- Verse notes
- Bookmarking notes

# v0.1.0
This is initial version of the project containing only the basic infrastructure
setup and functionality.

This version introduces:
- QA setup with prettier, eslint and tests for backend
- Automated build and test process leveraging docker containers
Features:
- Basic api and UI for Viewing Bible texts
