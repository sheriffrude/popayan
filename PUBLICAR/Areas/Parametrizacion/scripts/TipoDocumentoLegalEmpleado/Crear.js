/**
 * Evento de finalización de creación de tipo de documento legal de empleado
 * @param {any} response
 */
function OnCompleteCrearTipoDocumentoLegalEmp(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        {
            var tipoMensaje = "danger";
            if (resultado.state == true) {
                tipoMensaje = "success"
                RecargarTablaTipoDocumentoLegalEmp();
                Utils._CloseModal();
            }
            Utils._BuilderMessage(tipoMensaje, resultado.message);
        }
    }
}