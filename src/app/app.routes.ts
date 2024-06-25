import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./inicio/inicio.component').then((c) => c.InicioComponent),
    },
    {
        path: 'pessoas',
        loadComponent: () =>
            import('./pessoas/pessoas.component').then((c) => c.PessoasComponent),
    },
    {
        path: 'photo',
        loadComponent: () =>
            import('./photo/photo.component').then((c) => c.PhotoComponent),
    },
    {
        path: 'webcam',
        loadComponent: () =>
            import('./webcam/webcam.component').then((c) => c.WebCamComponent),
    },  
];
