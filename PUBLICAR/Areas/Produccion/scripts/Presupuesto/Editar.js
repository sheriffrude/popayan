/**
 * OnLoadEditarPresupuesto
 */
function OnLoadEditarPresupuesto() {
    $("#VigenciaInicialEditar").datepicker();

    $("#VigenciaFinalEditar").datepicker();
}

/**
 * Cambia la fecha de vigencia inicial o final
 */
function OnchangeVigencia() {
    var fechaInicial = $("#VigenciaInicialEditar").val();
    var fechaFinal = $("#VigenciaFinalEditar").val();

    fechaInicial = moment(fechaInicial, ForDefault._FormatDate);
    fechaFinal = moment(fechaFinal, ForDefault._FormatDate);

    if (!Validations._IsNull(fechaFinal)) {
        if (!Validations._Fechas(fechaInicial, fechaFinal)) {
            Utils._BuilderMessage("warning", "La fecha de Vigencia Final no puede ser mayor que la fecha de Vigencia Inicial");
            $("#VigenciaFinalEditar").val('');
        }
    }
}

/**
 * OnComplete Editar Presupuesto
 * @param {any} response
 */
function OnCompleteEditarPresupuesto(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        var tipoMensaje = "danger";
        if (resultado.state == true) {
            tipoMensaje = "success"
            Utils._CloseModal();
            ActualizarDatosEncabezadoPresupuesto();
        }
        Utils._BuilderMessage(tipoMensaje, resultado.message);
    }
}

/**
 * Actualiza los datos del encabezado del presupuesto
 */
function ActualizarDatosEncabezadoPresupuesto() {
    var parametros = {
        id: PresupuestoConsultar.PRESUPUESTO_ID
    };
    RequestHttp._Post(URL_CONSULTAR_DATOS_PRESUPUESTO, parametros, null, function (response) {
        if (response != null) {
            if (response.state == true) {
                var datos = response.data;
                $("#Referencia").val(datos.Referencia);
                $("#Clasificacion").val(datos.Clasificacion);
                $("#VigenciaInicial").val(datos.VigenciaInicial);
                $("#VigenciaFinal").val(datos.VigenciaFinal);
                $("#NumeroAprobacion").val(datos.NumeroAprobacion);
                $("#LugarEjecucion").val(datos.LugarEjecucion);
                $("#DirigidoA").val(datos.DirigidoA);
                $("#FechaHoraUltimaModificacion").val(datos.FechaHoraUltimaModificacion);
            } else
                Utils._BuilderMessage("danger", response.message);
        }
    });
}