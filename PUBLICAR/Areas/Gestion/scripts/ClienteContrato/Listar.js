var tablaContratos = null;

var ListarContratos = function () {
    return {
        urlListar: "",
        urlAgregar: "",
        urlEditar: "",

        //Carga inicial que recibe las url de cada CRUD
        init: function (listar) {
            ListarContratos.construirTabla();
        },

        reconstruirTabla: function () {
            tablaContratos.draw();
        },

        ResetearTablaPais: function () {
            $("#input-filtro").val("");
            $("#filtroEstados").val("");
            this.reconstruirTabla();
        },

        //Construye la tabla de salarios integrales
        construirTabla: function () {
            var filtro = $("#input-filtro");
            var filtroEstado = $("#filtroEstados");

            tablaContratos = $("#tabla-Contratos").DataTable({
                "ajax": {
                    "url": urlListar,
                    "type": "POST",
                    "data": function (d) {
                        d.search['value'] = filtro.val();
                        return $.extend({}, d, {
                            "adicional": {
                                filtroEstado: filtroEstado.val()
                            }
                        });
                    },

                }, "columns": [
                    { "data": "Nit" },
                    { "data": "Cliente" },
                    { "data": "TipoContrato" },
                    { "data": "Nombre" },
                    { "data": "FechaFirma", "orderable": false, "searchable": false },
                    { "data": "FechaInicio", "orderable": false, "searchable": false },
                    { "data": "FechaFinalizacion", "orderable": false, "searchable": false },
                    { "data": "ValorContrato" },
                    {
                        "data": "DocumentoId",
                        "orderable": false,
                        "searchable": false,
                        "render": function (data, type, full, meta) {
                            return '<a class="btn btn-success" href="' + urlArchivo + '?id=' + data + '" title="Descargar">' +
                                '<span class="glyphicon glyphicon-download-alt" aria-hidden="true"></span> Descargar' +
                                '</a>';
                        }
                    },
                    { "data": "Estado" },
                    {
                        "data": "Id",
                        "orderable": false,
                        "searchable": false,
                        "width": "12%",
                        "render": function (data, type, full, meta) {

                            var botonDocumento = '<a href="' + urlEditar + '&id=' + data + '" class="btn btn-secondary" >Editar</a>'
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
    ListarContratos.init();
});


