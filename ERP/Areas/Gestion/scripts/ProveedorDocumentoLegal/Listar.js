var tablaDocumentos = null;

var ListarDocumentosLegalesProveedores = function () {
    return {

        urlListar: "",
        urlAgregar: "",
        urlEditar: "",

        //Carga inicial que recibe las url de cada CRUD
        init: function (listar) {
            ListarDocumentosLegalesProveedores.construirTabla();
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
            tablaDocumentos = $("#tabla-proveedor-documento-legal").DataTable({
                "ajax": {
                    "url": URL_LISTAR_PROVEEDOR_DOCUMENTO_LEGAL,
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
                    { "data": "NombreProveedor" },
                    { "data": "NombreDocumentoLegal" },
                    {
                        "data": "DocumentoId",
                        "orderable": false,
                        "searchable": false,
                        "render": function (data, type, full, meta) {
                            return '<a href="' + URL_DESCARGAR_PROVEEDOR_DOCUMENTO_LEGAL + '?id=' + data + '" title="Descargar">' +
                                '<img src="/Content/images/Gestion/boton-descargar.png" alt="Descargar" />' +
                                '</a>';
                        }
                    },
                    {
                        "data": "Id",
                        "orderable": false,
                        "searchable": false,
                        "width": "5%",
                        "render": function (data, type, full, meta) {
                            return '<a onclick="ListarDocumentosLegalesProveedores.eliminarDocumento(' + data + ')" class="btn btn-danger btn-sm" >Eliminar</a>';
                        }
                    }
                ],
                "drawCallback": function (settings) {
                    Utils._BuilderModal();
                }
            });
        },

        eliminarDocumento: function (id) {
            Utils._BuilderConfirmation("Eliminar", "¿Desea eliminar el documento seleccionado? ", eliminarDocumentoCliente, "", id);
        }
    }
}();

$(function () {
    ListarDocumentosLegalesProveedores.init();
});

function eliminarDocumentoCliente(id) {

    $.ajax({
        url: urlEliminarArchivo,
        async: false,
        data: { id: id },
        type: "POST",
        dataType: "json",
        success: function (result) {
            if (result.state) {
                Utils._BuilderMessage("success", result.message);
                ListarDocumentosLegalesProveedores.reconstruirTabla();
            } else {
                Utils._BuilderMessage("danger", result.message);
            }
        },
        error: function(request, status, error) {
            Utils._BuilderMessage("danger", error);

        }
    });
}