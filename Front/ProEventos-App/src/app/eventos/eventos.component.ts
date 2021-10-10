import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
})
export class EventosComponent implements OnInit {
  public eventos: any = [];
  public eventosFiltrados: any = [];
  larguraImg = 100;
  margemImg = 2;
  exibirImagem = false;
  private _filtroLista = '';

  public get filtroLista(): string {
    return this._filtroLista;
  }

  public set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  filtrarEventos(filtrarPor: string): any {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: {tema: string; local: string}) =>
        evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
        evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getEventos();
  }

  public getEventos(): void {
    this.http.get('https://localhost:5001/api/eventos').subscribe(
      resposta => {
        this.eventos = resposta;
        this.eventosFiltrados = this.eventos;
      },
      error => console.log(error)
    );
  }

  public exibirOcultarImagem(): void {
    this.exibirImagem = !this.exibirImagem;
  }
}
