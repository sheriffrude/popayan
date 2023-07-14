/**
 * Variables globales
 */
var $TABLA_PRESUPUESTO_GENERAL_GRUPO = null;
var $FORM_FILTRO_TABLA_GRUPO = null;
var GRUPO_ID = null;

/**
 * Onload page
 */
$(function () {
    $FORM_FILTRO_TABLA_GRUPO = $("#form-filtro-tabla-grupo");
    $FORM_FILTRO_TABLA_GRUPO.on("submit", RecargarTablaPresupuestoGeneralGrupo);

    ConstruirTablaPresupuestoGeneralGrupo();
});

/**
 * Filtrar tabla presupuesto general grupo
 * @returns {boolean} 
 */
function RecargarTablaPresupuestoGeneralGrupo() {
    if ($TABLA_PRESUPUESTO_GENERAL_GRUPO != null)
        $TABLA_PRESUPUESTO_GENERAL_GRUPO.draw();
    return false;
}

/**
 * Construye tabla de grupos
 */
function ConstruirTablaPresupuestoGeneralGrupo() {
    var $filtro = $FORM_FILTRO_TABLA_GRUPO.find("input[type=search]");
    $TABLA_PRESUPUESTO_GENERAL_GRUPO = $("#tabla-presupuesto-general-grupo").DataTable({
        "ajax": {
            "url": URL_LISTAR_PRESUPUESTO_GENERAL_GRUPO,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {
                    }
                });
            }
        },
        "columns": [
            { "data": "Nombre" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_EDITAR_PRESUPUESTO_GENERAL_GRUPO)
                        ? '<a href="' + URL_EDITAR_PRESUPUESTO_GENERAL_GRUPO + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-info btn-sm" >Editar</a>'
                        : "";
                }
            },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_ELIMINAR_PRESUPUESTO_GENERAL_GRUPO)
                        ? '<button onclick="ConfirmarEliminarGrupo(' + data + ')" class="btn btn-danger btn-sm " >ELIMINAR</button>'
                        : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}

function ConfirmarEliminarGrupo(id) {
    GRUPO_ID = id;
    Utils._BuilderConfirmation('Eliminar Grupo', '¿Realmente desea eliminar el grupo?', 'EliminarGrupo');
}

/**
 * Eliminar grupo
 * @param {int} id 
 */
function EliminarGrupo() {
    var parameters = {
        id: GRUPO_ID
    };
    $.ajax({
        url: URL_ELIMINAR_PRESUPUESTO_GENERAL_GRUPO,
        type: "POST",
        dataType: "json",
        data: parameters,
        complete: function (response) {
            var resultado = RequestHttp._ValidateResponse(response);
            if (resultado != null) {
                var tipoMensaje = "danger";
                if (resultado.state == true) {
                    tipoMensaje = "success";
                    RecargarTablaPresupuestoGeneralGrupo();
                    RecargarTablaPresupuestoItem();
                }
                Utils._BuilderMessage(tipoMensaje, resultado.message);
            }
        },
        error: function(request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });
}