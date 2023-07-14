/**
 * Variables globales
 */
var $TABLA_EMPRESA_DOCUMENTO_LEGAL = null;
var $FORM_FILTRO_TABLA_EMPRESA_DOCUMENTO_LEGAL = null;
var FILTRO_TIPO_DOCUMENTO_LEGAL = 0;
var EMPRESA_DOCUMENTO_LEGAL = [];

/**
 * Onload page
 */
$(function () {
    $FORM_FILTRO_TABLA_EMPRESA_DOCUMENTO_LEGAL = $("#form-filtro-tabla-documento-legal");

    $FORM_FILTRO_TABLA_EMPRESA_DOCUMENTO_LEGAL.on("submit", FiltrarTablaEmpresaDocumentoLegal);

    ConstruirTablaEmpresaDocumentoLegal();

    $("input[name=filtro-checkbox-tabla]").change(FiltrarTablaPorCheckbox);

});

/**
 * Filtrar tabla documento legal por checkbox
 * @returns {} 
 */
function FiltrarTablaPorCheckbox() {
    var columna = $(this).val();
    if ($TABLA_EMPRESA_DOCUMENTO_LEGAL != null) {
        var column = $TABLA_EMPRESA_DOCUMENTO_LEGAL.column(columna);
        column.visible(!column.visible());
    }
}

/**
 * Filtrar tabla documento legal
 * @returns {boolean} 
 */
function FiltrarTablaEmpresaDocumentoLegal() {
    if ($TABLA_EMPRESA_DOCUMENTO_LEGAL != null) {
        $TABLA_EMPRESA_DOCUMENTO_LEGAL.draw();
    }
    return false;
}


/**
 * Construye tabla de documento legal
 */
function ConstruirTablaEmpresaDocumentoLegal() {
    var $filtro = $FORM_FILTRO_TABLA_EMPRESA_DOCUMENTO_LEGAL.find("input[type=search]");
    $TABLA_EMPRESA_DOCUMENTO_LEGAL = $("#tabla-empresa-impuesto-documento-legal").DataTable({
        "ajax": {
            "url": URL_LISTAR_EMPRESA_DOCUMENTO_LEGAL,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {
                        filtroDocumentoLegal: FILTRO_TIPO_DOCUMENTO_LEGAL
                    }
                });
            }
        },
        "columns": [
            //{
            //    "data": "DocumentoId",
            //    "orderable": false,
            //    "searchable": false,
            //    "render": function (data, type, full, meta) {
            //        //return '<div class="checkbox"><input type="checkbox" value="' + data + '" onchange =  "OnChangeDocumentoLegal(this, ' + data + ',\'' + full.NombreDocumento + '\')" /></div>';
            //        return '<div class="checkbox"><input type="checkbox" data-nombre="\'' + full.NombreDocumento + '\'" value="' + data + '" onchange =  "OnChangeDocumentoLegal(this)" /></div>';
            //    }
            //},
            { "data": "NombreDocumento" },
            { "data": "Nombre" },
            { "data": "FechaVencimiento" },
            {
                "data": "NotificarEmail",
                "render": function (data, type, full, meta) {
                    var html = "";
                    if (data != undefined && data != null) {
                        var emailsArray = data.split(",");
                        var tamanoEmailArray = emailsArray.length;
                        for (var i = 0; i < tamanoEmailArray; i++) {
                            html += emailsArray[i] + "<br/>";
                        }
                    }
                    return html;
                }
            },
            { "data": "Estado" },
            {
                "data": "DocumentoId",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    botonDescargar = '<a href="' + URL_DESCARGAR_EMPRESA_DOCUMENTO_LEGAL + '?id=' + data + '" title="Descargar" class="btn btn-success">' +
                        '<span class="glyphicon glyphicon-download-alt" aria-hidden="true"></span> Descargar' +
                        '</a>'

                    var resultado = ""
                    resultado += (PERMISO_DESCARGAR_EMPRESA_DOCUMENTO_LEGAL) ? botonDescargar : "";
                    return resultado;
                }
            },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var botones = "";
                    botones += (PERMISO_EDITAR_EMPRESA_DOCUMENTO_LEGAL) ? '<a href="' + URL_EDITAR_EMPRESA_DOCUMENTO_LEGAL + '?id=' + data + '" class="btn btn-secondary" >Editar</a>' : "";
                    return botones;
                }
            },
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });

}


/**
 * Cargar documentos en el modal
 * @param {int} id 
 */
function OnChangeDocumentoLegal(e) {
    var id = $(e).val();
    var nombre = $(e).attr("data-nombre");
    if ($(e).is(":checked") === true) {
        EMPRESA_DOCUMENTO_LEGAL.push({
            Id: id,
            Nombre: nombre
        });

    } else {

        var tamanoDataDocumentos = EMPRESA_DOCUMENTO_LEGAL.length;
        for (var i = 0; i < tamanoDataDocumentos; i++) {
            if (EMPRESA_DOCUMENTO_LEGAL[i]["Id"] == id) {
                EMPRESA_DOCUMENTO_LEGAL.splice(i, 1);
            }
            break;
        }
    }

    CrearTablaDocumentos();

};

/**
 * Eliminar documento legal
 * @param {int} id 
 */
function EliminarEmpresaDocumentoLegal(id) {
    var parameters = {
        id: id
    };

    $.ajax({
        url: URL_ELIMINAR_EMPRESA_DOCUMENTO_LEGAL,
        type: "POST",
        dataType: "json",
        data: parameters,
        success: function (data, text) {
            if ($TABLA_EMPRESA_DOCUMENTO_LEGAL != null) {
                $TABLA_EMPRESA_DOCUMENTO_LEGAL.draw();
            }
        },
        error: function(request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });
}

function OnChangeDocumento(e) {
    var id = $(e).val();
    if (typeof id === "undefined" || id === "") {
        id = 0;

    }
    FILTRO_TIPO_DOCUMENTO_LEGAL = id;

    if ($TABLA_EMPRESA_DOCUMENTO_LEGAL != null) {
        $TABLA_EMPRESA_DOCUMENTO_LEGAL.draw();
    }
}