/**
 * Evento de finalización de actualización de tipo de Rango de Cantidad
 * @param {any} response
 */
function OnCompleteEditarTipoRangoCantidad(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        var tipoMensaje = "danger";
        if (resultado.state == true) {
            tipoMensaje = "success"
            RecargarTablaTipoRangoCantidad();
            Utils._CloseModal();
        }
        Utils._BuilderMessage(tipoMensaje, resultado.message);
    }
}