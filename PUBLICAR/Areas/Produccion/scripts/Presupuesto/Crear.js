/*
 * Variables Globales
 */
EMPRESA_ID = null;

$(function () {
    $("#form_crear_presupuesto")[0].reset();

    $("#VigenciaInicial").datepicker({ yearRange: "-5:+5" }).datepicker("setDate", new Date()).val('');

    $("#VigenciaFinal").datepicker({ yearRange: "-5:+5" }).datepicker("setDate", new Date()).val('');
});

/**
 * Cambia la fecha de vigencia inicial o final
 */
function OnchangeVigencia() {
    var fechaInicial = $("#VigenciaInicial").val();
    var fechaFinal = $("#VigenciaFinal").val();

    fechaInicial = moment(fechaInicial, "DD-MM-YYYY");
    fechaFinal = moment(fechaFinal, "DD-MM-YYYY");

    if (fechaFinal != '') {
        if (fechaFinal < fechaInicial) {
            Utils._BuilderMessage("warning", "La fecha de Vigencia Final no puede ser mayor que la fecha de Vigencia Inicial");
            $("#VigenciaFinal").val('');
        }
    }
}

/**
 * Cambia select Empresa
 * @param {any} e
 */
function OnchangeEmpresa(e) {
    var id = $(e).val();
    if (!Validations._IsNull(id)) {

        var urlTipoPresupuesto = URL_EMPRESA_TIPO_PRESUPUESTO_LISTAR,
            urlClientes = URL_CLIENTE_LISTAR,
            urlNotaLegal = URL_EMPRESA_NOTA_LEGAL_CONSULTAR,
            urlCentrosCosto = URL_EMPRESA_CENTRO_COSTO_LISTAR,
            urlClasificacionPresupuesto = URL_EMPRESA_CLASIFICACION_PRESUPUESTO_LISTAR;

        EMPRESA_ID = id;
        var parameters = {
            id: EMPRESA_ID
        };

        var $elementListTipoPresupuesto = $("#TipoPresupuestoId");
        $elementListTipoPresupuesto.prop("disabled", false);
        Utils._GetDropDownList($elementListTipoPresupuesto, urlTipoPresupuesto, parameters, true, null);

        var $elementListClientes = $("#ClienteId");
        $elementListClientes.prop("disabled", false);
        Utils._GetDropDownList($elementListClientes, urlClientes, { empresaId: id }, true, null);

        var $elementNotaLegal = $("#NotaLegal");
        ObtenerNotaLegal($elementNotaLegal, urlNotaLegal, parameters, true, null);

        var $elementListCentrosCosto = $("#CentroCostoId");
        $elementListCentrosCosto.prop("disabled", false);
        Utils._GetDropDownList($elementListCentrosCosto, urlCentrosCosto, parameters, true, null);

        var $elementListClasificacionPresupuesto = $("#ClasificacionPresupuestoId");
        $elementListClasificacionPresupuesto.prop("disabled", false);
        Utils._GetDropDownList($elementListClasificacionPresupuesto, urlClasificacionPresupuesto, parameters, true, null);
    } else {
        var $elementListTipoPresupuesto = $("#TipoPresupuestoId");
        $elementListTipoPresupuesto.prop("disabled", true);
        Utils._ClearDropDownList($elementListTipoPresupuesto);

        var $elementListClientes = $("#ClienteId");
        $elementListClientes.prop("disabled", true);
        Utils._ClearDropDownList($elementListClientes);

        var $elementNotaLegal = $("#NotaLegal");
        $elementNotaLegal.val("")

        var $elementListCentrosCosto = $("#CentroCostoId");
        $elementListCentrosCosto.prop("disabled", true);
        Utils._ClearDropDownList($elementListCentrosCosto);

        var $elementListClasificacionPresupuesto = $("#ClasificacionPresupuestoId");
        $elementListClasificacionPresupuesto.prop("disabled", true);
        Utils._ClearDropDownList($elementListClasificacionPresupuesto);

        var $elementListOrdenesTrabajo = $("#OrdenTrabajoId");
        $elementListOrdenesTrabajo.prop("disabled", true);
        Utils._ClearDropDownList($elementListOrdenesTrabajo);

        var $elementListTiposComision = $("#TipoComisionId");
        $elementListTiposComision.prop("disabled", true);
        Utils._ClearDropDownList($elementListTiposComision);
    }
}

/**
 * Cambia select Cliente
 * @param {any} e
 */
function OnchangeCliente(e) {
    var clienteId = $(e).val();
    if (!Validations._IsNull(clienteId)) {
        var parameters = {
            clienteId: clienteId,
            empresaId: EMPRESA_ID
        };

        var urlOrdenesTrabajo = URL_ORDEN_TRABAJO_POR_EMPRESA_Y_CLIENTE_LISTAR,
            urlTiposComision = URL_EMPRESA_CLIENTE_TIPO_COMISION_LISTAR;

        var $elementListOrdenesTrabajo = $("#OrdenTrabajoId");
        $elementListOrdenesTrabajo.prop("disabled", false);
        Utils._GetDropDownList($elementListOrdenesTrabajo, urlOrdenesTrabajo, parameters, true, null);

        var $elementListTiposComision = $("#TipoComisionId");
        $elementListTiposComision.prop("disabled", false);
        Utils._GetDropDownList($elementListTiposComision, urlTiposComision, parameters, true, null);
    } else {
        var $elementListOrdenesTrabajo = $("#OrdenTrabajoId");
        $elementListOrdenesTrabajo.prop("disabled", true);
        Utils._ClearDropDownList($elementListOrdenesTrabajo);

        var $elementListTiposComision = $("#TipoComisionId");
        $elementListTiposComision.prop("disabled", true);
        Utils._ClearDropDownList($elementListTiposComision);
    }
}

/**
 * Obtiene la Nota legal por Empresa
 * @param {Object<>} elementList 
 * @param {string} url 
 * @param {Object<>} jsonFiltro 
 * @returns {boolean} 
 */
function ObtenerNotaLegal($element, url, parameters) {
    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        data: parameters,
        success: function (result) {
            if (result.state == true) {
                $element.val(result.data);
            } else {
                Utils._BuilderMessage("danger", result.message);
            }
        },
        error: function(request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });
}

/**
 * OnComplete Crear Presupuesto
 * @param {any} response
 */
function OnCompleteCrearPresupuesto(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        if (resultado.state)
            location.href = URL_PRESUPUESTO_CONSULTAR + "/" + resultado.data;
        else
            Utils._BuilderMessage("danger", resultado.message);
    }
}