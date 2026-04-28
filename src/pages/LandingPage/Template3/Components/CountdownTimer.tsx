import { useState, useEffect } from "react";

const CountdownTimer = ({ days = 3 }: { days?: number }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: days,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set a fixed end time 3 days from now for demonstration
    // In a real app, this might come from a prop or be fixed to a specific date
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [days]);

  const TimeUnit = ({ label, value }: { label: string; value: number }) => (
    <div className="flex flex-col items-center font-primary">
      <div className="bg-green-600 text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-lg shadow-md mb-1.5">
        <span className="text-xl md:text-3xl font-black">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[8px] md:text-[10px] font-bold text-gray-600 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex gap-2.5 md:gap-4 justify-center py-4">
      <TimeUnit label="Days" value={timeLeft.days} />
      <TimeUnit label="Hours" value={timeLeft.hours} />
      <TimeUnit label="Minutes" value={timeLeft.minutes} />
      <TimeUnit label="Seconds" value={timeLeft.seconds} />
    </div>
  );
};

export default CountdownTimer;
