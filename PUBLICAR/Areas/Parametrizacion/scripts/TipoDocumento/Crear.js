/**
 * Evento de finalización de creación de tipo de documento
 * @param {any} response
 */
function OnCompleteCrearTipoDocumento(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        {
            var tipoMensaje = "danger";
            if (resultado.state == true) {
                tipoMensaje = "success"
                RecargarTablaTipoDocumento();
                Utils._CloseModal();
            }
            Utils._BuilderMessage(tipoMensaje, resultado.message);
        }
    }
}