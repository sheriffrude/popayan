var CrearEmpresaClienteNegociacion = {
    OnComplete: function (response) {
        var data = RequestHttp._ValidateResponse(response);
        if (!Validations._IsNull(data)) {
            if (data.state == true) {
                Utils._BuilderMessage("success", data.message);
                ListarEmpresaClienteNegociacion.RecargarTabla();
                Utils._CloseModal();
            }
            else
                Utils._BuilderMessage("danger", data.message);
        }
    },
    OnChangeTipoComision: function (e) {
        var id = $(e).val();
        if (id == 3) {///Cero
            $("#ValorComision").val(0);
            $("#ValorComision").prop("disabled", true);
        } else {
            $("#ValorComision").prop("disabled", false);
        }
    }
}