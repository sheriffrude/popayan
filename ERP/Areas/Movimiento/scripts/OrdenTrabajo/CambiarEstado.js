var ORDEN_TRABAJO_CAMBIAR_ESTADO = {
    OnComplete: function (response) {
        var resultado = RequestHttp._ValidateResponse(response);
        if (!Validations._IsNull(resultado)) {
            var tipoMensaje = "danger";
            if (resultado.state == true)
                tipoMensaje = "success";
            Utils._BuilderMessage(tipoMensaje, resultado.message);
            ORDEN_TRABAJO_LISTAR.RecargarTablaPage();
            Utils._CloseModal();
        }
    }
}