var AprobacionAnticipoListarJerarquia = {
    $TABLA: null,
    ANTICIPO_ID: null,
    APROBACION_STATUS: {
        PendienteAprobacion: 1,
        Aprobado: 2,
        Rechazado: 3
    },
    Onload: function () {
        AprobacionAnticipoListarJerarquia.ANTICIPO_ID = $("#AnticipoId").val();
        AprobacionAnticipoListarJerarquia.CrearTabla();
    },
    CrearTabla: function () {

        AprobacionAnticipoListarJerarquia.$TABLA = $("#tabla_jerarquia_aprobacion").DataTable({
            "ajax": {
                "url": URL_JERARQUIA_APROBACION_ANTICIPO_LISTAR,
                "type": "POST",
                "data": function (d) {
                    d.anticipoId = AprobacionAnticipoListarJerarquia.ANTICIPO_ID;
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
                            case AprobacionAnticipoListarJerarquia.APROBACION_STATUS.Aprobado:
                                html = "Aprobado";
                                break;
                            case AprobacionAnticipoListarJerarquia.APROBACION_STATUS.Rechazado:
                                html = "Rechazado"
                                break;
                            case AprobacionAnticipoListarJerarquia.APROBACION_STATUS.PendienteAprobacion:
                                if (full.GrupoStatusId == AprobacionAnticipoListarJerarquia.APROBACION_STATUS.PendienteAprobacion) {
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
        AprobacionAnticipoListarJerarquia.$TABLA.draw("page");
    }
}