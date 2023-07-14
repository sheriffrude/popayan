function OnCompleteEditarConfigSoftware(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        var tipoMensaje = "danger";
        if (resultado.state == true) {
            tipoMensaje = "success"
        };
        Utils._BuilderMessage(tipoMensaje, resultado.message);
    }
}