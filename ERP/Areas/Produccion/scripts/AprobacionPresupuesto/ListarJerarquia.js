var AprobacionPresupuestoListarJerarquia = {
    $TABLA: null,
    PRESUPUESTO_ID: null,
    APROBACION_STATUS: {
        PendienteAprobacion: 1,
        Aprobado: 2,
        Rechazado: 3
    },
    Onload: function () {
        AprobacionPresupuestoListarJerarquia.PRESUPUESTO_ID = $("#PresupuestoId").val();
        AprobacionPresupuestoListarJerarquia.CrearTabla();
    },
    CrearTabla: function () {
        AprobacionPresupuestoListarJerarquia.$TABLA = $("#tabla_jerarquia_aprobacion").DataTable({
            "ajax": {
                "url": URL_JERARQUIA_APROBACION_PRESUPUESTO_LISTAR,
                "type": "POST",
                "data": function (d) {
                    d.presupuestoId = AprobacionPresupuestoListarJerarquia.PRESUPUESTO_ID;
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
                            case AprobacionPresupuestoListarJerarquia.APROBACION_STATUS.Aprobado:
                                html = "Aprobado";
                                break;
                            case AprobacionPresupuestoListarJerarquia.APROBACION_STATUS.Rechazado:
                                html = "Rechazado"
                                break;
                            case AprobacionPresupuestoListarJerarquia.APROBACION_STATUS.PendienteAprobacion:
                                if (full.GrupoStatusId == AprobacionPresupuestoListarJerarquia.APROBACION_STATUS.PendienteAprobacion) {
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
        AprobacionPresupuestoListarJerarquia.$TABLA.draw("page");
    }
}