var tablaDocumentos = null;

var ListarDocumentosLegalesClientes = function () {
    return {

        urlListar: "",
        urlAgregar: "",
        urlEditar: "",
        clienteId: null,

        //Carga inicial que recibe las url de cada CRUD
        init: function (listar) {
            ListarDocumentosLegalesClientes.construirTabla();
            ListarDocumentosLegalesClientes.clienteId = 0;
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
            tablaDocumentos = $("#tabla-documentos").DataTable({
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
                    { "data": "Cliente" },
                    { "data": "Nit" },
                    { "data": "TipoDocumento" },
                    {
                        "data": "DocumentoId",
                        "orderable": false,
                        "searchable": false,
                        "render": function (data, type, full, meta) {
                            return '<a href="' + urlDescargar + '?id=' + data + '" class="btn btn-success">' +
                                '<span class="glyphicon glyphicon-download-alt" aria-hidden="true"></span> Descargar' +
                                '</a>';
                        }
                    },
                    {
                        "data": "Id",
                        "orderable": false,
                        "searchable": false,
                        "width": "5%",
                        "render": function (data, type, full, meta) {
                            return '<a onclick="ListarDocumentosLegalesClientes.eliminarDocumento(' + data + ')" class="btn btn-danger btn-sm" >Eliminar</a>';
                        }
                    }
                ],
                "drawCallback": function (settings) {
                    Utils._BuilderModal();
                }
            });
        },

        eliminarDocumento: function (id) {
            ListarDocumentosLegalesClientes.clienteId = id;
            Utils._BuilderConfirmation("Eliminar", "¿Desea eliminar el documento seleccionado? ", "ListarDocumentosLegalesClientes.eliminarDocumentoCliente", "", id );
        },

        eliminarDocumentoCliente: function (id) {
            $.ajax({

                url: urlEliminacion,
                async: false,
                data: { id: ListarDocumentosLegalesClientes.clienteId },
                type: "POST",
                dataType: "json",
                success: function (result) {
                    if (result.state) {
                        Utils._BuilderMessage("success", result.message);
                        ListarDocumentosLegalesClientes.reconstruirTabla();
                    } else {
                        Utils._BuilderMessage("danger", result.message);
                    }
                },
                error: function(request, status, error) {
                    Utils._BuilderMessage("danger", error);

                }
            });
        }
    }
}();

$(function () {
    ListarDocumentosLegalesClientes.init();
});

