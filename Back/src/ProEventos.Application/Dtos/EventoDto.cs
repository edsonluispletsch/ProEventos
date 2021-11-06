using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProEventos.Application.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }
        public string Local { get; set; }
        public DateTime DataEvento { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório"),
//         MinLength(4, ErrorMessage = "O campo {0} deve ter no mínimo 4 caracteres"),
//         MaxLength(50, ErrorMessage = "O campo {0} deve ter no máximo 50 caracteres")]
         StringLength(50, MinimumLength = 4, ErrorMessage = "O campo {0} deve ter entre 4 e 50 caracteres")]
        public string Tema { get; set; }
        [Display(Name = "Qtd Pessoas")]
        [Range(1, 120000, ErrorMessage = "O campo {0} deve ter um valor entre 1 e 120.000")]
        public int QtdPessoas { get; set; }
        public string Lote { get; set; }
        [RegularExpression(@".*\.(gif|jpe?g|bmp|png)$", ErrorMessage = "Não é um arquivo de imagem (gif, jpg, bmp ou png)")]
        public string ImagemURL { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório"),
         Phone(ErrorMessage = "O campo {0} deve ser um telefone válido")]
        public string Telefone { get; set; }
        [EmailAddress(ErrorMessage = "Não é um e-mail válido")]
        public string Email { get; set; }
        public int UserId { get; set; }
        public UserDto UserDto { get; set; }
         public IEnumerable<LoteDto> Lotes { get; set; }
        public IEnumerable<RedeSocialDto> RedesSociais { get; set; }
        public IEnumerable<PalestranteDto> Palestrantes { get; set; }
    }
}