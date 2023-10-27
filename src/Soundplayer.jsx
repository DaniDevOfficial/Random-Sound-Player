import React, { useState, useEffect } from 'react';
import { storage } from './firebase'; // Import the Firebase storage instance

function AudioPlayer() {
  const [audioFiles, setAudioFiles] = useState([]);
  const [selectedAudio, setSelectedAudio] = useState(null);

  useEffect(() => {
    // Fetch the list of audio files from Firebase Storage
    const fetchAudioFiles = async () => {
      const audioFilesList = [];
      const storageRef = storage.ref('sounds'); // Update with your storage path

      try {
        const fileList = await storageRef.listAll();

        for (const file of fileList.items) {
          audioFilesList.push(await file.getDownloadURL());
        }

        setAudioFiles(audioFilesList);
      } catch (error) {
        console.error('Error fetching audio files:', error);
      }
    };

    fetchAudioFiles();
  }, []);

  const playRandomAudio = () => {
    // Select a random audio file
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    const randomAudio = audioFiles[randomIndex];

    // Play the random audio
    const audioElement = new Audio(randomAudio);
    audioElement.play();

    // Set the selected audio for reference
    setSelectedAudio(randomAudio);
  };

  return (
    <div>
      <h1>Audio Player</h1>
      <button onClick={playRandomAudio}>Play Random Sound</button>

      {selectedAudio && (
        <audio controls>
          <source src={selectedAudio} type="audio/mpeg" />
        </audio>
      )}
    </div>
  );
}

export default AudioPlayer;
