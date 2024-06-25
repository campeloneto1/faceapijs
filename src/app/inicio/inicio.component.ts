import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
    selector: 'app-inicio',
    templateUrl: './inicio.component.html',
    styleUrl: './inicio.component.css',
    standalone: true,
    imports: [
        CommonModule,
        NavbarComponent
    ]
})
export class InicioComponent{
    
}