var TAREA_LISTAR_CAMBIO_FECHA_HORA_ENTREGA = {
    $TABLA: null,
    OnLoad: function () {
        TAREA_LISTAR_CAMBIO_FECHA_HORA_ENTREGA.CrearTabla();
    },  
    CrearTabla: function () {
        TAREA_LISTAR_CAMBIO_FECHA_HORA_ENTREGA.$TABLA = $("#tabla_tarea_lista_cambios_fecha_hora_entrega").DataTable({
            "order": [[6, "desc"]],
            "ajax": {
                "url": URL_TAREA_LISTAR_CAMBIOS_FECHA_HORA_ENTREGA,
                "type": "POST",
                "data": function (d) {
                    d.tareaId = $("#TareaId").val();
                    return $.extend({}, d, {
                        "adicional": {}
                    });
                },
            },
            "columns": [
                { "data": "FechaAntigua" },
                { "data": "HoraAntigua" },
                { "data": "FechaNueva" },
                { "data": "HoraNueva" },
                { "data": "Observaciones" },
                { "data": "NombreModificador" },
                { "data": "FechaHoraModificacion" },
            ],
        });
    }
}