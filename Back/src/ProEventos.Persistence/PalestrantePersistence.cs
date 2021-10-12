using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Contextos;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Persistence
{
    public class PalestrantePersistence : IPalestrantePersist
    {    
        private readonly ProEventosContext _context;
        public PalestrantePersistence(ProEventosContext context)
        {
            _context = context;
        }
        public async Task<Palestrante[]> GetAllPalestrantesAsync(bool includeEventos = false )
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                .Include(pe => pe.RedesSociais);

            if (includeEventos) {
                query = query
                    .Include(pe => pe.PalestrantesEventos)
                    .ThenInclude(e => e.Evento);
            }
            
            query = query.AsNoTracking().OrderBy(pe => pe.Id);
            return await query.ToArrayAsync();
        }

        public async Task<Palestrante[]> GetAllPalestrantesByNomeAsync(string nome, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                .Include(pe => pe.RedesSociais);

            if (includeEventos) {
                query = query
                    .Include(pe => pe.PalestrantesEventos)
                    .ThenInclude(e => e.Evento);
            }
            
            query = query.AsNoTracking().OrderBy(pe => pe.Id)
                .Where(pe => pe.Nome.ToLower().Contains(nome.ToLower()));
            return await query.ToArrayAsync();
        }

        public async Task<Palestrante> GetPalestranteByIdAsync(int palestranteId, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                .Include(pe => pe.RedesSociais);

            if (includeEventos) {
                query = query
                    .Include(pe => pe.PalestrantesEventos)
                    .ThenInclude(e => e.Evento);
            }
            
            query = query.AsNoTracking().OrderBy(pe => pe.Id)
                .Where(pe => pe.Id == palestranteId);
            return await query.FirstOrDefaultAsync();
        }
    }
}