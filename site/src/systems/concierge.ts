type Msg = { role: 'u' | 'v'; text: string };

const STORE = 'vm23g-v';

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

function render(target: HTMLElement, text: string) {
  target.replaceChildren();
  const blocks = text.trim().split(/\n{2,}/);
  for (const block of blocks) {
    const lines = block.split('\n').filter(Boolean);
    const bulletLines = lines.filter((l) => /^\s*[•\-*]\s+/.test(l));
    if (bulletLines.length && bulletLines.length === lines.length) {
      const ul = document.createElement('ul');
      for (const l of lines) {
        const li = document.createElement('li');
        linkify(li, l.replace(/^\s*[•\-*]\s+/, ''));
        ul.append(li);
      }
      target.append(ul);
    } else {
      let ul: HTMLUListElement | null = null;
      for (const l of lines) {
        if (/^\s*[•\-*]\s+/.test(l)) {
          if (!ul) {
            ul = document.createElement('ul');
            target.append(ul);
          }
          const li = document.createElement('li');
          linkify(li, l.replace(/^\s*[•\-*]\s+/, ''));
          ul.append(li);
        } else {
          ul = null;
          const p = document.createElement('p');
          linkify(p, l);
          target.append(p);
        }
      }
    }
  }
}

function linkify(el: HTMLElement, text: string) {
  const clean = text.replace(/\*\*(.+?)\*\*/g, '$1');
  const re = /(https?:\/\/[^\s)]+|(?<![\w.])\/(?:work|services|ai-lab|founders|ecosystem|start|legal)\b[^\s,.)]*)/g;
  let last = 0;
  for (const m of clean.matchAll(re)) {
    if (m.index! > last) el.append(clean.slice(last, m.index));
    const a = document.createElement('a');
    const href = m[0].replace(/[.,]+$/, '');
    a.href = href;
    a.textContent = href.replace(/^https?:\/\//, '');
    if (href.startsWith('http')) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
    el.append(a);
    last = m.index! + m[0].length;
  }
  if (last < clean.length) el.append(clean.slice(last));
}

export function mountConcierge() {
  const root = document.querySelector<HTMLElement>('[data-concierge]');
  const panel = root?.querySelector<HTMLDialogElement>('[data-cg-panel]');
  if (!root || !panel) return;

  const log = panel.querySelector<HTMLElement>('[data-cg-log]')!;
  const form = panel.querySelector<HTMLFormElement>('[data-cg-form]')!;
  const text = panel.querySelector<HTMLTextAreaElement>('[data-cg-text]')!;
  const send = panel.querySelector<HTMLButtonElement>('[data-cg-send]')!;
  const suggest = panel.querySelector<HTMLElement>('[data-cg-suggest]')!;
  const mic = panel.querySelector<HTMLButtonElement>('[data-cg-mic]')!;
  const micLabel = panel.querySelector<HTMLElement>('[data-cg-mic-label]')!;
  const speakBtn = panel.querySelector<HTMLButtonElement>('[data-cg-speak]')!;
  const lead = panel.querySelector<HTMLFormElement>('[data-cg-lead]')!;
  const leadError = panel.querySelector<HTMLElement>('[data-cg-lead-error]')!;

  let state: { chatId: string; msgs: Msg[]; speak: boolean } = { chatId: '', msgs: [], speak: false };
  try {
    const saved = sessionStorage.getItem(STORE);
    if (saved) state = { ...state, ...JSON.parse(saved) };
  } catch {}
  const persist = () => {
    try {
      sessionStorage.setItem(STORE, JSON.stringify({ ...state, msgs: state.msgs.slice(-30) }));
    } catch {}
  };

  const add = (role: Msg['role'] | 'system', content: string) => {
    const div = document.createElement('div');
    div.className = `msg msg-${role}`;
    render(div, content);
    log.append(div);
    log.scrollTop = log.scrollHeight;
    return div;
  };

  for (const m of state.msgs) add(m.role, m.text);
  if (state.msgs.length) suggest.hidden = true;

  const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
  if (synth) {
    speakBtn.hidden = false;
    speakBtn.setAttribute('aria-pressed', String(state.speak));
    speakBtn.addEventListener('click', () => {
      state.speak = !state.speak;
      speakBtn.setAttribute('aria-pressed', String(state.speak));
      if (!state.speak) synth.cancel();
      persist();
    });
  }
  const speak = (t: string) => {
    if (!synth || !state.speak) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(t.replace(/[•*]/g, '').replace(/https?:\/\/\S+/g, 'the link'));
    u.lang = 'en-GB';
    u.rate = 1.02;
    const voice = synth.getVoices().find((v) => /en-(GB|SG|AU)/.test(v.lang)) ?? synth.getVoices().find((v) => v.lang.startsWith('en'));
    if (voice) u.voice = voice;
    synth.speak(u);
  };

  const SR = (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike })
    .SpeechRecognition ?? (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;
  let recognizer: SpeechRecognitionLike | null = null;
  if (SR) {
    mic.hidden = false;
    mic.addEventListener('click', () => {
      if (recognizer) {
        recognizer.stop();
        return;
      }
      recognizer = new SR();
      recognizer.lang = 'en-SG';
      recognizer.interimResults = true;
      recognizer.continuous = false;
      const base = text.value ? `${text.value} ` : '';
      recognizer.onresult = (e) => {
        let said = '';
        let final = false;
        for (let i = 0; i < e.results.length; i++) {
          said += e.results[i][0].transcript;
          if (e.results[i].isFinal) final = true;
        }
        text.value = base + said;
        autosize();
        if (final) {
          recognizer?.stop();
          if (text.value.trim()) form.requestSubmit();
        }
      };
      const end = () => {
        recognizer = null;
        mic.setAttribute('aria-pressed', 'false');
        micLabel.textContent = 'Speak to V';
      };
      recognizer.onend = end;
      recognizer.onerror = end;
      mic.setAttribute('aria-pressed', 'true');
      micLabel.textContent = 'Stop listening';
      try {
        recognizer.start();
      } catch {
        end();
      }
    });
  }

  const autosize = () => {
    text.style.height = 'auto';
    text.style.height = `${Math.min(140, text.scrollHeight)}px`;
    text.style.overflowY = text.scrollHeight > 140 ? 'auto' : 'hidden';
  };
  text.addEventListener('input', autosize);
  text.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  let busy = false;
  const ask = async (question: string) => {
    if (busy || !question.trim()) return;
    busy = true;
    send.disabled = true;
    suggest.hidden = true;
    add('u', question);
    state.msgs.push({ role: 'u', text: question });
    persist();

    const bubble = document.createElement('div');
    bubble.className = 'msg msg-v msg-typing';
    bubble.innerHTML = '<span></span><span></span><span></span>';
    bubble.setAttribute('aria-label', 'V is typing');
    log.append(bubble);
    log.scrollTop = log.scrollHeight;

    let full = '';
    try {
      const res = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ chatId: state.chatId, message: question, page: location.pathname }),
      });
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: 'V is unavailable right now.' }));
        throw new Error(err.error || 'V is unavailable right now.');
      }
      state.chatId = res.headers.get('x-chat-id') || state.chatId;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      bubble.className = 'msg msg-v';
      bubble.removeAttribute('aria-label');
      bubble.replaceChildren();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() ?? '';
        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith('data:')) continue;
          const data = line.slice(5).trim();
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data) as { response?: string };
            if (parsed.response) {
              full += parsed.response;
              render(bubble, full);
              log.scrollTop = log.scrollHeight;
            }
          } catch {}
        }
      }
      if (!full.trim()) throw new Error('V did not have an answer. Please try again.');
      state.msgs.push({ role: 'v', text: full });
      persist();
      speak(full);
    } catch (err) {
      bubble.remove();
      add('system', (err as Error).message || 'Something went wrong. Please try again.');
    } finally {
      busy = false;
      send.disabled = false;
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = text.value.trim();
    text.value = '';
    autosize();
    ask(q);
  });

  suggest.addEventListener('click', (e) => {
    const chip = (e.target as Element).closest<HTMLButtonElement>('[data-cg-chip]');
    if (chip) ask(chip.textContent?.trim() ?? '');
  });

  const showLead = (show: boolean) => {
    lead.hidden = !show;
    form.hidden = show;
    suggest.hidden = show || state.msgs.length > 0;
    if (show) (lead.elements.namedItem('name') as HTMLInputElement)?.focus();
    else text.focus();
  };
  panel.querySelector('[data-cg-brief]')?.addEventListener('click', () => showLead(true));
  panel.querySelector('[data-cg-lead-cancel]')?.addEventListener('click', () => showLead(false));

  lead.addEventListener('submit', async (e) => {
    e.preventDefault();
    leadError.textContent = '';
    const data = new FormData(lead);
    const email = String(data.get('email') ?? '').trim();
    if (!String(data.get('name') ?? '').trim()) return void (leadError.textContent = 'Please add your name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return void (leadError.textContent = 'Please add a valid email.');
    if (data.get('consent') !== 'yes') return void (leadError.textContent = 'Please confirm we may contact you.');
    const summary = state.msgs
      .filter((m) => m.role === 'u')
      .map((m) => `• ${m.text}`)
      .join('\n');
    const extra = String(data.get('message') ?? '').trim();
    data.set('message', [extra, summary && `From the chat with V:\n${summary}`].filter(Boolean).join('\n\n'));
    data.set('source', 'concierge');
    if (state.chatId) data.set('chat_id', state.chatId);
    const btn = lead.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    btn.disabled = true;
    try {
      const res = await fetch('/api/enquiries', { method: 'POST', body: data });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(out.error || 'We could not send that. Please try again.');
      lead.reset();
      showLead(false);
      const name = String(data.get('name')).split(' ')[0];
      const thanks = `Thank you, ${name}. Your brief is with the founders — they'll reply to ${email}. Anything else I can help with meanwhile?`;
      add('v', thanks);
      state.msgs.push({ role: 'v', text: thanks });
      persist();
    } catch (err) {
      leadError.textContent = (err as Error).message;
    } finally {
      btn.disabled = false;
    }
  });

  const open = (prompt?: string) => {
    if (!panel.open) panel.showModal();
    document.documentElement.style.overflow = 'hidden';
    setTimeout(() => {
      if (prompt) ask(prompt);
      else text.focus();
    }, 60);
  };
  const close = () => panel.close();

  document.addEventListener('click', (e) => {
    const trigger = (e.target as Element).closest<HTMLElement>('[data-concierge-open]');
    if (!trigger) return;
    e.preventDefault();
    open(trigger.dataset.conciergePrompt);
  });
  panel.querySelector('[data-cg-close]')?.addEventListener('click', close);
  panel.addEventListener('click', (e) => {
    if (e.target === panel) close();
  });
  panel.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    recognizer?.stop();
    synth?.cancel();
  });

  window.addEventListener('vm23g:concierge', (e) => open((e as CustomEvent<string | undefined>).detail));
}
