import { useState } from 'react'
import dados from './data/servidores.json'

function App() {
  const [salarioMinimo, setSalarioMinimo] = useState(0)
  const [filtroTipo, setFiltroTipo] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const registrosPorPagina = 20

  const unicosPorId = []
  const seenIds = new Set()

  for (const servidor of dados.result) {
    if (!seenIds.has(servidor.id)) {
      seenIds.add(servidor.id)
      unicosPorId.push(servidor)
    }
  }

  const unicosPorMatricula = []
  const seenMatriculas = new Set()

  for (const servidor of unicosPorId) {
    if (!seenMatriculas.has(servidor.matricula)) {
      seenMatriculas.add(servidor.matricula)
      unicosPorMatricula.push(servidor)
    }
  }

  const filtrados = unicosPorMatricula.filter(servidor => {
    return servidor.liquido >= salarioMinimo &&
      (filtroTipo === '' || servidor.tipo_contratacao === filtroTipo)
  })

  const totalPaginas = Math.ceil(filtrados.length / registrosPorPagina)

  const inicio = (paginaAtual - 1) * registrosPorPagina
  const fim = inicio + registrosPorPagina
  const dadosPaginados = filtrados.slice(inicio, fim)

  // Coletar tipos únicos de contratação para o dropdown
  const tiposUnicos = [...new Set(dados.result.map(s => s.tipo_contratacao))]

  return (
    <div style={{ padding: '20px' }}>

      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
        <label>
          Salário mínimo (líquido):
          <input
            type="number"
            value={salarioMinimo}
            onChange={(e) => {setSalarioMinimo(parseFloat(e.target.value) || 0), setPaginaAtual(1)}}
            style={{ marginLeft: '10px' }}
          />
        </label>

        <label>
          Tipo de contratação:
          <select
            value={filtroTipo}
            onChange={(e) => {setFiltroTipo(e.target.value), setPaginaAtual(1)}}
            style={{ marginLeft: '10px' }}
          >
            <option value="">Todos</option>
            {tiposUnicos.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </label>
      </div>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Matrícula</th>
            <th>CPF</th>
            <th>Cargo</th>
            <th>Salário Líquido</th>
            <th>Bruto</th>
            <th>Referência</th>
            <th>Secretaria</th>
            <th>Tipo de Contratação</th>
          </tr>
        </thead>
        <tbody>
          {dadosPaginados.map(servidor => (
            <tr key={servidor.id}>
              <td>{servidor.id}</td>
              <td>{servidor.nome_servidor}</td>
              <td>{servidor.matricula}</td>
              <td>{servidor.cpf_servidor}</td>
              <td>{servidor.cargo}</td>
              <td style={{ whiteSpace: 'nowrap' }} >{servidor.liquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              <td style={{ whiteSpace: 'nowrap' }} >{servidor.bruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              <td style={{ whiteSpace: 'nowrap' }} >{servidor.mes_ano_referencia}</td>
              <td>{servidor.secretaria}</td>
              <td>{servidor.tipo_contratacao}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '5px', flexWrap: 'wrap' }}>
        <button onClick={() => setPaginaAtual(p => Math.max(p - 1, 1))} disabled={paginaAtual === 1}>
          ⬅
        </button>

        {paginaAtual > 3 && (
          <>
            <button onClick={() => setPaginaAtual(1)}>1</button>
            {paginaAtual > 4 && <span>...</span>}
          </>
        )}

        {Array.from({ length: totalPaginas }, (_, i) => i + 1)
          .filter(p => Math.abs(p - paginaAtual) <= 2)
          .map(p => (
            <button
              key={p}
              onClick={() => setPaginaAtual(p)}
              style={{ fontWeight: p === paginaAtual ? 'bold' : 'normal' }}
            >
              {p}
            </button>
          ))}

        {paginaAtual < totalPaginas - 2 && (
          <>
            {paginaAtual < totalPaginas - 3 && <span>...</span>}
            <button onClick={() => setPaginaAtual(totalPaginas)}>{totalPaginas}</button>
          </>
        )}

        <button onClick={() => setPaginaAtual(p => Math.min(p + 1, totalPaginas))} disabled={paginaAtual === totalPaginas}>
          ➡
        </button>
      </div>

    </div>
  )
}

export default App
