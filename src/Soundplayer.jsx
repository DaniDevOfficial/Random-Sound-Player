import React, { useState, useEffect } from 'react';

function AudioPlayer() {
  const [audioFiles, setAudioFiles] = useState([]);
  const [selectedAudio, setSelectedAudio] = useState(null);

  useEffect(() => {
    const context = require.context('./sounds', false, /\.mp3$/);
    const audioFilesList = context.keys().map(context);

    setAudioFiles(audioFilesList);
  }, []);

  const playRandomAudio = () => {
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    const randomAudio = audioFiles[randomIndex];

    const audioElement = new Audio(randomAudio);
    audioElement.play();

    setSelectedAudio(randomAudio);
  };

  function RepeatSounds() {

    for (let i = 0; i < 2; i++) {
      setTimeout(() => {
        console.log(i)
      }, 5000);
    }
  }

  function countToTen() {
    let count = 1;
    const interval = setInterval(function () {
      playRandomAudio()
      console.log(count)
      count++;
      if (count > 10) {
        clearInterval(interval);
      }
    }, 10000);
  }



  return (
    <div>
      <h1>Audio Player</h1>
      <button onClick={playRandomAudio}>Play Random Sound</button>
      <button onClick={countToTen}>Play Random Sound infinity</button>
    </div>
  );
}

export default AudioPlayer;
