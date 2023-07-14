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
    $.fn.formatPrice = function (options) {
        //Carga los valores por defecto
        var options = $.extend(true, {}, $.fn.formatPrice.defaults, options);

        //Adiciona los eventos keypress keyup al elemento
        this.bind("keypress keyup", function (event) {
            if (event.which != 0 && event.which != 46 && event.which != 8 && isNaN(String.fromCharCode(event.which))) {
                event.preventDefault();
            }

            var val = $(this).val();
            var valFinal = retornarFloat(val);

            $(this).val(formatearPrecio(valFinal));
        });

        //Obtiene el valor o el texto del elemento
        var val = this.is("input") ? this.val() : this.text();

        //Pasa el valor formateado a float
        var valFinal = retornarFloat(val);

        //Llama a la funcion para formatear el valor
        if (this.is("input")) {
            this.val(formatearPrecio(valFinal));
        } else
            this.html(formatearPrecio(valFinal));

        /**
         * Funcion para formatear el valor a precio del elemento
         * @param {any} num
         */
        function formatearPrecio(num) {
            num += '';
            var splitStr = num.split(options.separator);
            var splitLeft = splitStr[0];
            var splitRight = splitStr.length > 1 ? options.decimalSeparator + splitStr[1] : '';
            var regx = /(\d+)(\d{3})/;
            while (regx.test(splitLeft)) {
                splitLeft = splitLeft.replace(regx, '$1' + options.separator + '$2');
            }
            return splitLeft + splitRight;
        }

        /**
         * Funcion para tranformar de formato precio a float
         * @param {any} val
         */
        function retornarFloat(val) {
            var valor = val.split(options.separator);
            var valFinal = "";
            for (var i = 0; i < valor.length; i++) {
                valFinal += "" + valor[i];
            }
            return valFinal;
        }

        this.getVal = function () {
            var valor = this.val();
            return (valor == "" || valor == undefined) ? 0 : valor.replace(/,/g, '');
        };
    }

    $.fn.formatPriceGetVal = function () {
        var valor = this.val();
        return (valor == "" || valor == undefined) ? 0 : valor.replace(/,/g, '');
    };

    /************
    * Defaults *
    ************/
    $.fn.formatPrice.defaults = {
        prefix: '$ ',
        separator: ',',
        decimalSeparator: '.',
    };
}));