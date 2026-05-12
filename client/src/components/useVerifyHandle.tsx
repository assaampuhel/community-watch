import { useState } from "react";

type UserData = {
  handle: string;
  rating: number;
  rank: string;
};

export function useVerifyHandle() {
  const [handle, setHandle] = useState<string>("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string>("");
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [canModerate, setCanModerate] = useState<boolean>(false); 

  const verifyHandle = async () => {
      try {
        setError("");
        setIsEligible(null)
  
        const response = await fetch(
          `https://codeforces.com/api/user.info?handles=${handle}`
        );
  
        const data = await response.json();
        if (data.status !== "OK") {
          setError("User not found");
          setUserData(null);
          setCanModerate(false);
          return;
        }
        setUserData(data.result[0]);
        if(data.result[0].rating < 1500 || data.result[0].rating === undefined) {
         setIsEligible(false);
         setCanModerate(false);
        }
        else {
         setIsEligible(true);
         setCanModerate(true);
         console.log("User Tagged: MODERATOR_ELIBIGLE");
        }
      } catch (err) {
        setError("Something went wrong");
      }
    };

    return {
      handle,
      setHandle,
      userData,
      error,
      isEligible,
      canModerate,
      verifyHandle
    }
  }
