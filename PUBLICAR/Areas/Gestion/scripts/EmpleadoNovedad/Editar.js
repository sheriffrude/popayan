function OnLoadEditarEmpleadoNovedad() {
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

function OnCompleteEditarEmpleadoNovedad(response) {
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

function OnBeginEditarEmpleadoNovedad(jqXHR, settings) {
    var data = $(this).serializeObject();
    settings.data = jQuery.param(data);
    return true;
}
