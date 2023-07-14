var CrearMonetizacionSalarial = function () {
    return {
        init: function () {
            $("#crearMonetizacionForm").validate();

            $("#FechaInicial").datepicker({
                onSelect: function () {
                    $("#FechaFinal").datepicker("option", "minDate", this.value);
                }
            });
            $("#FechaFinal").datepicker({
                onSelect: function () {
                    $("#FechaInicial").datepicker("option", "maxDate", this.value);
                }
            });
        },

        onComplete: function (response) {
            var data = RequestHttp._ValidateResponse(response);
            if (!Validations._IsNull(data)) {
                if (data.state == true) {
                    Utils._BuilderMessage("success", data.message);
                    Utils._CloseModal();
                    ListarMonetizacionSalarial.reconstruirTabla();
                }
                else {
                    Utils._BuilderMessage("danger", data.message);
                }
            }
        },

        onBegin: function () {
            var $form = $('.algo');
            if ($form.valid()) {
                return true;
            }

            return false;
        }
    }
}();