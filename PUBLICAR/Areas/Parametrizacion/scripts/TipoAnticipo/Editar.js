/**
 * Evento de finalización de actualización de tipo de anticipo
 * @param {any} response
 */
function OnCompleteEditarTipoAnticipo(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        var tipoMensaje = "danger";
        if (resultado.state == true) {
            tipoMensaje = "success"
            RecargarTablaTipoAnticipo();
            Utils._CloseModal();
        }
        Utils._BuilderMessage(tipoMensaje, resultado.message);
    }
}