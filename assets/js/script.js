(function () {
  const canvas = document.getElementById("gameWindow"),
    ctx = canvas.getContext("2d");
  startBtn = document.getElementById("start");
  let code,
    xPos = 330,
    yPos = 530,
    ballxPos,
    ballyPos,
    monsterX = random(780),
    monsterY = random(200),
    start = false,
    count = 0;

  window.addEventListener("keydown", function (event) {
    if (event.key !== undefined) {
      code = event.key;
    }
    code == " " ? shoot() : moveCannon(code);
  });
  startBtn.addEventListener("click", () => {
    start = true;
    startBtn.classList.add("d-none");
  });

  function moveCannon(event) {
    if (event) {
      switch (event) {
        case "z":
        case "ArrowUp":
          yPos = yPos == 0 ? yPos : yPos - 5;
          break;
        case "s":
        case "ArrowDown":
          yPos = yPos == 530 ? yPos : yPos + 5;
          break;
        case "q":
        case "ArrowLeft":
          xPos = xPos == 0 ? xPos : xPos - 5;
          break;
        case "d":
        case "ArrowRight":
          xPos = xPos == 730 ? xPos : xPos + 5;
          break;
      }
    }
  }

  function shoot() {
    ballxPos = xPos + 25;
    ballyPos = yPos - 20;

    shooting();
    async function shooting() {
      let exit = false;
      do {
        const promise = new Promise((resolve) => {
          setTimeout(() => {
            draw();
            ballyPos -= 5;
            resolve(ballyPos);
          }, 5);
        });
        await promise;
        if (ballyPos <= monsterY + 40) {
          if (ballxPos >= monsterX - 20 && ballxPos <= monsterX + 40) {
            addScore();
            ballyPos = -50;
            monsterX = random(780);
            monsterY = random(200);
            exit = true;
          }
        }
      } while ((ballyPos < 0) ^ !exit);
      moveCannon();
    }
  }

  function random(axe) {
    return Math.floor(Math.random() * axe);
  }
  let drawing = window.setInterval(function () {
    draw();
  }, 1);

  function draw() {
    //Cannon Ball
    if (start) {
      const cannonBall = new Image();
      cannonBall.src = "assets/img/cannonBall.svg";

      cannonBall.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        moveCannon();
        ctx.drawImage(cannonBall, ballxPos, ballyPos);
      };

      //Monster
      const monster = new Image();
      monster.src = "assets/img/Monster.svg";
      monster.onload = function () {
        ctx.drawImage(monster, monsterX, monsterY);
      };

      //Cannon
      const cannon = new Image();
      cannon.src = "assets/img/cannon.svg";
      cannon.onload = function () {
        ctx.drawImage(cannon, xPos, yPos);
      };
    }
  }
  function addScore() {
    count++;
    document.getElementById("score").innerHTML = count;
    if (count == 10) {
      count = 0;
      start = false;
      alert("You killed all of them !");
      startBtn.classList.add("d-block");
      startBtn.innerHTML = `Play again`;
      document.getElementById("score").innerHTML = "0";
    }
  }
})();
