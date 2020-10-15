(function () {
  const canvas = document.getElementById("gameWindow"),
    ctx = canvas.getContext("2d"),
    startBtn = document.getElementById("start"),
    hardBtn = document.getElementById("hardMode"),
    timerTarget = document.getElementById("timer"),
    countTarget = document.getElementById("score"),
    countMissTarget = document.getElementById("miss"),
    scoreListTarget = document.getElementById("scoreList");
  let code,
    xPos = 340,
    yPos = 530,
    ballxPos,
    ballyPos,
    monsterX = random(760),
    monsterY = random(200),
    start = false,
    count = 0,
    countMiss = 0,
    timerStart,
    time,
    hard,
    playerList = [],
    inAnimation = false,
    hit;

  window.addEventListener("keydown", function (event) {
    if (event.key !== undefined) {
      code = event.key;
    }
    code == " " ? shoot() : moveCannon(code);
  });
  startBtn.addEventListener("click", () => {
    hard = false;
    gameStart();
  });
  hardBtn.addEventListener("click", () => {
    hard = true;
    gameStart();
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
          xPos = xPos == -10 ? xPos : xPos - 5;
          break;
        case "d":
        case "ArrowRight":
          xPos = xPos == 750 ? xPos : xPos + 5;
          break;
      }
    }
  }

  function shoot() {
    inAnimation ? "can't shoot" : shooting();
    async function shooting() {
      ballxPos = xPos + 25;
      ballyPos = yPos - 20;
      let exit = false;
      do {
        hit = false;
        inAnimation = true;
        const promise = new Promise((resolve) => {
          setTimeout(() => {
            draw();
            ballyPos -= 5;
            resolve(ballyPos);
          }, 5);
        });
        await promise;
        ballyPos <= -20 ? (exit = true) : (exit = false);
        if (ballyPos <= monsterY + 40) {
          if (ballxPos >= monsterX - 20 && ballxPos <= monsterX + 40) {
            addScore();
            ballyPos = -50;
            monsterX = random(760);
            monsterY = random(200);
            exit = true;
            hit = true;
          }
        }
      } while (!exit);
      console.log("out");
      inAnimation = false;
      hit ? "hit" : countMissed();
      moveCannon();
    }
  }

  function random(axe) {
    return Math.floor(Math.random() * axe);
  }
  let drawing = window.setInterval(function () {
    draw();
  }, 1);
  let timing = window.setInterval(function () {
    timer();
  }, 1000);

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

  function timer() {
    if (start) {
      time = Math.floor((Date.now() - timerStart) / 1000);
      timerTarget.innerHTML = time;
      if (hard) {
        if (time == 30) {
          reset();
          alert("You lose !");
        }
      }
    }
  }

  function addScore() {
    count++;
    countTarget.innerHTML = count;
    if (count == 10) {
      displayScore();
      reset();
      alert("You killed all of them !");
    }
  }
  function countMissed() {
    countMiss++;
    document.getElementById("miss").innerHTML = countMiss;
  }
  function displayScore() {
    playerList.push({ time: time, miss: countMiss });
    playerList.sort((a, b) => (a.time > b.time ? 1 : b.time > a.time ? -1 : 0));
    console.log(playerList);
    scoreListTarget.innerHTML = "<li>Yannick : 0.5s, 0 miss</li>";
    for (let i = 0; i < playerList.length; i++) {
      let newPlayer = document.createElement("li");
      newPlayer.innerHTML = `You : ${playerList[i].time}s, ${playerList[i].miss} miss`;
      scoreListTarget.appendChild(newPlayer);
    }
  }
  function gameStart() {
    timerStart = Date.now();
    start = true;
    startBtn.classList.add("d-none");
    hardBtn.classList.add("d-none");
  }
  function reset() {
    time = 0;
    count = 0;
    countMiss = 0;
    start = false;
    startBtn.classList.remove("d-none");
    hardBtn.classList.remove("d-none");
    startBtn.innerHTML = `Play again`;
    countTarget.innerHTML = "0";
    timerTarget.innerHTML = "0";
    countMissTarget.innerHTML = "0";
  }
})();
