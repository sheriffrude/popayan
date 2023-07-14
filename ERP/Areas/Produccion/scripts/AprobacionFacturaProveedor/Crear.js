/**
 * AprobacionFacturaProveedorCrear
 */
var AprobacionFacturaProveedorCrear = {

    OnComplete: function (response) {
        var resultado = RequestHttp._ValidateResponse(response);

        if (resultado != null) {
            if (resultado.state)
                Utils._BuilderMessage("success", resultado.message, Utils._ReloadPage);
            else
                Utils._BuilderMessage("danger", resultado.message);
        }
    }
}