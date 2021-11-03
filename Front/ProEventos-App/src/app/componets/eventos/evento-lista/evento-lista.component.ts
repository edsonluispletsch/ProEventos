import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss'],
})
export class EventoListaComponent implements OnInit {
  modalRef?: BsModalRef;
  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  larguraImg = 100;
  margemImg = 2;
  exibirImagem = false;
  private filtroListaVar = '';
  eventoId = 0;

  public get filtroLista(): string {
    return this.filtroListaVar;
  }

  public set filtroLista(value: string) {
    this.filtroListaVar = value;
    this.eventosFiltrados = this.filtroLista
      ? this.filtrarEventos(this.filtroLista)
      : this.eventos;
  }

  public filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: { tema: string; local: string }) =>
        evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
        evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.spinner.show();
    this.carregarEventos();
  }

  public carregarEventos(): void {
    this.eventoService.getEventos().subscribe({
      next: (resposta: Evento[]) => {
        this.eventos = resposta;
        this.eventosFiltrados = this.eventos;
      },
      error: (error: any) => {
        this.spinner.hide(),
          this.toastr.error('Erro ao carregar os eventos', 'Erro');
      },
      complete: () => this.spinner.hide(),
    });
  }

  public exibirOcultarImagem(): void {
    this.exibirImagem = !this.exibirImagem;
  }

  openModal(event: any, template: TemplateRef<any>, eventoId: number): void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.modalRef?.hide();
    this.spinner.show();
    this.eventoService.deleteEvento(this.eventoId).subscribe(
      (result: any) => {
        if (result.message === 'Deletado') {
          console.log(result);
          this.toastr.success('Evento deletado com sucesso', 'Deletado');
          this.carregarEventos();
        }
      },
      (error: any) => {
        console.error(error);
        this.toastr.error(`Erro ao deletar o evento ${this.eventoId}`, 'Erro');
      }
    ).add(() => this.spinner.hide());
  }

  decline(): void {
    this.modalRef?.hide();
  }

  detalheEvento(id: number): void {
    this.router.navigate([`/eventos/detalhe/${id}`]);
  }

  mostraImagem(imagemURL: string): string {
    return (imagemURL !== '')
      ? `${environment.apiURL}resources/images/${imagemURL}`
      : 'assets/SemImagem.png'
  }
}
