import React, { useState, useEffect, useRef } from 'react';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list
} from 'firebase/storage'
import { storage } from './firebase'
import { v4 } from 'uuid'
import { FiUpload } from 'react-icons/fi';
import "./Style.css"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AudioPlayer() {
  const [audioFiles, setAudioFiles] = useState([]);
  const [audioFilesUploads, setAudioFilesUploads] = useState([]);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [secondBetween, setSecondBetween] = useState(null);
  const [amountOfSounds, SetAmountOfSounds] = useState(null)
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [fileUrls, setFileUrls] = useState([])
  const [fileUpload, setFileUpload] = useState(null)

  const fileListRef = ref(storage, 'Sounds/MySounds')
  const UploadsListRef = ref(storage, 'Sounds/Uploaded')


  const allAudio = []
  const uploadFile = () => {
    if (fileUpload == null) return;

    if (fileUpload.size > 500 * 1024) {
      toast.error("File size should be no larger than 500 KB", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
      return;
    }

    const fileRef = ref(storage, `Sounds/Uploaded/${fileUpload.name}`);
    uploadBytes(fileRef, fileUpload)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            setFileUrls((prev) => [...prev, url]);
            toast.success("File uploaded successfully. Download link in the console", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 5000,
            });
            console.log("Download Link: " + url)
            setFileUpload(null);
          })
          .catch((error) => {
            console.error("Error generating download URL: ", error);
            toast.error("An error occurred while processing the file.");
          });
      })
      .catch((error) => {
        console.error("Error uploading file: ", error);
        toast.error("An error occurred while uploading the file.");
      });
  };


  const hasFetchedImages = useRef(false);

  useEffect(() => {
    if (!hasFetchedImages.current) {
      listAll(fileListRef).then((response) => {
        const promises = response.items.map((item) => getDownloadURL(item));
        Promise.all(promises).then((urls) => {
          setAudioFiles(urls);
          hasFetchedImages.current = true;
        });
      });
    }
  }, []);

  const hasFetchedUploads = useRef(false);

  useEffect(() => {
    if (!hasFetchedUploads.current) {
      listAll(UploadsListRef).then((response) => {
        const promises = response.items.map((item) => getDownloadURL(item));
        Promise.all(promises).then((urls) => {
          setAudioFilesUploads(urls);

          hasFetchedUploads.current = true;
        });
      });
    } else {
    }
  }, []);

  allAudio.push(...audioFiles)
  allAudio.push(...audioFilesUploads)

  const playRandomAudio = () => {
    const randomIndex = Math.floor(Math.random() * allAudio.length);
    const randomAudio = allAudio[randomIndex];
    const audioElement = new Audio(randomAudio);
    audioElement.play();
    setSelectedAudio(randomAudio);
  };



  function RepeatSounds() {
    let count = 1;
    const interval = setInterval(function () {
      if(secondBetween > 3){
        toast.warning("Audio incoming", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        }); 
      }
   
      playRandomAudio()
      console.log(amountOfSounds)
      console.log(count)
      setButtonDisabled(true);

      count++;
      if (count > amountOfSounds) {
        clearInterval(interval);
        setButtonDisabled(false);

      }
    }, secondBetween * 1000);
  }


  function calculateTime(secondsBetween, amountOfSounds) {
    const totalSeconds = secondsBetween * amountOfSounds;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${hours} hours ${minutes} minutes and ${remainingSeconds} seconds`;
  }

  return (
    <div>


      <div className="Wrapper">

        <div className="content">
          <h1>Random Audio Player</h1>
          <button onClick={playRandomAudio} className='button'>Play Random Sound</button>
          <br />

          <input
            type="number"
            className='NumberInput'
            placeholder="Seconds between each Sound"
            onChange={(e) => setSecondBetween(e.target.value)}
            value={secondBetween}
          />

          <input
            type="number"
            className='NumberInput'
            placeholder="Amount of Sounds in total to be played"
            onChange={(e) => SetAmountOfSounds(e.target.value)}
            value={amountOfSounds}
          />
          {secondBetween && (
            <p style={{ color: 'white' }}>
              A sound will be played every {secondBetween} seconds.
            </p>
          )}
          {amountOfSounds && (
            <p style={{ color: 'white' }}>
              {amountOfSounds === '1'
                ? 'A total of 1 sound will be played.'
                : `A total of ${amountOfSounds} sounds will be played.`
              }
            </p>
          )}
          {secondBetween && amountOfSounds && (
            <p style={{ color: 'white' }}>
              This will take {calculateTime(secondBetween, amountOfSounds)}.
            </p>
          )}
          <button onClick={RepeatSounds} className='button' disabled={false}>
            Play Random Sound infinity
          </button>
          <input
            type="file"
            id="file-input"
            accept=".mp3"
            onChange={(event) => {
              const file = event.target.files[0];

              if (file && file.size <= 200 * 1024) {
                setFileUpload(file);
              } else {
                toast.error("File size should be no larger than 200 KB", {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 5000, // Auto close the toast after 5 seconds (adjust as needed)
                });
                event.target.value = null;
              }
            }}
          />


          <label className="custom-file-input" htmlFor="file-input">
            Choose Soundfile
          </label>
          {fileUpload && (
            <button className="upload-button" onClick={uploadFile}>
              <FiUpload className="upload-icon" />
            </button>
          )}
        </div>
      </div>
      <div class="animation-area">
        <ul class="box-area">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
  );
}

export default AudioPlayer;
