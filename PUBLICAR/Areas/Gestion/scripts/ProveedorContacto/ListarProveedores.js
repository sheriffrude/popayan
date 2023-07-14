var tablaClientes = null;

var ListarClientes = function () {
    return {

        urlListar: "",
        urlAgregar: "",
        urlEditar: "",

        //Carga inicial que recibe las url de cada CRUD
        init: function (listar) {
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
            tablaClientes = $("#tabla-Proveedores").DataTable({
                "ajax": {
                    "url": urlListar,
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
                    { "data": "Correo" },
                    {
                        "data": "Id",
                        "orderable": false,
                        "searchable": false,
                        "width": "20%",
                        "render": function (data, type, full, meta) {
                            return '<a href="' + urlContactos + '?id=' + data + '" class="btn btn-secondary" >CONTACTOS</a>';

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


