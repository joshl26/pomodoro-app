import React, { useState } from "react";
import howToImage from "../images/Pomodore_Technique.png";
import { Container } from "react-bootstrap";
import "./Help.css";

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen(!open);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleOpen();
    }
  };

  return (
    <>
      <dt
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-expanded={open}
        role="button"
        className={`faq-question${open ? " open" : ""}`}
      >
        {question}
      </dt>
      {open && <dd className="faq-answer">{answer}</dd>}
    </>
  );
};

const Help = () => {
  return (
    <Container
      as="main"
      className="help-container"
      tabIndex={-1}
      aria-label="Help and instructions for using the Pomodoro Timer app"
    >
      <h1 className="text-center">Help</h1>
      <div className="spacer" />

      <section className="overview" aria-labelledby="overview-title">
        <h2 id="overview-title">What is the Pomodoro Technique?</h2>
        <p>
          The Pomodoro Technique is a time management method developed by
          Francesco Cirillo. It helps you stay focused and mentally fresh by
          breaking work into intervals, traditionally 25 minutes in length,
          separated by short breaks.
        </p>
        <p>
          This technique encourages sustained concentration and regular rest,
          improving productivity and reducing burnout.
        </p>
      </section>

      <section className="usage" aria-labelledby="usage-title">
        <h2 id="usage-title">How to Use This Pomodoro Timer App</h2>
        <ol>
          <li>Pick a task you want to focus on.</li>
          <li>Start a 25-minute timer (called a Pomodoro).</li>
          <li>Work on your task without distractions until the timer rings.</li>
          <li>Take a 5-minute break (short break) to relax and recharge.</li>
          <li>
            After completing four Pomodoros, take a longer break of 15-30
            minutes (long break).
          </li>
          <li>Repeat the cycle to maintain productivity and focus.</li>
        </ol>
        <p>
          You can customize the length of each timer in the{" "}
          <strong>Settings</strong> page to fit your personal workflow.
        </p>
        <p>
          Enabling <em>auto-break</em> will automatically switch between work
          and break timers, so you can focus without manual intervention.
        </p>
      </section>

      <section className="benefits" aria-labelledby="benefits-title">
        <h2 id="benefits-title">Benefits of Using the Pomodoro Technique</h2>
        <ul>
          <li>
            Improves focus and concentration by working in short, dedicated
            bursts.
          </li>
          <li>Helps prevent burnout by encouraging regular breaks.</li>
          <li>Increases awareness of how you spend your time.</li>
          <li>
            Boosts motivation by providing a clear structure and achievable
            goals.
          </li>
          <li>
            Reduces procrastination by breaking tasks into manageable intervals.
          </li>
        </ul>
      </section>

      <section className="common-mistakes" aria-labelledby="mistakes-title">
        <h2 id="mistakes-title">Common Mistakes to Avoid</h2>
        <ul>
          <li>
            Skipping breaks, which can lead to fatigue and reduced productivity.
          </li>
          <li>Allowing distractions during Pomodoro sessions.</li>
          <li>
            Setting unrealistic timer lengths that don’t fit your work style.
          </li>
          <li>Not tracking completed Pomodoros to measure progress.</li>
          <li>
            Ignoring the need to adjust the technique to your personal needs.
          </li>
        </ul>
      </section>

      <section className="tips" aria-labelledby="tips-title">
        <h2 id="tips-title">Tips for Success</h2>
        <ul>
          <li>
            Eliminate distractions during your Pomodoro sessions (turn off
            notifications, close unrelated tabs).
          </li>
          <li>
            Use breaks to stand up, stretch, or take a short walk to refresh
            your mind and body.
          </li>
          <li>
            Adjust timer lengths in Settings if the defaults don’t fit your
            style.
          </li>
          <li>
            Track your completed Pomodoros to monitor your productivity over
            time.
          </li>
          <li>Be flexible—pause or extend sessions if needed.</li>
        </ul>
      </section>

      <section className="faq" aria-labelledby="faq-title">
        <h2 id="faq-title">Frequently Asked Questions</h2>
        <dl>
          <FAQItem
            question="Can I customize the timer durations?"
            answer="Yes! Visit the Settings page to adjust Pomodoro, short break, and long break lengths."
          />
          <FAQItem
            question="What does auto-break do?"
            answer="Auto-break automatically switches between work and break timers so you don’t have to manually start each session."
          />
          <FAQItem
            question="Can I disable sounds?"
            answer="Yes, you can toggle alarm and button sounds in the Settings page."
          />
          <FAQItem
            question="Is my progress saved?"
            answer="Your settings and timer states are saved locally in your browser, so they persist between sessions."
          />
          <FAQItem
            question="Can I use this app on mobile devices?"
            answer="Yes! The app is fully responsive and works well on phones and tablets."
          />
          <FAQItem
            question="What if I get interrupted during a Pomodoro?"
            answer="You can pause or reset the timer. Try to minimize interruptions for best results."
          />
        </dl>
      </section>

      <div className="spacer" />

      <figure className="align-center">
        <img
          src={howToImage}
          alt="Diagram illustrating the Pomodoro Technique workflow: work intervals followed by short and long breaks."
          className="howto-image"
        />
        {/* <figcaption className="text-muted">
          Pomodoro Technique overview
        </figcaption> */}
      </figure>
    </Container>
  );
};

export default Help;
