var AprobacionFacturaProveedorListarJerarquia = {
    $TABLA: null,
    FACTURA_ID: null,
    APROBACION_STATUS: {
        PendienteAprobacion: 1,
        Aprobado: 2,
        Rechazado: 3
    },
    Onload: function () {
        AprobacionFacturaProveedorListarJerarquia.FACTURA_ID = $("#FacturaId").val();
        AprobacionFacturaProveedorListarJerarquia.CrearTabla();
    },
    CrearTabla: function () {

        AprobacionFacturaProveedorListarJerarquia.$TABLA = $("#tabla_jerarquia_aprobacion").DataTable({
            "ajax": {
                "url": URL_JERARQUIA_APROBACION_FACTURA_PROVEEDOR_LISTAR,
                "type": "POST",
                "data": function (d) {
                    d.facturaId = AprobacionFacturaProveedorListarJerarquia.FACTURA_ID;
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
                            case AprobacionFacturaProveedorListarJerarquia.APROBACION_STATUS.Aprobado:
                                html = "Aprobado";
                                break;
                            case AprobacionFacturaProveedorListarJerarquia.APROBACION_STATUS.Rechazado:
                                html = "Rechazado"
                                break;
                            case AprobacionFacturaProveedorListarJerarquia.APROBACION_STATUS.PendienteAprobacion:
                                if (full.GrupoStatusId == AprobacionFacturaProveedorListarJerarquia.APROBACION_STATUS.PendienteAprobacion) {
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
        AprobacionFacturaProveedorListarJerarquia.$TABLA.draw("page");
    }
}