/**
 * Evento de finalización de actualización de tipo de pago
 * @param {any} response
 */
function OnCompleteEditarTipoPago(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        var tipoMensaje = "danger";
        if (resultado.state == true) {
            tipoMensaje = "success"
            RecargarTablaTipoPago();
            Utils._CloseModal();
        }
        Utils._BuilderMessage(tipoMensaje, resultado.message);
    }
}