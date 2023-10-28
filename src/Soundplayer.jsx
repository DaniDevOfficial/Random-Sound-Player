import React, { useState, useEffect } from 'react';

function AudioPlayer() {
  const [audioFiles, setAudioFiles] = useState([]);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [secondBetween, setSecondBetween] = useState(null);
  const [amountOfSounds, SetAmountOfSounds] = useState(null)
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
    let count = 1;
    const interval = setInterval(function () {
      playRandomAudio()
      console.log(amountOfSounds)
      console.log(count)
      count++;
      if (count > amountOfSounds) {
        clearInterval(interval);
      }
    }, secondBetween*1000);
  }



  return (
    <div>
      <h1>Audio Player</h1>
      <button onClick={playRandomAudio}>Play Random Sound</button>
      <button onClick={RepeatSounds}>Play Random Sound infinity</button>

      <input type="number" placeholder="Seconds between each Sound" onChange={(e) => setSecondBetween(e.target.value)} value={secondBetween} />
      <input type="number" placeholder="Amount of Sounds in total to be played" onChange={(e) => SetAmountOfSounds(e.target.value)} value={amountOfSounds} />
    </div>
  );
}

export default AudioPlayer;
