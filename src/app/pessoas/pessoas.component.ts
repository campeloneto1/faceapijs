import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NavbarComponent } from "../navbar/navbar.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { PessoasService } from "./pessoas.service";
import { Pessoas } from "./pessoa";

@Component({
    selector: 'app-pessoas',
    templateUrl: './pessoas.component.html',
    styleUrl: './pessoas.component.css',
    standalone: true,
    imports: [
        CommonModule,
        NavbarComponent,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class PessoasComponent implements OnInit{
    
    protected pessoas!: Pessoas;
    protected form!: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private pessoasService: PessoasService
    ){}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            'id': [null],
            'nome': [null, Validators.compose([
                Validators.required,
            ])],
            'facematcher': [null],
        });

        this.pessoas = this.pessoasService.getAll();
    }

    refresh(){
        this.pessoas = this.pessoasService.getAll();
    }

    cadastrar(){
        this.form.get('id')?.patchValue(this.pessoasService.getIndex()+1)
        this.pessoasService.create(this.form.value);
        this.refresh();
        this.form.reset();
    }
}