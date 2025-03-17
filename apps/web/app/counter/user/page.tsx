"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { setUser, clearUser } from "@/lib/redux/slices/userSlice";

export default function UserProfile() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  return (
    <div>
      {user.id ? (
        <>
          <h1>Welcome, {user.name}</h1>
          <button onClick={() => dispatch(clearUser())}>Logout</button>
        </>
      ) : (
        <button
          onClick={() =>
            dispatch(
              setUser({
                id: "123",
                name: "John Doe",
                email: "john@example.com",
              }),
            )
          }
        >
          Login
        </button>
      )}
    </div>
  );
}
