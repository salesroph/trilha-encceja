/**
 * PWA installation UI.
 *
 * Root integration:
 *   window.initPwaInstall({ container: document.querySelector('#install-app') });
 * Call it after the user signs in. The function is idempotent and returns
 * { destroy, update } so account state changes can remove the banner.
 */
(() => {
  let deferredPrompt = null;
  const listeners = new Set();

  const isStandalone = () =>
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  const isIos = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);

  const escapeHtml = value => String(value).replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      // This is deliberately best-effort: installation must still work if
      // the worker is unavailable, and the worker never caches user data.
      navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(() => {});
    }
  }

  function addBaseStyles() {
    if (document.querySelector('#trilha-pwa-styles')) return;
    const style = document.createElement('style');
    style.id = 'trilha-pwa-styles';
    style.textContent = `.pwa-banner{display:flex;align-items:center;justify-content:space-between;gap:14px;background:#e6f0df;border:1px solid #c9dfbe;border-radius:14px;padding:14px 16px;margin-bottom:18px;color:#234a37}.pwa-copy{min-width:0}.pwa-copy strong{font-size:14px}.pwa-copy p{margin:4px 0 0;font-size:13px;line-height:1.45;color:#58705f}.pwa-actions{display:flex;align-items:center;gap:10px;flex-shrink:0}.pwa-actions .button{min-height:42px;white-space:nowrap}.pwa-dismiss{border:0;background:transparent;color:#5e7666;cursor:pointer;padding:9px 4px;font-size:12px;white-space:nowrap}.pwa-help{flex-basis:100%;font-size:12px;line-height:1.5;color:#496450}.pwa-banner{flex-wrap:wrap}@media(max-width:600px){.pwa-banner{align-items:flex-start;padding:15px}.pwa-actions{width:100%;justify-content:flex-start}.pwa-actions .button{flex:1}.pwa-dismiss{padding:12px 4px}}`;
    document.head.append(style);
  }

  function render(instance) {
    const { container, signedIn } = instance;
    let dismissed = false;
    try { dismissed = sessionStorage.getItem("trilha-pwa-dismissed") === "1"; } catch {}
    if (!container || !signedIn || isStandalone() || dismissed) {
      if (container) container.replaceChildren();
      return;
    }

    const ios = isIos();
    const canPrompt = Boolean(deferredPrompt);
    const title = 'Instalar app';
    const message = ios
      ? 'Tenha a Trilha ENCCEJA na tela inicial para estudar com um toque.'
      : 'Adicione a Trilha ENCCEJA à tela inicial para estudar como um app.';
    const action = canPrompt
      ? '<button class="button" data-pwa-install>Instalar agora</button>'
      : ios
        ? '<button class="button" data-pwa-help>Como instalar</button>'
        : '<button class="button" data-pwa-help>Ver instruções</button>';

    container.innerHTML = `<div class="pwa-banner" role="status">
      <div class="pwa-copy"><strong>${title}</strong><p>${message}</p></div>
      <div class="pwa-actions">${action}<button class="pwa-dismiss" type="button" aria-label="Dispensar aviso" data-pwa-dismiss>Agora não</button></div>
      <div class="pwa-help" hidden>${ios
        ? 'No Safari: toque em Compartilhar e depois em “Adicionar à Tela de Início”.'
        : 'No menu do navegador, escolha “Instalar app” ou “Adicionar à tela inicial”.'}</div>
    </div>`;

    container.querySelector('[data-pwa-install]')?.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice.catch(() => null);
      deferredPrompt = null;
      render(instance);
    });
    container.querySelector('[data-pwa-help]')?.addEventListener('click', event => {
      const help = container.querySelector('.pwa-help');
      help.hidden = !help.hidden;
      event.currentTarget.textContent = help.hidden ? 'Como instalar' : 'Fechar instruções';
    });
    container.querySelector('[data-pwa-dismiss]')?.addEventListener('click', () => {
      try { sessionStorage.setItem('trilha-pwa-dismissed', '1'); } catch {}
      container.replaceChildren();
    });
  }

  function initPwaInstall(options = {}) {
    const instance = {
      container: options.container || document.querySelector('#install-app'),
      signedIn: options.signedIn !== false,
      update(next = {}) {
        Object.assign(instance, next);
        let dismissed = false;
        try { dismissed = sessionStorage.getItem('trilha-pwa-dismissed') === '1'; } catch {}
        if (dismissed && instance.signedIn) return;
        render(instance);
      },
      destroy() {
        listeners.delete(instance);
        instance.container?.replaceChildren();
      }
    };
    listeners.add(instance);
    addBaseStyles();
    registerServiceWorker();
    instance.update();
    return instance;
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;
    listeners.forEach(render);
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    listeners.forEach(instance => instance.container?.replaceChildren());
  });
  window.initPwaInstall = initPwaInstall;
  document.addEventListener('DOMContentLoaded', () => {
    // The root can expose #install-app before authentication. This makes the
    // install suggestion available on first mobile visit as requested.
    const container = document.querySelector('#install-app');
    if (container && !container.dataset.pwaInitialized) {
      container.dataset.pwaInitialized = '1';
      initPwaInstall({ container, signedIn: true });
    }
  }, { once: true });
})();
