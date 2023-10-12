import { useEffect, useRef, useState } from 'react'
import './App.css'
import image1 from './assets/frame_support-israel.png'
import image2 from './assets/frame_pray.png'
import image3 from './assets/stand_frame.png'
import image_init from './assets/girl-face-4.jpeg'
import Image from 'image-js'

function App() {
  const [image, setImage] = useState(image_init)
  const [imageShow, setImageShow] = useState()
  const [embedFrame, setEmbedFrame] = useState(image3)

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  }

  useEffect(() => {
    (async () => {
      let temp = (await Image.load(image));
      let x0 = Math.max(0, temp.width / 2 - temp.height / 2);
      let w0 = Math.min(temp.height, temp.width - x0)
      temp = temp.crop({ x: x0, y: 0, width: w0, height: temp.height });
      let frame = await Image.load(embedFrame);
      frame = frame.resize({ width: temp.width, height: temp.height })

      let x = 0
      let y = 0
      let fromWidth = frame.width;
      let fromHeight = frame.height;
      let toWidth = temp.width;
      let fchannels = frame.channels;
      let tchannels = temp.channels;
      const tdata = temp.data
      const fdata = frame.data
      for (let i = 0; i < fromWidth; i++) {
        for (let j = 0; j < fromHeight; j++) {
          let source = (j * fromWidth + i) * fchannels;
          let target = (j * toWidth + i) * tchannels;
          if (!(fdata[source] === 0 && fdata[source + 1] === 0 && fdata[source + 2] === 0)) {
            tdata[target] = fdata[source];
            tdata[target + 1] = fdata[source + 1];
            tdata[target + 2] = fdata[source + 2];
          }
        }
      }

      setImageShow(temp.toDataURL());
    })()
  }, [image, embedFrame]);


  return (
    <>
      <h1>Stand with Israel</h1>
      <br />
      <img alt="preview image" src={image} height={300} />
      &nbsp;
      &nbsp;
      &nbsp;
      &nbsp;
      <img src={imageShow} height={300} />
      <br />
      <input type="file" onChange={onImageChange} />
      <br />
      <br />
      <br />
      <br />
      <img src={image1} height={300} onClick={() => setEmbedFrame(image1)} />
      <img src={image2} height={300} onClick={() => setEmbedFrame(image2)} />
      <img src={image3} height={300} onClick={() => setEmbedFrame(image3)} />
    </>
  )
}

export default App
