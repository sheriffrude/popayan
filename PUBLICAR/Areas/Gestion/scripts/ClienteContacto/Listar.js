var tablaContactos = null;

var ListarContactos = function () {
    return {

        urlListar: "",
        urlAgregar: "",
        urlEditar: "",
        FILTRO_EMPRESA: 0,

        //Carga inicial que recibe las url de cada CRUD
        init: function (listar) {
            ListarContactos.FILTRO_EMPRESA = 0
            ListarContactos.construirTabla();
            ListarContactos.URL_EMPRESA_CLIENTE_CONTACTO_EDITAR = '/Gestion/ClienteContacto/Editar';
            $("#form-filtro-tabla").submit(ListarContactos.FiltrarTablaEmpresaClienteContacto);
        },

        reconstruirTabla: function () {
            tablaContactos.draw();
        },

        ResetearTablaPais: function () {
            $("#input-filtro").val("");
            this.reconstruirTabla();
        },

        //Construye la tabla de salarios integrales
        construirTabla: function () {

            var filtro = $("#input-filtro");
            tablaContactos = $("#tabla-Contactos").DataTable({
                "ajax": {
                    "url": urlListar,
                    "type": "POST",
                    "data": function (d) {
                        d.search['value'] = filtro.val();
                        d.empresaId = ListarContactos.FILTRO_EMPRESA;
                        return $.extend({}, d, {
                            "adicional": {}
                        });
                    },

                }, "columns": [
                    { "data": "Empresa" },
                    { "data": "Cliente" },
                    { "data": "NombreCompleto" },
                    { "data": "Cargo" },
                    { "data": "Correo" },
                    { "data": "Telefono" },
                    { "data": "Celular" },
                    {
                        "data": "Mes",
                        "render": function (data, type, full, meta) {
                            return moment.months(data - 1);
                        }
                    },
                    { "data": "Dia" },
                    {
                        "data": "Id",
                        "orderable": false,
                        "searchable": false,
                        "width": "5%",
                        "render": function (data, type, full, meta) {
                            return (PERMISO_EMPRESA_CLIENTE_CONTACTO_EDITAR) ?
                                '<a href="' + ListarContactos.URL_EMPRESA_CLIENTE_CONTACTO_EDITAR + '/' + data + '" class="btn btn-secondary btn-sm" data-toggle="modal" data-target="#" >Editar</a>'
                                : "";
                        }
                    },
                    {
                        "data": "Id",
                        "orderable": false,
                        "searchable": false,
                        "width": "5%",
                        "render": function (data, type, full, meta) {
                            var checked = (full.Estado == true) ? "checked" : "";
                            return '<input type="checkbox" ' + checked + ' class="boton-desactivar" onchange="ListarContactos.CambiarEstado(this)" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" data-size="mini" value="' + data + '">'
                        }
                    }
                ],
                "drawCallback": function (settings) {
                    Utils._BuilderModal();
                    $(".boton-desactivar").bootstrapToggle({
                        on: '',
                        off: ''
                    });
                }
            });
        },

        OnChangeEmpresa: function (e) {

            var id = $(e).val();
            if (typeof id === "undefined" || id === "") {
                id = 0;
            }
            ListarContactos.FILTRO_EMPRESA = id;

            if (tablaContactos != null) {
                tablaContactos.draw();
            }

        },

        /**
         * Cambiar estado
         * @param {int} id 
        */
        CambiarEstado: function (e) {

            var estado = ($(e).is(":checked") == true);
            var id = $(e).val();
            var parameters = {
                Id: id,
                Estado: estado
            };

            RequestHttp._Post(URL_EMPRESA_CLIENTE_CONTACTO_CAMBIAR_ESTADO, parameters, null, function (data) {
                if (!Validations._IsNull(data)) {
                    var tipoMensaje = "danger";
                    if (data.state) {
                        tipoMensaje = "success";
                        ListarContactos.FiltrarTablaEmpresaClienteContacto();
                    }
                    Utils._BuilderMessage(tipoMensaje, data.message);
                }
            });
        },

        FiltrarTablaEmpresaClienteContacto: function () {
            if (tablaContactos != null) {
                tablaContactos.draw();
            }
            return false;
        },

        OnComplete: function (response) {
            var resultado = RequestHttp._ValidateResponse(response);
            if (resultado != null) {
                var tipoMensaje = "danger";
                if (resultado.state == true) {
                    tipoMensaje = "success";
                    ListarContactos.FiltrarTablaEmpresaClienteContacto();
                    Utils._CloseModal();
                }
                Utils._BuilderMessage(tipoMensaje, resultado.message);
            }
        }

    }
}();

$(function () {
    ListarContactos.init();
});


