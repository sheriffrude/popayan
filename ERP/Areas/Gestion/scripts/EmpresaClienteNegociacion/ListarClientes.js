var tablaClientes = null;

var ListarClientes = function () {
    return {

        //Carga inicial que recibe las url de cada CRUD
        init: function () {
            ListarClientes.construirTabla();
        },

        reconstruirTabla: function () {
            tablaClientes.draw();
        },

        ResetearTablaPais: function () {
            $("#input-filtro").val("");
            this.reconstruirTabla();
        },

        //Construye la tabla de salarios integrales
        construirTabla: function () {
            var filtro = $("#input-filtro");
            tablaClientes = $("#tabla-Clientes").DataTable({
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
                    { "data": "Nit" },
                    {
                        "data": "NombreComercial"
                    },
                    { "data": "Telefonos" },
                    { "data": "Direccion" },
                    { "data": "Ciudad" },
                    {
                        "data": "Id",
                        "orderable": false,
                        "searchable": false,
                        "width": "12%",
                        "render": function (data, type, full, meta) {

                            var botonDocumento = '<a href="' + urlNegociaciones + '?id=' + data + '" class="btn btn-secondary" >Negociaciones</a>'
                            var resultado = botonDocumento;

                            return resultado;
                        }
                    }
                ]
            });
        }
    }
}();

$(function () {
    ListarClientes.init();
});


