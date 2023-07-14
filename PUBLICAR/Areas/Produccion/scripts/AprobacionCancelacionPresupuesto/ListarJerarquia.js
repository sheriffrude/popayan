var AprobacionCancelacionPresupuestoListarJerarquia = {
    $TABLA: null,
    PRESUPUESTO_ID: null,
    APROBACION_STATUS: {
        PendienteAprobacion: 1,
        Aprobado: 2,
        Rechazado: 3
    },
    Onload: function () {
        AprobacionCancelacionPresupuestoListarJerarquia.PRESUPUESTO_ID = $("#PresupuestoId").val();
        AprobacionCancelacionPresupuestoListarJerarquia.CrearTabla();
    },
    CrearTabla: function () {
        AprobacionCancelacionPresupuestoListarJerarquia.$TABLA = $("#tabla_jerarquia_aprobacion").DataTable({
            "ajax": {
                "url": URL_JERARQUIA_APROBACION_PRESUPUESTO_LISTAR,
                "type": "POST",
                "data": function (d) {
                    d.presupuestoId = AprobacionCancelacionPresupuestoListarJerarquia.PRESUPUESTO_ID;
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
                            case AprobacionCancelacionPresupuestoListarJerarquia.APROBACION_STATUS.Aprobado:
                                html = "Aprobado";
                                break;
                            case AprobacionCancelacionPresupuestoListarJerarquia.APROBACION_STATUS.Rechazado:
                                html = "Rechazado"
                                break;
                            case AprobacionCancelacionPresupuestoListarJerarquia.APROBACION_STATUS.PendienteAprobacion:
                                if (full.GrupoStatusId == AprobacionCancelacionPresupuestoListarJerarquia.APROBACION_STATUS.PendienteAprobacion) {
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
        AprobacionCancelacionPresupuestoListarJerarquia.$TABLA.draw("page");
    }
}