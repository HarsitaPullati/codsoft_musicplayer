// ---------- 1. Your songs (file names must match the files in the songs folder) ----------
const songs = [
  { title: "Vachindamma",            artist: "Movie: Geetha Govindam",         src: "songs/vachindamma.mp3", cover: "images/cover1.jpg" },
  { title: "Padi Padi Leche Manasu", artist: "Movie: Padi Padi Leche Manasu",  src: "songs/padipadi.mp3",    cover: "images/cover2.jpg" }
];

// ---------- 2. Get the page elements ----------
const audio      = document.getElementById('audio');
const cover      = document.getElementById('cover');
const titleEl    = document.getElementById('title');
const artistEl   = document.getElementById('artist');
const progress   = document.getElementById('progress');
const currentEl  = document.getElementById('current');
const durationEl = document.getElementById('duration');
const playBtn    = document.getElementById('play');
const prevBtn    = document.getElementById('prev');
const nextBtn    = document.getElementById('next');
const muteBtn    = document.getElementById('mute');
const volumeEl   = document.getElementById('volume');
const playlistEl = document.getElementById('playlist');

let currentIndex = 0;

// ---------- 3. Helper: seconds -> m:ss (e.g. 125 -> 2:05) ----------
function formatTime(seconds) {
  if (isNaN(seconds)) {
    return '0:00';
  }
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return minutes + ':' + (secs < 10 ? '0' : '') + secs;
}

// ---------- 4. Load a song (shows its details, does not play it) ----------
function loadSong(index) {
  currentIndex = index;
  const song = songs[index];

  audio.src = encodeURI(song.src);   // encodeURI makes spaces in file names safe
  titleEl.textContent = song.title;
  artistEl.textContent = song.artist;
  cover.style.backgroundImage = 'url(' + encodeURI(song.cover) + ')';

  progress.value = 0;
  currentEl.textContent = '0:00';
  durationEl.textContent = '0:00';

  // Highlight the current song in the playlist
  const items = playlistEl.querySelectorAll('li');
  items.forEach(function (item, i) {
    item.classList.toggle('active', i === index);
  });
}

// ---------- 5. Play and pause ----------
function playSong() {
  audio.play().catch(function (error) {
    // AbortError only means a new song was loaded quickly, so ignore it
    if (error.name !== 'AbortError') {
      console.log('Play problem:', error);
    }
  });
  playBtn.textContent = '⏸';
}

function pauseSong() {
  audio.pause();
  playBtn.textContent = '▶';
}

playBtn.addEventListener('click', function () {
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

// If the file cannot be loaded, tell exactly which one
audio.addEventListener('error', function () {
  alert('Cannot load: ' + songs[currentIndex].src +
        '\nCheck that this file is inside the songs folder with exactly this name.');
  playBtn.textContent = '▶';
});

// ---------- 6. Next and previous ----------
function nextSong() {
  loadSong((currentIndex + 1) % songs.length);   // after the last song, go to the first
  playSong();
}

function prevSong() {
  loadSong((currentIndex - 1 + songs.length) % songs.length);
  playSong();
}

nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

// Autoplay: when a song ends, play the next one
audio.addEventListener('ended', nextSong);

// ---------- 7. Progress bar and time ----------
audio.addEventListener('loadedmetadata', function () {
  progress.max = audio.duration;
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', function () {
  progress.value = audio.currentTime;
  currentEl.textContent = formatTime(audio.currentTime);
});

progress.addEventListener('input', function () {
  audio.currentTime = progress.value;
});

// ---------- 8. Volume and mute ----------
audio.volume = volumeEl.value;

function updateMuteIcon() {
  muteBtn.textContent = (audio.muted || audio.volume === 0) ? '🔇' : '🔊';
}

volumeEl.addEventListener('input', function () {
  audio.volume = volumeEl.value;
  audio.muted = false;
  updateMuteIcon();
});

muteBtn.addEventListener('click', function () {
  audio.muted = !audio.muted;
  updateMuteIcon();
});

// ---------- 9. Build the playlist ----------
songs.forEach(function (song, index) {
  const item = document.createElement('li');
  item.innerHTML = song.title + ' <small>- ' + song.artist + '</small>';
  item.addEventListener('click', function () {
    loadSong(index);
    playSong();
  });
  playlistEl.appendChild(item);
});

// ---------- 10. Start with the first song loaded ----------
loadSong(0);