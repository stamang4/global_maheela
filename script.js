const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');

toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';

  toggle.setAttribute('aria-expanded', String(!open));
  links?.classList.toggle('open', !open);
});

document.querySelectorAll('.nav-links a').forEach((a) => {
  a.addEventListener('click', () => {
    links?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

const reduced = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;


// =============================================
// REVEAL ANIMATION
// =============================================

if (!reduced && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  document.querySelectorAll('.reveal').forEach((element) => {
    io.observe(element);
  });
} else {
  document.querySelectorAll('.reveal').forEach((element) => {
    element.classList.add('visible');
  });
}


// =============================================
// CURRENT YEAR
// =============================================

const year = document.getElementById('year');

if (year) {
  year.textContent = new Date().getFullYear();
}


// =============================================
// MODEL CARD FLOWERS
// =============================================

const modelCards = [
  ...document.querySelectorAll('.model-card')
];

function startFlowerRain(card) {
  if (
    reduced ||
    card.querySelector('.flower-rain')
  ) {
    return;
  }

  const rain = document.createElement('div');

  rain.className = 'flower-rain';
  rain.setAttribute('aria-hidden', 'true');

  const flowers = [
    '✿',
    '❀',
    '✾',
    '❁'
  ];

  for (let i = 0; i < 15; i++) {
    const flower = document.createElement('span');

    flower.className = 'falling-flower';
    flower.textContent = flowers[i % flowers.length];

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

    rain.appendChild(flower);
  }

  card.appendChild(rain);
}

function stopFlowerRain(card) {
  card.querySelector('.flower-rain')?.remove();
}

modelCards.forEach((card) => {
  card.addEventListener(
    'mouseenter',
    () => startFlowerRain(card)
  );

  card.addEventListener(
    'mouseleave',
    () => stopFlowerRain(card)
  );

  card.addEventListener(
    'focus',
    () => startFlowerRain(card)
  );

  card.addEventListener(
    'blur',
    () => stopFlowerRain(card)
  );
});


// =============================================
// MOBILE MODEL CARD ACTIVATION
// =============================================

function updateActiveModelCard() {
  if (
    window.matchMedia(
      '(hover: none), (pointer: coarse)'
    ).matches === false
  ) {
    modelCards.forEach((card) => {
      card.classList.remove('model-active');
    });

    return;
  }

  const viewportCenter =
    window.innerHeight / 2;

  let closestCard = null;
  let closestDistance = Infinity;

  modelCards.forEach((card) => {
    const rect =
      card.getBoundingClientRect();

    const cardCenter =
      rect.top + rect.height / 2;

    const distance =
      Math.abs(
        cardCenter - viewportCenter
      );

    if (
      rect.bottom > 0 &&
      rect.top < window.innerHeight &&
      distance < closestDistance
    ) {
      closestDistance = distance;
      closestCard = card;
    }
  });

  modelCards.forEach((card) => {
    const active =
      card === closestCard;

    card.classList.toggle(
      'model-active',
      active
    );

    if (active) {
      startFlowerRain(card);
    } else {
      stopFlowerRain(card);
    }
  });
}

let modelScrollFrame = null;

function scheduleModelUpdate() {
  if (modelScrollFrame) {
    return;
  }

  modelScrollFrame =
    requestAnimationFrame(() => {
      updateActiveModelCard();
      modelScrollFrame = null;
    });
}

window.addEventListener(
  'scroll',
  scheduleModelUpdate,
  {
    passive: true
  }
);

window.addEventListener(
  'resize',
  scheduleModelUpdate
);

scheduleModelUpdate();


// =============================================
// GET INVOLVED CARD FLOWERS
// =============================================

const involveCards = [
  ...document.querySelectorAll('.involve-card')
];

involveCards.forEach((card) => {
  card.addEventListener(
    'mouseenter',
    () => startFlowerRain(card)
  );

  card.addEventListener(
    'mouseleave',
    () => stopFlowerRain(card)
  );

  card.addEventListener(
    'focusin',
    () => startFlowerRain(card)
  );

  card.addEventListener(
    'focusout',
    () => stopFlowerRain(card)
  );
});


// =============================================
// MOBILE GET INVOLVED ACTIVATION
// =============================================

function updateActiveInvolveCard() {
  if (
    window.matchMedia(
      '(hover: none), (pointer: coarse)'
    ).matches === false
  ) {
    involveCards.forEach((card) => {
      card.classList.remove('involve-active');
    });

    return;
  }

  const viewportCenter =
    window.innerHeight / 2;

  let closestCard = null;
  let closestDistance = Infinity;

  involveCards.forEach((card) => {
    const rect =
      card.getBoundingClientRect();

    const cardCenter =
      rect.top + rect.height / 2;

    const distance =
      Math.abs(
        cardCenter - viewportCenter
      );

    if (
      rect.bottom > 0 &&
      rect.top < window.innerHeight &&
      distance < closestDistance
    ) {
      closestDistance = distance;
      closestCard = card;
    }
  });

  involveCards.forEach((card) => {
    const active =
      card === closestCard;

    card.classList.toggle(
      'involve-active',
      active
    );

    if (active) {
      startFlowerRain(card);
    } else {
      stopFlowerRain(card);
    }
  });
}

let involveScrollFrame = null;

function scheduleInvolveUpdate() {
  if (involveScrollFrame) {
    return;
  }

  involveScrollFrame =
    requestAnimationFrame(() => {
      updateActiveInvolveCard();
      involveScrollFrame = null;
    });
}

window.addEventListener(
  'scroll',
  scheduleInvolveUpdate,
  {
    passive: true
  }
);

window.addEventListener(
  'resize',
  scheduleInvolveUpdate
);

scheduleInvolveUpdate();


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
  document.querySelector('.impact-stat');

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
      number.textContent = target;
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

          const duration = 1100;

          const tick = (now) => {
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

          requestAnimationFrame(tick);
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
// COMMUNITY GALLERY
// =============================================

const galleryTrack =
  document.getElementById(
    'community-gallery-track'
  );

const galleryScroller =
  document.querySelector(
    '.community-gallery'
  );

const lightbox =
  document.getElementById(
    'gallery-lightbox'
  );

const lightboxImage =
  document.getElementById(
    'gallery-lightbox-image'
  );

const lightboxCounter =
  document.getElementById(
    'gallery-lightbox-counter'
  );

const lightboxClose =
  document.getElementById(
    'gallery-lightbox-close'
  );

const lightboxPrevious =
  document.getElementById(
    'gallery-lightbox-prev'
  );

const lightboxNext =
  document.getElementById(
    'gallery-lightbox-next'
  );

const galleryImages =
  Array.isArray(window.communityImages)
    ? window.communityImages
    : [];

let currentGalleryIndex = 0;
let lastGalleryFocus = null;


// =============================================
// CREATE GALLERY ITEM
// =============================================

function createGalleryItem(
  imagePath,
  index,
  duplicate = false
) {
  const button =
    document.createElement('button');

  button.type = 'button';
  button.className =
    'community-gallery-item';

  if (duplicate) {
    button.tabIndex = -1;

    button.setAttribute(
      'aria-hidden',
      'true'
    );
  } else {
    button.setAttribute(
      'aria-label',
      `View community photo ${index + 1}`
    );
  }

  const image =
    document.createElement('img');

  image.src = imagePath;

  image.alt =
    duplicate
      ? ''
      : `Global Maheela community photo ${index + 1}`;

  image.loading = 'eager';
  image.decoding = 'async';

  button.appendChild(image);

  if (!duplicate) {
    button.addEventListener(
      'click',
      () => {
        openGallery(
          index,
          button
        );
      }
    );
  }

  return button;
}


// =============================================
// BUILD GALLERY
// =============================================

function buildGallery() {
  if (!galleryTrack) {
    return;
  }

  galleryTrack.innerHTML = '';

  galleryTrack.classList.remove(
    'gallery-ready',
    'gallery-no-animation'
  );

  if (galleryImages.length === 0) {
    const message =
      document.createElement('p');

    message.className =
      'gallery-empty';

    message.textContent =
      'No community photos found.';

    galleryTrack.appendChild(
      message
    );

    galleryTrack.classList.add(
      'gallery-ready',
      'gallery-no-animation'
    );

    return;
  }

  // First copy of all images.
  galleryImages.forEach(
    (imagePath, index) => {
      galleryTrack.appendChild(
        createGalleryItem(
          imagePath,
          index,
          false
        )
      );
    }
  );

  /*
    Add a second identical copy.

    The duplicate set allows the
    JavaScript auto-scroll to loop
    without a visible jump.
  */
  if (
    !reduced &&
    galleryImages.length > 1
  ) {
    galleryImages.forEach(
      (imagePath, index) => {
        galleryTrack.appendChild(
          createGalleryItem(
            imagePath,
            index,
            true
          )
        );
      }
    );
  } else {
    galleryTrack.classList.add(
      'gallery-no-animation'
    );
  }
}


// =============================================
// PRELOAD GALLERY IMAGES
// =============================================

function preloadImage(src) {
  return new Promise(
    (resolve) => {
      const image = new Image();

      image.onload =
        () => resolve({
          src,
          loaded: true
        });

      image.onerror =
        () => resolve({
          src,
          loaded: false
        });

      image.src = src;
    }
  );
}

async function preloadGalleryImages() {
  if (!galleryTrack) {
    return;
  }

  galleryTrack.classList.add(
    'gallery-loading'
  );

  if (galleryImages.length === 0) {
    buildGallery();

    galleryTrack.classList.remove(
      'gallery-loading'
    );

    galleryTrack.classList.add(
      'gallery-ready'
    );

    return;
  }

  const results =
    await Promise.all(
      galleryImages.map(
        (src) =>
          preloadImage(src)
      )
    );

  results.forEach((result) => {
    if (!result.loaded) {
      console.warn(
        'Community image failed to load:',
        result.src
      );
    }
  });

  buildGallery();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      galleryTrack.classList.remove(
        'gallery-loading'
      );

      galleryTrack.classList.add(
        'gallery-ready'
      );

      startGalleryAutoScroll();
    });
  });
}


// =============================================
// GALLERY AUTO SCROLL
// =============================================

let galleryAnimationFrame = null;

let galleryLastTimestamp = null;

let galleryInteractionPaused = false;

let galleryResumeTimer = null;

const GALLERY_SPEED = 32;


function getGalleryLoopWidth() {
  if (!galleryTrack) {
    return 0;
  }

  /*
    There are two identical sets of
    images in the track, so half the
    total track width is one complete
    gallery set.
  */
  return galleryTrack.scrollWidth / 2;
}


function galleryAutoScrollStep(
  timestamp
) {
  if (
    !galleryScroller ||
    !galleryTrack ||
    reduced ||
    galleryImages.length < 2
  ) {
    galleryAnimationFrame = null;
    return;
  }

  if (galleryLastTimestamp === null) {
    galleryLastTimestamp = timestamp;
  }

  const elapsed =
    Math.min(
      timestamp -
        galleryLastTimestamp,
      50
    );

  galleryLastTimestamp =
    timestamp;

  if (!galleryInteractionPaused) {
    const pixels =
      GALLERY_SPEED *
      (elapsed / 1000);

    galleryScroller.scrollLeft +=
      pixels;

    const loopWidth =
      getGalleryLoopWidth();

    if (
      loopWidth > 0 &&
      galleryScroller.scrollLeft >=
        loopWidth
    ) {
      galleryScroller.scrollLeft -=
        loopWidth;
    }
  }

  galleryAnimationFrame =
    requestAnimationFrame(
      galleryAutoScrollStep
    );
}


function startGalleryAutoScroll() {
  if (
    reduced ||
    !galleryScroller ||
    !galleryTrack ||
    galleryImages.length < 2
  ) {
    return;
  }

  if (galleryAnimationFrame) {
    cancelAnimationFrame(
      galleryAnimationFrame
    );
  }

  galleryLastTimestamp = null;

  galleryAnimationFrame =
    requestAnimationFrame(
      galleryAutoScrollStep
    );
}


function pauseGalleryAutoScroll() {
  galleryInteractionPaused = true;

  if (galleryResumeTimer) {
    clearTimeout(
      galleryResumeTimer
    );

    galleryResumeTimer = null;
  }
}


function resumeGalleryAutoScroll(
  delay = 700
) {
  if (reduced) {
    return;
  }

  if (galleryResumeTimer) {
    clearTimeout(
      galleryResumeTimer
    );
  }

  galleryResumeTimer =
    setTimeout(() => {
      galleryInteractionPaused =
        false;

      galleryLastTimestamp =
        null;
    }, delay);
}


// =============================================
// GALLERY TOUCH / POINTER INTERACTION
// =============================================

galleryScroller?.addEventListener(
  'pointerdown',
  () => {
    pauseGalleryAutoScroll();

    galleryScroller.classList.add(
      'is-dragging'
    );
  }
);

galleryScroller?.addEventListener(
  'pointerup',
  () => {
    galleryScroller.classList.remove(
      'is-dragging'
    );

    resumeGalleryAutoScroll();
  }
);

galleryScroller?.addEventListener(
  'pointercancel',
  () => {
    galleryScroller.classList.remove(
      'is-dragging'
    );

    resumeGalleryAutoScroll();
  }
);

galleryScroller?.addEventListener(
  'pointerleave',
  () => {
    galleryScroller.classList.remove(
      'is-dragging'
    );

    resumeGalleryAutoScroll();
  }
);

galleryScroller?.addEventListener(
  'touchstart',
  pauseGalleryAutoScroll,
  {
    passive: true
  }
);

galleryScroller?.addEventListener(
  'touchend',
  () => {
    resumeGalleryAutoScroll();
  },
  {
    passive: true
  }
);

galleryScroller?.addEventListener(
  'wheel',
  () => {
    pauseGalleryAutoScroll();
    resumeGalleryAutoScroll(1000);
  },
  {
    passive: true
  }
);


// =============================================
// DESKTOP CLICK + DRAG
// =============================================

let galleryDragging = false;

let galleryDragStartX = 0;

let galleryDragStartScroll = 0;

let galleryDraggedDistance = 0;


galleryScroller?.addEventListener(
  'mousedown',
  (event) => {
    galleryDragging = true;

    galleryDragStartX =
      event.clientX;

    galleryDragStartScroll =
      galleryScroller.scrollLeft;

    galleryDraggedDistance = 0;

    pauseGalleryAutoScroll();

    galleryScroller.classList.add(
      'is-dragging'
    );
  }
);


window.addEventListener(
  'mousemove',
  (event) => {
    if (
      !galleryDragging ||
      !galleryScroller
    ) {
      return;
    }

    const distance =
      event.clientX -
      galleryDragStartX;

    galleryDraggedDistance =
      Math.max(
        galleryDraggedDistance,
        Math.abs(distance)
      );

    galleryScroller.scrollLeft =
      galleryDragStartScroll -
      distance;
  }
);


window.addEventListener(
  'mouseup',
  () => {
    if (!galleryDragging) {
      return;
    }

    galleryDragging = false;

    galleryScroller?.classList.remove(
      'is-dragging'
    );

    resumeGalleryAutoScroll();
  }
);


// Prevent accidental lightbox opening
// after dragging the gallery.
galleryTrack?.addEventListener(
  'click',
  (event) => {
    if (galleryDraggedDistance > 8) {
      event.preventDefault();
      event.stopPropagation();

      galleryDraggedDistance = 0;
    }
  },
  true
);


// =============================================
// OPEN PHOTO
// =============================================

function openGallery(
  index,
  trigger
) {
  if (
    !lightbox ||
    !lightboxImage ||
    galleryImages.length === 0
  ) {
    return;
  }

  currentGalleryIndex = index;
  lastGalleryFocus = trigger;

  updateGalleryLightbox();

  lightbox.classList.add('open');

  lightbox.setAttribute(
    'aria-hidden',
    'false'
  );

  document.body.classList.add(
    'gallery-open'
  );

  pauseGalleryAutoScroll();

  lightboxClose?.focus();
}


// =============================================
// UPDATE LARGE PHOTO
// =============================================

function updateGalleryLightbox() {
  if (
    !lightboxImage ||
    galleryImages.length === 0
  ) {
    return;
  }

  lightboxImage.src =
    galleryImages[
      currentGalleryIndex
    ];

  lightboxImage.alt =
    `Global Maheela community photo ${
      currentGalleryIndex + 1
    }`;

  if (lightboxCounter) {
    lightboxCounter.textContent =
      `${currentGalleryIndex + 1} / ${
        galleryImages.length
      }`;
  }
}


// =============================================
// NEXT PHOTO
// =============================================

function nextGalleryImage() {
  if (galleryImages.length === 0) {
    return;
  }

  currentGalleryIndex =
    (
      currentGalleryIndex + 1
    ) %
    galleryImages.length;

  updateGalleryLightbox();
}


// =============================================
// PREVIOUS PHOTO
// =============================================

function previousGalleryImage() {
  if (galleryImages.length === 0) {
    return;
  }

  currentGalleryIndex =
    (
      currentGalleryIndex -
      1 +
      galleryImages.length
    ) %
    galleryImages.length;

  updateGalleryLightbox();
}


// =============================================
// CLOSE PHOTO VIEWER
// =============================================

function closeGallery() {
  if (!lightbox) {
    return;
  }

  lightbox.classList.remove('open');

  lightbox.setAttribute(
    'aria-hidden',
    'true'
  );

  document.body.classList.remove(
    'gallery-open'
  );

  if (lightboxImage) {
    lightboxImage.src = '';
  }

  if (
    lastGalleryFocus instanceof
      HTMLElement
  ) {
    lastGalleryFocus.focus();
  }

  resumeGalleryAutoScroll(300);
}


// =============================================
// LIGHTBOX BUTTONS
// =============================================

lightboxClose?.addEventListener(
  'click',
  closeGallery
);

lightboxPrevious?.addEventListener(
  'click',
  previousGalleryImage
);

lightboxNext?.addEventListener(
  'click',
  nextGalleryImage
);


// =============================================
// CLICK BACKGROUND TO CLOSE
// =============================================

lightbox?.addEventListener(
  'click',
  (event) => {
    if (event.target === lightbox) {
      closeGallery();
    }
  }
);


// =============================================
// KEYBOARD CONTROLS
// =============================================

document.addEventListener(
  'keydown',
  (event) => {
    if (
      !lightbox?.classList.contains(
        'open'
      )
    ) {
      return;
    }

    if (event.key === 'Escape') {
      closeGallery();
    }

    if (event.key === 'ArrowRight') {
      nextGalleryImage();
    }

    if (event.key === 'ArrowLeft') {
      previousGalleryImage();
    }
  }
);


// =============================================
// EMAIL BUTTON
// =============================================

const emailButton =
  document.getElementById(
    'email-global-maheela'
  );

emailButton?.addEventListener(
  'click',
  (event) => {
    event.preventDefault();

    const user = 'globalmaheela';
    const domain = 'gmail.com';

    window.location.href =
      `mailto:${user}@${domain}`;
  }
);


// =============================================
// START GALLERY
// =============================================

preloadGalleryImages();
