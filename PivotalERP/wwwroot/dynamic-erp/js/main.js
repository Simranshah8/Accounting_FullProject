//$(function() {
//    //Initialize Select2 Elements
//    $('.select2').select2()

//    //Initialize Select2 Elements
//    $('.select2bs4').select2({
//        theme: 'bootstrap4'
//    })
//})

// Enable Tooltip everywhere
$(function() {
    $('[data-toggle="tooltip"]').tooltip()
})



// For fixed height width table scroll which is used in Sales-Invoice page and modal
$(function() {
    //The passed argument has to be at least a empty object or a object with your desired options
    $('.table-scroll-x-y').overlayScrollbars({
        scrollbars: {
            autoHide: "scroll",
            autoHide: "never",

        },
    });

});


// For fixed height scroll which is used in Sales-Invoice page right side collapsed expand content
$(function() {
    //The passed argument has to be at least a empty object or a object with your desired options
    $('.right-box-wrap').overlayScrollbars({
        scrollbars: {
            autoHide: "scroll",
            autoHide: "never",

        },
    });

});


// For fixed height width table scroll which is used in Sales-Invoice page and modal
$(function() {
    //The passed argument has to be at least a empty object or a object with your desired options
    $('.aditional-cost-table-modal').overlayScrollbars({
        scrollbars: {
            autoHide: "scroll",
            autoHide: "never",

        },
    });

});


// For Calendar used in sales-invoice
//$(function() {
//    $('input[name="VoucherDate"]').daterangepicker({
//        singleDatePicker: true,
//        showDropdowns: true,
//        minYear: 1901,
//        maxYear: parseInt(moment().format('YYYY'), 10)
//    }, function(start, end, label) {
//        var years = moment().diff(start, 'years');
//        alert("You are " + years + " years old!");
//    });
//});

// For fixed height width table scroll which is used in Sales-Invoice page and modal
$(function() {
    //The passed argument has to be at least a empty object or a object with your desired options
    $('.scroll-only-y').overlayScrollbars({
        scrollbars: {
            autoHide: "scroll",
            autoHide: "never",

        },
    });

});