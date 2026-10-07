const toggle = document.querySelector('.menu-toggle');

const links = document.querySelector('.nav-links');
toggle?.addEventListener('click', () => {

  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute(

    'aria-expanded',

    String(!open)

  );
  links?.classList.toggle(

    'open',

    !open

  );

});
document

  .querySelectorAll('.nav-links a')

  .forEach((a) => {

    a.addEventListener('click', () => {

      links?.classList.remove('open');
      toggle?.setAttribute(

        'aria-expanded',

        'false'

      );

    });

  });
const reduced = window.matchMedia(

  '(prefers-reduced-motion: reduce)'

).matches;
// =============================================

// REVEAL ANIMATION

// =============================================
if (

  !reduced &&

  'IntersectionObserver' in window

) {

  document.documentElement.classList.add('motion-ready');
  const io = new IntersectionObserver(

    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.classList.add(

            'visible'

          );
          io.unobserve(

            entry.target

          );

        }

      });

    },

    {

      threshold: 0.02, rootMargin: "0px 0px 70px 0px"

    }

  );
  document

    .querySelectorAll('.reveal')

    .forEach((element) => {

      io.observe(element);

    });
} else {
  document

    .querySelectorAll('.reveal')

    .forEach((element) => {

      element.classList.add(

        'visible'

      );

    });

}
// =============================================

// CURRENT YEAR

// =============================================
const year = document.getElementById(

  'year'

);
if (year) {

  year.textContent =

    new Date().getFullYear();

}
// =============================================

// MODEL CARD FLOWERS

// =============================================
const modelCards = [

  ...document.querySelectorAll(

    '.model-card'

  )

];
function startFlowerRain(card) {
  if (

    reduced ||

    card.querySelector('.flower-rain')

  ) {

    return;

  }
  const rain =

    document.createElement('div');
  rain.className =

    'flower-rain';
  rain.setAttribute(

    'aria-hidden',

    'true'

  );
  const flowers = [

    '✿',

    '❀',

    '✾',

    '❁'

  ];
  for (

    let i = 0;

    i < 7;

    i++

  ) {
    const flower =

      document.createElement('span');
    flower.className =

      'falling-flower';
    flower.textContent =

      flowers[

      i % flowers.length

      ];
    flower.style.left =

      `${4 + Math.random() * 90}%`;
    flower.style.fontSize =

      `${14 + Math.random() * 17}px`;
    flower.style.setProperty(

      '--fall-delay',

      `${Math.random() * 0.8}s`

    );
    flower.style.setProperty(

      '--fall-duration',

      `${2.1 + Math.random() * 1.5}s`

    );
    flower.style.setProperty(

      '--drift',

      `${-30 + Math.random() * 60}px`

    );
    rain.appendChild(

      flower

    );

  }
  card.appendChild(

    rain

  );

}
function stopFlowerRain(card) {
  card

    .querySelector('.flower-rain')

    ?.remove();

}
// Desktop: genuine hover. Mobile: activate the card nearest the viewport center.
// No tap or click is required.
const touchLayout = window.matchMedia('(hover: none), (pointer: coarse)');
let activeModelCard = null;
let flowerCleanupTimer = null;

function activateModelCard(card) {
  if (activeModelCard === card) return;
  if (activeModelCard) {
    activeModelCard.classList.remove('model-active');
    stopFlowerRain(activeModelCard);
  }
  activeModelCard = card;
  if (!card) return;
  card.classList.add('model-active');
  startFlowerRain(card);
  clearTimeout(flowerCleanupTimer);
  flowerCleanupTimer = setTimeout(() => stopFlowerRain(card), 3600);
}

modelCards.forEach((card) => {
  card.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse' && !touchLayout.matches) activateModelCard(card);
  });
  card.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse' && !touchLayout.matches && activeModelCard === card) activateModelCard(null);
  });
  card.addEventListener('focusin', () => {
    if (!touchLayout.matches) activateModelCard(card);
  });
  card.addEventListener('focusout', () => {
    if (!touchLayout.matches && activeModelCard === card) activateModelCard(null);
  });
});

let modelScrollPending = false;
function updateMobileModelCard() {
  modelScrollPending = false;
  if (!touchLayout.matches || !modelCards.length) return;
  const center = window.innerHeight * 0.52;
  let nearest = null;
  let bestDistance = Infinity;
  modelCards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    if (rect.bottom < window.innerHeight * 0.16 || rect.top > window.innerHeight * 0.86) return;
    const distance = Math.abs((rect.top + rect.bottom) / 2 - center);
    if (distance < bestDistance) { nearest = card; bestDistance = distance; }
  });
  activateModelCard(nearest);
}
function queueMobileModelUpdate() {
  if (!modelScrollPending) {
    modelScrollPending = true;
    requestAnimationFrame(updateMobileModelCard);
  }
}
window.addEventListener('scroll', queueMobileModelUpdate, { passive: true });
window.addEventListener('resize', queueMobileModelUpdate, { passive: true });
touchLayout.addEventListener?.('change', () => {
  activateModelCard(null);
  queueMobileModelUpdate();
});
queueMobileModelUpdate();

// =============================================

// BACK TO TOP

// =============================================
document

  .querySelector('.back-to-top')

  ?.addEventListener('click', () => {
    window.scrollTo({

      top: 0,

      left: 0,

      behavior:

        reduced

          ? 'auto'

          : 'smooth'

    });
  });
// =============================================

// IMPACT NUMBER

// =============================================
const impactStat =

  document.querySelector(

    '.impact-stat'

  );
if (impactStat) {
  const number =

    impactStat.querySelector(

      '.impact-number'

    );
  const target =

    Number(

      impactStat.dataset.count || 11

    );
  if (

    reduced ||

    !('IntersectionObserver' in window)

  ) {
    if (number) {

      number.textContent =

        target;

    }
  } else {
    const countObserver =

      new IntersectionObserver(

        ([entry]) => {
          if (

            !entry.isIntersecting ||

            !number

          ) {

            return;

          }
          const start =

            performance.now();
          const duration =

            1100;
          const tick =

            (now) => {
              const progress =

                Math.min(

                  (now - start) /

                  duration,

                  1

                );
              const eased =

                1 -

                Math.pow(

                  1 - progress,

                  3

                );
              number.textContent =

                Math.max(

                  1,

                  Math.round(

                    target * eased

                  )

                );
              if (progress < 1) {

                requestAnimationFrame(

                  tick

                );

              }

            };
          requestAnimationFrame(

            tick

          );
          countObserver.disconnect();

        },

        {

          threshold: 0.45

        }

      );
    countObserver.observe(

      impactStat

    );

  }

}
// =============================================
// COMMUNITY GALLERY — progressive and mobile-friendly
// =============================================
const galleryTrack = document.getElementById('community-gallery-track');
const gallerySection = document.getElementById('community-gallery');
const lightbox = document.getElementById('gallery-lightbox');
const lightboxImage = document.getElementById('gallery-lightbox-image');
const lightboxCounter = document.getElementById('gallery-lightbox-counter');
const lightboxClose = document.getElementById('gallery-lightbox-close');
const lightboxPrevious = document.getElementById('gallery-lightbox-prev');
const lightboxNext = document.getElementById('gallery-lightbox-next');
const galleryImages = Array.isArray(window.communityImages) ? window.communityImages : [];
const galleryEntries = galleryImages.map((item) =>
  typeof item === 'string' ? { thumb: item, full: item } : item
).filter((item) => item && item.thumb && item.full);
let currentGalleryIndex = 0;
let lastGalleryFocus = null;
let galleryInitialized = false;
let suppressGalleryClickUntil = 0;

function createGalleryItem(entry, index, duplicate = false) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'community-gallery-item';
  button.setAttribute('aria-label', `View community photo ${index + 1}`);
  if (duplicate) {
    button.tabIndex = -1;
    button.setAttribute('aria-hidden', 'true');
  }
  const img = document.createElement('img');
  img.src = entry.thumb;
  img.alt = duplicate ? '' : `Global Maheela community photo ${index + 1}`;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.width = 420;
  img.height = 320;
  button.append(img);
  button.addEventListener('click', () => {
    if (performance.now() < suppressGalleryClickUntil) return;
    openGallery(index, button);
  });
  return button;
}

function initializeGallery() {
  if (!galleryTrack || galleryInitialized) return;
  galleryInitialized = true;
  if (!galleryEntries.length) {
    galleryTrack.textContent = 'Community photos coming soon.';
    galleryTrack.classList.add('gallery-ready', 'gallery-no-animation');
    return;
  }
  // Keep the marquee lightweight: the lightbox still navigates ALL images.
  const featured = galleryEntries.slice(0, 12);
  const fragment = document.createDocumentFragment();
  featured.forEach((entry, i) => fragment.append(createGalleryItem(entry, i)));
  if (featured.length > 1) {
    featured.forEach((entry, i) => fragment.append(createGalleryItem(entry, i, true)));
  } else {
    galleryTrack.classList.add('gallery-no-animation');
  }
  galleryTrack.append(fragment);
  galleryTrack.classList.add('gallery-ready');
  startGalleryMotion();
}

function updateGalleryLightbox() {
  if (!lightboxImage || !galleryEntries.length) return;
  lightboxImage.src = galleryEntries[currentGalleryIndex].full;
  lightboxImage.alt = `Global Maheela community photo ${currentGalleryIndex + 1}`;
  if (lightboxCounter) lightboxCounter.textContent = `${currentGalleryIndex + 1} / ${galleryEntries.length}`;
}
function openGallery(index, trigger) {
  if (!lightbox || !lightboxImage || !galleryEntries.length) return;
  currentGalleryIndex = index;
  lastGalleryFocus = trigger;
  updateGalleryLightbox();
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('gallery-open');
  lightboxClose?.focus();
}
function nextGalleryImage() {
  if (!galleryEntries.length) return;
  currentGalleryIndex = (currentGalleryIndex + 1) % galleryEntries.length;
  updateGalleryLightbox();
}
function previousGalleryImage() {
  if (!galleryEntries.length) return;
  currentGalleryIndex = (currentGalleryIndex - 1 + galleryEntries.length) % galleryEntries.length;
  updateGalleryLightbox();
}
function closeGallery() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('gallery-open');
  lightboxImage?.removeAttribute('src');
  lastGalleryFocus?.focus();
}
lightboxClose?.addEventListener('click', closeGallery);
lightboxPrevious?.addEventListener('click', previousGalleryImage);
lightboxNext?.addEventListener('click', nextGalleryImage);
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeGallery();
});
document.addEventListener('keydown', (event) => {
  if (!lightbox?.classList.contains('open')) return;
  if (event.key === 'Escape') closeGallery();
  if (event.key === 'ArrowRight') nextGalleryImage();
  if (event.key === 'ArrowLeft') previousGalleryImage();
  if (event.key === 'Tab') {
    const controls = [lightboxClose, lightboxPrevious, lightboxNext].filter(Boolean);
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
let touchStartX = null;
lightbox?.addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0]?.screenX ?? null;
}, { passive: true });
lightbox?.addEventListener('touchend', (event) => {
  if (touchStartX === null) return;
  const delta = (event.changedTouches[0]?.screenX ?? touchStartX) - touchStartX;
  touchStartX = null;
  if (Math.abs(delta) < 50) return;
  if (delta < 0) nextGalleryImage(); else previousGalleryImage();
}, { passive: true });
if (galleryTrack) {
  if ('IntersectionObserver' in window && gallerySection) {
    const galleryObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        initializeGallery();
        galleryObserver.disconnect();
      }
    }, { rootMargin: '450px 0px' });
    galleryObserver.observe(gallerySection);
  } else initializeGallery();
}

// Continuously scroll the actual gallery viewport, so users can swipe/drag
// in either direction while the gallery still moves on its own.
function startGalleryMotion() {
  if (!gallerySection || !galleryTrack || galleryEntries.length < 2) return;
  const gallery = gallerySection;
  let pausedUntil = 0;
  let dragging = false;
  let pointerStartX = 0;
  let scrollStart = 0;
  let movedWhileDragging = false;
  let lastTime = 0;
  let frame = 0;
  let visible = true;
  const speed = 19; // pixels per second: gentle automatic movement
  const pause = () => { pausedUntil = performance.now() + 2300; };
  gallery.addEventListener('pointerdown', (event) => {
    pause();
    if (event.pointerType === 'mouse' && event.button === 0) {
      dragging = true;
      movedWhileDragging = false;
      pointerStartX = event.clientX;
      scrollStart = gallery.scrollLeft;
      gallery.classList.add('is-dragging');
    }
  });
  window.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    if (Math.abs(event.clientX - pointerStartX) > 7) movedWhileDragging = true;
    if (movedWhileDragging) gallery.scrollLeft = scrollStart - (event.clientX - pointerStartX);
    pause();
  });
  const stopDragging = () => { if (dragging && movedWhileDragging) suppressGalleryClickUntil = performance.now() + 250; dragging = false; movedWhileDragging = false; gallery.classList.remove('is-dragging'); };
  window.addEventListener('pointerup', stopDragging);
  window.addEventListener('pointercancel', stopDragging);
  gallery.addEventListener('touchstart', pause, { passive: true });
  gallery.addEventListener('touchmove', pause, { passive: true });
  gallery.addEventListener('wheel', pause, { passive: true });
  gallery.addEventListener('mouseenter', pause);
  gallery.addEventListener('focusin', pause);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0 }).observe(gallery);
  }
  const tick = (time) => {
    const delta = lastTime ? Math.min((time - lastTime) / 1000, .05) : 0;
    lastTime = time;
    if (!reduced && visible && !dragging && time > pausedUntil && !lightbox?.classList.contains('open')) {
      const half = galleryTrack.scrollWidth / 2;
      if (half > 0) {
        gallery.scrollLeft += speed * delta;
        if (gallery.scrollLeft >= half) gallery.scrollLeft -= half;
      }
    }
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  window.addEventListener('pagehide', () => cancelAnimationFrame(frame), { once: true });
}

// Email is assembled only when a visitor presses the contact button.
// This avoids displaying a plain-text address in the page markup.
document.getElementById('email-global-maheela')?.addEventListener('click', () => {
  const address = ['globalmaheela', 'gmail.com'].join('@');
  const subject = encodeURIComponent('Connecting with Global Maheela');
  window.location.href = `mailto:${address}?subject=${subject}`;
});

// Get Involved: touch devices have no hover. Highlight the card closest
// to the center of the visible screen, without requiring a tap.
(() => {
  const cards = [...document.querySelectorAll('.involve-card')];
  if (!cards.length) return;
  const touch = window.matchMedia('(hover: none), (pointer: coarse)');
  let scheduled = false;
  const update = () => {
    scheduled = false;
    if (!touch.matches) {
      cards.forEach(card => card.classList.remove('is-scroll-active'));
      return;
    }
    const center = window.innerHeight / 2;
    let best = null;
    let distance = Infinity;
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      if (rect.bottom < window.innerHeight * .15 || rect.top > window.innerHeight * .85) return;
      const d = Math.abs((rect.top + rect.bottom) / 2 - center);
      if (d < distance) { distance = d; best = card; }
    });
    cards.forEach(card => card.classList.toggle('is-scroll-active', card === best));
  };
  const schedule = () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  touch.addEventListener?.('change', schedule);
  schedule();
})();
