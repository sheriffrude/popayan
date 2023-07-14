var TAREA_STATUS_CLIENTE_LISTAR = {
    $TABLA: null,
    OnLoad: function () {
        TAREA_STATUS_CLIENTE_LISTAR.CrearTabla();
    },  
    CrearTabla: function () {
        TAREA_STATUS_CLIENTE_LISTAR.$TABLA = $("#tabla_tarea_lista_status_cliente").DataTable({
            //"order": [[5, "desc"]],
            "ajax": {
                "url": URL_TAREA_STATUS_CLIENTE_LISTAR,
                "type": "POST",
                "data": function (d) {
                    d.tareaId = $("#TareaId").val();
                    return $.extend({}, d, {
                        "adicional": {}
                    });
                },
            },
            "columns": [
                { "data": "StatusCliente" },
                { "data": "FechaEntrega" },
                { "data": "Observaciones" },
                { "data": "NombreCreador" },
                { "data": "FechaHoraCreacion" },
            ],
        });
    },
    RecargarTabla: function() {
        if (TAREA_STATUS_CLIENTE_LISTAR.$TABLA != null)
            TAREA_STATUS_CLIENTE_LISTAR.$TABLA.draw();
    },
    RecargarTablaPage: function() {
        if (TAREA_STATUS_CLIENTE_LISTAR.$TABLA != null)
            TAREA_STATUS_CLIENTE_LISTAR.$TABLA.draw("page");
    }
}