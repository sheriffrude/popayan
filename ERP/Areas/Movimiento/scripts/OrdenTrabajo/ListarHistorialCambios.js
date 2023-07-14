var ORDEN_TRABAJO_HISTORIAL_CAMBIOS = {
    $TABLA: null,
    OnLoad: function () {
        ORDEN_TRABAJO_HISTORIAL_CAMBIOS.CrearTabla();
    },
    CrearTabla: function () {
        ORDEN_TRABAJO_HISTORIAL_CAMBIOS.$TABLA = $("#tabla_orden_trabajo_historial_cambios").DataTable({
            "ajax": {
                "url": URL_ORDEN_TRABAJO_LISTAR_HISTORICO_CAMBIOS,
                "type": "POST",
                "data": function (d) {
                    d.ordenTrabajoId = $("#OrdenTrabajoId").val();
                    return $.extend({}, d, {
                        "adicional": {}
                    });
                },
            },
            "columns": [
                { "data": "Referencia" },
                { "data": "Descripcion" },
                { "data": "NombreDirector" },
                { "data": "NombreEjecutivo" },
                { "data": "NombreProductorEjecutivo" },
                { "data": "Observaciones" },
                { "data": "NombreModificador" },
                { "data": "FechaHoraModificacion" },
            ],
        });
    }
}