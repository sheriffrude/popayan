/**
 * Función de inicialización conyugue
 */
function initConyugue() {
    var estadoRegistro = $("#estado-registro-conyugue").val();
    $("#partial-conyugue").hide();
    if (estadoRegistro == "True") {
        $("#partial-conyugue").show();
        $('#ChkConyugue').attr('checked', true);
    }
}

/**
 * Evento de registro de conyugue
 */
function clickConyugue() {
    if ($('#ChkConyugue').is(':checked')) {
        $('.conyugue').attr('required', true);
        $("#partial-conyugue").show();
    }
    else {
        $('.conyugue').removeAttr('required');
        $("#partial-conyugue").hide();
        limpiarConyugue();
    }
}

function limpiarConyugue() {
    var elements = $(".conyugue");
    var countElements = elements.length;
    for (var i = 0; i < countElements; i++) {
        if (elements[i].id != undefined) {
            $("#" + elements[i].id).val("");
        }
    }
}
/**
 * Función de obtener los datos registrados
 * @param {any} data
 */
function obtenerConyugue() {
    var dataConyugue = {}, detalleConyugue = {};
    var estadoRegistro = $('#ChkConyugue').is(':checked');
    var idConyugue = $("#IdConyugue").val();
    if (estadoRegistro) {
        var elements = $(".conyugue");
        var countElements = elements.length;
        for (var i = 0; i < countElements; i++) {
            if (elements[i].id != undefined) {
                detalleConyugue[elements[i].name] = elements[i].value;
            }
        }
        detalleConyugue["DetalleConyugue.IdConyugue"] = idConyugue != undefined && idConyugue.length > 0 ? Number(idConyugue) : 0;
        dataConyugue = detalleConyugue;

    } else {
        dataConyugue["DetallConyugue"] = null;
    }
    dataConyugue["RegistroConyugue"] = estadoRegistro;
    return dataConyugue;
}