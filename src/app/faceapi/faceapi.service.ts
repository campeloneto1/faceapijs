import { Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';
import { LabeledFaceDescriptors } from 'face-api.js';

@Injectable({
  providedIn: 'root',
})
export class FaceapiService {

  async loadModels() {
    //await faceapi.nets.ssdMobilenetv1.loadFromUri('assets/models');
    await faceapi.nets.tinyFaceDetector.loadFromUri('assets/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('assets/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('assets/models');

  }

  async recognizeFace(image: HTMLImageElement) {
    //await this.loadModels();
    const detections = await faceapi.detectSingleFace(image, new faceapi.TinyFaceDetectorOptions({scoreThreshold: 0.6})).withFaceLandmarks().withFaceDescriptor();
    return detections;
  }


  async recognizeFaces(image: HTMLImageElement, score:number) {
    //await this.loadModels(); , new faceapi.TinyFaceDetectorOptions()
    const detections = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions({scoreThreshold: score, inputSize: 416})).withFaceLandmarks().withFaceDescriptors();
    return detections;
  }

  async recognizeFaceVideo(image: HTMLVideoElement) {
    //await this.loadModels();
    const detections = await faceapi.detectSingleFace(image, new faceapi.TinyFaceDetectorOptions({scoreThreshold: 0.6})).withFaceLandmarks().withFaceDescriptor();
    //const detections = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions({scoreThreshold: 0.6})).withFaceLandmarks();
    
    return detections;
  }

  async recognizeFacesVideo(image: HTMLVideoElement) {
    //await this.loadModels();
    //const detections = await faceapi.detectSingleFace(image, new faceapi.TinyFaceDetectorOptions({scoreThreshold: 0.6})).withFaceLandmarks().withFaceDescriptor();
    const detections = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions({scoreThreshold: 0.6})).withFaceLandmarks().withFaceDescriptors();
    
    return detections;
  }
  
  async facematcher(image: LabeledFaceDescriptors){
    const matcher = new faceapi.FaceMatcher(image);
    return matcher;
  }

  async fromJson(data: Object){
    const matcher = faceapi.FaceMatcher.fromJSON(data);
    return matcher;
  }

  async resizeResults(detections: any, size:any){
    const resize = faceapi.resizeResults(detections, size);
    return resize;
  }

  async draw(canvas: any, resized:any){
    const draw = faceapi.draw.drawDetections(canvas, resized);
    return draw;
  }

  async rect(x:any, y: any, width:any, height:any){
    return new faceapi.Rect(x, y, width, height)
  }

  async extractFaces(imageRef:any, regionsToExtract:any){
    return faceapi.extractFaces(imageRef, regionsToExtract)
  }
}