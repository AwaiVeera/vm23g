const MAX_SECONDS = 180;

export function mountBrief() {
  const form = document.querySelector<HTMLFormElement>('[data-brief]');
  if (!form) return;
  document.documentElement.classList.add('js-steps');

  const steps = [...form.querySelectorAll<HTMLFieldSetElement>('[data-step]')];
  const prev = form.querySelector<HTMLButtonElement>('[data-prev]')!;
  const next = form.querySelector<HTMLButtonElement>('[data-next]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const progress = document.querySelector<HTMLElement>('[data-progress]');
  const dots = document.querySelectorAll<HTMLElement>('[data-step-dot]');
  const formError = form.querySelector<HTMLElement>('[data-form-error]')!;
  const done = document.querySelector<HTMLElement>('[data-done]');
  form.querySelector<HTMLInputElement>('[data-started]')!.value = String(Date.now());

  const focus = new URLSearchParams(location.search).get('focus') ?? new URLSearchParams(location.search).get('need');
  if (focus) {
    form.querySelectorAll<HTMLInputElement>('input[name="pillars"]').forEach((i) => {
      if (i.value.toLowerCase() === focus.toLowerCase()) i.checked = true;
    });
  }

  let current = 0;
  const err = (name: string, msg: string) => {
    const el = form.querySelector<HTMLElement>(`[data-error="${name}"]`);
    if (el) el.textContent = msg;
    const input = form.querySelector<HTMLElement>(`[name="${name}"]`);
    if (input && input.getAttribute('type') !== 'checkbox') input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  };

  const show = (i: number, moveFocus = true) => {
    current = Math.max(0, Math.min(steps.length - 1, i));
    steps.forEach((s, idx) => s.classList.toggle('is-active', idx === current));
    prev.hidden = current === 0;
    next.hidden = current === steps.length - 1;
    submit.hidden = current !== steps.length - 1;
    if (progress) progress.style.width = `${((current + 1) / steps.length) * 100}%`;
    dots.forEach((d, idx) => {
      if (idx === current) d.setAttribute('aria-current', 'step');
      else d.removeAttribute('aria-current');
      d.toggleAttribute('data-done-step', idx < current);
    });
    if (moveFocus) {
      const legend = steps[current].querySelector<HTMLElement>('legend');
      legend?.setAttribute('tabindex', '-1');
      legend?.focus({ preventScroll: true });
      const top = form.getBoundingClientRect().top + window.scrollY - 120;
      if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const validate = (i: number) => {
    const data = new FormData(form);
    let ok = true;
    if (i === 0) {
      const picked = data.getAll('pillars').length > 0;
      err('pillars', picked ? '' : 'Choose at least one so we can route your brief.');
      ok = picked;
    }
    if (i === 1) {
      const name = String(data.get('name') ?? '').trim();
      const email = String(data.get('email') ?? '').trim();
      err('name', name ? '' : 'Please tell us your name.');
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
      err('email', emailOk ? '' : 'Please enter a valid email address.');
      ok = Boolean(name) && emailOk;
    }
    if (i === 3) {
      const msg = String(data.get('message') ?? '').trim();
      const hasVoice = Boolean(recording);
      err('message', msg || hasVoice ? '' : 'Add a few words or a voice note about your project.');
      const consent = data.get('consent') === 'yes';
      err('consent', consent ? '' : 'Please confirm we may contact you about your enquiry.');
      ok = (Boolean(msg) || hasVoice) && consent;
    }
    if (!ok) {
      const firstInvalid = steps[i].querySelector<HTMLElement>('[aria-invalid="true"]') ?? steps[i].querySelector<HTMLElement>('input');
      firstInvalid?.focus();
    }
    return ok;
  };

  next.addEventListener('click', () => {
    if (validate(current)) show(current + 1);
  });
  prev.addEventListener('click', () => show(current - 1));
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT' && current < steps.length - 1) {
      e.preventDefault();
      next.click();
    }
  });

  let recording: Blob | null = null;
  const voice = form.querySelector<HTMLElement>('[data-voice]');
  if (voice && 'MediaRecorder' in window && navigator.mediaDevices?.getUserMedia) {
    voice.hidden = false;
    const recBtn = voice.querySelector<HTMLButtonElement>('[data-rec]')!;
    const recLabel = voice.querySelector<HTMLElement>('[data-rec-label]')!;
    const time = voice.querySelector<HTMLElement>('[data-rec-time]')!;
    const review = voice.querySelector<HTMLElement>('[data-rec-review]')!;
    const audio = voice.querySelector<HTMLAudioElement>('[data-rec-audio]')!;
    const canvas = voice.querySelector<HTMLCanvasElement>('[data-wave]')!;
    const discard = voice.querySelector<HTMLButtonElement>('[data-rec-discard]')!;
    const ctx2d = canvas.getContext('2d');
    let recorder: MediaRecorder | null = null;
    let stream: MediaStream | null = null;
    let timer = 0;
    let raf = 0;
    let started = 0;

    const draw = (analyser: AnalyserNode) => {
      if (!ctx2d) return;
      const data = new Uint8Array(analyser.frequencyBinCount);
      const loop = () => {
        analyser.getByteFrequencyData(data);
        const w = canvas.width;
        const h = canvas.height;
        ctx2d.clearRect(0, 0, w, h);
        const bars = 40;
        const step = Math.floor(data.length / bars);
        for (let i = 0; i < bars; i++) {
          const v = data[i * step] / 255;
          const bh = Math.max(3, v * h);
          ctx2d.fillStyle = `rgba(199,164,90,${0.35 + v * 0.65})`;
          ctx2d.fillRect(i * (w / bars) + 1, (h - bh) / 2, w / bars - 3, bh);
        }
        raf = requestAnimationFrame(loop);
      };
      loop();
    };

    const stop = () => {
      recorder?.state === 'recording' && recorder.stop();
    };

    recBtn.addEventListener('click', async () => {
      if (recorder?.state === 'recording') return stop();
      err('voice', '');
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch {
        err('voice', 'Microphone access was blocked. You can type your brief instead.');
        return;
      }
      const type = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm'].find((t) => MediaRecorder.isTypeSupported(t));
      recorder = new MediaRecorder(stream, type ? { mimeType: type, audioBitsPerSecond: 48000 } : undefined);
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      recorder.onstop = () => {
        clearInterval(timer);
        cancelAnimationFrame(raf);
        stream?.getTracks().forEach((t) => t.stop());
        recBtn.setAttribute('aria-pressed', 'false');
        recLabel.textContent = 'Record again';
        recording = new Blob(chunks, { type: recorder?.mimeType || 'audio/webm' });
        audio.src = URL.createObjectURL(recording);
        review.hidden = false;
        err('message', '');
      };
      const audioCtx = new AudioContext();
      const src = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);
      draw(analyser);
      recorder.start(250);
      started = Date.now();
      recBtn.setAttribute('aria-pressed', 'true');
      recLabel.textContent = 'Stop';
      review.hidden = true;
      timer = window.setInterval(() => {
        const s = Math.floor((Date.now() - started) / 1000);
        time.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
        if (s >= MAX_SECONDS) stop();
      }, 250);
    });

    discard.addEventListener('click', () => {
      recording = null;
      audio.removeAttribute('src');
      review.hidden = true;
      recLabel.textContent = 'Record';
      time.textContent = '0:00';
      ctx2d?.clearRect(0, 0, canvas.width, canvas.height);
      recBtn.focus();
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formError.textContent = '';
    for (let i = 0; i < steps.length; i++) {
      if (!validate(i)) {
        show(i);
        return;
      }
    }
    const data = new FormData(form);
    if (recording) {
      const ext = recording.type.includes('mp4') ? 'm4a' : 'webm';
      data.set('voice', recording, `voice-note.${ext}`);
    }
    submit.disabled = true;
    submit.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, { method: 'POST', body: data, headers: { accept: 'application/json' } });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (out.fields) {
          for (const [k, v] of Object.entries(out.fields as Record<string, string>)) err(k, v);
          const map: Record<string, number> = { pillars: 0, name: 1, email: 1, message: 3, consent: 3, voice: 3 };
          const first = Object.keys(out.fields)[0];
          if (first in map) show(map[first]);
        }
        throw new Error(out.error || 'We could not send your brief. Please try again.');
      }
      if (done) {
        done.querySelector('[data-done-name]')!.textContent = String(data.get('name')).split(' ')[0];
        done.querySelector('[data-done-email]')!.textContent = String(data.get('email'));
        form.hidden = true;
        done.hidden = false;
        done.focus();
        if (progress) progress.style.width = '100%';
        dots.forEach((d) => {
          d.removeAttribute('aria-current');
          d.setAttribute('data-done-step', '');
        });
      }
    } catch (error) {
      formError.textContent = (error as Error).message;
    } finally {
      submit.disabled = false;
      submit.textContent = 'Send brief';
    }
  });

  show(0, false);
}
