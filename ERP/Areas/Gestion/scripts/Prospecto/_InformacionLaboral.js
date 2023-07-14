/**
 * Función de inicio de modal para registrar infomracion laboral
 */
function initInformacionLaboral() {
    $("#FechaIngreso").datepicker({ maxDate: '-1' });
    $("#FechaRetiro").datepicker({ minDate: '0' });
    $("#FechaPeriodoPrueba").datepicker({ minDate: '0' });
    $("#FechaTerminacionContrato").datepicker({ minDate: '0' });
    $("#FechaIngreso").change();
    $("#UnidadNegocioId").change();
}

/**
 * Evento de selección de unidad de negocio
 * @param {any} e
 */
function OnchangeUnidadNegocioInfoLaboral(e) {
    var areaData = $("#AreaAuxId").val();
    var unidadNegocioId = $(e).val();
    if (unidadNegocioId > 0) {
        var parameters = {
            id: unidadNegocioId
        };
        var $elementList = $("#AreaId");
        Utils._GetDropDownList($elementList, URL_CAMBIO_UNIDAD_NEGOCIO, parameters, true, areaData);
    }
}

/**
 * Evento de cambio al seleccionar la fecha de ingreso
 * @param {any} e
 */
function onChangeFechaIngreso(e) {
    var fechaIngreso = $(e).val();
    if (fechaIngreso != '') {
        var datePicker = $("#FechaIngreso").datepicker('getDate');
        var dateActual = new Date();
        var momentFechaIngreso = moment(datePicker);
        var momentActual = moment(dateActual);
        var diffDuration = moment.duration(momentActual.diff(momentFechaIngreso));

        var years = diffDuration.years();
        var months = diffDuration.months();
        var days = diffDuration.days();

        var out = (years != undefined && years != '' && years != 0) ? (years + " año(s) ") : "";
        out += (months != undefined && months != '' && (years >= 0 && months >= 0)) ? (months + " mes(ses) ") : "";
        out += (days != undefined && days != '') ? (days + " dia(s) ") : "";
        $("#TiempoLaborado").val(out);
    }
}

/**
 * Función que prepara los elemento a registrar
 * @param {any} jqXHR
 * @param {any} settings
 */
function obtenerInformacionLaboral() {
    var dataInfoLaboral = {};
    var elements = $(".info-laboral");
    var countElements = elements.length;
    for (var i = 0; i < countElements; i++) {
        if (elements[i].id != undefined) {
            dataInfoLaboral[elements[i].name] = elements[i].value;
        }
    }
    return dataInfoLaboral;
}