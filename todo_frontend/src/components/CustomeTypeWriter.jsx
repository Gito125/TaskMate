import { useState, useEffect } from 'react';

const CustomTypewriter = ({
  words = [],
  speed = 100,
  pause = 1000,
  delayBeforeStart = 1000,
  loop = true,
  cursor = true,
  cursorBlinkSpeed = 500,
  cursorChar = '|',
  cursorClassName = 'text-blue-500 dark:text-blue-300',
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [isStarting, setIsStarting] = useState(true);

  // Delay before typing starts
  useEffect(() => {
    const startDelay = setTimeout(() => {
      setIsStarting(false);
    }, delayBeforeStart);
    return () => clearTimeout(startDelay);
  }, [delayBeforeStart]);

  // Cursor blinking effect
  useEffect(() => {
    if (!cursor) return;
    const blink = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, cursorBlinkSpeed);
    return () => clearInterval(blink);
  }, [cursor, cursorBlinkSpeed]);

  // Typing & deleting effect
  useEffect(() => {
    if (isStarting || words.length === 0) return;

    const word = words[currentWordIndex];
    let timeout;

    if (!isDeleting && charIndex < word.length) {
      timeout = setTimeout(() => {
        setDisplayedText(word.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, speed);
    } else if (!isDeleting && charIndex === word.length) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pause);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayedText(word.slice(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }, speed / 2);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setCurrentWordIndex((prev) =>
        loop ? (prev + 1) % words.length : prev + 1 < words.length ? prev + 1 : prev
      );
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, isStarting, currentWordIndex, words, loop, speed, pause]);

  return (
    <span className="text-inherit font-bold">
      {displayedText}
      {cursor && (
        <span
          className={`${cursorClassName} transition-opacity duration-200 ${
            showCursor ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {cursorChar}
        </span>
      )}
    </span>
  );
};

export default CustomTypewriter;