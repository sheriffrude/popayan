$(function () {
    EmpresaPresupuestoClasificacionListar.OnLoad();
});

var EmpresaPresupuestoClasificacionListar = {
    $TABLA: null,
    EMPRESA_ID: null,
    OnLoad: function () {
        EmpresaPresupuestoClasificacionListar.EMPRESA_ID = $("#EmpresaId").val();
        EmpresaPresupuestoClasificacionListar.CrearTabla(EmpresaPresupuestoClasificacionListar.EMPRESA_ID);
    },
    CrearTabla: function (empresaId) {
        EmpresaPresupuestoClasificacionListar.$TABLA = $("#tabla_empresa_presupuesto_clasificaciones").DataTable({
            "ajax": {
                "url": URL_EMPRESA_PRESUPUESTO_CLASIFICACION_LISTAR,
                "type": "POST",
                "data": function (d) {
                    //d.search["value"] = $filtro.val();
                    d.empresaId = empresaId;
                    return $.extend({}, d, {
                        "adicional": {}
                    });
                }
            },
            "columns": [
                { "data": "Clasificacion" },
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "width": "5%",
                    "render": function (data, type, full, meta) {
                        return (PERMISO_EMPRESA_PRESUPUESTO_CLASIFICACION_ELIMINAR)
                            ? '<button type="button" class="btn btn-danger btn-sm" onclick="EmpresaPresupuestoClasificacionListar.ConfirmarEliminar(' + data + ')" >Eliminar</button>'
                            : "";
                    }
                }
            ]
        });
    },
    RecargarTabla: function () {
        if (EmpresaPresupuestoClasificacionListar.$TABLA != null)
            EmpresaPresupuestoClasificacionListar.$TABLA.draw();
    },
    ConfirmarEliminar: function (id) {
        Utils._BuilderConfirmation("Eliminar Tipo", "¿Esta seguro de eliminar el tipo?", EmpresaPresupuestoClasificacionListar.Eliminar, null, id);
    },
    Eliminar: function (id) {
        var url = URL_EMPRESA_PRESUPUESTO_CLASIFICACION_ELIMINAR;
        var parametros = {
            id: id
        };
        RequestHttp._Post(url, parametros, null, function (response) {
            if (!Validations._IsNull(response)) {
                if (response.state) {
                    Utils._BuilderMessage("success", response.message);
                    EmpresaPresupuestoClasificacionListar.RecargarTabla();
                } else {
                    Utils._BuilderMessage("danger", response.message);
                }
            }
        });
    }
};