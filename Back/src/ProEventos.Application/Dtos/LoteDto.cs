using System;

namespace ProEventos.Application.Dtos
{
    public class LoteDto
    {
        private string _dataInicio = ""; 
        private string _dataFim = ""; 
        public int Id { get; set; }
        public string Nome { get; set; }
        public decimal Preco { get; set; }
        public string DataInicio { 
            get { return this._dataInicio; } 
            set { this._dataInicio = Convert.ToDateTime(value).ToString("dd/MM/yyyy") ; }
        }
        public string DataFim { 
            get { return this._dataFim; } 
            set { this._dataFim = Convert.ToDateTime(value).ToString("dd/MM/yyyy") ; }
        }          
//        public DateTime DataInicio { get; set; }
//        public DateTime DataFim { get; set; }
        public int Quantidade { get; set; }
        public int EventoId { get; set; }
        public EventoDto Evento { get; set; }        
    }
}