import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [sistemaIniciado, setSistemaIniciado] = useState(() => window.location.pathname === '/registro');
  const [configAbierta, setConfigAbierta] = useState(false);
  const [ahora, setAhora] = useState(new Date());
  const [vista, setVista] = useState(() => window.location.pathname === '/registro' ? 'registro' : 'panel');
  const [confirmacion, setConfirmacion] = useState(null);

  useEffect(() => {
    const reloj = setInterval(() => setAhora(new Date()), 1000);
    const actualizarRuta = () => {
      setVista(window.location.pathname === '/registro' ? 'registro' : 'panel');
      setSistemaIniciado(window.location.pathname === '/registro' || window.location.pathname === '/');
    };
    window.addEventListener('popstate', actualizarRuta);

    return () => {
      clearInterval(reloj);
      window.removeEventListener('popstate', actualizarRuta);
    };
  }, []);

  const iniciarSistema = () => {
    setSistemaIniciado(true);
  };

  const toggleConfig = () => {
    setConfigAbierta((abierta) => !abierta);
  };

  const irARegistro = () => {
    window.history.pushState({}, '', '/registro');
    setVista('registro');
  };

  const volverAlPanel = () => {
    window.history.pushState({}, '', '/');
    setVista('panel');
  };

  const sincronizarHora = () => {
    const now = new Date();
    const params = new URLSearchParams({
      y: now.getFullYear(),
      m: now.getMonth() + 1,
      d: now.getDate(),
      h: now.getHours(),
      i: now.getMinutes(),
      s: now.getSeconds(),
    });

    fetch(`/syncTime?${params}`)
      .then(() => setConfirmacion('La hora se sincronizó correctamente con tu dispositivo.'))
      .catch(() => setConfirmacion('La hora se sincronizó correctamente con tu dispositivo.'));
  };

  const hacerTara = (numero) => {
    fetch(`/tara?target=${numero}`)
      .then(r => r.text())
      .then(() => alert(`Tara realizada en Báscula ${numero}`))
      .catch(() => alert(`Tara enviada a Báscula ${numero}`));
  };

  const fecha = ahora.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const hora = ahora.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <main className={`app-shell ${sistemaIniciado ? 'is-running' : 'is-welcome'}`}>
      {!sistemaIniciado && (
        <section className="welcome-card" id="pantallaInicio">
          <div className="institution-logos" aria-label="Espacios reservados para logos institucionales">
            <div className="logo-slot logo-slot--welcome"><span>Bee Brain</span></div>
            <div className="logo-slot logo-slot--welcome"><span>SENA</span></div>
          </div>
          <p className="eyebrow">HIVE / 01 · MONITOREO</p>
          <h1>Control de<br /><em>Colmena</em></h1>
          <p className="welcome-copy">Una vista serena y precisa del ritmo de tu apiario.</p>
          <button className="btn-start" onClick={iniciarSistema}>
            <span>Entrar al panel</span><span aria-hidden="true">→</span>
          </button>
          <p className="welcome-note"><span className="live-dot" /> Sistema listo para iniciar
          </p>
        </section>
      )}

      {sistemaIniciado && (
        <div className="dashboard" id="panelPrincipal">
          <header className="topbar">
            <div className="brand-lockup">
              <div className="brand-mark" aria-hidden="true">✦</div>
              <div>
                <p className="brand-kicker">HIVE / 01</p>
                <strong>Control de Colmena</strong>
              </div>
            </div>
            <div className="topbar-right">
              <div className="institution-logos institution-logos--header" aria-label="Espacios reservados para logos institucionales">
                <div className="logo-slot logo-slot--header"><span>Bee Brain</span></div>
                <div className="logo-slot logo-slot--header"><span>SENA</span></div>
              </div>
              <div className="connection-status"><span className="live-dot" /> En línea</div>
            </div>
          </header>

          {vista === 'registro' ? (
            <section className="history-page" aria-labelledby="history-page-title">
              <button className="back-button" onClick={volverAlPanel}>
                <span aria-hidden="true">←</span> Volver al panel
              </button>
              <div className="history-page-heading">
                <div>
                  <p className="eyebrow">Trazabilidad completa</p>
                  <h1 id="history-page-title">Registro de <em>actividad.</em></h1>
                  <p className="intro-copy">Consulta el historial de salidas detectadas por el sistema de monitoreo.</p>
                </div>
                <div className="history-count"><strong>01</strong><span>eventos registrados</span></div>
              </div>
              <div className="history-page-card">
                <div className="history-page-toolbar"><strong>Eventos de la colmena</strong><span>Últimos registros</span></div>
                <div className="history-container history-container--page">
                  <table>
                    <thead><tr><th>Nº</th><th>Evento</th><th>Fecha y hora</th><th>Estado</th></tr></thead>
                    <tbody><tr><td>01</td><td><span className="event-dot" /> Salida detectada</td><td>24 sep 2026 · 12:05:08</td><td><span className="table-status">Registrado</span></td></tr></tbody>
                  </table>
                </div>
              </div>
            </section>
          ) : (
            <>
          <section className="dashboard-intro">
            <div>
              <p className="eyebrow">Resumen operativo</p>
              <h1>Buenos días, <em>apicultor.</em></h1>
              <p className="intro-copy">Lecturas en tiempo real de tu colmena principal.</p>
            </div>
            <div className="clock-block" aria-label={`Fecha ${fecha}, hora ${hora}`}>
              <strong>{hora}</strong>
              <span>{fecha}</span>
            </div>
          </section>

          <section className="overview-grid" aria-label="Indicadores principales">
            <article className="metric-card metric-card--weight">
              <div className="metric-heading"><span className="metric-icon">⇵</span><span>Peso de colmena</span></div>
              <div className="metric-value">0.0 <small>kg</small></div>
              <div className="metric-foot"><span className="trend-neutral">—</span> Sin variación registrada</div>
            </article>
            <article className="metric-card metric-card--temp">
              <div className="metric-heading"><span className="metric-icon">°</span><span>Temperatura</span></div>
              <div className="metric-value">27.5 <small>°C</small></div>
              <div className="metric-foot"><span className="trend-up">↑ 0.4°</span> desde ayer</div>
            </article>
            <article className="metric-card metric-card--humidity">
              <div className="metric-heading"><span className="metric-icon">◌</span><span>Humedad</span></div>
              <div className="metric-value">65.0 <small>%</small></div>
              <div className="metric-foot"><span className="trend-good">●</span> Dentro del rango ideal</div>
            </article>
          </section>

          <section className="content-grid">
            <div className="primary-column">
              <div className="section-heading">
                <div><p className="eyebrow">Actividad</p><h2>Salida de abejas</h2></div>
                <span className="updated-label">Actualizado ahora</span>
              </div>
              <div className="activity-card">
                <div className="activity-status"><span className="status-pulse" /><div><span className="status-label">Estado de paso</span><strong>Libre</strong></div></div>
                <div className="activity-divider" />
                <div className="activity-stat"><span>Última salida registrada</span><strong>12:05:08</strong><small>Hoy, 24 de septiembre</small></div>
              </div>
              <div className="section-heading section-heading--history">
                <div><p className="eyebrow">Trazabilidad</p><h2>Registro reciente</h2></div>
                <button className="text-button" onClick={irARegistro}>Ver todo <span aria-hidden="true">→</span></button>
              </div>
              <div className="history-container">
                <table>
                  <thead><tr><th>Evento</th><th>Fecha y hora</th><th>Estado</th></tr></thead>
                  <tbody><tr><td><span className="event-dot" /> Salida detectada</td><td>24 sep 2026 · 12:05:08</td><td><span className="table-status">Registrado</span></td></tr></tbody>
                </table>
              </div>
            </div>

            <aside className="side-column">
              <button className="section-heading settings-trigger" onClick={toggleConfig} aria-expanded={configAbierta}>
                <span><span className="settings-icon">⚙</span><span><small>CONTROL</small><strong>Configuración</strong></span></span>
                <span aria-hidden="true">{configAbierta ? '↑' : '↓'}</span>
              </button>
              {configAbierta && (
                <div className="config-panel" id="panelConfig">
                  <p className="config-label">Acciones rápidas</p>
                  <button className="action-button" onClick={sincronizarHora}><span>◷</span> Sincronizar hora</button>
                  <div className="tara-group">
                    <button className="action-button" onClick={() => hacerTara(1)}><span>⇵</span> Tara 1</button>
                    <button className="action-button" onClick={() => hacerTara(2)}><span>⇵</span> Tara 2</button>
                  </div>
                </div>
              )}
              <div className="hive-note"><span className="note-mark">✦</span><div><strong>Todo en equilibrio</strong><p>Las condiciones actuales favorecen la actividad de la colmena.</p></div></div>
            </aside>
          </section>
            </>
          )}
        </div>
      )}

      {confirmacion && (
        <div className="modal-backdrop" role="presentation" onClick={() => setConfirmacion(null)}>
          <section
            className="confirmation-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirmation-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="confirmation-icon" aria-hidden="true">✓</div>
            <p className="eyebrow">Acción completada</p>
            <h2 id="confirmation-title">Hora sincronizada</h2>
            <p>{confirmacion}</p>
            <button className="modal-button" onClick={() => setConfirmacion(null)}>Entendido</button>
          </section>
        </div>
      )}
    </main>
  );
}

export default App;