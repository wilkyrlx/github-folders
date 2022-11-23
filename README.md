# WIP: Git Commit Chrome Extension
The vision of this project is a simple, clean chrome extension to improve the github repository UI. Users will have access to a clean list of their repos, including:
- repos they own
- repos they have committed to 
- repos they have starred
- repos they have added manually

This project is born out of frusturation with the limited UI for github, with different repos listed in different places. Additionally, the user will be able to group repos as they see fit into folders.

## References
*Note: not all are used in the final product*
https://github.com/ghuser-io/github-contribs/blob/master/index.js <br>
https://github.com/trananhtuat/react-draggable-list/tree/main/src/components

## Notes:
https://docs.github.com/en/rest/repos/repos#list-repositories-for-the-authenticated-user

working cURL call:
curl \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <token>" \
  https://api.github.com/user/repos