var tablaContactos = null;

var ListarContactos = function () {
    return {

        urlListar: "",
        urlAgregar: "",
        urlEditar: "",

        //Carga inicial que recibe las url de cada CRUD
        init: function (listar) {
            ListarContactos.construirTabla();
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
                        return $.extend({}, d, {
                            "adicional": {}
                        });
                    },

                }, "columns": [
                    { "data": "NombreCompleto" },
                    { "data": "Cargo" },
                    { "data": "Correo" },
                    { "data": "Telefono" },
                    { "data": "Celular" },
                    { "data": "DiaCumpleanios" },
                    { "data": "MesCumpleanios" },
                    { "data": "Estado" },
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
        }
    }
}();

$(function () {
    ListarContactos.init();
});


