(function (factory) {
    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    /****************
    * Main Function *
    *****************/
    $.fn.onlyNumbers = function (options) {
        //Carga los valores por defecto
        var options = $.extend(true, {}, $.fn.onlyNumbers.defaults, options);

        //Adiciona atrinutos min y max a los inputs type number
        if (this.is('input') && this.attr("type") == "number") {
            if (options.min !== Number.NEGATIVE_INFINITY)
                this.attr("min", options.min);
            if (options.max !== Number.POSITIVE_INFINITY)
                this.attr("max", options.max);
        }

        //Adiciona los eventos keypress keyup al elemento
        this.bind("keypress keyup change", function (event) {
            if (!(event.which == 114 && event.ctrlKey)//Control + R
                && event.which != 0///Tabular
                && event.which != 45///Menos
                && event.which != 8
                && isNaN(String.fromCharCode(event.which))) {
                event.preventDefault();
            }

            var val = $(this).val();

            if (options.min !== Number.NEGATIVE_INFINITY && options.min > val) 
                $(this).val(options.min);

            if (options.max !== Number.POSITIVE_INFINITY && options.max < val) 
                $(this).val(options.max);
        });
    }

    /************
    * Defaults *
    ************/
    $.fn.onlyNumbers.defaults = {
        min: Number.NEGATIVE_INFINITY,
        max: Number.POSITIVE_INFINITY,
    };
}));