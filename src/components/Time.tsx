import { useState, useEffect } from "react";

function Time() {
  // Starts empty so server and client markup match; the clock fills in on mount.
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="tabular-nums">
      {time ? time.toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' }) : "--:--"} in Sakarya, TR
    </span>
  );
}

export default Time;
