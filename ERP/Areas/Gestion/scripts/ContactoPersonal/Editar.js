$(function () {
    var fechaActual = $("#FechaCumpleanos").val();
    $("#FechaCumpleanos").datepicker({
        dateFormat: "d 'de' MM"
    }).datepicker('setDate', fechaActual);
    $("#FechaCumpleanos").datepicker().focus(function () { $(".ui-datepicker-year").hide(); });
});

/**
 * 
 * @param {any} jqXHR
 * @param {any} settings
 */
function OnBeginEditarContacto(jqXHR, settings) {
    
    $("#FechaCumpleanos").datepicker("option", "dateFormat", "dd/mm");
    var data = $(this).serializeObject();
    settings.data = jQuery.param(data);
    return true;
}

/**
 * 
 * @param {any} response
 */
function OnCompleteEditarContacto(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        var tipoMensaje = "danger";
        if (resultado.state == true) {
            tipoMensaje = "success"
            RecargarTablaContactos();
            Utils._CloseModal();
        }
        Utils._BuilderMessage(tipoMensaje, resultado.message);
    }
}
