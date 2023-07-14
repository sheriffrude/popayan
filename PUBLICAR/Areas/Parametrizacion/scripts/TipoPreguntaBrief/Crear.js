/**
 * Evento de finalización de creación de tipo de pregunta
 * @param {any} response
 */
function OnCompleteCrearTipoPreguntaBrief(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        {
            var tipoMensaje = "danger";
            if (resultado.state == true) {
                tipoMensaje = "success"
                RecargarTablaTipoPreguntaBrief();
                Utils._CloseModal();
            }
            Utils._BuilderMessage(tipoMensaje, resultado.message);
        }
    }
}