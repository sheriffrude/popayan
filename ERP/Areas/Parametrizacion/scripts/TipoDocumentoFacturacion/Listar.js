var tablaTipos = null;

var tipoDocumentosFacturacion = function () {
    return {

        urlListar: "",
        urlAgregar: "",
        urlEditar: "",

        //Carga inicial que recibe las url de cada CRUD
        init: function (listar) {
            tipoDocumentosFacturacion.construirTabla();
        },

        reconstruirTabla: function () {
            tablaTipos.draw();
        },

        ResetearTablaPais: function () {
            $("#input-filtro").val("");
            this.reconstruirTabla();
        },

        //Construye la tabla de salarios integrales
        construirTabla: function () {
            var filtro = $("#input-filtro");
            tablaTipos = $("#tabla-tipos-documentos").DataTable({
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
                    {
                        "data": "Nombre"
                    },
                    { "data": "Sigla" },
                    { "data": "Estado" },
                    {
                        "data": "Id",
                        "orderable": false,
                        "searchable": false,
                        "width": "5%",
                        "render": function (data, type, full, meta) {
                            return '<a href="' + urlEditar + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-parametrizacion btn-sm" >Editar</a>';
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
    tipoDocumentosFacturacion.init();
});

