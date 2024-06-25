import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, OnInit } from "@angular/core";
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

    private pessoas!: Pessoas;
    protected descriptors = {
        "distanceThreshold":0.6,
        "labeledDescriptors":[]
    }

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
        console.log(this.descriptors)
    }

    ngAfterViewInit(): void {
        this.faceapiService.loadModels();
        this.handleImage2();
    }

    handleImage2() {
        let video = document.querySelector("#webcam div video");
        let facematch:any;
          if(video){
              this.faceapiService.recognizeFacesVideo(video as HTMLVideoElement).then((data:any) => {
                  if(data){
                      console.log(data)
                     //@ts-ignore
                    //  facematch = this.facematchers.findBestMatch(data.descriptor)
                    //  if(facematch){
                    //   let array = facematch.label.split(" (")[1];
                    //  }
                    
                  }
              })
          }
      
        setTimeout(async () => { 
          this.handleImage2();
        }, 2000 );
    }
}