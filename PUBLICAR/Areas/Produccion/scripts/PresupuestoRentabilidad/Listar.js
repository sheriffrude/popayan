/**
 * this
 */
var PresupuestoRentabilidadListar = {
    /**
     * Variables Globales
     */
    $TABLA: null,
    /**
     * OnLoad
     */
    OnLoad: function () {
        this.CrearTabla();
        $("#form_filtro_tabla_rentabilidad_presupuesto").submit(this.RecargarTabla);
    },
    /**
     * CrearTabla
     */
    CrearTabla: function () {
        var $filtro = $("#input_filtro_listar_rentabilidad");

        this.$TABLA = $("#tabla_rentabilidad_presupuesto").DataTable(
            {
            "ajax": {
                "url": URL_PRESUPUESTO_RENTABILIDAD_LISTAR,
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
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                { "data": "PresupuestoVersionInterna" },
                { "data": "PresupuestoVersionExterna" },
                { "data": "EstadoPresupuesto" },
                { "data": "TotalCostoInterno" },
                { "data": "TotalCostoExterno" },
                { "data": "RentabilidadBruta" },
                { "data": "RentabilidadNeta" },
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
        PresupuestoRentabilidadListar.$TABLA.draw();
        return false;
    },
    /**
     * RecargarTablaPage
     */
    RecargarTablaPage: function () {
        PresupuestoRentabilidadListar.$TABLA.draw("PAGE");
        return false;
    },
    /**
     * ResetearTabla
     */
    ResetearTabla: function () {
        $("#input_filtro_listar_rentabilidad").val('');
        this.RecargarTabla();
        return false;
    }
}