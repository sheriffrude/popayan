/**
 * Evento de finalización de creación de tipo de documento legal de la empresa
 * @param {any} response
 */
function OnCompleteCrearTipoDocumentoLegalEmpresa(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        {
            var tipoMensaje = "danger";
            if (resultado.state == true) {
                tipoMensaje = "success"
                RecargarTablaTipoDocumentoLegalEmpresa();
                Utils._CloseModal();
            }
            Utils._BuilderMessage(tipoMensaje, resultado.message);
        }
    }
}