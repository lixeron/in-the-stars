console.log("Written in the Stars for Libby loaded.");

const app = document.getElementById("app");
const startButton = document.getElementById("start-button");
const guideCat = document.getElementById("guide-cat");
const guideCatImg = document.getElementById("guide-cat-img");
const glow = document.getElementById("glow");
const catPlayer = document.getElementById("cat-player");
const catAudio = document.getElementById("cat-audio");
const catNowPlaying = document.getElementById("cat-now-playing");
const catSongs = {
  haruko: {
    label: "Haruko",
    src: "audio/Haruko.mp3"
  },
  sun: {
    label: "Sun",
    src: "audio/Sun.mp3"
  },
  love: {
    label: "Love",
    src: "audio/Love.mp3"
  },
  radio: {
    label: "Radio – Bershy",
    src: "audio/Radio.mp3"
  },
  kissme: {
    label: "Kiss Me – Sixpence None The Richer",
    src: "audio/Kiss_me.mp3"
  },
  bubbly: {
    label: "Bubbly – Colbie Caillat",
    src: "audio/Bubbly.mp3"
  }
};

function playCatSong(key, { fromUser = false } = {}) {
  const data = catSongs[key];
  if (!data || !catAudio) return;

  const nextIndex = catPlaylist.indexOf(key);
  if (nextIndex !== -1) {
    currentSongIndex = nextIndex;
  }

  catAudio.src = data.src;
  catAudio.currentTime = 0;

  catAudio.play().then(() => {
    if (catNowPlaying) {
      catNowPlaying.textContent = "Now playing: " + data.label;
    }
  }).catch(() => {
    // autoplay might be blocked unless there was a click; ignore
    if (fromUser && catNowPlaying) {
      catNowPlaying.textContent = "Now playing: " + data.label;
    }
  });
}

// pool for the random first song
const autoplayPool = ["haruko", "sun", "love"];

// full playlist order for auto-next
const catPlaylist = ["haruko", "sun", "love", "radio", "kissme", "bubbly"];
let currentSongIndex = null;

// Scene tracking for the left timeline
const visitedScenes = new Set();
let currentSceneKey = null;

// these are required to unlock the secret constellation
const mainSceneOrder = ["intro-cat", "beginnings", "adventures", "gifts", "final"];

  const authGate = document.getElementById("auth-gate");
  const authFirst = document.getElementById("auth-first");
  const authLast = document.getElementById("auth-last");
  const authSubmit = document.getElementById("auth-submit");
  const authError = document.getElementById("auth-error");

  function checkAuth() {
    if (!authFirst || !authLast || !authGate || !app) return;

    const first = authFirst.value.trim().toLowerCase();
    const last = authLast.value.trim().toLowerCase();

    if (first === "ethan" && last === "tran") {
      // success: hide gate, show main app
      authGate.classList.add("hidden");
      app.classList.remove("hidden");
      if (authError) authError.classList.add("hidden");

      // optional: focus Begin button
      const startBtn = document.getElementById("start-button");
      if (startBtn) startBtn.focus();
    } else {
      if (authError) authError.classList.remove("hidden");
      authFirst.focus();
    }
  }

  if (authSubmit) {
    authSubmit.addEventListener("click", (e) => {
      e.preventDefault();
      checkAuth();
    });
  }

  // allow pressing Enter in last name field
  if (authLast) {
    authLast.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        checkAuth();
      }
    });
  }

  const fullscreenBtn = document.getElementById("fullscreen-toggle");

  function isFullscreen() {
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  }

  function requestFs() {
    const el = document.documentElement;
    if (el.requestFullscreen) return el.requestFullscreen();
    if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
    if (el.mozRequestFullScreen) return el.mozRequestFullScreen();
    if (el.msRequestFullscreen) return el.msRequestFullscreen();
  }

  function exitFs() {
    if (document.exitFullscreen) return document.exitFullscreen();
    if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
    if (document.mozCancelFullScreen) return document.mozCancelFullScreen();
    if (document.msExitFullscreen) return document.msExitFullscreen();
  }

  function updateFsIcon() {
    if (!fullscreenBtn) return;
    fullscreenBtn.textContent = isFullscreen() ? "🗗" : "⛶";
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", () => {
      if (isFullscreen()) {
        exitFs();
      } else {
        requestFs();
      }
    });

    document.addEventListener("fullscreenchange", updateFsIcon);
    document.addEventListener("webkitfullscreenchange", updateFsIcon);
    document.addEventListener("mozfullscreenchange", updateFsIcon);
    document.addEventListener("MSFullscreenChange", updateFsIcon);

    // set initial icon
    updateFsIcon();
  }

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/* ------------------------- Helper Functions -------------------------*/
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function isSecretUnlocked() {
  return mainSceneOrder.every((key) => visitedScenes.has(key));
}

function updateTimelineUI() {
  const items = document.querySelectorAll(".timeline-item");
  const secretUnlocked = isSecretUnlocked();

  items.forEach((item) => {
    const sceneKey = item.getAttribute("data-scene");
    if (!sceneKey) return;

    item.classList.toggle("timeline-item-active", sceneKey === currentSceneKey);

    if (visitedScenes.has(sceneKey)) {
      item.classList.add("timeline-item-visited");
    } else {
      item.classList.remove("timeline-item-visited");
    }

    if (sceneKey === "secret") {
      if (secretUnlocked) {
        item.classList.remove("timeline-item-locked");
      } else {
        item.classList.add("timeline-item-locked");
      }
    }
  });
}

// Call this at the start of each scene to mark it visited
function enterScene(sceneKey) {
  currentSceneKey = sceneKey;
  visitedScenes.add(sceneKey);
  updateTimelineUI();
  window.scrollTo(0, 0); // scroll to top on scene change
}

function setSecretStars(on) {
  if (on) {
    document.body.classList.add("secret-stars");
  } else {
    document.body.classList.remove("secret-stars");
  }
}


function setupTimeline() {
  const items = document.querySelectorAll(".timeline-item");

  items.forEach((item) => {
    const sceneKey = item.getAttribute("data-scene");
    if (!sceneKey) return;

    item.addEventListener("click", () => {
      // Secret is gated
      if (sceneKey === "secret" && !isSecretUnlocked()) {
        return; // ignore clicks until unlocked
      }

      switch (sceneKey) {
        case "intro-cat":
          showScene1();
          break;
        case "beginnings":
          showBeginningsScene();
          break;
        case "adventures":
          showAdventuresScene();
          break;
        case "gifts":
          showGiftsScene();
          break;
        case "final":
          showFinalScene();
          break;
        case "secret":
          showSecretScene();
          break;
        case "intro-title":
        default:
          // we’ll leave title as non-functional for now
          break;
      }
    });
  });

  updateTimelineUI();
}


function setupCatJukebox() {
  const guideCat = document.getElementById("guide-cat");
  const catPlayer = document.getElementById("cat-player");
  const catAudio = document.getElementById("cat-audio");
  const catNowPlaying = document.getElementById("cat-now-playing");
  const songButtons = document.querySelectorAll(".cat-song-button");

  if (!guideCat || !catPlayer || !catAudio) return;

  // make sure cat looks clickable
  guideCat.style.cursor = "pointer";

  // clicking the cat toggles the jukebox panel
  guideCat.addEventListener("click", () => {
    const isHidden = catPlayer.classList.contains("hidden");
    if (isHidden) {
      catPlayer.classList.remove("hidden");
      catPlayer.classList.add("visible");
    } else {
      catPlayer.classList.remove("visible");
      catPlayer.classList.add("hidden");
    }
  });

  // when a song ends, move to the next one in the playlist
  catAudio.addEventListener("ended", () => {
    if (currentSongIndex == null) return;
    const nextIndex = (currentSongIndex + 1) % catPlaylist.length;
    const nextKey = catPlaylist[nextIndex];
    playCatSong(nextKey);
  });

  // clicking a song plays it and updates playlist position
  songButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-song");
      playCatSong(key, { fromUser: true });
    });
  });
}

function setSceneScroll(allowScroll) {
  document.body.style.overflowY = allowScroll ? "auto" : "hidden";
  // always keep horizontal locked
  document.body.style.overflowX = "hidden";
}

function setBackgroundVariant(variant) {
  if (!glow) return;

  let imageUrl = "";

  switch (variant) {
    case "intro":
      imageUrl = 'url("backgrounds/back1.gif")';
      break;

    // First two constellations
    case "constellations1":
    case "constellations": // fallback if you ever use this name
      imageUrl = 'url("backgrounds/back4.gif")';
      break;

    // Third & fourth constellations
    case "constellations2":
      imageUrl = 'url("backgrounds/back5.gif")';
      break;

    // Secret constellation
    case "secret":
      imageUrl = 'url("backgrounds/back3.gif")';
      break;

    default:
      return;
  }

  // avoid pointless transitions if already on this background
  if (glow.dataset.bgVariant === variant) return;

  glow.dataset.bgVariant = variant;

  // fade out, swap image, fade in
  glow.style.opacity = 0;
  setTimeout(() => {
    glow.style.backgroundImage = imageUrl;
    glow.style.opacity = 1;
  }, 250);
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/




if (app && startButton) {
  startButton.addEventListener("click", () => {
    // start a random song from Haruko / Sun / Love once
    if (currentSongIndex === null && autoplayPool.length > 0) {
      const randomKey =
        autoplayPool[Math.floor(Math.random() * autoplayPool.length)];
      // run inside the click = user gesture, autoplay allowed
      playCatSong(randomKey, { fromUser: true });
    }

    // Fade the title screen out
    app.classList.remove("fade-in");
    app.classList.add("fade-out");

    const handleAnimationEnd = (event) => {
      if (event.animationName !== "cardFadeOut") return;

      app.removeEventListener("animationend", handleAnimationEnd);
      showScene1();
    };

    app.addEventListener("animationend", handleAnimationEnd);
  });
}
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/* ------------------------- Main Functions ------------------------- */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function showScene1() {
  setBackgroundVariant("intro");
    setSceneScroll(false);
    setSecretStars(false);
    if (app) app.classList.remove("frameless");


    if (guideCat) guideCat.classList.add("hidden");
    enterScene("intro-cat");
  app.innerHTML = `
    <div class="scene scene-intro">
      <div class="cat-wrapper">
        <div class="cat-image">
          <img src="cats/first.gif" alt="A little white cat gif" />
        </div>
        <p class="cat-caption">A cute white cat settles beside you; speaking with you"</p>
      </div>

      <h2 class="scene-heading">Hello there Libby! 💫</h2>

      <p class="scene-text">
        This is a little, rough, put together journey I will guide you through!
        No Worries, I won't do too much speaking~
      </p>
      <p class="scene-text">
        Someone who thinks you're pretty amazing made this for you.
      </p>
      <p class="scene-text">
        When you're ready, click continue and we'll begin this adventure!
      </p>

      <button class="primary-button" id="continue-button">Continue</button>
    </div>
  `;

  app.classList.remove("fade-out");
  app.classList.add("fade-in");

  const continueButton = document.getElementById("continue-button");
  if (continueButton) {
    continueButton.addEventListener("click", () => {
      // Fade out Scene 1, then show Constellation I
      app.classList.remove("fade-in");
      app.classList.add("fade-out");

      const handleAnimationEnd = (event) => {
        if (event.animationName !== "cardFadeOut") return;

        app.removeEventListener("animationend", handleAnimationEnd);
        showBeginningsScene();
      };

      app.addEventListener("animationend", handleAnimationEnd);
    });
  }
}

function showBeginningsScene() {
  setBackgroundVariant("constellations1");
  setSceneScroll(true);
    setSecretStars(false);
    if (app) app.classList.remove("frameless");


    if (guideCat && guideCatImg) {
        guideCatImg.src = "cats/walk.gif";
        guideCat.classList.remove("hidden");
    }
  const events = [
    {
      id: "friends",
      text: "We started out as friends hanging out every Saturday, just getting to know each other (Made my infamous chocolate incident)."
    },
    {
      id: "confession",
      text: "At the end of our semester of us getting to know each other, I finally confessed to you in May."
    },
    {
      id: "london",
      text: "You spent the summer thinking about it (and cleansing the fact I'm not gay) while also enjoying your time in London."
    },
    {
      id: "phone-call",
      text: 'Near the end of summer, you called and said, "So do you wanna go on a date?", to which I said "I would love to."'
    },
    {
      id: "first-date",
      text: "Our first date: karaoke and Japanese curry that I cooked for us. Not absurd, but cute"
    },
    {
      id: "six-flags",
      text: "Our second date: Six Flags, brought up by you, which was so much fun (not for my wallet)."
    },
    {
      id: "first-anniversary",
      text: "We officially have been dating for over a year!"
    },
    {
      id: "current",
      text: "Approaching year 3 of knowing each other and 1 and a half year of dating!"
    }
  ];

  const shuffled = [...events].sort(() => Math.random() - 0.5);
    enterScene("beginnings");
  app.innerHTML = `
    <div class="scene scene-beginnings">
      <h2 class="scene-heading">Constellation I: Our Beginnings</h2>
      <p class="scene-text">
        Everyone's romance has a beginning. These are some of my milestones in ours.
      </p>
      <p class="timeline-instructions">
        Drag the stars up and down to put these moments in the order you think they happened.
        When you're ready, click the button and I'll show you how I remember it.
      </p>

      <div class="event-grid" id="event-grid">
        ${shuffled
          .map(
            (ev) => `
          <div class="event-card" draggable="true" data-id="${ev.id}">
            <span class="event-label">★</span>
            <span class="event-text">${ev.text}</span>
          </div>
        `
          )
          .join("")}
      </div>

      <div class="chosen-container">
        <h3 class="scene-subheading">Your timeline:</h3>
        <ol id="chosen-list" class="chosen-list"></ol>
      </div>

      <div class="controls-row">
        <button class="secondary-button" id="reset-order">Shuffle again</button>
        <button class="primary-button" id="check-order">See how I remember it</button>
      </div>

      <p id="status-message" class="status-message"></p>

      <button class="primary-button" id="beginnings-continue" style="display:none; margin-top: 0.5rem;">
        Continue the journey
      </button>
    </div>
  `;

  app.classList.remove("fade-out");
  app.classList.add("fade-in");

  const eventGrid = document.getElementById("event-grid");
  const chosenList = document.getElementById("chosen-list");
  const statusMessage = document.getElementById("status-message");
  const resetButton = document.getElementById("reset-order");
  const checkButton = document.getElementById("check-order");
  const continueButton = document.getElementById("beginnings-continue");


  function updateChosenFromDOM() {
    if (!chosenList || !eventGrid) return;
    const cards = Array.from(eventGrid.querySelectorAll(".event-card"));
    chosenList.innerHTML = "";
    cards.forEach((card) => {
      const id = card.getAttribute("data-id");
      const ev = events.find((e) => e.id === id);
      if (!ev) return;
      const li = document.createElement("li");
      li.textContent = ev.text;
      chosenList.appendChild(li);
    });
  }

  // Drag & drop logic
  let draggedElement = null;

  function handleDragStart(e) {
    draggedElement = this;
    this.classList.add("dragging");
  }

  function handleDragEnd(e) {
    this.classList.remove("dragging");
    draggedElement = null;
    updateChosenFromDOM();
  }

  function getDragAfterElement(container, y) {
    const cards = Array.from(
      container.querySelectorAll(".event-card:not(.dragging)")
    );
    let closest = { offset: Number.NEGATIVE_INFINITY, element: null };

    cards.forEach((child) => {
      const box = child.getBoundingClientRect();
      const offset = y - (box.top + box.height / 2);
      if (offset < 0 && offset > closest.offset) {
        closest = { offset, element: child };
      }
    });

    return closest.element;
  }

  if (eventGrid) {
    eventGrid.addEventListener("dragover", (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(eventGrid, e.clientY);
      const dragging = eventGrid.querySelector(".event-card.dragging");
      if (!dragging) return;

      if (afterElement == null) {
        eventGrid.appendChild(dragging);
      } else {
        eventGrid.insertBefore(dragging, afterElement);
      }
    });

    const cards = eventGrid.querySelectorAll(".event-card");
    cards.forEach((card) => {
      card.addEventListener("dragstart", handleDragStart);
      card.addEventListener("dragend", handleDragEnd);
    });
  }

  // Initial render of "Your timeline" (random order)
  updateChosenFromDOM();

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      // Just re-show the scene, which re-shuffles
      app.classList.remove("fade-in");
      app.classList.add("fade-out");

      const handleAnimationEnd = (event) => {
        if (event.animationName !== "cardFadeOut") return;
        app.removeEventListener("animationend", handleAnimationEnd);
        showBeginningsScene();
      };

      app.addEventListener("animationend", handleAnimationEnd);
    });
  }

  if (checkButton) {
    checkButton.addEventListener("click", () => {
      if (!eventGrid) return;
      const currentIds = Array.from(
        eventGrid.querySelectorAll(".event-card")
      ).map((card) => card.getAttribute("data-id"));

      const correctOrderIds = events.map((e) => e.id);
      const isCorrect = correctOrderIds.every(
        (id, index) => id === currentIds[index]
      );

      if (isCorrect) {
        statusMessage.innerHTML =
          "That's exactly how I remember it too. Thank you for walking back through it with me. 💫";
      } else {
        statusMessage.innerHTML = `
          Even if the order isn't perfect, here's how I remember it:<br><br>
          ${events.map((e) => "• " + e.text).join("<br>")}
        `;
      }

      if (continueButton) {
        continueButton.style.display = "inline-block";
      }
    });
  }

  if (continueButton) {
    continueButton.addEventListener("click", () => {
      // fade out this scene, then show Constellation II
      app.classList.remove("fade-in");
      app.classList.add("fade-out");

      const handleAnimationEnd = (event) => {
        if (event.animationName !== "cardFadeOut") return;
        app.removeEventListener("animationend", handleAnimationEnd);
        showAdventuresScene();
      };

      app.addEventListener("animationend", handleAnimationEnd);
    });
  }
}
function showAdventuresScene() {
  setBackgroundVariant("constellations1");
  setSceneScroll(false);
    setSecretStars(false);
    if (app) app.classList.remove("frameless");
  // shift the glow a bit for this scene (tweak degrees if you want)


    // guide cat in bottom-right using circles gif
    if (guideCat && guideCatImg) {
        guideCatImg.src = "cats/circles.gif";
        guideCat.classList.remove("hidden");
    }

    enterScene("adventures");

    app.innerHTML = `
        <div class="scene scene-adventures">
        <h2 class="adventures-heading">Constellation II: Adventures Together</h2>
        <p class="adventures-intro">
            Some of my favorite memories with you are the little adventures we've gone on.
            Pick one of these buttons and I'll tell you about it.
        </p>

        <div class="memory-orbit">
            <button class="memory-bubble" data-memory="birthday">
            <span>His Birthday</span>
            </button>
            <button class="memory-bubble" data-memory="sports">
            <span>Sports</span>
            </button>
            <button class="memory-bubble" data-memory="cozy">
            <span>Cozy days</span>
            </button>
        </div>

        <div id="memory-cloud" class="memory-cloud hidden">
            <div class="memory-cloud-title" id="memory-title"></div>
            <div class="memory-cloud-text" id="memory-text"></div>
            <div class="memory-choices" id="memory-choices"></div>
            <div class="choice-response" id="choice-response"></div>
        </div>

        <button class="primary-button adventures-continue" id="adventures-continue" style="display:none;">
            Continue the journey
        </button>
        </div>
    `;

    app.classList.remove("fade-out");
    app.classList.add("fade-in");

    const memoryCloud = document.getElementById("memory-cloud");
    const memoryTitle = document.getElementById("memory-title");
    const memoryText = document.getElementById("memory-text");
    const memoryChoices = document.getElementById("memory-choices");
    const choiceResponse = document.getElementById("choice-response");
    const continueButton = document.getElementById("adventures-continue");

    const bubbles = Array.from(document.querySelectorAll(".memory-bubble"));
    const visited = new Set();

    const memoryData = {
        birthday: {
        title: "Celebrating His Birthay",
        text: "We celebrated my 20th birthday together. None of my friends could make and I was down about it, but you were there with my family. Genuiely, one of the best birthdays of my life.",
        choices: [
            { id: "Swimsuit", label: "You looked amazing in that swimsuit!" },
            { id: "Beach", label: "What were you favorite moments?" }
        ],
        responses: {
            Swimsuit: "You looked equally (I mean I'm slightly better, but I'll be nice) beautiful in yours <3.",
            Beach: "Ah, walking with you along the shore, holding you in the water, and me floating in it drifting off~"
        }
        },
        "sports": {
        title: "Doing Physical Sport Dates",
        text: "I can't beat you... Every time we have been on a date that has involved physical acitivties like bowling, golf, and even mini-golf I always lose..",
        choices: [
            { id: "TopGolf", label: "U suck lol" },
            { id: "Bowling", label: "Keep trying lol" }
        ],
        responses: {
            TopGolf: "If you picked this you are just a dick. I try FYI and saying that is plain out rude... I'll beat you someday just wait...",
            Bowling: "Even on your bad days you still win... I just haven't went all out yet. I hope you picked this response, and I am trying to do better!"
        }
        },
        cozy: {
        title: "Cozy days",
        text: "Not every adventure needed tickets or road trips. Some of my favorite memories are just us hanging out be it watching something, talking, or just being with you. Couldn't ask for more.",
        choices: [
            { id: "movies", label: "Movie/couch/bed/car days" },
            { id: "space", label: "Being with you" }
        ],
        responses: {
            movies: "Elite snuggle strategy. I am there for that warmth and amazing bed(s). Mwahaha... I also get to watch so many new movies and shows with you. Like going through a new experience; I love it.",
            space: "No matter what, I love being with you. Doesn't matter where because the best part of any adventure will always be you."
        }
        }
    };

    function updateContinueVisibility() {
        if (!continueButton) return;
        if (visited.size === bubbles.length) {
        continueButton.style.display = "inline-block";
        }
    }

    bubbles.forEach((bubble) => {
        bubble.addEventListener("click", () => {
        const key = bubble.getAttribute("data-memory");
        const data = memoryData[key];
        if (!data || !memoryCloud || !memoryTitle || !memoryText || !memoryChoices || !choiceResponse) return;

        visited.add(key);
        bubble.classList.add("visited");
        updateContinueVisibility();

        memoryTitle.textContent = data.title;
        memoryText.textContent = data.text;

        // reset choices
        memoryChoices.innerHTML = "";
        choiceResponse.textContent = "";

        data.choices.forEach((choice) => {
            const btn = document.createElement("button");
            btn.className = "choice-pill";
            btn.textContent = choice.label;
            btn.addEventListener("click", () => {
            const resp = data.responses[choice.id];
            if (resp) {
                choiceResponse.innerHTML = resp;
            } else {
                choiceResponse.textContent = "";
            }
            });
            memoryChoices.appendChild(btn);
        });

        memoryCloud.classList.remove("hidden");
        });
    });

        if (continueButton) {
        continueButton.addEventListener("click", () => {
            app.classList.remove("fade-in");
            app.classList.add("fade-out");

            const handleAnimationEnd = (event) => {
            if (event.animationName !== "cardFadeOut") return;
            app.removeEventListener("animationend", handleAnimationEnd);
            showGiftsScene();
            };

            app.addEventListener("animationend", handleAnimationEnd);
        });
        }
    }

function showGiftsScene() {
  setBackgroundVariant("constellations2");
  setSceneScroll(false);
  setSecretStars(false);
  // new hue for this constellation


  // idle cat in bottom-right
  if (guideCat && guideCatImg) {
    guideCatImg.src = "cats/idle.gif";
    guideCat.classList.remove("hidden");
  }

  // remove card styling for this scene
  if (app) {
    app.classList.add("frameless");
  }

  enterScene("gifts");

  app.innerHTML = `
    <div class="scene scene-gifts">
      <h2 class="gifts-heading">Constellation III: Little Things I Get You</h2>
      <p class="gifts-intro">
        This constellation is made of the tiny things I put time/thought into because they were for you.
      </p>

      <div class="gift-sky">
        <div class="gift-orb lily" data-gift="lily">
          <span>Tiger lily</span>
        </div>
        <div class="gift-orb valentines" data-gift="valentines">
          <span>Valentine&apos;s dinner</span>
        </div>
        <div class="gift-orb music" data-gift="music">
          <span>Music Box</span>
        </div>
        <div class="gift-orb painting" data-gift="painting">
          <span>Our painting</span>
        </div>
        <div class="gift-orb figures" data-gift="figures">
          <span>Figures</span>
        </div>
      </div>

      <div class="gift-cloud" id="gift-cloud">
        <div class="gift-cloud-title" id="gift-title"></div>
        <div class="gift-cloud-text" id="gift-text"></div>
      </div>

      <p class="gift-progress" id="gift-progress">
        Click a little planet to see the tiny story behind it.
      </p>

      <button class="primary-button" id="gifts-continue" style="display:none;">
        Continue the journey
      </button>
    </div>
  `;

  app.classList.remove("fade-out");
  app.classList.add("fade-in");

  const giftCloud = document.getElementById("gift-cloud");
  const giftTitle = document.getElementById("gift-title");
  const giftText = document.getElementById("gift-text");
  const giftProgress = document.getElementById("gift-progress");
  const giftsContinue = document.getElementById("gifts-continue");
  const giftOrbs = Array.from(document.querySelectorAll(".gift-orb"));

  const visitedGifts = new Set();

  const giftData = {
    lily: {
      title: "Tiger lily",
      text:
        "I twisted pipe cleaners and painted them because I wanted you to have your favorite flower even though it wasn't real. You loved it so much that it made every little smear of paint worth it."
    },
    valentines: {
      title: "Valentine's dinner",
      text:
        "I went full try-hard mode with Marry Me Chicken and decorating my whole place (with the help of my friends), because you deserved a Valentine's that felt like it was all about you! An experience like none you've recieved before."
    },
    music: {
      title: "Music Box",
      text:
        "From one of my personal favorite Disney movies ever, but like music boxified. This was one of the first gifts I got you, wasn't too sure if you'd like it, but when I listen to it I think of you. Hopefully it does the same for you."
    },
    painting: {
      title: "Our painting",
      text:
        "I commissioned that painting of us because I wanted something that captured us in a way a selfie never could. It's one of the gifts that I am most happy about getting you. We look like such an adorable couple."
    },
    figures: {
      title: "The Figures of Us",
      text:
        "I love custom made things to be gifts and when I saw we could get Funko Pops of us I had to get it! We look like cartoon characters or something. It was cool and kinda dorky I liked it. Sorry they didn't have your hair color though. Their fault not mine."
    }
  };

  function updateGiftProgress() {
    if (!giftProgress) return;
    const total = giftOrbs.length;
    const seen = visitedGifts.size;

    if (seen === 0) {
      giftProgress.textContent =
        "Click a little bubble to see the tiny story behind it.";
    } else if (seen < total) {
      giftProgress.textContent =
        "You’ve uncovered " + seen + " out of " + total + " little stories.";
    } else {
      giftProgress.textContent =
        "You’ve found all of them. These gifts will never amount to how much joy you give me though.";
      if (giftsContinue) {
        giftsContinue.style.display = "inline-block";
      }
    }
  }

  giftOrbs.forEach((orb) => {
    orb.addEventListener("click", () => {
      const key = orb.getAttribute("data-gift");
      const data = giftData[key];
      if (!data || !giftCloud || !giftTitle || !giftText) return;

      visitedGifts.add(key);
      orb.classList.add("visited");
      updateGiftProgress();

      giftTitle.innerHTML = data.title;
      giftText.innerHTML = data.text;

      giftCloud.classList.add("visible");
    });
  });

  updateGiftProgress();

  if (giftsContinue) {
    giftsContinue.addEventListener("click", () => {
      app.classList.remove("fade-in");
      app.classList.add("fade-out");

      const handleAnimationEnd = (event) => {
        if (event.animationName !== "cardFadeOut") return;
        app.removeEventListener("animationend", handleAnimationEnd);
        showFinalScene();
      };

      app.addEventListener("animationend", handleAnimationEnd);
    });
  }
}
function showFinalScene() {
    setBackgroundVariant("constellations2");
    setSceneScroll(false);
    setSecretStars(false);
    // last hue shift – soft, calm color


    // dancing cat for the finale
    if (guideCat && guideCatImg) {
        guideCatImg.src = "cats/dance.gif"; // make sure this filename matches your actual gif
        guideCat.classList.remove("hidden");
    }

    // keep frameless look for the ending
    if (app) {
        app.classList.add("frameless");
    }
    enterScene("final");
    app.innerHTML = `
        <div class="scene scene-final">
        <h2 class="final-heading">Our Little Starry Story</h2>

        <p class="final-text">
            Thank you for being the person I get to have all of these memories with.
            You make my everyday life feel a lot less ordinary and a lot more like
            something I want to keep showing up for.
        </p>

        <p class="final-text">
            I've never been so grateful for the fact that I get to grow, laugh, mess up, learn, and keep trying
            again with you. You make me want to be better, and you make
            everything softer just by being there. I know we will make mistakes down the road with each other, maybe argue and get 
            into quarrels... but I know we will be there for each other and understand. I feel very confident in our relationship 
            and I will hold onto the promises I've made you as well as improve as both a person and a partner.
        </p>

        <p class="final-note">
            There is only so much to say here; the stars here can only say so much, though. For the real surprise,
            you have to talk to the Ethan in real life. He's been working hard at this...
            just for you. ✨
        </p>

        <div class="final-buttons">
            <button class="primary-button" id="final-restart">
            See the stars again
            </button>
        </div>
        </div>
    `;

    app.classList.remove("fade-out");
    app.classList.add("fade-in");

    const restartButton = document.getElementById("final-restart");
    if (restartButton) {
        restartButton.addEventListener("click", () => {
        // go back to the intro scene (or scene 1, your choice)
        showScene1();
        });
    }
    }

function showSecretScene() {
    setBackgroundVariant("secret");
    setSceneScroll(false);

    // special cat gif for the secret scene
    if (guideCat && guideCatImg) {
        guideCatImg.src = "cats/yawn.gif"; // change if you want a different one
        guideCat.classList.remove("hidden");
    }

    if (app) {
        app.classList.add("frameless");
    }

    enterScene("secret");

    app.innerHTML = `
        <div class="scene scene-secret">
        <div class="secret-intro">
            <h2 class="secret-heading">Secret Constellation: Us</h2>

            <p class="secret-text">
            You found the secret constellation. This one isn't about quests, choices, or like anything before.
            It's just about you and me, and all the little moments that keep replaying
            in my head when I think about us.
            </p>

            <p class="secret-note">
            If you're ready, you can peek into a tiny film strip I made of our life so far.
            It's not every moment, but it's a little gallery of times I'm
            really glad I got to spend with you, when I am the most happy. Promise ya I will support you through thick and then
            thin, and be there for you no matter what. <3
            unless I die or smth lol.
            </p>

            <div class="secret-actions">
            <button class="primary-button" id="view-moments">
                View moments from our life
            </button>
            </div>
        </div>

        <div class="secret-gallery" id="secret-gallery">
            <p class="secret-gallery-note">
            I don't think I'll ever get tired looking at these. Thank you for being you! Merry Christmas (part 1)!
            </p>
            <div class="film-strip">
            <div class="film-strip-inner" id="film-track"></div>
            </div>
        </div>
        </div>
    `;

    app.classList.remove("fade-out");
    app.classList.add("fade-in");

    const intro = document.querySelector(".secret-intro");
    const viewButton = document.getElementById("view-moments");
    const gallery = document.getElementById("secret-gallery");
    const filmTrack = document.getElementById("film-track");
    setSecretStars(true);
    // build the film strip with your images (once)
    if (filmTrack) {
        const totalImages = 30; // how many photos you have
        const sources = [];
        for (let i = 1; i <= totalImages; i++) {
        sources.push(`photos/${i}.jpeg`); // adjust path if needed
        }

        sources.forEach((src, index) => {
        const frame = document.createElement("div");
        frame.className = "film-frame";

        const img = document.createElement("img");
        img.src = src;
        img.alt = "Moment " + (index + 1);

        frame.appendChild(img);
        filmTrack.appendChild(frame);
        });
    }

    function startFilmAnimation() {
        if (!filmTrack) return;
        const filmStrip = document.querySelector(".film-strip");
        if (!filmStrip) return;

        const distance = filmTrack.scrollWidth - filmStrip.clientWidth;
        const durationSeconds = 60; // one full pass = 30s

        if (distance > 0) {
        filmTrack.style.setProperty("--film-scroll-distance", distance + "px");
        filmTrack.style.animation = `filmScrollFull ${durationSeconds}s linear infinite`;
        }
    }

    if (viewButton && intro && gallery) {
        viewButton.addEventListener("click", () => {
        // fade out intro text + button
        intro.classList.add("secret-intro-hidden");
        // fade in gallery
        gallery.classList.add("secret-gallery-visible");

        // wait one frame so layout updates, then start animation
        requestAnimationFrame(() => {
            startFilmAnimation();
        });
        });
    }
    }



document.addEventListener("DOMContentLoaded", () => {
  setupCatJukebox();
  setupTimeline();
  setBackgroundVariant("intro");
  
});

