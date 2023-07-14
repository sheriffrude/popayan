/**
 * Variables globales
 */
var $TABLA_PRESUPUESTO_GENERAL_ITEM = null;
var $FORM_FILTRO_TABLA_ITEM = null;
var ITEM_ID = null;

/**
 * Onload page
 */
$(function () {
    $FORM_FILTRO_TABLA_ITEM = $("#form-filtro-tabla-item");
    $FORM_FILTRO_TABLA_ITEM.on("submit", RecargarTablaPresupuestoItem);

    ConstruirTablaPresupuestoGeneralItem();
});

/**
 * Filtrar tabla item
 * @returns {boolean} 
 */
function RecargarTablaPresupuestoItem() {
    if ($TABLA_PRESUPUESTO_GENERAL_ITEM != null) 
        $TABLA_PRESUPUESTO_GENERAL_ITEM.draw();
    return false;
}

/**
 * Construye tabla de item
 */
function ConstruirTablaPresupuestoGeneralItem() {
    var $filtro = $FORM_FILTRO_TABLA_ITEM.find("input[type=search]");
    $TABLA_PRESUPUESTO_GENERAL_ITEM = $("#tabla-presupuesto-general-item").DataTable({
        "ajax": {
            "url": URL_LISTAR_PRESUPUESTO_GENERAL_ITEM,
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
            { "data": "Grupo" },
            { "data": "Nombre" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_EDITAR_PRESUPUESTO_GENERAL_ITEM)
                        ? '<a href="' + URL_EDITAR_PRESUPUESTO_GENERAL_ITEM + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-info btn-sm" >Editar</a>' 
                        : "";
                }
            },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_ELIMINAR_PRESUPUESTO_GENERAL_ITEM)
                        ? '<button onclick="ConfirmarEliminarItem(' + data + ')" class="btn btn-danger btn-sm" >ELIMINAR</button>'
                        : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}

function ConfirmarEliminarItem(id) {
    ITEM_ID = id;
    Utils._BuilderConfirmation('Eliminar Item', '¿Realmente desea eliminar el Item?', 'EliminarItem');
}

/**
 * Eliminar
 * @param {int} id 
 */
function EliminarItem() {
    var parameters = {
        id: ITEM_ID
    };
    $.ajax({
        url: URL_ELIMINAR_PRESUPUESTO_GENERAL_ITEM,
        type: "POST",
        dataType: "json",
        data: parameters,
        complete: function (response) {
            var resultado = RequestHttp._ValidateResponse(response);
            if (resultado != null) {
                var tipoMensaje = "danger";
                if (resultado.state == true) {
                    tipoMensaje = "success";
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