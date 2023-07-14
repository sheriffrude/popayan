var CrearSalarioIntegral = function () {
    return {
        init: function () {     
            $("#Periodo").datepicker({
                onSelect: function () {
                    var dateObject = $(this).datepicker('getDate');
                    CrearSalarioIntegral.validarAnio(dateObject);
                }
            });
        },
        
        validarAnio: function (valor) {
            if (valor != undefined) {
                var fecha = new Date(valor);
                if (fecha != undefined) {
                    $("#Anio").val(fecha.getFullYear());
                }
            }
        },

        onComplete: function (response) {
            var data = RequestHttp._ValidateResponse(response);
            if (!Validations._IsNull(data)) {
                if (data.state == true){
                    Utils._BuilderMessage("success", data.message);
                    Utils._CloseModal();
                    ListarSalarioIntegral.reconstruirTabla();
                    
                }
                else{
                    Utils._BuilderMessage("danger", data.message);
                }
            }
        }
    }
}();