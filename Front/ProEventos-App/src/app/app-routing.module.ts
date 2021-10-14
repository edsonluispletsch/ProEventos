import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContatosComponent } from './componets/contatos/contatos.component';
import { DashboardComponent } from './componets/dashboard/dashboard.component';
import { EventosComponent } from './componets/eventos/eventos.component';
import { PalestrantesComponent } from './componets/palestrantes/palestrantes.component';
import { PerfilComponent } from './componets/perfil/perfil.component';

const routes: Routes = [
  {path: 'eventos', component: EventosComponent},
  {path: 'contatos', component: ContatosComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'palestrantes', component: PalestrantesComponent},
  {path: 'perfil', component: PerfilComponent},
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
