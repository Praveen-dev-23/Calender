import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging tailwind classes safely
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)); // January 2025 as in image
  const [direction, setDirection] = useState(0);

  const nextMonth = () => {
    setDirection(1);
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setDirection(-1);
    setCurrentDate(subMonths(currentDate, 1));
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const days = [];

  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      days.push(
        <div
          key={day}
          className={cn(
            "flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-2xl border border-brand-text/30 transition-all duration-300",
            !isSameMonth(day, monthStart)
              ? "opacity-0 pointer-events-none border-transparent" // Hide days outside current month
              : isSameDay(day, new Date())
                ? "bg-brand-text/5 font-medium"
                : "hover:bg-brand-text/5 cursor-pointer"
          )}
          onClick={() => isSameMonth(cloneDay, monthStart)}
        >
          <motion.span
            whileHover={isSameMonth(day, monthStart) ? { scale: 1.1 } : {}}
            whileTap={isSameMonth(day, monthStart) ? { scale: 0.95 } : {}}
            className="w-full h-full flex items-center justify-center rounded-inherit"
          >
            {formattedDate}
          </motion.span>
        </div>
      );
      day = addDays(day, 1);
    }
  }

  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <div className="min-h-screen bg-brand-bg relative overflow-hidden flex flex-col items-center py-12 px-6 sm:px-12 font-sans selection:bg-brand-purple/30">
      {/* Ambient Glow Effects */}
      <div className="absolute -bottom-[20%] -left-[10%] w-[80vw] h-[80vw] sm:w-[60vw] sm:h-[60vw] bg-ambient-glow blur-3xl rounded-full opacity-80 pointer-events-none mix-blend-multiply" />
      <div className="absolute -bottom-[10%] left-[20%] w-[60vw] h-[60vw] bg-brand-purple/20 blur-3xl rounded-full opacity-60 pointer-events-none mix-blend-multiply" />

      <main className="w-full max-w-lg flex flex-col flex-1 z-10 relative mt-10">

        {/* Header */}
        <header className="flex justify-between items-baseline mb-8 px-2 relative">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-brand-text">
            {format(currentDate, 'MMMM')}
          </h1>
          <span className="text-2xl sm:text-3xl font-semibold text-brand-text">
            {format(currentDate, 'yyyy')}
          </span>

          {/* Navigation Arrows */}
          <div className="absolute -top-12 right-0 flex gap-2">
            <button onClick={prevMonth} className="p-2 text-brand-text/50 hover:text-brand-text transition-colors rounded-full hover:bg-black/5">
              <ChevronLeft size={24} strokeWidth={1.5} />
            </button>
            <button onClick={nextMonth} className="p-2 text-brand-text/50 hover:text-brand-text transition-colors rounded-full hover:bg-black/5">
              <ChevronRight size={24} strokeWidth={1.5} />
            </button>
          </div>
        </header>

        {/* Weekdays Nav */}
        <div className="rounded-full px-6 py-4 flex justify-between items-center mb-10 border border-brand-text/30 bg-transparent">
          {weekdays.map((day) => (
            <span key={day} className="text-sm font-medium text-brand-text tracking-wider w-10 text-center">
              {day}
            </span>
          ))}
        </div>

        {/* Calendar Grid Container with Animation */}
        <div className="relative flex-1">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={currentDate.toString()}
              custom={direction}
              initial={{ opacity: 0, x: direction * 20, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: direction * -20, filter: 'blur(4px)' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-7 gap-y-4 gap-x-2 sm:gap-x-5 justify-items-center"
            >
              {days}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-16 pb-6 w-full">
          <div className="flex items-center gap-4 text-sm text-brand-text tracking-wide">
            <span>a new year</span>
            <div className="flex-1 h-[1px] bg-brand-text/30"></div>
            <span>a new journey</span>
          </div>
        </footer>

      </main>
    </div>
  );
}
