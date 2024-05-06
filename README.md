# GymSync

Gympass style app.

## RFs

- [x] It should be possible to register;
- [x] It should be possible to authenticate;
- [ ] It should be possible to get a profile of a logged user;
- [ ] It should be possible to get the number of check-ins made by the user;
- [ ] It should be possible for the user to get their check-in history;
- [ ] It should be possible for the user to search nearby gyms;
- [ ] It should be possible for the user to search gyms by the name;
- [ ] It should be possible for the user to check-in to a gym;
- [ ] It should be possible to validate a check-in of a user;
- [ ] It should be possible to validate a check-in of a user;
- [ ] It should be possible to register a gym;

## Rn

- [x] The user can't register with a duplicate e-mail;
- [ ] The user can't make two check-ins in the same day;
- [ ] The user can't check-in if their not close to the gym (100m);
- [ ] The check-in can only be validate 20 minutes after their creation;
- [ ] The check-in can only be validate by admins;
- [ ] The gym can only be register by admins;

## RNFs

- [x] The user password needs to be hashed;
- [x] The application's data needs to be stored in a PostgreeSQl database;
- [ ] The user needs to be identified by a JWT (JSON Web Token);
