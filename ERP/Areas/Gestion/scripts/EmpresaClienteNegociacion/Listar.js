$(function () {
    ListarEmpresaClienteNegociacion.OnLoad();
});

var ListarEmpresaClienteNegociacion = {
    $TABLA: null,
    EMPRESA_ID: null,
    OnLoad: function (listar) {
        ListarEmpresaClienteNegociacion.EMPRESA_ID = $("#EmpresaId").val();
        ListarEmpresaClienteNegociacion.CrearTabla(ListarEmpresaClienteNegociacion.EMPRESA_ID);

        $("#form-filtro-tabla").submit(ListarEmpresaClienteNegociacion.RecargarTabla);
    },
    RecargarTabla: function () {
        ListarEmpresaClienteNegociacion.$TABLA.draw();
        return false;
    },
    RecargarTablaPage: function () {
        ListarEmpresaClienteNegociacion.$TABLA.draw("page");
        return false;
    },
    ResetearTabla: function () {
        $("#input-filtro").val("");
        this.RecargarTabla();
    },
    CrearTabla: function (empresaId) {
        var filtro = $("#input-filtro");
        ListarEmpresaClienteNegociacion.$TABLA = $("#tabla_negociaciones").DataTable({
            "ajax": {
                "url": URL_EMPRESA_CLIENTE_NEGOCIACION_LISTAR,
                "type": "POST",
                "data": function (d) {
                    d.search['value'] = filtro.val();
                    d.empresaId = empresaId;
                    return $.extend({}, d, {
                        "adicional": {}
                    });
                },

            }, "columns": [
                { "data": "Cliente" },
                { "data": "TipoRegimen" },
                { "data": "TipoComision" },
                { "data": "ValorComision" },
                {
                    "data": "Autoretenedor",
                    "render": function (data, type, full, meta) {
                        return (data == 1) ? "Si" : "No";
                    }
                },
                { "data": "DiaCierreFacturacion" },
                { "data": "PlazoPago" },
                {
                    "data": "Impuestos",
                    "orderable": false,
                    "searchable": false,
                    "width": "5%",
                    "render": function (data, type, full, meta) {
                        var html = "";
                        for (var i = 0; i < data.length; i++) {
                            html += '<span class="label label-default">' + data[i] +'</span><br/>';
                        }
                        return html;
                    }
                },
                //{
                //    "data": "Id",
                //    "orderable": false,
                //    "searchable": false,
                //    "width": "5%",
                //    "render": function (data, type, full, meta) {
                //        return (PERMISO_EMPRESA_CLIENTE_NEGOCIACION_EDITAR)
                //            ? '<a href="' + URL_EDITAR_PAIS + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                //            : "";
                //    }
                //},
                {
                    "data": "Estado",
                    "searchable": false,
                    "width": "5%",
                    "render": function (data, type, full, meta) {
                        var disabled = (!PERMISO_EMPRESA_CLIENTE_NEGOCIACION_EDITAR) ? 'disabled="disabled"' : '';
                        var checked = (data == 1) ? 'checked="checked"' : '';
                        return '<div class="text-center">' +
                            '<input type="checkbox" ' + disabled + ' ' + checked + ' class="btn_cambiar_estado" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" data-size="mini" value="' + full.Id + '"  onchange="ListarEmpresaClienteNegociacion.CambiarEstado(this)">' +
                            '</div>';
                    }
                }
            ],
            "drawCallback": function (settings) {
                //RadioBotones Comisionable y Mandato
                $(".btn_cambiar_estado").bootstrapToggle({
                    on: '',
                    off: ''
                });
                Utils._BuilderModal();
            }
        });
    },
    CambiarEstado: function (e) {
        var estado = ($(e).is(":checked"));
        var id = $(e).val();
        var parametros = {
            estado: estado,
            id: id
        };
        RequestHttp._Post(URL_EMPRESA_CLIENTE_NEGOCIACION_CAMBIAR_ESTADO, parametros, null, function (response) {
            if (!Validations._IsNull(response)) {
                if (response.state) {
                    Utils._BuilderMessage("success", response.message);
                    ListarEmpresaClienteNegociacion.RecargarTablaPage();
                } else
                    Utils._BuilderMessage("danger", response.message);
            }
        });
    }
}