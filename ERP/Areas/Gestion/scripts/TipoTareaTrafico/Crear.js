var CrearTipoTareaTrafico = function () {
    return {
        onComplete: function (response) {
            var data = RequestHttp._ValidateResponse(response);
            if (!Validations._IsNull(data)) {
                if (data.state == true) {
                    Utils._BuilderMessage("success", data.message);
                    Utils._CloseModal();
                    ListarTipoTareaTrafico.reconstruirTabla();

                }
                else {
                    Utils._BuilderMessage("danger", data.message);
                }
            }
        }
    }
}();