import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})

export class EventoDetalheComponent implements OnInit {

  form: FormGroup | any;
  evento = {} as Evento;
  estadoSalvar = 'post';

  public bsconfig(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY HH:mm',
      containerClass: 'theme-default',
      showWeekNumbers: false
    };
  }

  get f(): any {
    return this.form.controls;
  }

  constructor(private fb: FormBuilder,
              private localeService: BsLocaleService,
              private router: ActivatedRoute,
              private eventoService: EventoService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService) {
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
      imagemURL: ['', Validators.required]
    });
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campo: FormControl): any {
    return {'is-invalid': campo.errors && campo.touched};
  }

  public carregarEvento(): void {
    const eventoIdParam = this.router.snapshot.paramMap.get('id');

    if (eventoIdParam !== null) {
      this.spinner.show();

      this.estadoSalvar = 'put';

      this.eventoService.getEventoById(+eventoIdParam).subscribe(
        (evento: Evento) => {
          this.evento = Object.assign({}, evento);
          this.form.patchValue(this.evento);
        },
        (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao carregar evento', 'Erro!');
          console.error(error);
        },
        () => this.spinner.hide()
      );
    }
  }

  public salvarAlteracao(): void {
    this.spinner.show();
    if (this.form.valid) {
      if (this.estadoSalvar === 'post') {
        this.evento = {... this.form.value};
        this.eventoService.post(this.evento).subscribe(
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

}
