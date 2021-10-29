import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento } from '@app/models/Evento';
import { Lote } from '@app/models/Lote';
import { EventoService } from '@app/services/evento.service';
import { LoteService } from '@app/services/lote.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})

export class EventoDetalheComponent implements OnInit {

  modalRef: BsModalRef;
  form: FormGroup | any;
  evento = {} as Evento;
  estadoSalvar = 'post';
  eventoId = 0;
  loteAtual = {id: 0,
               nome: '',
               indice: 0};

  public bsconfig(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY HH:mm',
      containerClass: 'theme-default',
      showWeekNumbers: false
    };
  }

  get modoEditar(): boolean {
    return this.estadoSalvar === 'put';
  }

  get lotes(): FormArray {
    return this.form.get('lotes') as FormArray;
  }

  get f(): any {
    return this.form.controls;
  }

  constructor(private fb: FormBuilder,
              private localeService: BsLocaleService,
              private activatedRouter: ActivatedRoute,
              private eventoService: EventoService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService,
              private router: Router,
              private loteService: LoteService,
              private modalService: BsModalService) {
    this.localeService.use('pt-br');
  }

  ngOnInit(): void {
    this.carregarEvento();
    this.validation();
  }

  public validation(): void {
    this.form = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemURL: ['', Validators.required],
      lotes: this.fb.array([])
    });
  }

  adicionarLote(): void {
    this.lotes.push(this.criarLote({id: 0} as Lote));
  }

  criarLote(lote: Lote): FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim]
    });
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campo: FormControl | AbstractControl): any {
    return {'is-invalid': campo.errors && campo.touched};
  }

  public carregarEvento(): void {
    this.eventoId = +this.activatedRouter.snapshot.paramMap.get('id');

    if (this.eventoId !== null && this.eventoId !== 0) {
      this.spinner.show();

      this.estadoSalvar = 'put';

      this.eventoService.getEventoById(this.eventoId).subscribe(
        (evento: Evento) => {
          this.evento = Object.assign({}, evento);
          this.form.patchValue(this.evento);
          this.evento.lotes.forEach(lote => {
            this.lotes.push(this.criarLote(lote));
          });
        },
        (error: any) => {
          this.toastr.error('Erro ao carregar evento', 'Erro!');
          console.error(error);
        }
      ).add(() => this.spinner.hide());
    }
  }

  public salvarEvento(): void {
    this.spinner.show();
    if (this.form.valid) {
      if (this.estadoSalvar === 'post') {
        this.evento = {... this.form.value};
        this.eventoService.post(this.evento).subscribe(
          (eventoRetorno: Evento) => {
            this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
            this.toastr.success('Evento salvo com sucesso', 'Sucesso');
            this.spinner.hide();
          },
          (error: any) => {
            console.error(error);
            this.toastr.error('Erro ao salvar evento', 'Erro');
            this.spinner.hide();
          },
          () => {
            this.spinner.hide();
          }
        );
      }
      else {
        this.evento = {id: this.evento.id, ... this.form.value};
        this.eventoService.put(this.evento).subscribe(
          () => {
            this.toastr.success('Evento salvo com sucesso', 'Sucesso');
            this.spinner.hide();
          },
          (error: any) => {
            console.error(error);
            this.toastr.error('Erro ao salvar evento', 'Erro');
            this.spinner.hide();
          },
          () => {
            this.spinner.hide();
          }
        );
      }
    }
  }

  public salvarLotes(): void {
    if (this.form.controls.lotes.valid)
    {
      this.spinner.show();
      this.loteService.saveLote(this.eventoId, this.form.value.lotes)
        .subscribe(
          () => {
            this.toastr.success('Lotes salvos com sucesso!', 'Sucesso');
//            this.lotes.reset();
          },
          (error: any) => {
            this.toastr.error('Erro ao salvar lotes!', 'Erro');
            console.error(error);
          }
        ).add(() => this.spinner.hide());
    }
  }

  public removerLote(template: TemplateRef<any>, indice: number): void {
    this.loteAtual.id = this.lotes.get(indice + '.id').value;
    this.loteAtual.nome = this.lotes.get(indice + '.nome').value;
    this.loteAtual.indice = indice;

    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  public confirmDeleteLote(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.loteService.deleteLote(this.eventoId, this.loteAtual.id)
      .subscribe(
        () => {
          this.toastr.success('Lote deletado com sucesso!', 'Sucesso');
          this.lotes.removeAt(this.loteAtual.indice);
        },
        (error: any) => {
          this.toastr.error(`Erro ao deletar lote ${this.loteAtual.id}`, 'Erro');
          console.error(error);
        }

      ).add(() => this.spinner.hide());

  }

  public declineDeleteLote(): void {
    this.modalRef.hide();
  }

  public retornaTituloLote(valor: string): string {
    return valor === null || valor === ''
                ? 'Nome do lote'
                : valor;
  }

}
