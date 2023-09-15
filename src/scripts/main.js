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
        slidesPerView: 2,
        spaceBetween: 15,
        // loop: true,
        navigation: {
            prevEl: '.swiper-button--prev',
            nextEl: '.swiper-button--next',
        },
        /*breakpoints: {
            992: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1365: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
        }*/
    });

    $('.js-rating-stars').each(function () {
        const rating = $(this).attr('data-rating')
        const stars = $(this).find('.js-star')
        stars.each(function () {
            if ($(this).index() < rating - 1) $(this).addClass('-filled')
        })
    })
});


