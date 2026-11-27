window.__ModuleLoader__.load({
  id: '@local/tts-plugin',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    function TtsIndicator() {
      return h('span', { style: { fontSize: 12, color: '#247bbf' } }, 'TTS on');
    }
    return {
      inject: ['slots'],
      apply(ctx) {
        ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
          name: 'sidebar.footer.action', id: 'tts-plugin', order: 5,
        }, TtsIndicator));
        // Auto-read new assistant messages
        const observer = new MutationObserver((mutations) => {
          for (const m of mutations) {
            for (const node of m.addedNodes) {
              if (node.nodeType !== 1) continue;
              const text = node.textContent || '';
              if (text.length > 20 && window.speechSynthesis) {
                const u = new SpeechSynthesisUtterance(text.slice(0, 500));
                window.speechSynthesis.speak(u);
              }
            }
          }
        });
        const target = document.querySelector('[data-chat-flow]') || document.body;
        observer.observe(target, { childList: true, subtree: true });
        ctx.effect(() => () => observer.disconnect());
      },
    };
  },
});