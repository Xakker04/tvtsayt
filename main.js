const revealTargets = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("reveal-in");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

revealTargets.forEach((el) => revealObserver.observe(el));

const reasonCards = document.querySelectorAll(".reason-card.reason-left, .reason-card.reason-right");
const reasonObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const rowIndex = Math.floor(entry.target.dataset.reasonIndex / 2);
      const delay = rowIndex * 220;
      if (entry.target.dataset.reasonTimer) {
        window.clearTimeout(Number(entry.target.dataset.reasonTimer));
      }
      const timerId = window.setTimeout(() => {
        entry.target.classList.add("reason-anim");
      }, delay);
      entry.target.dataset.reasonTimer = String(timerId);
    } else {
      entry.target.classList.remove("reason-anim");
    }
  });
}, { threshold: 0.3 });

reasonCards.forEach((el, idx) => {
  el.dataset.reasonIndex = String(idx);
  reasonObserver.observe(el);
});

const logoutBtn = document.querySelector(".logout-btn");
if (logoutBtn) {
  let logoutAnimating = false;
  const walkIcon = logoutBtn.querySelector(".walk-icon");
  const legLeft = walkIcon ? walkIcon.querySelector(".leg-left") : null;
  const legRight = walkIcon ? walkIcon.querySelector(".leg-right") : null;
  const arm = walkIcon ? walkIcon.querySelector(".arm") : null;
  const walkFrames = [
    {
      legLeft: "M8.2 13.2 L9.2 19.2 L7 19.2 Z",
      legRight: "M11 13.2 L12.8 19 L10.6 19.2 Z",
      arm: { x: 10.8, y: 10.8 }
    },
    {
      legLeft: "M8.4 13.2 L7.2 18.2 L9.2 18.6 Z",
      legRight: "M11 13.2 L13.6 18.4 L11.6 19 Z",
      arm: { x: 10.2, y: 11.2 }
    }
  ];
  logoutBtn.addEventListener("click", () => {
    if (logoutAnimating) {
      return;
    }
    logoutAnimating = true;
    logoutBtn.classList.add("is-anim");
    let frame = 0;
    let walkTimer = null;
    if (legLeft && legRight && arm) {
      const applyFrame = (idx) => {
        const f = walkFrames[idx];
        legLeft.setAttribute("d", f.legLeft);
        legRight.setAttribute("d", f.legRight);
        arm.setAttribute("x", f.arm.x);
        arm.setAttribute("y", f.arm.y);
      };
      applyFrame(frame);
      walkTimer = window.setInterval(() => {
        frame = (frame + 1) % walkFrames.length;
        applyFrame(frame);
      }, 140);
    }
    window.setTimeout(() => {
      logoutBtn.classList.remove("is-anim");
      if (walkTimer) {
        window.clearInterval(walkTimer);
      }
      if (legLeft && legRight && arm) {
        legLeft.setAttribute("d", walkFrames[0].legLeft);
        legRight.setAttribute("d", walkFrames[0].legRight);
        arm.setAttribute("x", walkFrames[0].arm.x);
        arm.setAttribute("y", walkFrames[0].arm.y);
      }
      logoutAnimating = false;
    }, 1500);
  });
}
