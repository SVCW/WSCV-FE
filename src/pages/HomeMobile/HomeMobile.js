import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { useFormik } from 'formik';
import { CheckinActivityAction } from '../../redux/actions/ActivityAction';
import { useDispatch } from 'react-redux';

export default function QRScanner () {
  const dispatch = useDispatch()
  const videoRef = useRef(null);
  const [scannedData, setScannedData] = useState(null);
  const [data, setData] = useState()

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: 'environment' } } });
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener('loadedmetadata', () => {
          videoRef.current.play();
        });
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    setupCamera();

    const scanQRCode = () => {
      if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const canvasElement = document.createElement('canvas');
        const context = canvasElement.getContext('2d');
        canvasElement.width = videoRef.current.videoWidth;
        canvasElement.height = videoRef.current.videoHeight;

        context.drawImage(videoRef.current, 0, 0, canvasElement.width, canvasElement.height);
        const imageData = context.getImageData(0, 0, canvasElement.width, canvasElement.height);

        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          setScannedData(code.data);
          setData({
            userId: localStorage.getItem('userIDMobile'),
            activityId: code.data,
          })
          const checkin = {
            userId: localStorage.getItem('userIDMobile'),
            activityId: code.data,
          }
          const action = CheckinActivityAction(checkin);
          dispatch(action)
        }
      }
    };

    const intervalId = setInterval(scanQRCode, 3000);

    return () => {
      clearInterval(intervalId);
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      }
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay muted playsInline></video>
    </div>
  );
}