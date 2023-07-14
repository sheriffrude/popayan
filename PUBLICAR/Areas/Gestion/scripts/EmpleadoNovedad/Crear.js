function OnLoadCrearEmpleadoNovedad() {
    $("#FechaFinal").datepicker();
    $("#FechaInicial").datepicker(
        {
            minDate: '0',
            onSelect: function (dateText, inst) {
                $("#FechaFinal").datepicker("option", "minDate",
                    $("#FechaInicial").datepicker("getDate"));
            }
        }
    );
}

function OnCompleteCrearEmpleadoNovedad(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        var tipoMensaje = "danger";
        if (resultado.state == true) {
            tipoMensaje = "success";
            RecargarTablaNovedades();
            Utils._CloseModal();
        }
        Utils._BuilderMessage(tipoMensaje, resultado.message);
    }
}

function OnBeginCrearEmpleadoNovedad(jqXHR, settings) {
    var fechaInicial = $("#FechaInicial").val();
    var fechaFinal = $("#FechaFinal").val();
    var horaInicial = $("#HoraInicial").val();
    var horaFinal = $("#HoraFinal").val();
    if (!Validations._FechasHoras(fechaInicial, horaInicial, fechaFinal, horaFinal)) {
        Utils._BuilderMessage("danger", "La Fecha y Hora Final debe ser mayor a la Fecha y Hora Inicial.")
        return false;
    }

    var data = $(this).serializeObject();
    settings.data = jQuery.param(data);
    return true;
}
