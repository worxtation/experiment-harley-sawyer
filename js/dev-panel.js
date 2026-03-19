/* =============================================
   DEV-PANEL.JS — Painel de bypass da máquina de estados
   Ativo apenas com ?dev na URL
   ============================================= */

'use strict';

(() => {
  if (!new URLSearchParams(location.search).has('dev')) return;

  const STATES = [
    'idle', 'watching', 'amused', 'patrol',
    'squinting', 'crimson', 'aggressive',
    'many', 'bared', 'shutdown', 'returns',
    'ethereal', 'narrowed',
  ];

  // ── Estilos inline — sem dependência de CSS externo ──────────────

  const style = document.createElement('style');
  style.textContent = `
    #dev-panel {
      position: fixed;
      top: 12px;
      right: 12px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-family: "Menlo", "Monaco", "Courier New", monospace;
      font-size: 10px;
    }
    #dev-panel-label {
      color: rgba(0, 229, 255, 0.45);
      letter-spacing: 0.14em;
      text-align: right;
      margin-bottom: 2px;
      user-select: none;
    }
    .dev-btn {
      background: rgba(0, 0, 0, 0.72);
      border: 1px solid rgba(0, 229, 255, 0.22);
      color: rgba(0, 229, 255, 0.65);
      padding: 3px 10px;
      letter-spacing: 0.12em;
      cursor: pointer;
      text-align: right;
      transition: border-color 0.12s, color 0.12s, background 0.12s;
    }
    .dev-btn:hover {
      border-color: rgba(0, 229, 255, 0.7);
      color: #00E5FF;
      background: rgba(0, 229, 255, 0.08);
    }
    .dev-btn.active {
      border-color: #00E5FF;
      color: #00E5FF;
      background: rgba(0, 229, 255, 0.14);
      box-shadow: 0 0 8px rgba(0, 229, 255, 0.3);
    }
  `;
  document.head.appendChild(style);

  // ── DOM ──────────────────────────────────────────────────────────

  const panel = document.createElement('div');
  panel.id = 'dev-panel';

  const label = document.createElement('div');
  label.id = 'dev-panel-label';
  label.textContent = 'DEV // STATE';
  panel.appendChild(label);

  const buttons = {};

  STATES.forEach(state => {
    const btn = document.createElement('button');
    btn.className = 'dev-btn';
    btn.textContent = state.toUpperCase();
    btn.dataset.state = state;
    btn.addEventListener('click', () => {
      StateMachine.forceState(state);
    });
    buttons[state] = btn;
    panel.appendChild(btn);
  });

  document.body.appendChild(panel);

  // ── Mantém botão ativo sincronizado com o estado atual ───────────

  const observer = new MutationObserver(() => {
    const current = document.body.dataset.state;
    STATES.forEach(s => {
      buttons[s]?.classList.toggle('active', s === current);
    });
  });

  observer.observe(document.body, { attributes: true, attributeFilter: ['data-state'] });

  // Sincroniza estado inicial
  const initial = document.body.dataset.state;
  if (initial && buttons[initial]) buttons[initial].classList.add('active');

})();
