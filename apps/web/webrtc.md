1. webrtc

// when clicked on call icon

- step 1 : (web1) - done

1. create peer connection
2. setup ice-candidate
   1. send to server type="ice-candidate"
3. setup ontrack and set remotevideoref

- step 2: (web1)

4. getLocalVideoStream -done

   1. getdisplayuser
   2. peer.addTrack()

5. create offer (web1) -done

   1. create offer()
   2. setlocalDescription (offer)
   3. send the offer to signaling server type="call-user" to='to userid'

6. in signaling server (server) -done

   1. receive type='call-user'
   2. send the signal to the to user id with the offer and from userid {offer , from, type = "incoming-call"}

7. in the to user browser (web2) -done

   1. listen for type = "incoming-call"
   2. handle the call.
      1. set ringing true
      1. setup peer connection
      1. set offer to the the remote description
      1. getLocalVideoStream
      1. create answer
         1. create answer
         2. set as answer as local description
         3. signal to server (type : "answer-user", answer)

8. in signaling server (sever) -done

   1. receive type='answer-user'
   2. send to user (web1) {type : 'answer-received', answer, from}

9. in user (web1) -done

   1. listen for type = "answer-received"
   2. set the corresoonding state
   3. set the answer as a remotedescription

10. on browser web1 and web2

    1. on type = ice-candidate, candidate
    2. await peer.addIceCandidate(new RTCIceCandidate(candidate));
