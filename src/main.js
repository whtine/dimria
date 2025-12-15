import db from "./db.json";

const select = document.getElementById("roomSelect");
const hidden = document.getElementById("propertyType");
const flatCountText = document.getElementById("flat-number");

if (flatCountText) {
  flatCountText.textContent = "Знайдено " + db.length + " помешкань";
}

document.addEventListener('DOMContentLoaded', function() {
  const mapButton = document.querySelector('.map-overlay');
  if (mapButton) {
    mapButton.addEventListener('click', function() {
      document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' });
    });
  }
});

let currentItem = null;

if (window.location.pathname.includes("details.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    currentItem = db.find(el => el.id == id);
    if (!currentItem) return;

    const detailsTrack = document.querySelector(".details-carousel-track");
    if (detailsTrack) {
      const images = [currentItem.img1, currentItem.img2, currentItem.img3, currentItem.img4, currentItem.img5, currentItem.img6].filter(Boolean);
      detailsTrack.innerHTML = images.map(img => `
        <div class="details-carousel-slide" style="min-width:100%">
          <img src="${img}" alt="Квартира" style="width:100%; height:500px; object-fit:cover; border-radius:5px;">
        </div>
      `).join("");

      const slides = detailsTrack.querySelectorAll(".details-carousel-slide");
      let index = 0;
      const update = () => {
        detailsTrack.style.transform = `translateX(-${index * 100}%)`;
        detailsTrack.style.transition = "0.5s ease";
      };

      const nextBtn = document.querySelector(".details-next");
      const prevBtn = document.querySelector(".details-prev");

      if (nextBtn) nextBtn.addEventListener("click", () => {
        index = (index + 1) % slides.length;
        update();
      });

      if (prevBtn) prevBtn.addEventListener("click", () => {
        index = (index - 1 + slides.length) % slides.length;
        update();
      });
      
      window.addEventListener("resize", update);
    }

    
    const photosPreviewBtn = document.querySelector('.photos-overlay');
    if (photosPreviewBtn) {
      photosPreviewBtn.style.cursor = 'pointer';
      photosPreviewBtn.addEventListener('click', openPhotosModal);
    }
  });
}


function openPhotosModal() {
  if (!currentItem) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    currentItem = db.find(el => el.id == id);
    if (!currentItem) return;
  }
  
  const photos = [currentItem.img1, currentItem.img2, currentItem.img3, currentItem.img4, currentItem.img5, currentItem.img6].filter(Boolean);
  if (photos.length === 0) return;
  
  if (document.querySelector('.photos-modal')) return;
  
  let currentIndex = 0;
  
  const modalHTML = `
    <div class="photos-modal" style="
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
      background: rgba(0,0,0,0.9); z-index: 9999; display: flex; 
      align-items: center; justify-content: center;">
      
      <button class="modal-close" style="
        position: absolute; top: 20px; right: 20px; background: none; 
        border: none; color: white; font-size: 30px; cursor: pointer;
        z-index: 10000;">
        &times;
      </button>
      
      <button class="modal-prev" style="
        position: absolute; left: 20px; top: 50%; transform: translateY(-50%);
        background: rgba(255,255,255,0.2); 
        border: none; color: white; width: 50px; height: 50px; border-radius: 50%; 
        cursor: pointer; font-size: 20px; z-index: 10000;">
        ‹
      </button>
      
      <div class="modal-content" style="max-width: 90%; max-height: 90%;">
        <img id="modal-img" src="${photos[0]}" alt="Фото" style="
          width: 100%; height: auto; max-height: 80vh; object-fit: contain;">
      </div>
      
      <button class="modal-next" style="
        position: absolute; right: 20px; top: 50%; transform: translateY(-50%);
        background: rgba(255,255,255,0.2); 
        border: none; color: white; width: 50px; height: 50px; border-radius: 50%; 
        cursor: pointer; font-size: 20px; z-index: 10000;">
        ›
      </button>
      
      <div class="photo-counter" style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); 
        color: white; font-size: 16px; z-index: 10000;">
        ${currentIndex + 1} / ${photos.length}
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  const modal = document.querySelector('.photos-modal');
  const modalImg = document.getElementById('modal-img');
  const counter = modal.querySelector('.photo-counter');
  
  function updateModal() {
    if (modalImg) modalImg.src = photos[currentIndex];
    if (counter) counter.textContent = `${currentIndex + 1} / ${photos.length}`;
  }
  
  const nextBtn = modal.querySelector('.modal-next');
  const prevBtn = modal.querySelector('.modal-prev');
  const closeBtn = modal.querySelector('.modal-close');
  
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % photos.length;
      updateModal();
    });
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + photos.length) % photos.length;
      updateModal();
    });
  }
  
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.body.removeChild(modal);
    });
  }
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) document.body.removeChild(modal);
  });
  
  document.addEventListener('keydown', function closeOnEscape(e) {
    if (e.key === 'Escape' && modal.parentNode) {
      document.body.removeChild(modal);
      document.removeEventListener('keydown', closeOnEscape);
    }
  });
}

document.addEventListener('click', function(e) {
  if (e.target.closest('.photos-preview-img')) {
    openPhotosModal();
  }
});

if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
  document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("listings");
    if (!container) return;

    db.forEach(item => {
      const section = document.createElement("section");
      section.className = "d-flex-custom my-3 border";
      section.dataset.id = item.id;

      section.innerHTML = `
        <div class="col-lg-6 col-12 p-0">
          <div class="carousel">
            <div class="carousel-track">
              ${[item.img1, item.img2, item.img3, item.img4, item.img5, item.img6]
          .filter(Boolean)
          .map(img => `<div class="carousel-slide"><img src="${img}" alt=""></div>`)
          .join('')}
            </div>
            <button class="carousel-btn prev">&#10094;</button>
            <button class="carousel-btn next">&#10095;</button>
          </div>
        </div>

        <div class="col-lg-6 col-12 flat-text-block">
          <div class="price-block d-flex m-0">
            <p class="price px-2 m-0">${item.price}</p>
            <p class="price-per-m px-2">${item.price_m2}</p>
          </div>

          <div class="street-block">
            <p class="street px-2">${item.address}</p>
          </div>

          <div class="location-block d-flex">
            <p class="rayon px-2">${item.district}</p>
            <p class="city px-2">${item.city}</p>
            <p class="complex-name px-2">${item.complex}</p>
          </div>

          <div class="detail-block d-flex">
            <p class="room-amount px-2">${item.rooms} кімнати</p>
            <p class="area px-2">${item.area}</p>
            <p class="floor px-2">${item.floor}</p>
          </div>

          <div class="house-description">
            <p class="description px-2">${item.description}</p>
          </div>

          <div class="date-block d-flex">
            <p class="date px-2">${item.published}</p>
            <p class="checked px-2">${item.verified}</p>
          </div>

          <div class="like-flat">
            <button class="like-btn"><i class="fa-regular fa-heart fa-2x"></i></button>
          </div>
        </div>
      `;

      container.appendChild(section);
    });

    container.addEventListener("click", e => {
      if (e.target.closest(".like-btn")) {
        const icon = e.target.closest(".like-btn").querySelector("i");
        icon.classList.toggle("fa-regular");
        icon.classList.toggle("fa-solid");
        e.stopPropagation();
      }
    });

    container.addEventListener("click", e => {
      const flatBlock = e.target.closest(".flat-text-block");
      if (flatBlock && !e.target.closest(".like-btn")) {
        const section = flatBlock.closest("section");
        const id = section.dataset.id;
        window.location.href = `details.html?id=${id}`;
      }
    });

    document.querySelectorAll(".carousel").forEach(carousel => {
      const track = carousel.querySelector(".carousel-track");
      const slides = carousel.querySelectorAll(".carousel-slide");
      let index = 0;

      const update = () => {
        const slideWidth = slides[0].getBoundingClientRect().width;
        track.style.transform = `translateX(-${index * slideWidth}px)`;
      };

      window.addEventListener("resize", update);

      carousel.querySelector(".next").onclick = () => {
        index = (index + 1) % slides.length;
        update();
      };

      carousel.querySelector(".prev").onclick = () => {
        index = (index - 1 + slides.length) % slides.length;
        update();
      };
    });
  });
}

if (select) {
  select.addEventListener("click", () => {
    select.classList.toggle("active");
  });

  document.querySelectorAll(".custom-options li").forEach(item => {
    item.addEventListener("click", (e) => {
      select.querySelector("span").innerText = e.target.innerText;
      hidden.value = e.target.dataset.value;
      select.classList.remove("active");
    });
  });

  document.addEventListener("click", (e) => {
    if (!select.contains(e.target)) select.classList.remove("active");
  });
}

const toggleBtn = document.getElementById("toggleBtn");
const fullDesc = document.getElementById("fullDesc");

if (toggleBtn && fullDesc) {
  toggleBtn.addEventListener("click", () => {
    const random = Math.random();
    if (random > 0.5) {
      fullDesc.style.display = "block";
      toggleBtn.textContent = "Згорнути";
    } else {
      fullDesc.style.display = "none";
      toggleBtn.textContent = "Повний опис";
    }
  });
}

let map = L.map('map').setView([49.5535, 25.5948], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

L.marker([49.5535, 25.5948]).addTo(map)
  .bindPopup('Flat')
  .openPopup();