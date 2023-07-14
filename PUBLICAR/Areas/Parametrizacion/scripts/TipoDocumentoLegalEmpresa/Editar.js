/**
 * Evento de finalización de actualización de tipo de documento legal de la empresa
 * @param {any} response
 */
function OnCompleteEditarTipoDocumentoLegalEmpresa(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        var tipoMensaje = "danger";
        if (resultado.state == true) {
            tipoMensaje = "success"
            RecargarTablaTipoDocumentoLegalEmpresa();
            Utils._CloseModal();
        }
        Utils._BuilderMessage(tipoMensaje, resultado.message);
    }
}