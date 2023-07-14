/**
 * PresupuestoOrdenProduccionListar
 */
var PresupuestoOrdenProduccionListar = {
    /**
     * Variables Globales
     */
    $TABLA: null,
    /**
     * OnLoad
     */
    OnLoad: function () {
        this.CrearTabla();
        $("#form_filtro_tabla_ordenes_produccion").submit(this.RecargarTabla);
    },
    /**
     * CrearTabla
     */
    CrearTabla: function () {
        var $filtro = $("#input_filtro_listar_ordenes_produccion");
        this.$TABLA = $("#tabla_ordenes_produccion").DataTable({
            "ajax": {
                "url": URL_PRESUPUESTO_ORDEN_PRODUCCION_LISTAR,
                "type": "POST",
                "data": function (d) {
                    d.search["value"] = $filtro.val();
                    d.presupuestoId = PresupuestoConsultar.PRESUPUESTO_ID;
                    return $.extend({}, d, {
                        "adicional": {}
                    });
                }
            },
            "columns": [
                {
                    "data": "Id",
                    "render": function (data, type, full, meta) {
                        var url = URL_PRESUPUESTO_ORDEN_PRODUCCION_CONSULTAR + '/' + data;
                        var html = '<a href="' + url + '" class="btn btn-secondary" data-size="all" data-toggle="modal" data-target="#" data-execute-onload="PresupuestoOrdenProduccionConsultar.OnLoad" >' +
                            '<i class="fa fa-suitcase" aria-hidden="true"></i> OP # ' + data +
                            '</a>'
                        return html;
                    }
                },
                { "data": "PresupuestoVersionInterna" },
                { "data": "PresupuestoVersionExterna" },
                { "data": "Proveedor" },
                { "data": "FormaPago" },
                { "data": "FechaEntrega" },
                { "data": "FechaRadicacion" },
                { "data": "FechaVigenciaInicial" },
                { "data": "FechaVigenciaFinal" },
                { "data": "LugarEntrega" },
                { "data": "Usuario" },
                { "data": "FechaHoraCreacion" },
                { "data": "Estado" },
            ],
            "drawCallback": function (settings) {
                Utils._InputFormatPrice();
                Utils._BuilderModal();
            }
        });
    },
    /**
     * RecargarTabla
     */
    RecargarTabla: function () {
        PresupuestoOrdenProduccionListar.$TABLA.draw();
        return false;
    },
    /**
     * RecargarTablaPage
     */
    RecargarTablaPage: function () {
        PresupuestoOrdenProduccionListar.$TABLA.draw("PAGE");
        return false;
    },
    /**
     * ResetearTabla
     */
    ResetearTabla: function () {
        $("#input_filtro_listar_ordenes_produccion").val('');
        this.RecargarTabla();
        return false;
    }
}