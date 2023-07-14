/**
 * Variables globales
 */
var $TABLA_EMPLEADO_DOCUMENTO = null;

/**
 * Onload page
 */
$(function () {
    ConstruirTablaDocumentos();
    $("#form-filtro-tabla").submit(RecargarTablaDocumentos);
});

/**
 * Filtrar tabla documento legal
 * @returns {boolean} 
 */
function RecargarTablaDocumentos() {
    if ($TABLA_EMPLEADO_DOCUMENTO != null) {
        $TABLA_EMPLEADO_DOCUMENTO.draw();
    }
    return false;
}


/**
 * Construye tabla de documento legal
 */
function ConstruirTablaDocumentos() {
    var $filtro = $("#filtro-doc-legal-emp");
    $TABLA_EMPLEADO_DOCUMENTO = $("#tabla-empleado-documentos").DataTable({
        "ajax": {
            "url": URL_LISTAR_EMPLEADO_DOCUMENTO,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            }
        },
        "columns": [
            { "data": "Nombre" },
            { "data": "TipoDocumento" },
            { "data": "Estado" },
            {
                "data": "DocumentoId",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var botones = "";
                    botones += (PERMISO_DESCARGAR_EMPLEADO_DOCUMENTO) ? '<a href="' + URL_DESCARGAR_EMPLEADO_DOCUMENTO + '?id=' + data + '" title="Descargar">' +
                        '<img src="/Content/images/Gestion/boton-descargar.png" alt="Descargar" />' +
                        '</a>'
                        : ""; return botones;
                }
            },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var botones = "";
                    botones += (PERMISO_EDITAR_EMPLEADO_DOCUMENTO) ? '<a href="' + URL_EDITAR_EMPLEADO_DOCUMENTO + '?id='+data+'" class="btn btn-info" >Editar</a>' : "";
                    return botones;
                }
            },
            //{
            //    "data": "Id",
            //    "orderable": false,
            //    "searchable": false,
            //    "width": "5%",
            //    "render": function (data, type, full, meta) {
            //        return (PERMISO_ELIMINAR_EMPLEADO_DOCUMENTO)
            //         ? '<a href="#" onclick="EliminarDocumento(' + data + ')" class="btn btn-danger btn-sm" >Eliminar</a>'
            //        : "";
            //    }
            //}
        ],
        "drawCallback": function (settings) {
        }
    });
}


/**
 * Eliminar documento
 * @param {int} id 
 */
function EliminarDocumento(id) {
    var parameters = {
        id: id
    };

    $.ajax({
        url: URL_ELIMINAR_EMPLEADO_DOCUMENTO,
        type: "POST",
        dataType: "json",
        data: parameters,
        success: function (resultado, text) {
            if (resultado.state == true)
                Utils._BuilderMessage("success", resultado.message);
            else
                Utils._BuilderMessage("danger", resultado.message);
            RecargarTablaDocumentos();
        },
        error: function(request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });
    return false;
}