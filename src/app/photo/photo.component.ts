import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { WebcamImage, WebcamInitError, WebcamModule, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { FaceapiService } from '../faceapi/faceapi.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pessoas } from '../pessoas/pessoa';
import { PessoasService } from '../pessoas/pessoas.service';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrl: './photo.component.css',
  standalone: true,
  imports: [
    CommonModule, 
    NavbarComponent, 
    WebcamModule,
    FormsModule,
        ReactiveFormsModule
    ],
})
export class PhotoComponent implements OnInit, AfterViewInit {


    protected pessoas!: Pessoas;
    protected form!: FormGroup;

  public sysImage!: string;
  public webcamImage!: WebcamImage;
  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId!: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  @ViewChild('imagetaked', { static: false }) imagetaked!: ElementRef;

  protected facematcher!: any;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();

  constructor(
    private faceapiService: FaceapiService,
    private formBuilder: FormBuilder,
    private pessoasService: PessoasService
) {}

  ngAfterViewInit(): void {
    this.faceapiService.loadModels();
  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
        'id': [null, Validators.compose([
            Validators.required,
        ])],
        
        'facematcher': [null],
    });

    this.pessoas = this.pessoasService.getAll();

    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }
    );
  }

  public getSnapshot(): void {
    this.trigger.next(void 0);
  }

  public async handleImage(webcamImage: WebcamImage){
    this.webcamImage = webcamImage;
    this.sysImage = webcamImage.imageAsDataUrl;
    var detectedFace;    
    //var previous = this.faceapiService.fromJson(JSON.parse('{"distanceThreshold":0.6,"labeledDescriptors":[{"label":"Jose de Barros Campelo Neto","descriptors":[[-0.14661304652690887,0.05831713601946831,0.07529032975435257,-0.07388003915548325,-0.0846615731716156,0.04151558130979538,-0.05660773813724518,-0.014945860020816326,0.13153581321239471,-0.059364769607782364,0.24978002905845642,-0.003938376437872648,-0.26981884241104126,-0.027484485879540443,-0.019695203751325607,0.09978137910366058,-0.10277889668941498,-0.07130851596593857,-0.08086314797401428,-0.10454567521810532,0.09876058250665665,0.0007373732514679432,0.03751268610358238,0.016962489113211632,-0.13128182291984558,-0.36336201429367065,-0.09595101326704025,-0.19892023503780365,-0.02847476489841938,-0.15079542994499207,0.007622898556292057,-0.08228820562362671,-0.11946283280849457,-0.011231459677219391,-0.0541035495698452,0.036519456654787064,-0.07034259289503098,-0.060670025646686554,0.09353581070899963,-0.027668286114931107,-0.1335187554359436,0.05101780593395233,0.013999296352267265,0.17822417616844177,0.1186196431517601,0.059891026467084885,0.045805640518665314,-0.06781879812479019,0.11014464497566223,-0.2675724923610687,0.06762269139289856,0.11579011380672455,0.09676038473844528,0.04842019081115723,0.18120969831943512,-0.07655058801174164,0.05486489459872246,0.1440645009279251,-0.20074526965618134,0.14276263117790222,0.03606821969151497,0.02115747332572937,-0.043956734240055084,-0.05473092570900917,0.15857166051864624,0.13536126911640167,-0.14471383392810822,-0.12356150150299072,0.0855741947889328,-0.11392698436975479,-0.04208223521709442,0.13379189372062683,-0.1187722235918045,-0.25457966327667236,-0.2045092135667801,0.11475779861211777,0.397901326417923,0.1644216626882553,-0.1686011701822281,-0.03241883963346481,-0.0948837473988533,-0.020130569115281105,0.02668183483183384,-0.004509847145527601,-0.0852479338645935,-0.04665904864668846,-0.15336421132087708,0.023175053298473358,0.1255161315202713,-0.024070823565125465,0.018079707399010658,0.26917600631713867,-0.019832177087664604,0.07164877653121948,-0.01284857839345932,0.13458506762981415,-0.19831378757953644,-0.010548126883804798,-0.062442127615213394,-0.057948801666498184,0.07853369414806366,-0.08704029023647308,-0.039817407727241516,0.030485784634947777,-0.13248389959335327,0.128366157412529,-0.09252270311117172,-0.009112782776355743,-0.0392431803047657,0.010025152005255222,-0.08549503237009048,0.019936395809054375,0.14318808913230896,-0.2370690107345581,0.13919934630393982,0.19962304830551147,0.04962998628616333,0.08860550820827484,0.08313976973295212,-0.013746815733611584,-0.028311965987086296,-0.05686270073056221,-0.21488818526268005,-0.046461500227451324,0.013616057112812996,-0.043916504830121994,-0.06529401987791061,-0.009128816425800323]]}]}'));
    
    setTimeout(async () => { 
        //detectedFace = await this.faceapiService.recognizeFaces(this.imagetaked.nativeElement);  
        detectedFace = await this.faceapiService.recognizeFace(this.imagetaked.nativeElement);  
        if(detectedFace){
            //@ts-ignore
            this.facematcher = await this.faceapiService.facematcher(detectedFace);      
            this.pessoas.forEach((data) => {
              if(data.id == this.form.value.id){
                this.facematcher._labeledDescriptors[0]._label = data.nome;
              }
            });
        }
    }, 500 );
    
  }

  cadastrar(){
    this.form.get('facematcher')?.patchValue(this.facematcher);
    this.pessoasService.setFacematcher(this.form.value);
    this.form.reset();
    this.sysImage = '';
    this.facematcher = null
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public cameraWasSwitched(deviceId: string): void {
    //console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
}
