$(function () {
    EmpresaPresupuestoTipoListar.OnLoad();
});

var EmpresaPresupuestoTipoListar = {
    $TABLA: null,
    EMPRESA_ID: null,
    OnLoad: function () {
        EmpresaPresupuestoTipoListar.EMPRESA_ID = $("#EmpresaId").val();
        EmpresaPresupuestoTipoListar.CrearTabla(EmpresaPresupuestoTipoListar.EMPRESA_ID);
    },
    CrearTabla: function (empresaId) {
        EmpresaPresupuestoTipoListar.$TABLA = $("#tabla_empresa_presupuesto_tipos").DataTable({
            "ajax": {
                "url": URL_EMPRESA_PRESUPUESTO_TIPO_LISTAR,
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
                { "data": "Tipo" },
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "width": "5%",
                    "render": function (data, type, full, meta) {
                        return (PERMISO_EMPRESA_PRESUPUESTO_TIPO_ELIMINAR)
                            ? '<button type="button" class="btn btn-danger btn-sm" onclick="EmpresaPresupuestoTipoListar.ConfirmarEliminar(' + data + ')" >Eliminar</button>'
                            : "";
                    }
                }
            ]
        });
    },
    RecargarTabla: function () {
        if (EmpresaPresupuestoTipoListar.$TABLA != null)
            EmpresaPresupuestoTipoListar.$TABLA.draw();
    },
    ConfirmarEliminar: function (id) {
        Utils._BuilderConfirmation("Eliminar Tipo", "¿Esta seguro de eliminar el tipo?", EmpresaPresupuestoTipoListar.Eliminar, null, id);
    },
    Eliminar: function (id) {
        var url = URL_EMPRESA_PRESUPUESTO_TIPO_ELIMINAR;
        var parametros = {
            id: id
        };
        RequestHttp._Post(url, parametros, null, function (response) {
            if (!Validations._IsNull(response)) {
                if (response.state) {
                    Utils._BuilderMessage("success", response.message);
                    EmpresaPresupuestoTipoListar.RecargarTabla();
                } else {
                    Utils._BuilderMessage("danger", response.message);
                }
            }
        });
    }
};