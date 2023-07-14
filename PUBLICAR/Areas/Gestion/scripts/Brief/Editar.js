///Variables globales
var $TABLA_PREGUNTAS = null;
var PREGUNTA_ID = 0;

//Onload page
$(function () {
    ConstruirTablaPreguntas()
});

/**
 * Construir Tabla Preguntas
 */
function ConstruirTablaPreguntas() {
    var $filtro = $("#input-filtro");
    $TABLA_PREGUNTAS = $("#tabla-preguntas").DataTable({
        "ajax": {
            "url": URL_LISTAR_PREGUNTAS,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            },
        }, "columns": [
            { "data": "Pregunta" },
            { "data": "Tipo" },
            {
                "data": "Obligatorio",
                "render": function (data, type, full, meta) {
                    return (data) ? "Si" : "No";
                }
            },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var html = '<a href="' + URL_EDITAR_PREGUNTA + '?id=' + data + '"  data-toggle="modal" data-target="#" class="btn btn-info btn-sm"  data-execute-onload="OnLoadEditarPregunta" >Editar</a>';
                    return html;
                }
            },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var html = '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="ConfirmarEliminarPregunta(' + data + ')" />';
                    return html;
                }
            },
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}

/**
 * Recargar Tabla
 */
function RecargarTabla() {
    if ($TABLA_PREGUNTAS != null)
        $TABLA_PREGUNTAS.draw();
}

/**
 * ConfirmarEliminarPregunta
 * @param {any} id
 */
function ConfirmarEliminarPregunta(id) {
    PREGUNTA_ID = id;
    Utils._BuilderConfirmation("Eliminar Pregunta", "¿Esta seguro de eliminar la pregunta?", "EliminarPregunta");
}

/**
 * Eliminar Pregunta
 * @param {any} id
 */
function EliminarPregunta(id) {
    var parameters = {
        id: PREGUNTA_ID
    };
    RequestHttp._Post(URL_ELIMINAR_PREGUNTA, parameters, null, function (data) {
        if (data != null) {
            tipoMensaje = (data.state == true) ? "sucess" : "danger";
            Utils._BuilderMessage(tipoMensaje, data.message);
            RecargarTabla();
        }
    })
}

/**
 * OnCompleteEditarBrief
 * @param {any} response
 */
function OnCompleteEditarBrief(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        if (resultado.state == true) {
            Utils._BuilderMessage("success", resultado.message, 'RedireccionarListarBriefs');
        } else {
            Utils._BuilderMessage("danger", resultado.message);
        }
    }
}

/**
 * Redireccionar Listar Briefs
 */
function RedireccionarListarBriefs() {
    window.location.href = URL_LISTAR_BRIEF;
}