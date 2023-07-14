var tablaDocumentos = null;

var ListarProveedores = function () {
    return {

        urlListar: "",
        urlAgregar: "",
        urlEditar: "",

        //Carga inicial que recibe las url de cada CRUD
        init: function (listar) {
            ListarProveedores.construirTabla();
        },

        reconstruirTabla: function () {
            tablaDocumentos.draw();
        },

        ResetearTablaPais: function () {
            $("#input-filtro").val("");
            this.reconstruirTabla();
        },

        //Construye la tabla de salarios integrales
        construirTabla: function () {
            var filtro = $("#input-filtro");
            tablaDocumentos = $("#tabla-proveedor").DataTable({
                "ajax": {
                    "url": URL_LISTAR_PROVEEDOR,
                    "type": "POST",
                    "data": function (d) {
                        d.search['value'] = filtro.val();
                        return $.extend({}, d, {
                            "adicional": {
                            }
                        });
                    }
                },
                "columns": [
                    { "data": "Nit" },
                    { "data": "NombreComercial" },
                    { "data": "Direccion" },
                    { "data": "Telefono" },
                    { "data": "Correo" },
                    {
                        "data": "Id",
                        "orderable": false,
                        "searchable": false,
                        "width": "20%",
                        "render": function (data, type, full, meta) {
                            return '<a class="btn" href="' + urlVerItem + '?id=' + data + '">Ver tarifarios </a>';

                        }
                    }
                ]
            });
        },

        CambiarEstadoProveedor: function (e) {
            var estado = ($(e).is(":checked") == true);
            var id = $(e).val();
            var parameters = {
                id: id,
                estado: estado
            };

            $.ajax({
                url: URL_CAMBIAR_ESTADO_PROVEEDOR,
                type: "POST",
                dataType: "json",
                data: parameters,
                success: function (data, text) {
                    ListarProveedores.reconstruirTabla();
                },
                error: function(request, status, error) {
                    Utils._BuilderMessage("danger", error);
                }
            });
        }
    }
}();

$(function () {
    ListarProveedores.init();
});