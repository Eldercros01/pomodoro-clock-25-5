import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerLabel, setTimerLabel] = useState("Session");
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const beepRef = useRef(null);

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerLabel("Session");
    setRunning(false);
    beepRef.current.pause();
    beepRef.current.currentTime = 0;
  };

  const startStop = () => {
    if (running) {
      clearInterval(intervalRef.current);
      setRunning(false);
    } else {
      setRunning(true);
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            beepRef.current.play();
            if (timerLabel === "Session") {
              setTimerLabel("Break");
              return breakLength * 60;
            } else {
              setTimerLabel("Session");
              return sessionLength * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const changeLength = (type, amount) => {
    if (running) return;
    if (type === 'break') {
      const newBreak = breakLength + amount;
      if (newBreak > 0 && newBreak <= 60) {
        setBreakLength(newBreak);
      }
    } else {
      const newSession = sessionLength + amount;
      if (newSession > 0 && newSession <= 60) {
        setSessionLength(newSession);
        setTimeLeft(newSession * 60);
      }
    }
  };

  return (
    <div className="container" id="clock">
      <h1>25 + 5 Clock</h1>

      <div className="settings">
        <div id="break-label">
          Break Length
          <div>
            <button id="break-decrement" onClick={() => changeLength('break', -1)}>-</button>
            <span id="break-length">{breakLength}</span>
            <button id="break-increment" onClick={() => changeLength('break', 1)}>+</button>
          </div>
        </div>

        <div id="session-label">
          Session Length
          <div>
            <button id="session-decrement" onClick={() => changeLength('session', -1)}>-</button>
            <span id="session-length">{sessionLength}</span>
            <button id="session-increment" onClick={() => changeLength('session', 1)}>+</button>
          </div>
        </div>
      </div>

      <div className="timer">
        <div id="timer-label">{timerLabel}</div>
        <div id="time-left">{formatTime(timeLeft)}</div>
      </div>

      <div className="controls">
        <button id="start_stop" onClick={startStop}>{running ? 'Pause' : 'Start'}</button>
        <button id="reset" onClick={reset}>Reset</button>
      </div>

      <audio id="beep" ref={beepRef} src="https://www.soundjay.com/button/beep-07.wav" />
    </div>
  );
}

export default App;