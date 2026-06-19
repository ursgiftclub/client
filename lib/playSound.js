export const playSound = () => {
  try {
    const audio = new Audio(`/sounds/cart.mp3`);

    audio.volume = 0.5;

    audio.play();
  } catch (error) {
    console.log("Sound failed");
  }
};
