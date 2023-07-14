var tablaItems = null;

var ListarItems = function () {
    return {

        urlListar: "",
        urlAgregar: "",
        urlEditar: "",

        //Carga inicial que recibe las url de cada CRUD
        init: function (listar) {
            ListarItems.construirTabla();
        },

        reconstruirTabla: function () {
            tablaItems.draw();
        },

        ResetearTablaPais: function () {
            $("#input-filtro").val("");
            this.reconstruirTabla();
        },

        //Construye la tabla de salarios integrales
        construirTabla: function () {
            var filtro = $("#input-filtro");
            tablaItems = $("#tabla-Contactos").DataTable({
                "ajax": {
                    "url": urlListar,
                    "type": "POST",
                    "data": function (d) {
                        d.search['value'] = filtro.val();
                        return $.extend({}, d, {
                            "adicional": {}
                        });
                    },

                }, "columns": [
                    { "data": "GrupoTarifario" },
                    { "data": "Nombre" },
                    { "data": "ValorUnitario" },
                    { "data": "RangoCantidad" },                    
                    {
                        "data": "Id",
                        "orderable": false,
                        "searchable": false,
                        "width": "5%",
                        "render": function (data, type, full, meta) {
                            var checked = (full.Estado == true) ? "checked" : "";
                            return '<input type="checkbox" ' + checked + ' class="boton-desactivar-cliente" onchange="ListarItems.desactivarItemTarifario(this)" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + data + '">'
                        }
                    },
                    {
                        "data": "Id",
                        "orderable": false,
                        "searchable": false,
                        "width": "12%",
                        "render": function (data, type, full, meta) {
                            var botonDocumento = '<a href="' + urlEditar + '?id=' + data + '" class="btn btn-secondary" data-toggle="modal" data-target="#">Editar</a>'
                            var resultado = botonDocumento;

                            return resultado;
                        }
                    }
                ],
                "drawCallback": function (settings) {
                    Utils._BuilderModal();
                }
            });
        },

        desactivarItemTarifario: function (e) {            
            var estado = ($(e).is(":checked") == true);
            var id = $(e).val();
            var parameters = {
                Id: id,
                Estado: estado
            };

            RequestHttp._Post(urlEstado, parameters, null, function (data) {
                if (!Validations._IsNull(data)) {
                    var tipoMensaje = "danger";
                    if (data.state) {
                        tipoMensaje = "success";
                        ListarItems.reconstruirTabla();
                    }
                    Utils._BuilderMessage(tipoMensaje, data.message);
                }
            });            
        }
    }
}();

$(function () {
    ListarItems.init();
});


