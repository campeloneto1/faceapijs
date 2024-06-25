import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { NavbarComponent } from "../navbar/navbar.component";
import { WebcamImage, WebcamInitError, WebcamModule } from "ngx-webcam";
import { FaceapiService } from "../faceapi/faceapi.service";
import { PessoasService } from "../pessoas/pessoas.service";
import { Pessoas } from "../pessoas/pessoa";

@Component({
    selector: 'app-webcam',
    templateUrl: './webcam.component.html',
    styleUrl: './webcam.component.css',
    standalone: true,
    imports: [
        CommonModule,
        WebcamModule,
        NavbarComponent
    ]
})
export class WebCamComponent implements OnInit, AfterViewInit{

    @ViewChild('canvas', { static: false }) canvas2!: ElementRef;
    @ViewChild('webcam', { static: false }) webcam!: ElementRef;
    protected canvas!: any;
    private pessoas!: Pessoas;
    protected descriptors = {
        "distanceThreshold":0.6,
        "labeledDescriptors":[]
    }
    protected facematchers: any;
    public videoOptions: MediaTrackConstraints = {
        // width: {ideal: 1024},
        // height: {ideal: 576}
    };

    constructor(
        private faceapiService: FaceapiService,
        private pessoasService: PessoasService
    ){}
    

    ngOnInit(): void {
        this.pessoas = this.pessoasService.getAll();
        
        this.pessoas.forEach((data) => {
            if(data.facematcher){
                //@ts-ignore
                this.descriptors.labeledDescriptors.push(data.facematcher.labeledDescriptors[0])
            }
        });
        this.faceapiService.fromJson(this.descriptors).then(data => {
            this.facematchers = data;
        }); 
    }

    ngAfterViewInit(): void {
        this.faceapiService.loadModels();
        this.handleImage2();
    }

    async handleImage2() {
        
        let video = document.querySelector("#webcam div video");
        const canvas = document.getElementById('canvas')
        const dims = this.faceapiService.matchDimensions(canvas, video);
        var box = { 
            //@ts-ignore
            x: 0, 
            //@ts-ignore
            y: 0, 
            //@ts-ignore
            width: 0, 
            //@ts-ignore
            height: 0 
        }
        
        let facematch:any;
          if(video){
            if(this.facematchers){
                this.faceapiService.recognizeFacesVideo(video as HTMLVideoElement).then((data:any) => {
                    if(data){
                      data.forEach(async (fd:any) => {
                        let drawOptions = {
                            label: '',
                            lineWidth: 1
                          }
                        //@ts-ignore
                         const resized = this.faceapiService.resizeResults(data, dims.__zone_symbol__value)
                        console.log(fd)
                          //@ts-ignore
                          facematch = this.facematchers.findBestMatch(fd.descriptor);
                          if(facematch){
                            
                            drawOptions.label = facematch._label
                            //@ts-ignore
                            //this.faceapiService.drawDetections(canvas, resized.__zone_symbol__value)
                            
                            //@ts-ignore
                            //this.faceapiService.drawFaceLandmarks(canvas, resized.__zone_symbol__value)
                            const minProbability = 0.05
                            //@ts-ignore
                            this.faceapiService.drawFaceExpressions(canvas, resized.__zone_symbol__value, minProbability)
                            

                            box = { 
                                //@ts-ignore
                                x: fd.alignedRect._box._x, 
                                //@ts-ignore
                                y: fd.alignedRect._box._y, 
                                //@ts-ignore
                                width: fd.alignedRect._box._width, 
                                //@ts-ignore
                                height: fd.alignedRect._box._height }
                            // see DrawBoxOptions below
                            //@ts-ignore
                            const drawBox = this.faceapiService.DrawBox(box, drawOptions);
                            //@ts-ignore
                            (await drawBox).draw(canvas)
                          }
                      })
                    }
                })
            }
          }
      
        setTimeout(async () => { 
          this.handleImage2();
        }, 2000 );
    }
}