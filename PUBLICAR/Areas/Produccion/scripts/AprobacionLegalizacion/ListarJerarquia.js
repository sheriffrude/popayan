var AprobacionLegalizacionListarJerarquia = {
    $TABLA: null,
    LEGALIZACION_ID: null,
    APROBACION_STATUS: {
        PendienteAprobacion: 1,
        Aprobado: 2,
        Rechazado: 3
    },
    Onload: function () {
        AprobacionLegalizacionListarJerarquia.LEGALIZACION_ID = $("#LegalizacionId").val();
        AprobacionLegalizacionListarJerarquia.CrearTabla();
    },
    CrearTabla: function () {

        AprobacionLegalizacionListarJerarquia.$TABLA = $("#tabla_jerarquia_aprobacion").DataTable({
            "ajax": {
                "url": URL_JERARQUIA_APROBACION_LEGALIZACION_LISTAR,
                "type": "POST",
                "data": function (d) {
                    d.legalizacionId = AprobacionLegalizacionListarJerarquia.LEGALIZACION_ID;
                    return $.extend({}, d, {
                        "adicional": {}
                    });
                }
            },
            "columns": [
                {
                    "data": "Orden",
                },
                {
                    "data": "Grupo",
                },
                { "data": "Persona" },
                {
                    "data": "GrupoUsuarioStatusId",
                    "render": function (data, type, full, meta) {
                        var html = "";
                        switch (data) {
                            case AprobacionLegalizacionListarJerarquia.APROBACION_STATUS.Aprobado:
                                html = "Aprobado";
                                break;
                            case AprobacionLegalizacionListarJerarquia.APROBACION_STATUS.Rechazado:
                                html = "Rechazado"
                                break;
                            case AprobacionLegalizacionListarJerarquia.APROBACION_STATUS.PendienteAprobacion:
                                if (full.GrupoStatusId == AprobacionLegalizacionListarJerarquia.APROBACION_STATUS.PendienteAprobacion) {
                                    html = "Pendiente";
                                }
                        }
                        return html;
                    }
                },
                { "data": "Observacion" },
                { "data": "FechaHoraRespuesta" }
            ],
            "drawCallback": function (settings) {
            }
        });
    },
    RecargarTablaPage: function() {
        AprobacionLegalizacionListarJerarquia.$TABLA.draw("page");
    }
}