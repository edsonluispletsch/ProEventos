using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProEventos.Domain
{
    [Table("Eventos")]
    public class Evento
    {
        [Key]
        [Column(Order=1)] // Para chave composta [Key] [Column(Order=2)]
        public int Id { get; set; }
        public string Local { get; set; }
        public DateTime? DataEvento { get; set; }
        [Required] //Not null
        public string Tema { get; set; }
// Campo calculado, não grava em tabela
//        [NotMapped]
//        public int Dias { get; set; }
        public int QtdPessoas { get; set; }
        public string Lote { get; set; }
        public string ImagemURL { get; set; }
        public string Telefone { get; set; }
        public string Email { get; set; }
        public IEnumerable<Lote> Lotes { get; set; }
        public IEnumerable<RedeSocial> RedesSociais { get; set; }
        public IEnumerable<PalestranteEvento> PalestrantesEventos { get; set; }
    }
}