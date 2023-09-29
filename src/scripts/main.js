$(document).ready(function () {
    //Подгрузка скриптов
    function loadScript(url, callback) {

        const script = document.createElement("script");
        script.onload = function () {
            callback();
        };

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

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

    //Валидация форм
    const validateInput = (input, inputValue, inputType) => {
        let errorMessage = ''
        if (validator.isEmpty(inputValue)) {
            errorMessage = "Необходимо заполнить"
            return errorMessage
        }
        switch (inputType) {
            case 'email':
                if (!validator.isEmail(inputValue)) errorMessage = 'Не похоже на e-mail'
                break
            default:
                break
        }
        return errorMessage
    }

    const renderError = (element, errorText) => {
        element.addClass('has-error')
        element.next('.validation-error').remove()
        element.after(`<div class="validation-error">${errorText}</div>`)
        setTimeout(function () {
            element.next('.validation-error').remove()
        }, 5000)
    }

    const removeError = (element) => {
        element.removeClass('has-error')
        element.next('.validation-error').remove()
    }

    $('.js-validator').on('submit', function (e) {
        const inputs = $(this).find('.js-input-required')
        inputs.each(function () {
            const inputValue = $(this).val()
            const inputType = $(this).attr('data-validator-type')
            const errorMessage = validateInput($(this), inputValue, inputType)

            if (!validator.isEmpty(errorMessage)) {
                e.preventDefault()
                renderError($(this), errorMessage)
            } else {
                removeError($(this))
            }
        })
    })

    //Вывод звездочек рейтинга
    $('.js-rating-stars').each(function () {
        const rating = $(this).attr('data-rating')
        if (rating === 0) return
        const stars = $(this).find('.js-star')
        stars.each(function () {
            if ($(this).index() <= rating - 1) $(this).addClass('-filled')
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
    window.addEventListener('scroll', function () {
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

    //Добавляет кнопку и функционал "Показать еще"
    const hideSome = (element, resolution) => {
        if (screen.width > resolution) return
        const maxItems = element.attr('data-max-items')
        const itemsToShow = element.attr('data-items-to-show')
        const items = element.children()
        const itemsQty = items.length
        if (itemsQty <= maxItems) return

        items.each(function (index) {
            if (index >= maxItems) $(this).hide().addClass('hidden')
        })

        const moreBtnMarkup = '<button class="more-button js-more-btn common-btn common-btn--pink w-shadow"><div class="common-btn__body">Посмотреть ещё</div></button>'
        element.append(moreBtnMarkup)
        const moreBtnDom = element.find('.js-more-btn')
        moreBtnDom.on('click', function () {
            const hiddenItems = element.children('.hidden')
            if (hiddenItems.length <= itemsToShow) moreBtnDom.remove()
            hiddenItems.each(function (index) {
                if (index < itemsToShow) $(this).show().removeClass('hidden')
            })
        })
    }

    $('.js-hide-some').each(function () {
        hideSome($(this), 767)
    })

    //Аккордион
    $(document).on('click', '.js-accordion-toggle', function () {
        if (!$(this).hasClass('opened')) {
            $(this).next('.js-accordion-body').slideDown(300).addClass('opened')
            $(this).addClass('opened')
        } else {
            $(this).next('.js-accordion-body').slideUp(300).removeClass('opened')
            $(this).removeClass('opened')
        }
    })

    //Добавляем аккордион к предметам на мобилках
    if (screen.width < 768) {
        $('.subjects__letter').addClass('js-accordion-toggle')
        $('.subjects__links-wrapper').addClass('js-accordion-body')
    }

    //Переключение табов
    const tabControlsWrapper = $('.js-tabs-controls')
    const tabControls = tabControlsWrapper.children()

    tabControls.on('click', function () {
        const tabId = $(this).attr('data-tab')
        const tabsWrapper = tabControlsWrapper.siblings('.js-tabs')
        tabControls.removeClass('active')
        $(this).addClass('active')
        tabsWrapper.children().removeClass('active')
        tabsWrapper.children(tabId).addClass('active')
    })

    //Карта
    const mainMap = document.getElementById('mainMap')

    async function initYMap() {
        await ymaps3.ready;
        const {
            YMap,
            YMapDefaultSchemeLayer,
            YMapDefaultFeaturesLayer,
            YMapControls,
        } = ymaps3;

        const {YMapZoomControl} = await ymaps3.import('@yandex/ymaps3-controls@0.0.1');
        const {YMapDefaultMarker} = await ymaps3.import('@yandex/ymaps3-markers@0.0.1');

        const map = new YMap(document.getElementById('mainMap'), {
            location: {
                center: [0, 0],
                zoom: 16
            },
            behaviors: ['pinchZoom', 'drag']
        });

        map.addChild(new YMapDefaultSchemeLayer());
        map.addChild(new YMapDefaultFeaturesLayer());
        map.addChild(new YMapControls({position: 'left'}).addChild(new YMapZoomControl()));

        $.getJSON($('#mainMap').attr('data-json'), function (data) {
            data.forEach(city => {
                const markerContent = `<div><strong>Офис Work5</strong><div>
                                       <div>${city.address}</div>`
                map.addChild(new YMapDefaultMarker({
                    coordinates: city.coords,
                    popup: {
                        content: markerContent,
                        position: 'right'
                    }
                }));

                if (city.name === "Москва") map.setLocation({center: city.coords});
            })
        });

        function setCenter(coords) {
            map.setLocation({center: coords, duration: 500});
        }
    }


    let mapIsVisible = $(mainMap).visible(true)

    const checkMapVisibility = () => {
        mapIsVisible = $(mainMap).visible(true)
        if (mapIsVisible) {
            loadScript('https://api-maps.yandex.ru/v3/?apikey=b94d7ec3-5178-446e-81c0-18bb45ea93c8&lang=ru_RU',
                initYMap)
            window.removeEventListener('scroll', checkMapVisibility)
        }
    }

    if (mapIsVisible) {
        loadScript('https://api-maps.yandex.ru/v3/?apikey=b94d7ec3-5178-446e-81c0-18bb45ea93c8&lang=ru_RU',
            initYMap)
    } else {
        window.addEventListener('scroll', checkMapVisibility, {passive: true});
    }

    //Выводит список городов из JSON на странице контактов
    if ($('.js-cities-list').length > 0) {
        $.getJSON('./data/contacts.json', function (data) {
            data.forEach(city => {
                const cityItem = `
                <div class="contacts-cities__item w-shadow">
                    <div class="contacts-cities__item-body">
                        <div class="contacts-cities__item-city">
                            <svg class="icon icon-point">
                                <use xlink:href="img/svg/sprite.svg#point"></use>
                            </svg>${city.name}
                        </div>
                        <div class="contacts-cities__item-address">${city.address}</div>
                    </div>
                </div>`

                $('.js-cities-list').append(cityItem)
            })
            console.log(1);
        })
            .done(function () {
                hideSome($('.js-cities-list'), 767)
            })
    }
});


