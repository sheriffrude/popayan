$(function () {
    ListarJerarquiasPresupuesto.OnLoad();
});

var ListarJerarquiasPresupuesto = {
    JERARQUIA_APROBACION_TIPO_ID: null,
    JERARQUIA_APROBACION_TIPOS: {
        Cotizacion: 1,
        PresupuestoInterno: 2,
        CancelacionPresupuesto: 3,
        Legalizacion: 4,
        FacturaProveedor: 5,
        CierrePresupuesto: 6,
        Anticipo: 7
    },
    $TABLA: null,
    OnLoad: function (listar) {
        ListarJerarquiasPresupuesto.JERARQUIA_APROBACION_TIPO_ID = $("#JerarquiaAprobacionTipoId").val();
        ListarJerarquiasPresupuesto.CrearTabla();
    },
    CrearTabla: function () {
        var visualizacionRentabilidad = [];
        if (ListarJerarquiasPresupuesto.JERARQUIA_APROBACION_TIPO_ID != ListarJerarquiasPresupuesto.JERARQUIA_APROBACION_TIPOS.PresupuestoInterno
            && ListarJerarquiasPresupuesto.JERARQUIA_APROBACION_TIPO_ID != ListarJerarquiasPresupuesto.JERARQUIA_APROBACION_TIPOS.Cotizacion
            && ListarJerarquiasPresupuesto.JERARQUIA_APROBACION_TIPO_ID != ListarJerarquiasPresupuesto.JERARQUIA_APROBACION_TIPOS.CancelacionPresupuesto
            && ListarJerarquiasPresupuesto.JERARQUIA_APROBACION_TIPO_ID != ListarJerarquiasPresupuesto.JERARQUIA_APROBACION_TIPOS.CancelacionPresupuesto
            && ListarJerarquiasPresupuesto.JERARQUIA_APROBACION_TIPO_ID != ListarJerarquiasPresupuesto.JERARQUIA_APROBACION_TIPOS.CancelacionPresupuesto
        ) {
            visualizacionRentabilidad = [
                {
                    "targets": [3],
                    "visible": false,
                    "searchable": false
                }
            ];
        }

        var filtro = $("#input-filtro");
        var jerarquiaAprobacionTipoId = $("#JerarquiaAprobacionTipoId").val();

        ListarJerarquiasPresupuesto.$TABLA = $("#tabla_jerarquias").DataTable({
            "ajax": {
                "url": URL_JERARQUIA_APROBACION_LISTAR,
                "type": "POST",
                "data": function (d) {
                    d.search['value'] = filtro.val();
                    d.jerarquiaAprobacionTipoId = jerarquiaAprobacionTipoId;
                    return $.extend({}, d, {
                        "adicional": {}
                    });
                },

            }, "columns": [
                { "data": "Empresa" },
                { "data": "CentroCostos" },
                { "data": "Cliente" },
                {
                    "data": "Rentabilidad",
                    "width": "5%",
                },
                {
                    "data": "Estado",
                    "width": "5%",
                    "render": function (data, type, full, meta) {
                        var checked = (data == true) ? "checked" : "";
                        return '<input type="checkbox" ' + checked + ' class="boton-desactivar-jerarquia-aprobacion" onchange="ListarJerarquiasPresupuesto.CambiarEstado(this)" data-toggle="toggle" data-size="small" data-onstyle="success" data-offstyle="danger" value="' + full.Id + '">'
                    }
                },
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "width": "5%",
                    "render": function (data, type, full, meta) {
                        return '<a href="' + URL_JERARQUIA_APROBACION_EDITAR + '/' + data + '" class="btn btn-secondary btn-sm" >Editar</a>';
                    }
                }
            ],
            "columnDefs": visualizacionRentabilidad,
            "drawCallback": function (settings) {
                Utils._BuilderModal();
                $(".boton-desactivar-jerarquia-aprobacion").bootstrapToggle({
                    on: '',
                    off: ''
                });
            }
        });
    },
    RecargarTablaPage: function () {
        ListarJerarquiasPresupuesto.$TABLA.draw("page");
    },
    ResetearTablaPais: function () {
        $("#input-filtro").val("");
        ListarJerarquiasPresupuesto.RecargarTablaPage();
    },
    CambiarEstado: function (e) {
        var estado = ($(e).is(":checked") == true);
        var id = $(e).val();
        var parameters = {
            Id: id,
            Estado: estado
        };

        RequestHttp._Post(URL_JERARQUIA_APROBACION_CAMBIAR_ESTADO, parameters, null, function (data) {
            if (!Validations._IsNull(data)) {
                if (data.state) {
                    tipoMensaje = "success";
                    Utils._BuilderMessage("sucess", data.message);
                } else {
                    Utils._BuilderMessage("danger", data.message);
                }
                ListarJerarquiasPresupuesto.RecargarTablaPage();
            }
        });
    }
}