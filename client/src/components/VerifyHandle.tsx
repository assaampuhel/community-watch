import { useState } from "react";

type UserData = {
  handle: string;
  rating: number;
  rank: string;
};

function VerifyHandle() {
  const [handle, setHandle] = useState<string>("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string>("");

  const verifyHandle = async () => {
    try {
      setError("");

      const response = await fetch(
        `https://codeforces.com/api/user.info?handles=${handle}`
      );

      const data = await response.json();
      if (data.status !== "OK") {
        setError("User not found");
        setUserData(null);
        return;
      }
      setUserData(data.result[0]);

    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div>
      <h1>Codeforces Verification</h1>

      <input
        type="text"
        placeholder="Enter handle"
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
        onKeyDown={(e) => {
        if (e.key === "Enter") {
        verifyHandle();
    }
  }}
      />

      <button onClick={verifyHandle}>
        Verify
      </button>

      {error && <p>{error}</p>}

      {userData && (
        <div>
          <h2>{userData.handle}</h2>
          {userData.rating === undefined ? 
          (
            <p>Rating: Unranked</p>
          )
           : 
          (
            <p>Rating: {userData.rating}</p>
          )}
          {userData.rank === undefined ? 
          (
            <p>Rank: No Rating</p>
          )
           : 
          (
            <p>Rank: {userData.rank}</p>
          )}

          {userData.rating >= 1500 ? (
            <p>User can verify reports</p>
          ) : (
            <p>User cannot verify reports</p>
          )}
        </div>
      )}
    </div>
  );
}


export default VerifyHandle;