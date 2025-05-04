

export function getCenterX(scene) {
    return scene.sys.canvas.width / 2;
}

export function getCenterY(scene) {
    return scene.sys.canvas.height / 2;
}

export function getWidth(scene) {
    return scene.sys.canvas.width;
}

export function getHeight(scene) {
    return scene.sys.canvas.height;
}

 // Quiz system data
 export let quizData = [
  {
    question: "Which item makes Mario grow bigger?",
    options: ["Fire Flower", "Super Mushroom", "Star", "Coin"],
    correctAnswer: 1  // Super Mushroom
  },
  {
    question: "Which princess does Mario try to rescue?",
    options: ["Princess Zelda", "Princess Daisy", "Princess Peach", "Princess Rosalina"],
    correctAnswer: 2 // Princess Peach
  },
  {
    question: "What is the name of the most common enemy in Mario games?",
    options: ["Bowser", "Koopa", "Goomba", "Bullet Bill"],
    correctAnswer: 2 // Goomba
  },
  {
    question: "Which item gives Mario temporary invincibility?",
    options: ["Super Mushroom", "Fire Flower", "1-Up Mushroom", "Star"],
    correctAnswer: 3    // Star
  },
  {
    question: "Which power-up allows Mario to throw fireballs?",
    options: ["Super Mushroom", "Fire Flower", "Ice Flower", "Tanooki Suit"],
    correctAnswer: 1 // Fire Flower
  }
];