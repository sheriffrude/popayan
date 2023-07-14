/**
 * Evento de finalización de creación de tipo de documento legal de cliente
 * @param {any} response
 */
function OnCompleteCrearTipoDocumentoLegalCliente(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        {
            var tipoMensaje = "danger";
            if (resultado.state == true) {
                tipoMensaje = "success"
                RecargarTablaTipoDocumentoLegalCliente();
                Utils._CloseModal();
            }
            Utils._BuilderMessage(tipoMensaje, resultado.message);
        }
    }
}