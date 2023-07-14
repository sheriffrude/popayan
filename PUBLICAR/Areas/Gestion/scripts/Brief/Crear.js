/**
 * Variables Globales
 */
var DATA_PREGUNTAS = [];
var $TABLA_PREGUNTAS = null;

/**
 * Onload Page
 */
$(function () {
    CrearTablaPreguntas();
});

/**
 * Crear tabla preguntas
 * @returns {} 
 */
function CrearTablaPreguntas() {
    $TABLA_PREGUNTAS = $("#tabla-preguntas").dataTable({
        "destroy": true,
        "serverSide": false,
        "data": DATA_PREGUNTAS,
        "columns": [
            {
                "data": "Nombre",
                "orderable": false,
            },
            {
                "data": "Descripcion",
                "orderable": false,
            },
            {
                "data": "TipoPregunta",
                "orderable": false,
                "render": function (data, type, full, meta) {
                    var resultado = "";
                    switch (data) {
                        case "1": resultado = "Abierta";
                            break;
                        case "2": resultado = "Respuesta única";
                            break;
                        case "3": resultado = "Respuesta multiple";
                            break;
                    }
                    return resultado;
                }
            },
            {
                "data": "Obligatorio",
                "orderable": false,
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
                    return '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="EliminarPregunta(' + data + ')" >';
                }
            }
        ]
    });
}

/**
 * Eliminar pregunta
 * @param {int} id 
 * @returns {} 
 */
function EliminarPregunta(id) {
    var longitudDataPreguntas = DATA_PREGUNTAS.length;

    for (var i = 0; longitudDataPreguntas > i; i++) {
        if (DATA_PREGUNTAS[i]["Id"] == id) {
            DATA_PREGUNTAS.splice(i, 1);
            break;
        }
    }

    longitudDataPreguntas = DATA_PREGUNTAS.length;
    for (var i = 0; longitudDataPreguntas > i; i++) {
        DATA_PREGUNTAS[i]["Id"] = i;
    }

    if ($TABLA_PREGUNTAS != null)
        $TABLA_PREGUNTAS.fnDestroy();

    CrearTablaPreguntas();
}

/**
 * OnBeginCrearBrief
 * @param {any} jqXHR
 * @param {any} settings
 */
function OnBeginCrearBrief(jqXHR, settings) {
    if (DATA_PREGUNTAS.length <= 0) {
        Utils._BuilderMessage("danger", "Debe adicionar mínimo una pregunta para continuar.");
        return false;
    }

    var data = $(this).serializeObject();
    data["ListaPreguntas"] = DATA_PREGUNTAS;

    settings.data = jQuery.param(data);
    return true;
}

/**
 * OnCompleteCrearBrief
 * @param {any} result
 */
function OnCompleteCrearBrief(response) {
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