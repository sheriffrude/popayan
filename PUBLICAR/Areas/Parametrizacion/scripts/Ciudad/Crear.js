function OnCompleteCrearCiudad(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        var tipoMensaje = "danger";
        if (resultado.state == true) {
            tipoMensaje = "success"
            RecargarTablaCiudad();
            Utils._CloseModal();
        }
        Utils._BuilderMessage(tipoMensaje, resultado.message);
    }
}

function OnchangePaisCrear(e, url) {
    var paisId = $(e).val();
    var $dropDownList = $("#DepartamentoId");
    if (!(paisId > 0)) {
        Utils._ClearDropDownList($dropDownList);
        return false;
    }

    var parameters = {
        id: paisId
    };
    Utils._GetDataDropDownList($dropDownList, url, parameters);

}