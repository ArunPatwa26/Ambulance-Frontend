import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data from localStorage
    const userData = localStorage.getItem("userdata");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) {
    return <p className="text-center mt-10 text-gray-500">Loading user profile...</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
        User Profile
      </h2>
      <div className="flex flex-col items-center">
        <img
          src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAuwMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAAAQIDBAUH/8QAKBABAAICAAUDBAMBAAAAAAAAAAECAxEEEiExQVFhkRMycYEiUqEU/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD7iAAAAAAAACs3rHkFhn9SPST6vsDQZ/U9YTGSoLiInfZIAAAAAAAAAAAAAAClrxHTyre/iFATNpnugAAAAAIlpXJ/ZmA3idpYVtNZbRO43AJAAAAAAAAAAZ5LeI/a1p5YYgAAAdgBhk4mlelY3Pt2Z/8AVfxFdfgHWOavFddWr09Yb1tW8brMSCwAC1bcsqgOiBnit4aAAAAAAAAAyyTudeFC3WZkAAAc3FZZ3yR47ul50zuZnzIIAVBfFknHbcdvMKAPRrMTWLR2lLHhZ3j1PiWyKAAROpiW8TuNsGuOd1BcAAAAABFu0pRbtIMAAAARPaXnPSefkryX5Z8AqAqAAOvhPsn8t2fD15MUb89WiKAANMXaWa+LyDUAAAAABEpAc89xa8atKoAADLPijJG4+6P9ak9O4POmJrOpjUoehbkvH8uWWc4cM+fiwON0YMG55rxqI7e7alMVJ6cv7lfcesfIJAAAAa4vtZN6xqsAkAAAAAAAFMkdNx4ZOhjeup9gVPG56RA5eLyfy5InpHcDJxMzuMfSPVhNpnvMz+UCh0OgCHQ7dugA0x5r087j0l2Y71yV3WfzDz1sd5pbmj9or0BETuImO0pjuC2ON29obK0rqulgAAAAAAAAETG41KQGFomO7zbzu8z6y9i0bjTzs/C3xzM1/lX/AGAc4CoAAAAAvjxXyzqkb9wdXCzvFEek6dNKa6q8PgjDXW9zLZFAAAAAAAAAAAAEJAY5eGx5OuuWfWHLfgrx9ton89HoAPKtw+WvfHb9dVfpZP6W+HraSDyIw5Znpjt8NacJlt3iKx7y9I0Dlx8FSOt55p+IdMVisaiIiPZIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//Z"
          alt="Profile Avatar"
          className="rounded-full mb-4"
        />
        <h3 className="text-xl font-semibold">{user.name}</h3>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-gray-600">{user.phoneNo}</p>
       
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800">About</h3>
        <p className="text-gray-600 mt-2">
          Hello! I'm {user.name}, a registered user of this platform. I love using this
          service and enjoy a seamless experience booking rides and managing my profile.
        </p>
      </div>
    </div>
  );
};

export default Profile;
