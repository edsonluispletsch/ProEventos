using System.Threading.Tasks;
using ProEventos.Domain;

namespace ProEventos.Persistence.Contratos
{
    public interface ILotePersist
    {   
        /// <summary>
        /// Método get que vai retornar uma lista de lotes por um evento
        /// </summary>
        /// <param name="eventoId">id do Evento</param>
        /// <returns>lista de lotes</returns>
         Task<Lote[]> GetLotesByEventoIdAsync(int eventoId);
         /// <summary>
         /// Método get que retorna apenas um lote
         /// </summary>
         /// <param name="eventoId">id do Evento</param>
         /// <param name="id">id do Lote</param>
         /// <returns>um lote</returns>
         Task<Lote> GetLoteByIdsAsync(int eventoId, int id);
    }
}