var UnoAUno = {

    /**
     * OnLoad
     */
    init: function () {
    },

    OnChangeEmpresa: function (e) {

        var empresaId = $(e).val();
        if (Validations._IsNull(empresaId)) {
            $("#ClienteId").prop("disabled", true);
            $("#ProductoId").prop("disabled", true);
            $("#OrdenTrabajoId").prop("disabled", true);
            $("#OrdenTrabajoEstadoId").prop("disabled", true);
            Utils._ClearDropDownList($("#ClienteId"));
            Utils._ClearDropDownList($("#ProductoId"));
            Utils._ClearDropDownList($("#OrdenTrabajoId"));
            Utils._BuilderDropDown();
            return false;
        } else {
            $("#ClienteId").prop("disabled", false);
            Utils._ClearDropDownList($("#ClienteId"));
            Utils._BuilderDropDown();
        }

        var $dropDownList = $("#ClienteId");
        var parameters = {
            empresaId: empresaId
        };
        Utils._GetDropDownList($dropDownList, URL_CLIENTE_LISTAR_POR_EMPRESA, parameters);
    },

    OnChangeCliente: function (e) {

        var clienteId = $(e).val();
        if (Validations._IsNull(clienteId)) {
            $("#ProductoId").prop("disabled", true);
            $("#OrdenTrabajoId").prop("disabled", true);
            $("#OrdenTrabajoEstadoId").prop("disabled", true);

            Utils._ClearDropDownList($("#ProductoId"));
            Utils._ClearDropDownList($("#OrdenTrabajoId"));
            Utils._BuilderDropDown();
            return false;
        } else {
            $("#ProductoId").prop("disabled", false);
            Utils._ClearDropDownList($("#ProductoId"));
            Utils._BuilderDropDown();
        }

        var $dropDownList = $("#ProductoId");
        var parameters = {
            id: clienteId
        };
        Utils._GetDropDownList($dropDownList, URL_LISTAR_PRODUCTOS_POR_CLIENTE, parameters);
    },

    /**
    * Cargar select de ordenes de trabajo
    * @param {any} e
    * @param {any} urlOrdenTrabajo
    */
    OnchangeProducto: function (e, urlOrdenTrabajo) {

        var productoId = $(e).val();

        if (Validations._IsNull(productoId)) {
            $("#OrdenTrabajoEstadoId").prop("disabled", true);
            $("#OrdenTrabajoId").prop("disabled", true);
            Utils._ClearDropDownList($("#OrdenTrabajoId"));
            Utils._BuilderDropDown();
            return false;
        } else {
            $("#OrdenTrabajoEstadoId").prop("disabled", false);
            $("#OrdenTrabajoId").prop("disabled", false);
            Utils._ClearDropDownList($("#OrdenTrabajoId"));
            Utils._BuilderDropDown();
        }

    },

    OnChangeOrdenTrabajoEstado: function (e) {
        var estadoOrdenTrabajoId = $(e).val();

        if (Validations._IsNull(estadoOrdenTrabajoId)) {
            $("#OrdenTrabajoId").prop("disabled", true);
            Utils._ClearDropDownList($("#OrdenTrabajoId"));
            Utils._BuilderDropDown();
            return false;
        } else {
            $("#OrdenTrabajoId").prop("disabled", false);

            Utils._BuilderDropDown();
        }

        var empresaId = $("#EmpresaId").val();
        var clienteId = $("#ClienteId").val();
        var $dropDownList = $("#OrdenTrabajoId");

        var parameters = {
            clienteId: clienteId,
            empresaId: empresaId,
            estadoId: estadoOrdenTrabajoId
        };
        Utils._GetDropDownList($dropDownList, URL_ORDEN_TRABAJO_LISTAR, parameters);
    },

    VisualizarReporte: function () {

        var empresaId = $("#EmpresaId").val();
        var clienteId = $("#ClienteId").val();
        var productoId = $("#ProductoId").val();
        var ordenTrabajoEstadoId = $("#OrdenTrabajoEstadoId").val();
        var ordenTrabajoId = $("#OrdenTrabajoId").val();
        var anioId = $("#AnioId").val();

        var parameters = {
            GesEmpresaId: empresaId,
            GesClienteId: clienteId,
            ProductoId: productoId,
            OtId: ordenTrabajoId,
            Ano: anioId
        };

        ReportsP._Draw($("#reportUnoAUno"), "Reportes/Financieros/UnoAUno.trdp", parameters);
    },
}

$(function () {
    UnoAUno.init();
});
