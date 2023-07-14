$(function () {
    $("#FechaCumpleanos").datepicker();
    $("#FechaCumpleanos").datepicker("option", "dateFormat", "d 'de' MM");
    $("#FechaCumpleanos").datepicker().focus(function () { $(".ui-datepicker-year").hide(); });

});

/**
 * 
 * @param {any} jqXHR
 * @param {any} settings
 */
function OnBeginCrearContactoPersonal(jqXHR, settings) {
    $("#FechaCumpleanos").datepicker("option", "dateFormat", "dd/mm");
    var data = $(this).serializeObject();
    settings.data = jQuery.param(data);
    return true;
}

/**
 * 
 * @param {any} response
 */
function OnCompleteCrearContactoPersonal(response) {
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
