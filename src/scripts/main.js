$(document).ready(function () {
    //Селекты
    const searchSelects = $(".js-search-select")

    searchSelects.each(function () {
        console.log($(this).parents('.form-item'));
        $(this).select2({
            placeholder: 'Тип работы',
            dropdownPosition: 'below',
            minimumResultsForSearch: -1,
            width: '100%',
            dropdownParent: $(this).parents('.form-item')
        })
    })
});


