document.addEventListener('DOMContentLoaded', function () {

    //sección para el menú de hamburguesa:
    const menuBtn = document.querySelector('.navbar__toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    menuBtn.addEventListener('click', function() {
        mobileNav.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.navbar__link').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
        });
    });

    //sección para el slider
    const slider = {
        currentSlide: 0,
        slides: document.querySelectorAll('.hero__slider-content'),
        timeoutId: null,
        interval: 30000, // 30 segundos

        init() {
            // Agregar botones de navegación
            const sliderContainer = document.querySelector('.hero__slider');

            // Crear botón previo con atributos de accesibilidad
            const prevButton = document.createElement('button');
            prevButton.classList.add('hero__slider-button', 'hero__slider-button--prev');
            prevButton.setAttribute('aria-label', 'Slide anterior');
            prevButton.setAttribute('type', 'button');
            prevButton.innerHTML = '<i class="hero__slider-butto-chevron fa-solid fa-circle-chevron-left" aria-hidden="true"></i>';

            // Crear botón siguiente con atributos de accesibilidad
            const nextButton = document.createElement('button');
            nextButton.classList.add('hero__slider-button', 'hero__slider-button--next');
            nextButton.setAttribute('aria-label', 'Siguiente slide');
            nextButton.setAttribute('type', 'button');
            nextButton.innerHTML = '<i class="hero__slider-butto-chevron fa-solid fa-circle-chevron-right" aria-hidden="true"></i>';

            // Agregar eventos de mouse
            prevButton.addEventListener('mouseenter', () => prevButton.classList.add('beat'));
            prevButton.addEventListener('mouseleave', () => prevButton.classList.remove('beat'));
            prevButton.addEventListener('click', () => this.moveSlide('prev'));

            nextButton.addEventListener('mouseenter', () => nextButton.classList.add('beat'));
            nextButton.addEventListener('mouseleave', () => nextButton.classList.remove('beat'));
            nextButton.addEventListener('click', () => this.moveSlide('next'));

            // Agregar roles y atributos ARIA al contenedor del slider
            sliderContainer.setAttribute('role', 'region');
            sliderContainer.setAttribute('aria-label', 'Carrusel de imágenes');
            sliderContainer.setAttribute('aria-roledescription', 'Carrusel');

            // Agregar atributos ARIA a cada slide
            this.slides.forEach((slide, index) => {
                slide.setAttribute('role', 'tabpanel');
                slide.setAttribute('aria-label', `Slide ${index + 1} de ${this.slides.length}`);
                slide.setAttribute('aria-hidden', 'true');
            });

            // Agregar los botones al contenedor
            sliderContainer.appendChild(prevButton);
            sliderContainer.appendChild(nextButton);

            // Mostrar primer slide
            this.showSlide(this.currentSlide);

            // Iniciar autoplay
            this.startAutoplay();
        },

        showSlide(index) {
            // Actualizar la visibilidad y estados ARIA de todos los slides
            this.slides.forEach(slide => {
                slide.classList.remove('active');
                slide.setAttribute('aria-hidden', 'true');
            });

            // Actualizar el slide actual
            this.slides[index].classList.add('active');
            this.slides[index].setAttribute('aria-hidden', 'false');

            // Anunciar cambio de slide para lectores de pantalla
            this.announceSlideChange(index);
        },

        moveSlide(direction) {
            // Resetear el temporizador cuando hay interacción manual
            this.resetAutoplay();

            if (direction === 'next') {
                this.currentSlide = (this.currentSlide + 1) % this.slides.length;
            } else {
                this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            }

            this.showSlide(this.currentSlide);
        },

        startAutoplay() {
            this.timeoutId = setInterval(() => {
                this.moveSlide('next');
            }, this.interval);
        },

        resetAutoplay() {
            if (this.timeoutId) {
                clearInterval(this.timeoutId);
                this.startAutoplay();
            }
        },

        // Método para anunciar cambios de slide
        announceSlideChange(index) {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.classList.add('sr-only');
            announcement.textContent = `Mostrando slide ${index + 1} de ${this.slides.length}`;

            document.body.appendChild(announcement);
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 1000);
        },
    };

    // Inicializar slider
    slider.init();

    const carousel = document.querySelector('.testimonials__carousel');
    
    // Función para centrar una tarjeta y manejar la clase active
    function centerCard(card) {
        const containerWidth = carousel.offsetWidth;
        const cardWidth = card.offsetWidth;
        const scrollLeft = card.offsetLeft - (containerWidth / 2) + (cardWidth / 2);
        
        // Remover clase active de todas las tarjetas
        cards.forEach(c => c.classList.remove('active'));
        
        // Añadir clase active a la tarjeta centrada
        card.classList.add('active');
        
        carousel.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
    }

    // Event listener para los clicks en las tarjetas
    const cards = carousel.querySelectorAll('.testimonial-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            centerCard(card);
        });
    });

    // Scroll automático cada 5 segundos
    let currentIndex = 0;
    setInterval(() => {
        currentIndex = (currentIndex + 1) % cards.length;
        centerCard(cards[currentIndex]);
    }, 5000);
});