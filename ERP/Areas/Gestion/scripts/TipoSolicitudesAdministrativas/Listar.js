var tablaSolicitudes = null;

var ListarSolicitudesAdministrativas = function () {
    return {

        urlListar: "",
        urlAgregar: "",
        urlEditar: "",

        //Carga inicial que recibe las url de cada CRUD
        init: function (listar) {
            ListarSolicitudesAdministrativas.construirTabla();
        },

        reconstruirTabla: function () {
            tablaSolicitudes.draw();
        },

        ResetearTablaPais: function () {
            $("#input-filtro").val("");
            this.reconstruirTabla();
        },

        //Construye la tabla de salarios integrales
        construirTabla: function () {
            var filtro = $("#input-filtro");
            tablaSolicitudes = $("#tabla-solicitudes").DataTable({
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
                    { "data": "Nombre" },
                    { "data": "DepartamentoTrafico" },
                    { "data": "Estado" },
                    {
                        "data": "Id",
                        "orderable": false,
                        "searchable": false,
                        "width": "5%",
                        "render": function (data, type, full, meta) {
                            return '<a href="' + urlEditar + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>';
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
    ListarSolicitudesAdministrativas.init();
});

