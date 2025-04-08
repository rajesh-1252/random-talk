https://chatgpt.com/c/67dc28d1-5f50-8000-9e00-6cd968d58436

1. send the fetched user from mongodb

---

1. first create a db schema struct types/user.go
2. create store (userStore , settingStrore) - it is like controller - only for doing db related logic
3. create a hanlder (route) - it is like route for doing the native go logic
4.

5. match found
6. case 1
   - user A connected - make a session for both a and b
   - user B disconnected - he will receive the message but the user b can block him session will exist until user a clears it
7. case 2
   - user A connected - make a session for both a and b
   - user B connected - they will chat happy
