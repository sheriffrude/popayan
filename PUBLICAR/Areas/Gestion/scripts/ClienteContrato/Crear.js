var crearContrato = function () {
    return {
        init: function () {
            var estadoProceso = $("#estadoProceso").val();
            var mensajeProceso = $("#mensajeProceso").val();

            if (estadoProceso == 1)
                Utils._BuilderMessage("success", mensajeProceso, redirigirProceso);
            if (estadoProceso == 0)
                Utils._BuilderMessage("danger", mensajeProceso);

            $("#FechaFirma").datepicker({
                onSelect: function () {
                    $("#FechaFin").datepicker("option", "minDate", this.value);
                }
            });

            $("#FechaFin").datepicker({
                onSelect: function () {
                    $("#FechaInicio").datepicker("option", "maxDate", this.value);
                }
            });

            $("#FechaInicio").datepicker();
        }
    }
}();

function redirigirProceso() {
    window.location = urlRedireccion;
}

$(function () {
    crearContrato.init();
});