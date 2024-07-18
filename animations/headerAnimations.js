export function headerAnimation({ parent }) {
  const parentEl = document.querySelector(parent);
  const logo = parentEl.querySelector('.logo');
  const mail = parentEl.querySelector('.mail-button');

  let direction = 0;

  const scroll = ScrollTrigger.create({
    onUpdate: (self) => {
      if (self.direction !== direction) {
        direction = self.direction;
        console.log("direction: ",direction);
        // gsap.to(logo, { autoAlpha: direction === 1 ? 0 : 1 });
        // gsap.to(mail, { autoAlpha: direction === 1 ? 0 : 1 });
        gsap.to(logo, { y: direction === 1 ? -50 : 0, marginTop: direction === 1 ? 0 : 55, duration: 0.4 });
        gsap.to(mail, { y: direction === 1 ? -50 : 0, marginTop: direction === 1 ? 0 : 55, duration: 0.4 });
      }
    }
  });
}