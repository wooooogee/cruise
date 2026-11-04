(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canObserve = 'IntersectionObserver' in window;

  /* ---------- 클릭·전환 기록 ----------
     광고 픽셀(GA4, 메타, 카카오, 틱톡 등)을 index.html <head>에 붙이면
     여기서 자동으로 이벤트가 전달돼요. 없으면 아무 일도 하지 않아요. */
  const track = (name, data = {}) => {
    try {
      (window.dataLayer = window.dataLayer || []).push({ event: name, ...data });
      if (typeof window.gtag === 'function') window.gtag('event', name, data);
      if (typeof window.fbq === 'function') {
        if (name === 'lead') window.fbq('track', 'Lead', data);
        else if (name.startsWith('call')) window.fbq('track', 'Contact', data);
      }
      if (typeof window.ttq?.track === 'function') {
        if (name === 'lead') window.ttq.track('SubmitForm');
        else if (name.startsWith('call')) window.ttq.track('Contact');
      }
    } catch (e) { /* 추적 실패는 페이지 동작에 영향 없음 */ }
  };
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-track]');
    if (el) track(el.dataset.track);
  });

  /* ---------- 스크롤하면 떠오르기 ---------- */
  if (canObserve && !reduceMotion) {
    document.documentElement.classList.add('js');
    const groups = [
      ['.sec > .kicker, .sec > h2, .sec > h3, .sec > .p, .gallery, .inc-box, .price, .fund, .compare, .form, .callcard, .note-line', ''],
      ['.worry li, .spec li, .days li, .benefits li, .routes li, .steps li, .stats li, .safe li', ''],
      ['.awards li', 'from-left'],
      ['.themes li', 'pop'],
      ['.wide-img, .track', 'zoom'],
      ['.days', 'container'],
    ];
    const targets = [];
    groups.forEach(([sel, kind]) => $$(sel).forEach((el) => {
      if (kind === 'container') { targets.push(el); return; } // 선 그리기용: 숨기지 않고 상태만 받음
      el.classList.add('reveal');
      if (kind) el.classList.add(kind);
      // 같은 목록 안에서는 하나씩 차례로 등장
      if (/^(LI)$/.test(el.tagName)) el.style.setProperty('--d', `${Math.min([...el.parentNode.children].indexOf(el) * 0.09, 0.63)}s`);
      targets.push(el);
    }));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach((el) => io.observe(el));
  }

  /* ---------- 숫자 카운트업 (숫자는 처음부터 최종값으로 들어 있음) ---------- */
  const fmt = (n) => Math.round(n).toLocaleString('ko-KR');
  if (canObserve && !reduceMotion) {
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        countIO.unobserve(en.target);
        const el = en.target, to = Number(el.dataset.count), dur = 1400, t0 = performance.now();
        const step = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        };
        el.textContent = '0';
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    $$('[data-count]').forEach((el) => countIO.observe(el));
  }

  /* ---------- 상단 읽기 진행 바 + 위로 가기 버튼 ---------- */
  const bar = $('.progress');
  const toTop = $('.totop');
  if (toTop) toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  if (bar) {
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.setProperty('--p', max > 0 ? Math.min(1, scrollY / max).toFixed(4) : 0);
      if (toTop) toTop.classList.toggle('is-on', scrollY > 500); // 첫 화면을 지나면 나타남
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------- 디즈니 사진: 자동으로 넘어가기 + 점 표시 ---------- */
  const gallery = $('.gallery');
  const dotsWrap = $('.gallery-dots');
  if (gallery && dotsWrap) {
    const slides = $$('figure', gallery);
    dotsWrap.innerHTML = slides.map(() => '<i></i>').join('');
    const dots = $$('i', dotsWrap);
    const current = () => {
      const x = gallery.scrollLeft;
      let best = 0;
      slides.forEach((s, i) => { if (Math.abs(s.offsetLeft - gallery.offsetLeft - 22 - x) < Math.abs(slides[best].offsetLeft - gallery.offsetLeft - 22 - x)) best = i; });
      return best;
    };
    const paint = () => { const c = current(); dots.forEach((d, i) => d.classList.toggle('on', i === c)); gallery.dataset.slide = c; };
    gallery.addEventListener('scroll', () => requestAnimationFrame(paint), { passive: true });
    paint();

    if (!reduceMotion && canObserve) {
      let timer = null, userTouched = false;
      // 브라우저마다 가로 smooth 스크롤이 들쭉날쭉해서 직접 움직임
      const glide = (to, dur = 650) => {
        const from = gallery.scrollLeft, t0 = performance.now();
        gallery.style.scrollSnapType = 'none';
        const step = (t) => {
          const p = Math.min(1, (t - t0) / dur), e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
          gallery.scrollLeft = from + (to - from) * e;
          if (p < 1) requestAnimationFrame(step); else { gallery.style.scrollSnapType = ''; paint(); }
        };
        requestAnimationFrame(step);
      };
      const next = () => {
        const i = (current() + 1) % slides.length;
        glide(slides[i].offsetLeft - gallery.offsetLeft - 22);
      };
      const start = () => { if (!timer && !userTouched) timer = setInterval(next, 3200); };
      const stop = () => { clearInterval(timer); timer = null; };
      ['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach((ev) =>
        gallery.addEventListener(ev, () => { userTouched = true; stop(); }, { passive: true }));
      let inView = false;
      new IntersectionObserver(([en]) => { inView = en.isIntersecting; inView ? start() : stop(); }, { threshold: 0.6 }).observe(gallery);
      document.addEventListener('visibilitychange', () => (document.hidden ? stop() : inView && start()));
    }
  }

  /* ---------- 가격 카드로 이동 (첫 화면 할인 띠, 팝업 버튼) ----------
     가격 카드 맨 위가 상단 바 바로 아래에 오도록 맞춤 */
  const goToPrice = () => {
    const el = $('#price');
    if (!el) return;
    let y = 0;
    for (let n = el; n; n = n.offsetParent) y += n.offsetTop; // 등장 애니메이션 위치와 상관없이 실제 위치
    scrollTo({ top: Math.max(0, y - 68), behavior: reduceMotion ? 'auto' : 'smooth' });
  };
  document.addEventListener('click', (e) => {
    if (e.target.closest('a[href="#price"]')) { e.preventDefault(); goToPrice(); }
  });

  /* ---------- 하단 고정 버튼 ----------
     항상 보임. 신청서 입력칸에 글을 쓰는 동안만(휴대폰 키보드가 올라와 있을 때) 숨김 */
  const dock = $('.dock');
  const formEl = $('form[name="consult"]');
  if (dock && formEl) {
    const isField = (el) => el && el.matches('input[type=text], input[type=tel]');
    formEl.addEventListener('focusin', (e) => { if (isField(e.target)) dock.classList.add('is-hidden'); });
    formEl.addEventListener('focusout', () => setTimeout(() => {
      if (!isField(document.activeElement)) dock.classList.remove('is-hidden');
    }, 50));
  }

  /* ---------- 들어오자마자 뜨는 혜택 팝업 (들어올 때마다·새로고침할 때마다) ---------- */
  const sheet = $('#welcome');
  if (sheet && typeof sheet.showModal === 'function') {
    const root = document.documentElement;
    const close = (then) => {
      if (!sheet.open || sheet.classList.contains('is-closing')) return;
      sheet.classList.add('is-closing');
      setTimeout(() => {
        sheet.classList.remove('is-closing');
        sheet.close();
        root.classList.remove('is-locked');
        if (then) then();
      }, reduceMotion ? 0 : 280);
    };
    sheet.addEventListener('cancel', (e) => { e.preventDefault(); close(); track('popup_close'); }); // ESC·뒤로 제스처
    sheet.addEventListener('click', (e) => { if (e.target === sheet) { close(); track('popup_close'); } }); // 어두운 바깥 누르기
    $('.sheet-go', sheet).addEventListener('click', () => close()); // 혜택 확인하기: 창만 닫고 그 자리 그대로
    // 새로고침하면 브라우저가 이전 스크롤 위치로 돌아가므로, 항상 맨 위에서 팝업을 보여줌
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    scrollTo(0, 0);
    setTimeout(() => {
      sheet.showModal();
      root.classList.add('is-locked');
      track('popup_view');
    }, 600);
  }

  /* ---------- 노선별 상세 일정 모달 (동남아·아시아 / 서부 지중해 공통) ---------- */
  const setupRouteModal = (modal, travelList, key) => {
    if (!modal || typeof modal.showModal !== 'function') return;
    const root = document.documentElement;
    const body = $('.route-modal-body', modal);
    const panels = $$('.sched-panel', modal);
    const badgeEl = $('.nav-badge', modal);
    const titleEl = $('.nav-title-full', modal);
    const dots = $$('.nav-dot', modal);

    let currentIndex = 0;

    const updateTravel = (index) => {
      currentIndex = (index + travelList.length) % travelList.length;
      const cur = travelList[currentIndex];

      if (badgeEl) badgeEl.textContent = cur.badge;
      if (titleEl) titleEl.textContent = cur.title;

      dots.forEach((dot, idx) => {
        dot.classList.toggle('is-active', idx === currentIndex);
      });

      panels.forEach((p, idx) => {
        const isTarget = idx === currentIndex;
        p.classList.toggle('is-active', isTarget);
        p.hidden = !isTarget;
      });

      if (body) body.scrollTop = 0;
      track(`switch_${key}_travel`, { index: currentIndex + 1 });
    };

    const closeModal = (then) => {
      if (!modal.open || modal.classList.contains('is-closing')) return;
      modal.classList.add('is-closing');
      setTimeout(() => {
        modal.classList.remove('is-closing');
        modal.close();
        root.classList.remove('is-locked');
        if (then) then();
      }, reduceMotion ? 0 : 250);
    };

    const openModal = () => {
      updateTravel(0); // 열 때 항상 1번 여행부터
      modal.showModal();
      root.classList.add('is-locked');
      track(`open_${key}_modal`);
    };

    // 모달 열기 트리거 (카드 클릭 및 버튼 클릭)
    $$(`[data-modal-open="${key}"]`).forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal();
        }
      });
    });

    // 닫기 버튼 및 백드롭 클릭
    $$(`[data-modal-close="${key}"]`, modal).forEach((btn) => {
      btn.addEventListener('click', () => closeModal());
    });
    modal.addEventListener('cancel', (e) => {
      e.preventDefault();
      closeModal();
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // 이전 / 다음 여행 버튼
    $$('[data-nav="prev"]', modal).forEach((btn) => {
      btn.addEventListener('click', () => updateTravel(currentIndex - 1));
    });
    $$('[data-nav="next"]', modal).forEach((btn) => {
      btn.addEventListener('click', () => updateTravel(currentIndex + 1));
    });

    // 점 인디케이터 클릭
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = Number(dot.dataset.index);
        if (!isNaN(idx)) updateTravel(idx);
      });
    });

    // 키보드 좌우 화살표 키로도 이전/다음 이동 지원
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') updateTravel(currentIndex - 1);
      else if (e.key === 'ArrowRight') updateTravel(currentIndex + 1);
    });

    // 모바일 터치 스와이프 지원
    let touchStartX = 0;
    let touchStartY = 0;
    modal.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    modal.addEventListener('touchend', (e) => {
      const diffX = e.changedTouches[0].clientX - touchStartX;
      const diffY = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (diffX < 0) updateTravel(currentIndex + 1);
        else updateTravel(currentIndex - 1);
      }
    }, { passive: true });

    // 상담 신청 버튼 클릭 시 모달 닫고 이동 및 라디오 체크
    $$('[data-modal-apply]', modal).forEach((btn) => {
      btn.addEventListener('click', () => {
        const routeVal = btn.dataset.modalApply;
        closeModal(() => {
          const f = $('form[name="consult"]');
          if (f && f.elements.route) {
            const radio = [...f.elements.route].find((r) => r.value === routeVal);
            if (radio) radio.checked = true;
          }
          const target = $('#apply');
          if (target) {
            let y = 0;
            for (let n = target; n; n = n.offsetParent) y += n.offsetTop;
            scrollTo({ top: Math.max(0, y - 68), behavior: reduceMotion ? 'auto' : 'smooth' });
          }
        });
      });
    });
  };

  // 1. 동남아·아시아 모달 초기화
  setupRouteModal($('#asiaModal'), [
    { badge: '1 / 5 · 로열캐리비안', title: '2027년 3월 16일 동남아 크루즈 로열 캐리비안 [네비게이터호] KE' },
    { badge: '2 / 5 · 로열캐리비안', title: '2027년 3월 12일 동남아 크루즈 로열 캐리비안 [네비게이터호] SQ' },
    { badge: '3 / 5 · 겐팅드림호', title: '2027년 3월 8일 동남아 크루즈 스타드림 [겐팅드림호] TW' },
    { badge: '4 / 5 · MSC 벨리시마', title: '『 발코니 』 2027년 2월 26일 한국출발 중국/일본 크루즈 MSC [벨리시마호]' },
    { badge: '5 / 5 · MSC 벨리시마', title: '『 발코니 』 2027년 2월 8일 한국출발 중국/일본 크루즈 MSC [벨리시마호]' }
  ], 'asia');

  // 2. 서부 지중해 모달 초기화
  setupRouteModal($('#medWestModal'), [
    { badge: '1 / 5 · 코스타 토스카나', title: '2027년 3월 11일 서부 지중해 크루즈 코스타 [토스카나호] QR' },
    { badge: '2 / 5 · NCL 던호', title: '2027년 5월 14일 대서양이 빚은 기적, 포르투갈-스페인 크루즈 NCL [던호] EK' },
    { badge: '3 / 5 · MSC 월드아시아', title: '2027년 2월 21일 서부 지중해 크루즈 MSC [월드아시아호] QR' },
    { badge: '4 / 5 · MSC 월드아시아', title: '2027년 1월 21일 서부 지중해 크루즈 MSC [월드아시아호] QR' },
    { badge: '5 / 5 · MSC 월드아시아', title: '2027년 2월 6일 서부 지중해 크루즈 MSC [월드아시아호] EK' }
  ], 'med-west');

  // 3. 알래스카 모달 초기화
  setupRouteModal($('#alaskaModal'), [
    { badge: '1 / 1 · NCL 앙코르호', title: '2027년 4월 24일 알래스카 크루즈 NCL [앙코르호] AS- 1팀' }
  ], 'alaska');

  // 4. 이집트 나일강 모달 초기화
  setupRouteModal($('#egyptModal'), [
    { badge: '1 / 2 · 크라운 엠페러호', title: '2027년 3월 6일 오천년의 이집트, 나일강 리버크루즈 [크라운 엠페러호] EK 『 리버뷰 』' },
    { badge: '2 / 2 · 그랜드 선호', title: '2026년 11월 29일 5천년의 이집트, 나일강 리버크루즈 [그랜드 선호] QR' }
  ], 'egypt');

  /* ---------- 상담 신청 폼 ---------- */
  const form = $('form[name="consult"]');
  if (!form) return;
  const msg = $('.form-msg', form);
  const done = $('.done');
  const btn = $('button[type="submit"]', form);
  const phone = form.elements.phone;
  const name = form.elements.name;

  // 광고 유입 정보(UTM)를 신청서에 같이 담기
  const params = new URLSearchParams(location.search);
  let saved = {};
  try { saved = JSON.parse(sessionStorage.getItem('utm') || '{}'); } catch (e) {}
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach((k) => {
    const v = params.get(k) || saved[k] || '';
    if (v) saved[k] = v;
    if (form.elements[k]) form.elements[k].value = v;
  });
  if (!saved.referrer && document.referrer && !document.referrer.startsWith(location.origin)) saved.referrer = document.referrer;
  form.elements.referrer.value = saved.referrer || '';
  try { sessionStorage.setItem('utm', JSON.stringify(saved)); } catch (e) {}

  // 연락처 자동 하이픈
  phone.addEventListener('input', () => {
    const d = phone.value.replace(/\D/g, '').slice(0, 11);
    phone.value = d.length < 4 ? d
      : d.length < 8 ? `${d.slice(0, 3)}-${d.slice(3)}`
      : d.length < 11 ? `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`
      : `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
    phone.removeAttribute('aria-invalid');
  });
  name.addEventListener('input', () => name.removeAttribute('aria-invalid'));

  const showError = (text, field) => {
    msg.textContent = text;
    msg.hidden = false;
    if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); }
  };

  let started = false;
  form.addEventListener('focusin', () => { if (!started) { started = true; track('form_start'); } });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.hidden = true;

    if (name.value.trim().length < 2) return showError('이름을 입력해 주세요.', name);
    if (!/^01[016789]\d{7,8}$/.test(phone.value.replace(/\D/g, ''))) return showError('연락처를 정확히 입력해 주세요. (예: 010-1234-5678)', phone);
    if (!form.elements.agree.checked) return showError('개인정보 수집·이용에 동의해 주세요.', form.elements.agree);

    btn.disabled = true;
    btn.textContent = '보내는 중…';
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString(),
      });
      if (!res.ok) throw new Error(res.status);
      track('lead', { route: form.elements.route.value });
      form.hidden = true;
      done.hidden = false;
      done.focus();
      done.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    } catch (err) {
      showError('전송에 실패했어요. 잠시 후 다시 시도하시거나 010-5945-2153으로 전화 주세요.');
      btn.disabled = false;
      btn.textContent = '무료 상담 신청하기';
    }
  });
})();
