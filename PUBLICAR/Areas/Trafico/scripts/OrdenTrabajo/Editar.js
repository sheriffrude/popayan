var ORDEN_TRABAJO_EDITAR = {
    OnComplete: function (response) {
        var resultado = RequestHttp._ValidateResponse(response);
        if (!Validations._IsNull(resultado)) {
            var tipoMensaje = "danger";
            if (resultado.state == true) {
                tipoMensaje = "success";
                Utils._CloseModal();
            }
            Utils._BuilderMessage(tipoMensaje, resultado.message);
        }
    }
}