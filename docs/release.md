# Checklist for releasing new version
Every time releasing new version, corresponding doccumentation and changes
should be added.

These steps have to be done before release is considered complete.
On branch release/x.y.z:
- increase version number in all package.json files (every package has its own)
- Add entry in `docs/changlog.md` for the new version
- push changes into main and create tag `vx.y.z`
- merge main back into dev branch
