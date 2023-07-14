$(function () {
    //console.log("init document")

    ///Inicia los valores por defecto del plugin dataTable
    ForDefault._DataTable();

    ///Inicia los valores por defecto del plugin datepicker
    ForDefault._DatePicker();

    //ForDefault._JqueryValidate();

    ///Adiciona la function Reset summary
    Validations._AddFunctionResetSummary();

    ///Inicializa modales
    Utils._InitModal();

    ///Inicializa animacón ajax loading
    Utils._InitAjaxLoading();

    ///Inicializa el evento OnKeyUp en los input con el atrinuto data-format-price
    Utils._InputFormatPrice();

    ///Inicializa los eventos focus en los inputs, textarea, select
    Utils._InputFocus();

    //Horas hombre
    if (VALIDAR_HORAS_HOMBRE)
        RequestHttp._Post(URL_VALIDAR_REGISTRO_HORAS_HOMBRE, null, null, function (respuesta) {
            if (respuesta != null) {
                if (respuesta.state == true) {
                    if (respuesta.data == false) {
                        var titulo = "Horas Hombre";
                        var mensaje = "Debe registrar sus actividades del día hábil anterior.";
                        Utils._BuilderConfirmationHorasHombre(titulo, mensaje, 'RedireccionarModuloHorasHombre');
                    }
                } else {
                    Utils._BuilderMessage("danger", respuesta.mensaje);
                }
            }
        });

});

function RedireccionarModuloHorasHombre() {
    window.location = URL_REGISTRO_ACTIVIDADES;
}

///Objeto: Valores por defecto
var ForDefault = {
    _UrlBase: PATH_BASE,
    _UrlServerReports: URL_REPORT_SERVICE,
    _FormatDate: "DD/MM/YYYY", // 01/12/2017, plugin momentjs
    _FormatHour: "h : mm A", // 12:30 am, plugin momentjs
    _DatePicker: function () {
        if ("undefined" !== typeof $.datepicker) {
            //console.log("_DatePicker");

            $.datepicker.regional['es'] = {
                closeText: 'Cerrar',
                prevText: '< Ant',
                nextText: 'Sig >',
                currentText: 'Hoy',
                monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
                dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
                dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
                weekHeader: 'Sm',
                dateFormat: 'dd/mm/yy',
                firstDay: 1,
                isRTL: false,
                showMonthAfterYear: false,
                yearSuffix: '',
                changeMonth: true,
                changeYear: true,
                yearRange: "-100:+0"
            };
            $.datepicker.setDefaults($.datepicker.regional["es"]);
        }
    },
    _DataTable: function () {
        if ("undefined" !== typeof $.fn.dataTable) {
            //console.log("_DataTable");

            $.extend(true, $.fn.dataTable.defaults, {
                "bLengthChange": false,
                "bFilter": false,
                "processing": true,
                "serverSide": true,
                "language": {
                    "sProcessing": "Procesando...",
                    "sLengthMenu": "Mostrar _MENU_ registros",
                    "sZeroRecords": "No se encontraron resultados",
                    "sEmptyTable": "Ningún dato disponible en esta tabla",
                    "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                    "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                    "sInfoPostFix": "",
                    "sSearch": "Buscar:",
                    "sUrl": "",
                    "sInfoThousands": ",",
                    "sLoadingRecords": "Cargando...",
                    "oPaginate": {
                        "sFirst": '<i class="fa fa-fast-backward" aria-hidden="true"></i>',
                        "sLast": '<i class="fa fa-fast-forward" aria-hidden="true"></i>',
                        "sNext": '<i class="fa fa-step-forward" aria-hidden="true"></i>',
                        "sPrevious": '<i class="fa fa-step-backward" aria-hidden="true"></i>'
                    },
                    "oAria": {
                        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                    }
                },
            });

            $.fn.dataTable.ext.errMode = function (settings, helpPage, message) {
                if (settings.jqXHR !== null && typeof (settings.jqXHR.responseJSON) !== 'undefined') {
                    var codeError = settings.jqXHR.status;
                    var messageError = settings.jqXHR.responseJSON.error;
                    Utils._BuilderMessage('danger', messageError);
                }
                else if (settings.jqXHR !== null) {
                    var codeError = settings.jqXHR.status;
                    var messageError = "ERROR " + codeError + ": " + settings.jqXHR.responseText;
                    Utils._BuilderMessage('danger', messageError);
                }
                else {
                    Utils._BuilderMessage('danger', 'Ocurrió un error, por favor comuníquese con el administrador.');
                }
            };
        }
    },
    _JqueryValidate: function () {

        $.extend($.validator.messages = {
            required: "This field is asdasdrequired.",
            remote: "asd fix thissadasdas field.",
            email: "Pleasdase enter a valid email address.",
            url: "Pleaasdse enter a valid URL.",
            date: "Pleasasde enter a valid date.",
            dateISO: "Pleasdase enter a valid date (ISO).",
            number: "Pleasasde enter a valid number.",
            digits: "Pleasasde enter only digits.",
            creditcard: "Pleaasdasdse enter a valid credit card number.",
            equalTo: "Please entasdasder the same value again.",
            accept: "Please enter asdasdasda value with a valid extension.",
            maxlength: $.validator.format("Pleasesdasd enter no more than {0} characters."),
            minlength: $.validator.format("Please entasdasder at least {0} characters."),
            rangelength: $.validator.format("Please entasdasder a value between {0} and {1} characters long."),
            range: $.validator.format("Please enter a vasdasdalue between {0} and {1}."),
            max: $.validator.format("Please enter a vaasdasdlue less than or equal to {0}."),
            min: $.validator.format("Please enter a asdasdasdvalue greater than or equal to {0}.")
        });
        /*
        $.extend(jQuery.validator.messages, {
            required: "Este campo es obligatorio.",
            remote: "Por favor, rellena este campo.",
            email: "Por favor, escribe una dirección de correo válida",
            url: "Por favor, escribe una URL válida.",
            date: "Por favor, escribe una fecha válida.",
            dateISO: "Por favor, escribe una fecha (ISO) válida.",
            number: "Por favor, escribe un número entero válido.",
            digits: "Por favor, escribe sólo dígitos.",
            creditcard: "Por favor, escribe un número de tarjeta válido.",
            equalTo: "Por favor, escribe el mismo valor de nuevo.",
            accept: "Por favor, escribe un valor con una extensión aceptada.",
            maxlength: jQuery.validator.format("Por favor, no escribas más de {0} caracteres."),
            minlength: jQuery.validator.format("Por favor, no escribas menos de {0} caracteres."),
            rangelength: jQuery.validator.format("Por favor, escribe un valor entre {0} y {1} caracteres."),
            range: jQuery.validator.format("Por favor, escribe un valor entre {0} y {1}."),
            max: jQuery.validator.format("Por favor, escribe un valor menor o igual a {0}."),
            min: jQuery.validator.format("Por favor, escribe un valor mayor o igual a {0}.")
        });
        */
    }
}

///Objeto: utilidades generales de la app
var Utils = {
    ///Loading
    _InitAjaxLoading: function () {
        //console.log("_InitAjaxLoading");

        var $loading = $('#container-loading').hide();
        $(document).ajaxStart(function () {
            $loading.stop().fadeIn(100);
        }).ajaxStop(function () {
            $loading.stop().fadeOut(100);
        });
    },

    ///Modal
    _InitModal: function () {
        //console.log("_InitModal");

        //Evento Abrir Modal
        $("#all-modal").on("shown.bs.modal", function () {

        });

        //Evento Cerrar modal
        $("#all-modal").on("hidden.bs.modal", function () {
            $('#all-modal .modal-content').empty();
        });

        Utils._BuilderModal();
    },
    _BuilderModal: function () {
        //console.log("_BuilderModal");

        $("a[data-modal]").unbind("click");

        $('[data-toggle="modal"]').click(function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();

            var $this = $(this);

            //Adiciona el atributo data-loading-text al link
            var attr = $this.attr("data-loading-text");
            if (typeof attr === typeof undefined || attr === false) {
                $this.attr("data-loading-text", "Cargando...");
            }

            var executeOnLoad = $this.attr("data-execute-onload");
            var size = $this.attr("data-size");
            var url = $this.attr("href");

            Utils._OpenModal(url, executeOnLoad, size, $this);
        });

        Utils._BuilderSubmitFormModal()
    },
    _BuilderSubmitFormModal: function () {
        //console.log("_BuilderSubmitFormModal");

        $("#all-modal").on("submit", "form[data-ajax!=true]", function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var form = $(this);
            var action = form.attr("action");
            if (action != "#" || action == null) {
                $.ajax({
                    url: form.attr("action"),
                    method: form.attr("method"),
                    data: form.serialize(),
                    success: function (partialResult) {
                        $('#all-modal .modal-content').html(partialResult);
                        Utils._RefreshFormValidationModal();
                    }
                });
            }
        });
    },
    _RefreshFormValidationModal: function () {
        //console.log("_RefreshFormValidationModal");

        $.validator.unobtrusive.parse($("#all-modal form"));
        Validations._ResetValidation();
    },
    _OpenModal: function (url, executeOnLoad, size, $btn) {
        //console.log("_OpenModal");

        //Valida la url del link
        if (!url.indexOf("#") == 0) {

            //Cambia de estado del boton a cargando
            if (typeof $btn !== typeof undefined)
                $btn.button("loading");

            //Llama a la Url solicitada
            $.get(url, function (data) {

                ///Elimina clases modal-(lg, md, sm, xs)
                $('#all-modal').find(".modal-dialog").eq(0).removeClass("modal-lg modal-md modal-sm modal-xs modal-all");
                ///Tamaño modal
                if (typeof size !== typeof undefined) {
                    var classSize = "";
                    switch (size) {
                        case "lg": classSize = "modal-lg";
                            break;
                        case "md": classSize = "modal-md";
                            break;
                        case "sm": classSize = "modal-sm";
                            break;
                        case "xs": classSize = "modal-xs";
                            break;
                        case "all": classSize = "modal-all";
                            break;
                    }
                    $('#all-modal').find(".modal-dialog").eq(0).addClass(classSize);
                }

                //Inserta el html al modal de la url solicitada
                //var html = $.parseHTML(data);
                $('#all-modal .modal-content').html(data);

                //Contruye los modales
                Utils._BuilderModal();

                //Abre el modal
                $("#all-modal").modal('show');


                //Valida si existe function onload
                if (typeof executeOnLoad !== "undefined" && executeOnLoad !== null) {
                    if (typeof executeOnLoad === "string") {
                        //window[executeOnLoad]();
                        var tmpFunc = new Function(executeOnLoad + "()");
                        tmpFunc();
                    }
                    else if (typeof executeOnLoad === "function")
                        executeOnLoad();
                    else
                        Utils._BuilderMessage("danger", "No se encontro la función " + executeOnLoad);
                }

                ///Recarga validacion de formularios
                Utils._RefreshFormValidationModal();
            }).always(function () {
                //Resetea el boton del link
                if (typeof $btn !== typeof undefined)
                    $btn.button("reset");

            }).fail(function (data) {
                //Abre una alerta con el error
                Utils._BuilderMessage("danger", data.status + " - " + data.statusText);
            }).done(function (data) {
                if (typeof data.state !== "undefined" && data.state == false) {
                    if (data.sesion)
                        Utils._BuilderMessage("danger", data.message);
                    else
                        Utils._BuilderMessage("danger", data.message, Utils._ReloadPage);
                }
                Utils._InputFocus();
                Utils._InputFormatPrice();
                Utils._BuilderDropDown();
            });
        }
    },
    _CloseModal: function () {
        //console.log("_CloseModal");
        $("#all-modal").modal("hide");
    },

    ///Messages
    _BuilderMessage: function (type, message, callbackFunction, datos) {
        //console.log("_BuilderMessage");

        var title = "";
        var typeAlert = "";
        switch (type) {
            case 'danger': title = 'Error';
                typeAlert = 'error';
                break;
            case 'success': title = 'Correcto';
                typeAlert = 'success';
                break;
            case 'info': title = 'Información';
                typeAlert = 'info';
                break;
            case 'warning': title = 'Advertencia';
                typeAlert = 'warning';
                break;
            case 'default': title = 'Mensaje';
                typeAlert = 'default';
                break;
            default: break;
        }
        Lobibox.alert(typeAlert, {
            title: title,
            msg: message,
            parametros: {
                data: datos,
            },
            callback: function () {
                if (typeof callbackFunction !== "undefined" && callbackFunction != null) {
                    if (typeof callbackFunction === "string") {
                        var tmpFunc = new Function(callbackFunction + "()");
                        tmpFunc(datos);
                    }
                    else if (typeof callbackFunction === "function")
                        callbackFunction(datos);
                    else
                        Utils._BuilderMessage("danger", "No se encontro la función " + callbackFunction);
                }
            }
        });
    },

    _BuilderConfirmation: function (title, message, functionYes, functionNo, datos) {

        Lobibox.confirm({
            title: title,
            msg: message,
            parametros: {
                data: datos,
            },
            buttons: {
                ok: {
                    text: 'Si'
                },
                no: {
                    text: 'No'
                }
            },
            callback: function ($this, type, ev) {
                if (type === 'ok') {
                    if (typeof functionYes !== "undefined" && functionYes != null) {
                        if (typeof functionYes === "string") {
                            var tmpFunc = new Function(functionYes + "()");
                            tmpFunc($this.$options.parametros.data);
                        }
                        else if (typeof functionYes === "function")
                            functionYes($this.$options.parametros.data);
                        else
                            Utils._BuilderMessage("danger", "No se encontro la función " + functionYes);
                    }
                }
                else {
                    if (typeof functionNo !== "undefined" && functionNo != null) {
                        if (typeof functionNo === "string") {
                            var tmpFunc = new Function(functionNo + "()");
                            tmpFunc($this.$options.parametros.data);
                        }
                        else if (typeof functionNo === "function")
                            functionNo($this.$options.parametros.data);
                        else
                            Utils._BuilderMessage("danger", "No se encontro la función " + functionNo);
                    }
                }
            }
        })
    },

    _BuilderConfirmationHorasHombre: function (title, message, functionYes, functionNo, datos) {

        Lobibox.alert('warning', {
            title: title,
            msg: message,
            parametros: {
                data: datos,
            },
            closeButton: false,
            closeOnEsc: false,  
            buttons: {
                ok: {
                    text: 'OK',
                    closeOnClick: false
                }
            },
            callback: function ($this, type, ev) {
                if (type === 'ok') {
                    if (typeof functionYes !== "undefined" && functionYes != null) {
                        if (typeof functionYes === "string") {
                            var tmpFunc = new Function(functionYes + "()");
                            tmpFunc($this.$options.parametros.data);
                        }
                        else if (typeof functionYes === "function")
                            functionYes($this.$options.parametros.data);
                        else
                            Utils._BuilderMessage("danger", "No se encontro la función " + functionYes);
                    }
                }
                else {
                    if (typeof functionNo !== "undefined" && functionNo != null) {
                        if (typeof functionNo === "string") {
                            var tmpFunc = new Function(functionNo + "()");
                            tmpFunc($this.$options.parametros.data);
                        }
                        else if (typeof functionNo === "function")
                            functionNo($this.$options.parametros.data);
                        else
                            Utils._BuilderMessage("danger", "No se encontro la función " + functionNo);
                    }
                }
            }

        })
    },


    ///DropDownList
    _GetDataDropDownList: function (elementList, url, parameters, addSeleccione, valueDefault) {

        $(elementList).empty();
        if (typeof valueDefault === "undefined") {
            valueDefault = '';
        }

        if (typeof addSeleccione === "undefined" || addSeleccione !== false) {
            $(elementList).append($("<option/>", { value: valueDefault, text: "Seleccione" }));
        }
        RequestHttp._Post(url, parameters, null, function (data) {
            if (!Validations._IsNull(data)) {
                $.each(data, function (index, item) {
                    $(elementList)
                        .append(
                        $("<option/>", { value: item.Value, text: item.Text }));
                });
                Utils._BuilderDropDown();
            }
        });
        /*
        $.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            data: parameters,
            success: function (data, text) {
                $.each(data,
                    function (index, item) {
                        console.info(item);
                        $(elementList)
                            .append(
                            $("<option/>", { value: item.Value, text: item.Text }));
                    });
            },
            error: function(request, status, error) {
                Utils._BuilderMessage("danger", error);
            }
        });
        */
    },
    _GetDropDownList: function (elementList, url, parameters, addSeleccione, valueForDefault) {
        //console.log("_GetDropDownList");

        if ($(elementList).hasClass("selectpicker"))
            $(elementList).selectpicker('destroy').addClass("selectpicker");

        $(elementList).empty();

        if (typeof addSeleccione === "undefined" || addSeleccione !== false) {
            $(elementList).append($("<option/>", { value: '', text: "Seleccione" }));
        }

        RequestHttp._Post(url, parameters, null, function (response) {
            if (!Validations._IsNull(response)) {
                if (response.state == true) {
                    var data = response.data;
                    $.each(data,
                        function (index, item) {
                            $(elementList)
                                .append(
                                $("<option/>", { value: item.Value, text: item.Text }));
                        });

                    if (valueForDefault != null)
                        $(elementList).val(valueForDefault);

                    if ($(elementList).hasClass("selectpicker"))
                        $(elementList).selectpicker('render');
                } else {
                    if (response.sesion)
                        Utils._BuilderMessage("danger", response.message);
                    else
                        Utils._BuilderMessage("danger", response.message, Utils._ReloadPage);
                }
                Utils._BuilderDropDown();
            }
        });
    },
    _ClearDropDownList: function (elementList) {
        //console.log("_ClearDropDownList");

        if ($(elementList).hasClass("selectpicker"))
            $(elementList).selectpicker('destroy').addClass("selectpicker");

        $(elementList).empty();
        $(elementList).append($("<option/>", { value: '', text: "Seleccione" }));

        if ($(elementList).hasClass("selectpicker"))
            $(elementList).selectpicker('render');

        Utils._BuilderDropDown();
    },
    _LoadDataToDropDownList: function (elementList, dataList, valueForDefault, addSeleccione) {
        //console.log("_LoadDataToDropDownList");

        if ($(elementList).hasClass("selectpicker"))
            $(elementList).selectpicker('destroy').addClass("selectpicker");

        $(elementList).empty();

        if (typeof addSeleccione === "undefined" || addSeleccione !== false) {
            $(elementList).append($("<option/>", { value: '', text: "Seleccione" }));
        }

        var data = dataList;
        $.each(data,
            function (index, item) {
                $(elementList)
                    .append(
                    $("<option/>", { value: item.Value, text: item.Text }));
            });

        if (valueForDefault != null)
            $(elementList).val(valueForDefault);

        if ($(elementList).hasClass("selectpicker"))
            $(elementList).selectpicker('render');
    },
    _BuilderDropDown: function () {
        $("select.selectpicker").each(function () {
            $(this).selectpicker('destroy').addClass("selectpicker");
            $(this).selectpicker('render');
        });
    },
    _LoadDataToDropDownListMultiple: function (elementList, dataList, valuesForDefault) {
        //console.log("_LoadDataToDropDownListMultiple");

        if ($(elementList).hasClass("selectpicker"))
            $(elementList).selectpicker('destroy').addClass("selectpicker");

        $(elementList).empty();

        var data = dataList;
        if (!Validations._IsNull(valuesForDefault)) {
            $.each(data,
                function (index, item) {
                    var selected = false;
                    for (var i = 0; i < valuesForDefault.length; i++) {
                        if (item.Value == valuesForDefault[i])
                            selected = true;
                    }
                    $(elementList)
                        .append(
                        $("<option/>", { value: item.Value, text: item.Text, selected: selected }));
                });
        }
        else {
            $.each(data,
                function (index, item) {
                    $(elementList)
                        .append(
                        $("<option/>", { value: item.Value, text: item.Text }));
                });
        }

        if ($(elementList).hasClass("selectpicker"))
            $(elementList).selectpicker('render');
    },

    //Time
    _SubtractHours: function(horaInicial, horaFinal, tipoRetorno) {
        var resultado = 0;
        horaInicial = moment(horaInicial, ForDefault._FormatHour);
        horaFinal = moment(horaFinal, ForDefault._FormatHour);
        var resta = horaFinal - horaInicial;

        if (typeof tipoRetorno === "undefined")
            tipoRetorno = null;

        switch (tipoRetorno) {
            case "horas": resultado = parseFloat((resta / 3600) / 1000);
                break;
            case "minutos": resultado = parseFloat(resta / 60000);
                break;
            case "segundos": resultado = parseFloat(resta / 1000);
                break;
            case "milisegundos": resultado = parseFloat(resta);
                break;
            default: resultado = parseFloat(resta);
                break;
        }
        return resultado;
    },
    _FormatWickedpickerTo24H: function(hora) {
        return (typeof hora === 'undefined') ? null : moment(hora, "h : mm A").format("HH:mm");
    },

    //Format Price
    _InputFormatPrice: function() {
        $("input[data-format-price]").each(function () {
            $(this).formatPrice();
        });
    },

    //Animate Focus input
    _InputFocus: function () {
        $("input[type='number'], input[type='text'], input[type='search'], textarea").each(function () {
            var $nodePadre = $(this).parent();
            if (typeof ($nodePadre) != "undefined" && $nodePadre.hasClass("form-group")) {
                $(this).focus(function () {
                    $nodePadre.addClass("form-group-focus");
                }).blur(function () {
                    $nodePadre.removeClass("form-group-focus");
                });
            }
        });
    },

    //Recargar pagina
    _ReloadPage: function () {
        location.reload();
    },

    //Tooltip
    _BuilderToolTip: function () {
        $('[data-toggle="tooltip"]').tooltip();
    }
}

///Object: Utilidades form validation 
var Validations = {
    _AddFunctionResetSummary: function () {
        jQuery.fn.resetSummary = function () {
            var form = this.is('form') ? this : this.closest('form');
            form.find("[data-valmsg-summary=true]")
                .removeClass("validation-summary-errors")
                .addClass("validation-summary-valid")
                .find("ul")
                .empty();
            return this;
        };
        Validations._ResetValidation();
    },
    _AddErrorSummary: function ($form, message) {
        $form.find("[data-valmsg-summary=true]")
            .addClass("validation-summary-errors")
            .removeClass("validation-summary-valid")
            .find("ul")
            .show();

        $form.find("[data-valmsg-summary=true]").find("ul").append($("<li/>", { text: message }));
    },
    _ResetValidation: function () {
        $('form').each(function () {
            var validator = $(this).data('validator');
            if (validator) {
                validator.settings.ignore = ".data-val-ignore, :hidden, :disabled";
                validator.settings.showErrors = function (map, errors) {
                    this.defaultShowErrors();
                    if ($('div[data-valmsg-summary=true] li:visible').length) {
                        this.checkForm();
                        if (this.errorList.length)
                            $(this.currentForm).triggerHandler("invalid-form", [this]);
                        else
                            $(this.currentForm).resetSummary();
                    }
                };
            }
        });
    },
    _Requerido: function (valor) {
        var pattern = /^\s+$/;
        return !(typeof valor == 'undefined' || valor == null || valor.length == 0 || pattern.test(valor));
    },
    _Email: function (valor) {
        //var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var pattern = new RegExp(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/);
        return pattern.test(String(valor).toLowerCase());
    },
    _Telefono: function (valor) {
        var pattern = /^\d{9}$./;
        return pattern.test(valor);
    },
    _Celular: function (valor) {
        var pattern = /^\d{10}$./;
        return pattern.test(valor);
    },
    _Numerico: function (valor) {
        return !isNaN(valor);
    },
    _MaximoCaracteres: function (valor, maximo) {
        return !(valor.length > maximo);
    },
    _MinimoCaracteres: function (valor, minimo) {
        return !(valor.length < maximo);
    },
    _Horas: function (horaInicial, horaFinal) {
        horaInicial = moment(horaInicial, ForDefault._FormatHour);
        horaFinal = moment(horaFinal, ForDefault._FormatHour);
        return horaInicial < horaFinal;
    },
    _Fechas: function (fechaInicial, fechaFinal) {
        fechaInicial = moment(fechaInicial, ForDefault._FormatDate);
        fechaFinal = moment(fechaFinal, ForDefault._FormatDate);
        return fechaInicial < fechaFinal;
    },
    _FechasHoras: function (fechaInicial, horaInicial, fechaFinal, horaFinal) {
        var fechaHoraInicial = moment(fechaInicial + " " + horaInicial, ForDefault._FormatDate + " " + ForDefault._FormatHour);
        var fechaHoraFinal = moment(fechaFinal + " " + horaFinal, ForDefault._FormatDate + " " + ForDefault._FormatHour);
        return fechaHoraInicial < fechaHoraFinal;
    },
    _IsNull: function (valor) {
        var pattern = /^\s+$/;
        return (typeof valor == 'undefined' || valor == null || valor.length == 0 || pattern.test(valor));
    },
    _OnlyNumbers: function (event) {
        if (!(event.which == 114 && event.ctrlKey)//Control + R
            && event.which != 0///Tabular
            && event.which != 8
            && isNaN(String.fromCharCode(event.which))) {
            event.preventDefault();
        }
    },
}

///Object: Validar RequestHttp
var RequestHttp = {
    _ValidateResponse: function (response) {
        var result = null;
        if (response.status == 200) {
            result = JSON.parse(response.responseText);
        } else {
            if (response.status == 0)
                Utils._BuilderMessage("danger", "No pudo conectarse con el servidor.</br>Por favor, revise su conexión a internet o comuníquese con el administrador.");
            else
                Utils._BuilderMessage("danger", response.statusText, Utils._ReloadPage);
        }
        return result;
    },
    _UploadFile: function (e, url, callback) {
        //console.log("RequestHttp._UploadFile");

        var files = $(e).prop("files");

        var data = new FormData();
        $.each(files, function (key, value) {
            data.append("file", value);
        });

        $.ajax({
            url: url,
            type: "POST",
            data: data,
            cache: false,
            dataType: 'json',
            processData: false,
            contentType: false,
            complete: function (jqXHR, textStatus) {
                var resultado = RequestHttp._ValidateResponse(jqXHR);
                if (resultado != null) {
                    if (resultado.state == true)
                        callback(resultado.data);
                    else
                        Utils._BuilderMessage('danger', resultado.message);
                }
                callback(null);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Utils._BuilderMessage("danger", textStatus);
            }
        });
    },
    _UploadFiles: function (e, url, callback) {
        //console.log("RequestHttp._UploadFile");

        var files = $(e).prop("files");

        var data = new FormData();
        $.each(files, function (key, value) {
            data.append("file", value);
        });

        $.ajax({
            url: url,
            type: "POST",
            data: data,
            cache: false,
            dataType: 'json',
            processData: false,
            contentType: false,
            complete: function (jqXHR, textStatus) {
                var resultado = RequestHttp._ValidateResponse(jqXHR);
                
                callback(resultado);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Utils._BuilderMessage("danger", textStatus);
            }
        });
    },
    _Post: function (url, parameters, dataType, callback, enableLoading) {

        if (typeof dataType === "undefined" || dataType == null || dataType == false) {
            dataType = "JSON";
        }

        if (Validations._IsNull(enableLoading))
            enableLoading = true;

        //Token
        var form = $('#__AjaxAntiForgeryForm');
        var token = $('input[name="__RequestVerificationToken"]', form).val();
        if (Validations._IsNull(parameters)) {
            parameters = {
                __RequestVerificationToken: token
            };
        }
        else
            parameters.__RequestVerificationToken = token;

        $.ajax({
            url: url,
            data: parameters,
            type: "POST",
            dataType: dataType,
            global: enableLoading,
            complete: function (response) {
                var result = RequestHttp._ValidateResponse(response);
                callback(result);
            },
            error: function (request, status, error) {
                //Utils._BuilderMessage("danger", error);
                callback(null);
            }
        });
    }
}

var ReportsP = {
    _OpenTab: function (typeFile, pathReport, parametersReport) {
        ReportsP._RequestDownload(typeFile, pathReport, parametersReport, 'tab');
    },
    _Download: function (typeFile, pathReport, parametersReport) {
        var type = 'download';
        ReportsP._RequestDownload(typeFile, pathReport, parametersReport, type);
    },
    _RequestDownload: function (typeFile, pathReport, parametersReport, type) {
        var $loading = $('#container-loading');
        $loading.stop().fadeIn(100);

        //Solicitar Client Id
        var formData = new FormData();
        var timestamp = new Date().getTime();
        formData.append("timeStamp", timestamp);

        var clientId = null;
        $.ajax({
            async: false,
            url: ForDefault._UrlServerReports + "/clients",
            type: "POST",
            data: formData,
            crossDomain: true,
            processData: false,
            error: function (jqXHR, textStatus, errorThrown) {
                RequestHttp._ValidateResponse(jqXHR);
                $loading.stop().fadeOut(100);
                return false;
            },
            success: function (data) {
                clientId = data.clientId;
            }
        });

        if (clientId == null)
            return false;

        //Solicitar Instance Id
        var parameters = JSON.stringify({
            parameterValues: parametersReport,
            report: pathReport
        });

        var instanceId = null;
        $.ajax({
            async: false,
            url: ForDefault._UrlServerReports + "/clients/" + clientId + "/instances",
            type: "POST",
            data: parameters,
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            //processData: false,
            error: function (jqXHR, textStatus, errorThrown) {
                RequestHttp._ValidateResponse(jqXHR);
                $loading.stop().fadeOut(100);
                return false;
            },
            success: function (data) {
                instanceId = data.instanceId;
            }
        });

        ///Solicitar Base Document Id
        parameters = JSON.stringify({
            deviceInfo: {
                BaseInfo: ForDefault._UrlServerReports,
                ContentOnly: true,
                UseSVG: true
            },
            format: "HTML5Interactive",
            useCache: true
        });

        var baseDocumentId = null;
        $.ajax({
            async: false,
            url: ForDefault._UrlServerReports + "/clients/" + clientId + "/instances/" + instanceId + "/documents",
            type: "POST",
            data: parameters,
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            //processData: false,
            error: function (jqXHR, textStatus, errorThrown) {
                RequestHttp._ValidateResponse(jqXHR);
                $loading.stop().fadeOut(100);
                return false;
            },
            success: function (data) {
                baseDocumentId = data.documentId;
            }
        });

        ///Solicitar Document Id
        parameters = JSON.stringify({
            baseDocumentID: baseDocumentId,
            deviceInfo: {
                BaseInfo: ForDefault._UrlServerReports
            },
            format: typeFile,
            useCache: true
        });

        var documentId = null;
        $.ajax({
            async: false,
            url: ForDefault._UrlServerReports + "/clients/" + clientId + "/instances/" + instanceId + "/documents",
            type: "POST",
            data: parameters,
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            //processData: false,
            error: function (jqXHR, textStatus, errorThrown) {
                RequestHttp._ValidateResponse(jqXHR);
                $loading.stop().fadeOut(100);
                return false;
            },
            success: function (data) {
                documentId = data.documentId;
            }
        });

        $.ajax({
            async: false,
            url: ForDefault._UrlServerReports + "/clients/" + clientId + "/instances/" + instanceId + "/documents/" + documentId + "/info",
            type: "GET",
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            //processData: false,
            error: function (jqXHR, textStatus, errorThrown) {
                RequestHttp._ValidateResponse(jqXHR);
                $loading.stop().fadeOut(100);
                return false;
            },
            success: function (data) {
                setTimeout(function () {
                    var urlDownload = ForDefault._UrlServerReports + "/clients/" + clientId + "/instances/" + instanceId + "/documents/" + documentId + "?response-content-disposition=";
                    if (type == 'tab')
                        window.open(urlDownload + 'inline', '_blank');
                    else
                        window.location = urlDownload + 'attachment';
                }, 3000);
            }
        });

        $loading.stop().fadeOut(100);
    },
    _Draw: function ($container, pathReport, parameterReport) {
        if (!Validations._IsNull($container.data("telerik_ReportViewer"))) {
            var viewer = $container.data("telerik_ReportViewer");
            viewer.reportSource({
                report: viewer.reportSource().report,
                parameters: parameterReport
            });
            viewer.refreshReport();
        } else {
            var $reportViewer = $container.telerik_ReportViewer({
                //viewMode: "PRINT_PREVIEW",
                scaleMode: "FIT_PAGE_WIDTH",
                serviceUrl: ForDefault._UrlServerReports,
                templateUrl: "/ReportViewer/templates/telerikReportViewerTemplate.html",
                reportSource: {
                    report: pathReport,
                    parameters: parameterReport
                }
            });
        }
    }
};

///Add function serializeObject
$.fn.serializeObject = function () {
    //console.log("serializeObject");
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
}

/**
 * Objeto: sideBarP
*/
var SideBarP = {
    _OnClickMenuToogle: function () {
        var open = $("body").hasClass("nav-sm");
        var parameters = {
            open: open
        };
        $.ajax({
            url: URL_MENU_TOOGLE,
            data: parameters,
            type: "POST",
            global: false,
            dataType: "JSON",
            complete: function (response) {
            }
        });
    },
    _OnClickFullScreen: function (e) {
        if (screenfull.enabled) {
            screenfull.toggle();
            var $span = $(e).find("span");
            if ($span.hasClass("glyphicon-fullscreen"))
                $span.removeClass("glyphicon-fullscreen").addClass("glyphicon-screenshot");
            else
                $span.removeClass("glyphicon-screenshot").addClass("glyphicon-fullscreen");
        }
    }
}

/**
 * formatNumber
 */
var formatNumber = {
    separador: ",", // separador para los miles
    sepDecimal: '.', // separador para los decimales
    formatear: function (num) {
        num += '';
        var splitStr = num.split(',');
        var splitLeft = splitStr[0];
        var splitRight = splitStr.length > 1 ? this.sepDecimal + splitStr[1] : '';
        var regx = /(\d+)(\d{3})/;
        while (regx.test(splitLeft)) {
            splitLeft = splitLeft.replace(regx, '$1' + this.separador + '$2');
        }
        return this.simbol + splitLeft + splitRight;
    },
    new: function (num, simbol) {
        this.simbol = simbol || '';
        return this.formatear(num);
    }
}

var intVal = function (i) {
    return typeof i === 'string' ?
        i.replace(/[\$,]/g, '') * 1 :
        typeof i === 'number' ?
            i : 0;
};

