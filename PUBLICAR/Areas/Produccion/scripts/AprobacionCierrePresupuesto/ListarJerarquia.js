var AprobacionCierrePresupuestoListarJerarquia = {
    $TABLA: null,
    PRESUPUESTO_ID: null,
    APROBACION_STATUS: {
        PendienteAprobacion: 1,
        Aprobado: 2,
        Rechazado: 3
    },
    Onload: function () {
        AprobacionCierrePresupuestoListarJerarquia.PRESUPUESTO_ID = $("#PresupuestoId").val();
        AprobacionCierrePresupuestoListarJerarquia.CrearTabla();
    },
    CrearTabla: function () {
        AprobacionCierrePresupuestoListarJerarquia.$TABLA = $("#tabla_jerarquia_aprobacion").DataTable({
            "ajax": {
                "url": URL_JERARQUIA_APROBACION_PRESUPUESTO_LISTAR,
                "type": "POST",
                "data": function (d) {
                    d.presupuestoId = AprobacionCierrePresupuestoListarJerarquia.PRESUPUESTO_ID;
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
                            case AprobacionCierrePresupuestoListarJerarquia.APROBACION_STATUS.Aprobado:
                                html = "Aprobado";
                                break;
                            case AprobacionCierrePresupuestoListarJerarquia.APROBACION_STATUS.Rechazado:
                                html = "Rechazado"
                                break;
                            case AprobacionCierrePresupuestoListarJerarquia.APROBACION_STATUS.PendienteAprobacion:
                                if (full.GrupoStatusId == AprobacionCierrePresupuestoListarJerarquia.APROBACION_STATUS.PendienteAprobacion) {
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
        AprobacionCierrePresupuestoListarJerarquia.$TABLA.draw("page");
    }
}