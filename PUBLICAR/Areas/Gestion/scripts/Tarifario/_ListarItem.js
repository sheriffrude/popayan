/**
 * Variables globales
 */
var $TABLA_TARIFARIO_ITEM = null;
var $FORM_FILTRO_TABLA_ITEM = null;


/**
 * Onload page
 */
$(function () {

    $FORM_FILTRO_TABLA_ITEM = $("#form-filtro-tabla-item");

    $FORM_FILTRO_TABLA_ITEM.on("submit", FiltrarTablaTarifarioItem);

    ConstruirTablaTarifarioItem();
   

});

/**
 * Filtrar tabla tarifario item
 * @returns {boolean} 
 */
function FiltrarTablaTarifarioItem() {
    if ($TABLA_TARIFARIO_ITEM != null) {
        $TABLA_TARIFARIO_ITEM.draw();
    }
    return false;
}

/**
 * Construye tabla de item
 */
function ConstruirTablaTarifarioItem() {
    var $filtro = $FORM_FILTRO_TABLA_ITEM.find("input[type=search]");
    $TABLA_TARIFARIO_ITEM = $("#tabla-tarifario-item").DataTable({
        "ajax": {
            "url": URL_LISTAR_TARIFARIO_ITEM,
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
            { "data": "NombreGrupo" },
            { "data": "SubNombre" },
            { "data": "Item" },
            { "data": "Tarifas" },
            { "data": "Impuesto" },
            { "data": "Valor" },
            { "data": "Volumen" },
            { "data": "DescuentosAdicionales" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "20%",
                "render": function (data, type, full, meta) {

                    var botonEditar = '<a href="' + URL_EDITAR_TARIFARIO_ITEM + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-info btn-sm" >Editar</a>'
                    var botonEliminar = '<button onclick="EliminarItem(' + data + ')" class="btn btn-danger btn-sm " >ELIMINAR</button>'
                    var resultado = ""
                    resultado += (PERMISO_EDITAR_TARIFARIO_ITEM) ? botonEditar : "";
                    resultado += (PERMISO_ELIMINAR_TARIFARIO_ITEM) ? botonEliminar : "";
                    return resultado;
                }


            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}


/**
 * Eliminar item
 * @param {int} id 
 */
function EliminarItem(id) {
    var parameters = {
        id: id
    };

    $.ajax({
        url: URL_ELIMINAR_TARIFARIO_ITEM,
        type: "POST",
        dataType: "json",
        data: parameters,
        success: function (data, text) {
            if ($TABLA_TARIFARIO_ITEM != null) {
                $TABLA_TARIFARIO_ITEM.draw();
            }
        },
        error: function(request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });
}