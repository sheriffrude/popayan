var crearItem = function () {
    return {
        init: function () {
            this.onChangeValorUnitario();
        },

        onComplete: function (response) {
            var data = RequestHttp._ValidateResponse(response);
            if (!Validations._IsNull(data)) {
                if (data.state == true) {
                    Utils._BuilderMessage("success", data.message);
                    Utils._CloseModal();
                    ListarItems.reconstruirTabla();
                }
                else {
                    Utils._BuilderMessage("danger", data.message);
                }
            }
        },

        onChangeValorUnitario: function () {
            var valor = $("#ValorUnitario").val();

            if (valor != undefined && valor == "0") {
                $("#rangoEdadesDiv").show();
            } else {
                $("#rangoEdadesDiv").hide();
            }
        }
    };
}();

$(function () {
    crearItem.init();
})