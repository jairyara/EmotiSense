'use client'
import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import FileInput from "@/app/components/FileInput";
import CameraButton from "@/app/components/CameraButton";
import CaptureButton from "@/app/components/CaptureButton";

export default function Page() {
    const [image, setImage] = useState<string | ArrayBuffer | null>(null);
    const [emotions, setEmotions] = useState<faceapi.FaceExpressions[]>([]);
    const [isVideoReady, setIsVideoReady] = useState(false);
    const [isCaptureVisible, setIsCaptureVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();

        reader.onload = async () => {
            setImage(reader.result);
            await loadModels();
            analyzeImage(reader.result as string);
        };

        reader.readAsDataURL(file);
    };

    const handleCapture = async () => {
        if (!videoRef.current) return;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/png');
            setImage(dataUrl);
            await loadModels();
            analyzeImage(dataUrl);
            stopCamera();
            setIsCaptureVisible(false);
        }
    };

    const startCamera = async () => {
        resetVideo();
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const resetVideo = () => {
        setIsVideoReady(false);
        setImage(null);
        setEmotions([]);
        setIsCaptureVisible(true);
    };

    const loadModels = async () => {
        const modelUrl = '/models'; // Ruta a la carpeta donde guardaste los modelos
        await faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl);
        await faceapi.nets.faceExpressionNet.loadFromUri(modelUrl);
    };

    const analyzeImage = async (imgData: string) => {
        console.log(imgData)
        setIsLoading(true);
        if (!imgRef.current) return;
        const detections = await faceapi
            .detectAllFaces(imgRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();
        setEmotions(detections.map(det => det.expressions));
        setIsLoading(false);
    };

    const emotionTranslations: { [key: string]: string } = {
        angry: 'Enojado',
        disgusted: 'Disgustado',
        fearful: 'Temeroso',
        happy: 'Feliz',
        neutral: 'Neutral',
        sad: 'Triste',
        surprised: 'Sorprendido'
    };

    const emotionColors: { [key: string]: string } = {
        angry: 'red',
        disgusted: '#3DBC83',
        fearful: '#AC50FF',
        happy: '#FEC902',
        neutral: 'gray',
        sad: '#01AFFF',
        surprised: 'orange'
    };

    const emotionImages: { [key: string]: string } = {
        angry: '😡😡😡',
        disgusted: '🤢🤢🤢',
        fearful: '😨😨😨',
        happy: '😀😀😀',
        neutral: '😐😐😐',
        sad: '😥😥😥',
        surprised: '😯😯😯'
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.addEventListener('loadedmetadata', () => {
                setIsVideoReady(true);
            });
        }
    }, [videoRef]);

    return (
        <section className='container py-8 mx-auto w-full'>
            <h1 className='py-8 text-center font-bold text-3xl'>Detector de emociones EmotiSense</h1>
            <section className='flex flex-col lg:flex-row items-center lg:items-end justify-center gap-2 lg:gap-16 w-full'>
                <FileInput onChange={handleImageUpload}/>
                <p>O</p>
                <CameraButton onClick={startCamera}/>
            </section>
            <section className=' mt-8 flex flex-col-reverse lg:flex-row items-center lg:items-start justify-center gap-4 lg:gap-16'>
                <div>
                    <video className='mb-4' ref={videoRef} style={{display: image ? 'none' : 'block'}}/>
                    {isCaptureVisible &&
                        isVideoReady &&
                        <CaptureButton onClick={handleCapture}/>
                    }
                    {image && <img className='max-w-[350px] rounded h-auto' ref={imgRef} src={image as string}
                                   alt="Uploaded"/>}
                </div>
                <section className='w-full lg:w-auto px-4 lg:px-0'>
                    {isLoading ? (
                        <p>Cargando...</p>
                    ) : (
                        emotions.length > 0 &&
                        emotions.map((e, i) => (
                            <div key={i}>
                                <h3 className='text-lg font-bold mb-4'>Persona {i + 1}</h3>
                                <div className='grid grid-cols-2 gap-4 mb-6'>
                                    {Object.entries(e)
                                        .sort(([, a], [, b]) => b - a)
                                        .map(([emotion, value]) => (
                                            <div className='flex gap-3' key={emotion} style={{color:emotionColors[emotion]}}>
                                                <span>{emotionImages[emotion]}</span>
                                                {emotionTranslations[emotion] || emotion}: {(value * 100).toFixed(2)}%
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))
                    )}
                </section>
            </section>
        </section>
    );
}