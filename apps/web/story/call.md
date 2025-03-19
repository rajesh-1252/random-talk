1. user a will call
2. call will come to user b
   - will call is ringing if user b refresh or close the app the call will disconnected for user a
   - if the call is accepted both user state will be updated will incall = true
     - if other user call at this time we should only allow if incall is false or show line busy
