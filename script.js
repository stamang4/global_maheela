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
      threshold: 0.12
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
    i < 15;
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
// COMMUNITY GALLERY
// =============================================

const galleryTrack =
  document.getElementById(
    'community-gallery-track'
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
  Array.isArray(
    window.communityImages
  )
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
    document.createElement(
      'button'
    );

  button.type =
    'button';

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
    document.createElement(
      'img'
    );

  image.src =
    imagePath;

  image.alt =
    duplicate
      ? ''
      : `Global Maheela community photo ${index + 1}`;

  /*
    These are eager because the images
    have already been preloaded before
    the gallery becomes visible.
  */
  image.loading =
    'eager';

  image.decoding =
    'async';

  button.appendChild(
    image
  );


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

  galleryTrack.innerHTML =
    '';

  galleryTrack.classList.remove(
    'gallery-ready'
  );


  if (
    galleryImages.length === 0
  ) {

    const message =
      document.createElement(
        'p'
      );

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


  // ORIGINAL SET

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
    DUPLICATE SET

    This creates the second identical
    set required for the continuous
    scrolling effect.
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
// PRELOAD ALL GALLERY IMAGES
// =============================================

function preloadImage(src) {

  return new Promise(
    (resolve) => {

      const image =
        new Image();

      image.onload =
        () => resolve({
          src,
          loaded: true
        });

      /*
        If one photo is broken or missing,
        don't prevent the entire gallery
        from appearing.
      */
      image.onerror =
        () => resolve({
          src,
          loaded: false
        });

      image.src =
        src;
    }
  );
}


async function preloadGalleryImages() {

  if (!galleryTrack) {
    return;
  }


  /*
    Keep everything invisible while
    loading.
  */

  galleryTrack.classList.add(
    'gallery-loading'
  );


  if (
    galleryImages.length === 0
  ) {

    buildGallery();

    galleryTrack.classList.remove(
      'gallery-loading'
    );

    galleryTrack.classList.add(
      'gallery-ready'
    );

    return;
  }


  /*
    Wait for EVERY community image.
  */

  const results =
    await Promise.all(
      galleryImages.map(
        (src) =>
          preloadImage(src)
      )
    );


  /*
    If an image failed to load,
    print it in the browser console.
  */

  results.forEach(
    (result) => {

      if (!result.loaded) {

        console.warn(
          'Community image failed to load:',
          result.src
        );

      }

    }
  );


  /*
    All images have now either loaded
    successfully or failed.

    Build the gallery.
  */

  buildGallery();


  /*
    Wait for the browser to paint the
    gallery before revealing it.
  */

  requestAnimationFrame(
    () => {

      requestAnimationFrame(
        () => {

          galleryTrack.classList.remove(
            'gallery-loading'
          );

          galleryTrack.classList.add(
            'gallery-ready'
          );

        }
      );

    }
  );
}


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

  currentGalleryIndex =
    index;

  lastGalleryFocus =
    trigger;

  updateGalleryLightbox();

  lightbox.classList.add(
    'open'
  );

  lightbox.setAttribute(
    'aria-hidden',
    'false'
  );

  document.body.classList.add(
    'gallery-open'
  );

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
    `Global Maheela community photo ${currentGalleryIndex + 1
    }`;


  if (lightboxCounter) {

    lightboxCounter.textContent =
      `${currentGalleryIndex + 1
      } / ${galleryImages.length
      }`;

  }
}


// =============================================
// NEXT PHOTO
// =============================================

function nextGalleryImage() {

  if (
    galleryImages.length === 0
  ) {
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

  if (
    galleryImages.length === 0
  ) {
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

  lightbox.classList.remove(
    'open'
  );

  lightbox.setAttribute(
    'aria-hidden',
    'true'
  );

  document.body.classList.remove(
    'gallery-open'
  );

  if (lightboxImage) {
    lightboxImage.src =
      '';
  }

  if (
    lastGalleryFocus instanceof
    HTMLElement
  ) {
    lastGalleryFocus.focus();
  }
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
// CLICK DARK BACKGROUND TO CLOSE
// =============================================

lightbox?.addEventListener(
  'click',
  (event) => {

    if (
      event.target === lightbox
    ) {
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


    if (
      event.key === 'Escape'
    ) {
      closeGallery();
    }


    if (
      event.key === 'ArrowRight'
    ) {
      nextGalleryImage();
    }


    if (
      event.key === 'ArrowLeft'
    ) {
      previousGalleryImage();
    }

  }
);


// =============================================
// START GALLERY
// =============================================

preloadGalleryImages();