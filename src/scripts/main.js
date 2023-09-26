$(document).ready(function () {
    //Селекты
    const searchSelects = $(".js-search-select")

    searchSelects.each(function () {
        $(this).select2({
            placeholder: 'Тип работы',
            dropdownPosition: 'below',
            minimumResultsForSearch: -1,
            width: '100%',
            dropdownParent: $(this).parents('.form-item')
        })
    })

    //Слайдеры

    const feedbacksSlider = new Swiper('.js-feedbacks-slider', {
        slidesPerView: 1,
        spaceBetween: 20,
        autoHeight: true,
        loop: true,
        navigation: {
            prevEl: '.swiper-button--prev',
            nextEl: '.swiper-button--next',
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 15,
                autoHeight: false
            },
        },
    });

    //Вывод звездочек рейтинга
    $('.js-rating-stars').each(function () {
        const rating = $(this).attr('data-rating')
        if (rating === 0) return
        const stars = $(this).find('.js-star')
        stars.each(function () {
            if ($(this).index() <= rating-1) $(this).addClass('-filled')
        })
        const rounded = Math.floor(rating)
        const decimal = (rating - rounded).toFixed(1)
        if (decimal > 0) {
            stars.eq(rounded).addClass('-part-filled')
                .prepend(`<div class="star-filler" style="width: ${decimal * 100}%"></div>`)
        }
    })

    // Полоски с городами
    let lastTopOffset = window.pageYOffset
    const checkScrollDirection = () => {
        const currentTopOffset = window.pageYOffset
        const result = lastTopOffset < currentTopOffset
        lastTopOffset = currentTopOffset
        return result
    }

    const citiesSection = $('.cities')
    window.addEventListener('scroll',function () {
        if (!citiesSection.visible(true)) return
        const scrollDirection = checkScrollDirection()
        $('.js-cities-line').each(function () {
            let scrollSign
            const isIndexOdd = $(this).parent().index() % 2 !== 0
            if (scrollDirection) scrollSign = isIndexOdd ? '+' : '-'
            else scrollSign = isIndexOdd ? '-' : '+'
            $(this).animate({left: `${scrollSign}=2`}, 5)
        })
    }, {passive: true})

    //Находит ширину скроллбара
    const getScrollBarWidth = () => {
        let el = document.createElement("div");
        el.style.cssText = "overflow:scroll; position:absolute;";
        document.body.appendChild(el);
        let width = el.offsetWidth - el.clientWidth;
        el.remove();
        return width;
    }

    // Моб. меню
    const closeMobileMenu = () => {
        $('.mobile-menu').removeClass('opened')
        $(`#modalBg--mmenu`).remove()
        $('body').removeClass('modal-opened').css('padding-right', 0)
    }

    $('.js-open-mmenu').on('click', function () {
        $('.mobile-menu').addClass('opened').append(`<div class="modal-bg" id="modalBg--mmenu"></div>`)
        $('body').addClass('modal-opened').css('padding-right', getScrollBarWidth())
        $('#modalBg--mmenu').on('click', function () {
            closeMobileMenu()
        })
    })

    $('.js-close-mmenu').on('click', function () {
        closeMobileMenu()
    })

    $('.js-mmenu-dd').on('click', function () {
        const parent = $(this).parents('.mobile-menu__nav-item')
        parent.toggleClass('opened')
        parent.find('.mobile-menu__dropdown-box').slideToggle()
    })
});


