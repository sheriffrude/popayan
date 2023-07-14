function OnCompleteEditarUnidadNegocio(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        var callbackFunction = null;
        var tipoMensaje = "danger";
        if (resultado.state == true) {
            tipoMensaje = "success"
            callbackFunction = "RecargarPagina";
            Utils._CloseModal();
        }
        Utils._BuilderMessage(tipoMensaje, resultado.message, callbackFunction);
    }
}

function RecargarPagina() {
    location.reload();
}