import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Pessoa, Pessoas } from "./pessoa";

@Injectable({
    providedIn: 'root'
})
export class PessoasService{

    private pessoas: Pessoas = [];

    constructor(
    ){
        if(localStorage.getItem('pessoas')){
            //@ts-ignore
            this.pessoas = JSON.parse(localStorage.getItem('pessoas'));
        }
    }

    getAll(): Pessoas{
        return this.pessoas; 
    }

    getIndex(){
        return this.pessoas.length;
    }

    create(data: Pessoa){
       this.pessoas.push(data);

       localStorage.setItem('pessoas', JSON.stringify(this.pessoas));
    }
    
    setFacematcher(object:any){
        this.pessoas.forEach((data)=>{
            if(data.id == object.id){
               
                if(this.pessoas[data.id-1].facematcher){
                    //@ts-ignore
                    this.pessoas[data.id-1].facematcher.labeledDescriptors[0].descriptors.push(object.facematcher._labeledDescriptors[0]._descriptors[0]);
                }else{
                    this.pessoas[data.id-1].facematcher = object.facematcher;
                }
            }
        });
        localStorage.setItem('pessoas', JSON.stringify(this.pessoas));
    }
}