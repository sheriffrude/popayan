var AprobacionCotizacionListarJerarquia = {
    $TABLA: null,
    PRESUPUESTO_ID: null,
    APROBACION_STATUS: {
        PendienteAprobacion: 1,
        Aprobado: 2,
        Rechazado: 3
    },
    Onload: function () {
        AprobacionCotizacionListarJerarquia.PRESUPUESTO_ID = $("#PresupuestoId").val();
        AprobacionCotizacionListarJerarquia.CrearTabla();
    },
    CrearTabla: function () {
        AprobacionCotizacionListarJerarquia.$TABLA = $("#tabla_jerarquia_aprobacion").DataTable({
            "ajax": {
                "url": URL_JERARQUIA_APROBACION_COTIZACION_LISTAR,
                "type": "POST",
                "data": function (d) {
                    d.presupuestoId = AprobacionCotizacionListarJerarquia.PRESUPUESTO_ID;
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
                            case AprobacionCotizacionListarJerarquia.APROBACION_STATUS.Aprobado:
                                html = "Aprobado";
                                break;
                            case AprobacionCotizacionListarJerarquia.APROBACION_STATUS.Rechazado:
                                html = "Rechazado"
                                break;
                            case AprobacionCotizacionListarJerarquia.APROBACION_STATUS.PendienteAprobacion:
                                if (full.GrupoStatusId == AprobacionCotizacionListarJerarquia.APROBACION_STATUS.PendienteAprobacion) {
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
        AprobacionCotizacionListarJerarquia.$TABLA.draw("page");
    }
}