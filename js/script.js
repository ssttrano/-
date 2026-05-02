document.addEventListener('DOMContentLoaded', () => {
    // Бургер-меню
    const burger = document.getElementById('burger');
    const nav = document.getElementById('mainNav');
    const navLinks = nav.querySelectorAll('a');
    
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('active');
    });
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // Модальное окно (всплывающая форма)
    const modal = document.getElementById('formModal');
    const modalClose = document.getElementById('modalClose');
    const btnsOpen = document.querySelectorAll('.btn-open-form');
    
    btnsOpen.forEach(btn => btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
    }));
    modalClose.addEventListener('click', () => modal.classList.remove('active'));
    modal.querySelector('.modal__overlay').addEventListener('click', () => modal.classList.remove('active'));

    // Маска телефона
    const phoneInputs = document.querySelectorAll('.phone-mask');
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            if (val.length === 11 && val[0] === '8') val = '7' + val.slice(1);
            if (val.length > 11) val = val.slice(0, 11);
            let formatted = '+7';
            if (val.length > 1) formatted += ' (' + val.substring(1, 4);
            if (val.length >= 4) formatted += ') ' + val.substring(4, 7);
            if (val.length >= 7) formatted += '-' + val.substring(7, 9);
            if (val.length >= 9) formatted += '-' + val.substring(9, 11);
            e.target.value = formatted;
        });
    });

    // Слайдер отзывов
    const track = document.getElementById('reviewsTrack');
    const prevBtn = document.getElementById('reviewPrev');
    const nextBtn = document.getElementById('reviewNext');
    const slides = document.querySelectorAll('.review-card');
    let slideIndex = 0;
    let cachedSlideWidth = 0;

    function calcSlideWidth() {
        if (slides.length === 0) return 0;
        const firstSlide = slides[0];
        const style = window.getComputedStyle(firstSlide);
        return firstSlide.offsetWidth + parseFloat(style.marginRight);
    }

    function updateSlider() {
        track.style.transform = `translateX(-${slideIndex * cachedSlideWidth}px)`;
    }

    if (slides.length) {
        cachedSlideWidth = calcSlideWidth();
        window.addEventListener('resize', () => {
            cachedSlideWidth = calcSlideWidth();
            updateSlider();
        });
        nextBtn.addEventListener('click', () => {
            slideIndex = (slideIndex < slides.length - 1) ? slideIndex + 1 : 0;
            updateSlider();
        });
        prevBtn.addEventListener('click', () => {
            slideIndex = (slideIndex > 0) ? slideIndex - 1 : slides.length - 1;
            updateSlider();
        });
    }



    // Ленивая загрузка карты
    const mapContainer = document.getElementById('mapContainer');
    const mapLoadBtn = document.getElementById('mapLoadBtn');
    if (mapLoadBtn) {
        mapLoadBtn.addEventListener('click', () => {
            const iframe = document.createElement('iframe');
            iframe.src = 'https://yandex.ru/map-widget/v1/?ll=45.0108%2C53.1959&z=10&pt=45.0108,53.1959,pm2rdl&l=map';
            iframe.width = '100%';
            iframe.height = '300';
            iframe.style.border = '0';
            iframe.style.borderRadius = '12px';
            iframe.allowFullscreen = true;
            iframe.loading = 'lazy';
            mapContainer.innerHTML = '';
            mapContainer.appendChild(iframe);
        });
    }

    // Плавающая кнопка связи
    const toggleBtn = document.getElementById('floatingToggle');
    const dropdown = document.getElementById('floatingDropdown');
    if (toggleBtn && dropdown) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });
        window.addEventListener('click', (e) => {
            if (!toggleBtn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }
});