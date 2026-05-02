    // Живая фильтрация портфолио
    document.addEventListener('DOMContentLoaded', () => {
        // === КОНФИГУРАЦИЯ ===
        const ITEMS_PER_PAGE = 9;
        const grid = document.querySelector('.portfolio__grid');
        const items = grid.querySelectorAll('.portfolio__item');
        const filterButtons = document.querySelectorAll('.portfolio__filter-btn');
        const loadMoreContainer = document.querySelector('.portfolio__load-more');
        const loadMoreBtn = loadMoreContainer?.querySelector('.portfolio__load-more-btn');
      
        // Состояние
        let currentFilter = 'Все работы';
        let expanded = false; // показаны ли все элементы текущего фильтра
      
        // === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===
      
        // Проверяет, соответствует ли элемент категории фильтра
        function matchesFilter(item, filter) {
          if (filter === 'Все работы') return true;
          const cats = (item.getAttribute('data-category') || '').split(',').map(c => c.trim());
          return cats.includes(filter);
        }
      
        // Возвращает массив элементов, соответствующих текущему фильтру
        function getFilteredItems() {
          return Array.from(items).filter(item => matchesFilter(item, currentFilter));
        }
      
        // Обновляет видимость элементов с учётом лимита и кнопку "Загрузить ещё"
        function updateVisibility() {
          const filtered = getFilteredItems();
      
          // Сначала скрываем все элементы
          items.forEach(item => item.style.display = 'none');
      
          // Показываем нужное количество
          const showCount = expanded ? filtered.length : Math.min(filtered.length, ITEMS_PER_PAGE);
          for (let i = 0; i < showCount; i++) {
            filtered[i].style.display = '';
          }
      
          // Управляем кнопкой
          if (filtered.length <= ITEMS_PER_PAGE) {
            loadMoreContainer.style.display = 'none';
          } else {
            loadMoreContainer.style.display = '';
            loadMoreBtn.textContent = expanded ? 'Скрыть' : 'Загрузить ещё';
          }
        }
      
        // Обработчик клика по кнопке "Загрузить ещё" / "Скрыть"
        function handleLoadMoreClick() {
          expanded = !expanded;
          updateVisibility();
        }
      
        // === ФИЛЬТРАЦИЯ ===
        filterButtons.forEach(btn => {
          btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
      
            currentFilter = btn.textContent.trim();
            expanded = false; // сбрасываем раскрытие при смене фильтра
            updateVisibility();
          });
        });
      
        // === КНОПКА "ЗАГРУЗИТЬ ЕЩЁ" ===
        if (loadMoreBtn) {
          loadMoreBtn.addEventListener('click', handleLoadMoreClick);
        }
      
        // === ЛАЙТБОКС (простая галерея) ===
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
          <span class="lightbox__close">&times;</span>
          <img class="lightbox__img" src="" alt="">
          <button class="lightbox__nav lightbox__nav--prev">&#10094;</button>
          <button class="lightbox__nav lightbox__nav--next">&#10095;</button>
        `;
        document.body.appendChild(lightbox);
      
        const lightboxImg = lightbox.querySelector('.lightbox__img');
        const closeBtn = lightbox.querySelector('.lightbox__close');
        let currentLightboxIndex = -1;
        let lightboxItems = []; // массив элементов для навигации в лайтбоксе
      
        function openLightbox(index) {
          lightboxItems = getFilteredItems(); // используем тот же фильтр, включая скрытые
          if (!lightboxItems.length) return;
      
          currentLightboxIndex = index;
          const imgElement = lightboxItems[currentLightboxIndex].querySelector('img');
          if (imgElement) {
            lightboxImg.src = imgElement.src;
            lightboxImg.alt = imgElement.alt || '';
          }
          lightbox.classList.add('lightbox--visible');
          document.body.style.overflow = 'hidden';
        }
      
        function closeLightbox() {
          lightbox.classList.remove('lightbox--visible');
          document.body.style.overflow = '';
        }
      
        function navigateLightbox(direction) {
          if (!lightboxItems.length) return;
          currentLightboxIndex = (currentLightboxIndex + direction + lightboxItems.length) % lightboxItems.length;
          const imgElement = lightboxItems[currentLightboxIndex].querySelector('img');
          if (imgElement) {
            lightboxImg.src = imgElement.src;
            lightboxImg.alt = imgElement.alt || '';
          }
        }
      
        // Открытие по клику на элемент в сетке
        grid.addEventListener('click', (e) => {
          const item = e.target.closest('.portfolio__item');
          if (!item) return;
      
          // Определяем индекс кликнутого элемента среди отфильтрованных
          const filtered = getFilteredItems();
          const index = filtered.indexOf(item);
          if (index !== -1) {
            openLightbox(index);
          }
        });
      
        // Закрытие и навигация
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
          if (e.target === lightbox) closeLightbox(); // клик по фону
        });
        lightbox.querySelector('.lightbox__nav--prev').addEventListener('click', () => navigateLightbox(-1));
        lightbox.querySelector('.lightbox__nav--next').addEventListener('click', () => navigateLightbox(1));
      
        // Клавиатурная навигация
        document.addEventListener('keydown', (e) => {
          if (!lightbox.classList.contains('lightbox--visible')) return;
          if (e.key === 'Escape') closeLightbox();
          if (e.key === 'ArrowLeft') navigateLightbox(-1);
          if (e.key === 'ArrowRight') navigateLightbox(1);
        });
      
        // === ИНИЦИАЛИЗАЦИЯ ===
        updateVisibility();
      });

      