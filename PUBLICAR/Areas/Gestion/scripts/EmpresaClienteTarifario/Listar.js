///Variables globales
var $TABLA_EMPRESA_CLIENTE_TARIFARIO = null;

//Onload page
$(function () {
    ConstruirTablaEmpresaClienteTarifario();
    $("#form-filtro-tabla").submit(FiltrarTablaEmpresaClienteTarifario);

});

/**
*
*/
function FiltrarTablaEmpresaClienteTarifario() {
    if ($TABLA_EMPRESA_CLIENTE_TARIFARIO != null) {
        $TABLA_EMPRESA_CLIENTE_TARIFARIO.draw();
    }
    return false;
}

function ConstruirTablaEmpresaClienteTarifario() {
    var $filtro = $("#input-filtro");
    $TABLA_EMPRESA_CLIENTE_TARIFARIO = $("#tabla-empresa-cliente-tarifario").DataTable({
        "ajax": {
            "url": URL_LISTAR_EMPRESA_CLIENTE_TARIFARIO,
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
                "data": "Tarifa",
                "width": "20%"
            },
            { "data": "NombreComercial" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "20%",
                "render": function (data, type, full, meta) {

                    var botonEditar = '<a href="' + URL_EDITAR_EMPRESA_CLIENTE_TARIFARIO + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-info btn-sm" >Editar</a>'
                    var botonEliminar = '<button onclick="EliminarEmpresaImpuesto(' + data + ')" class="btn btn-danger btn-sm " >ELIMINAR</button>'
                    var resultado = ""
                    resultado += (PERMISO_EDITAR_EMPRESA_CLIENTE_TARIFARIO) ? botonEditar : "";
                    resultado += (PERMISO_ELIMINAR_EMPRESA_CLIENTE_TARIFARIO) ? botonEliminar : "";
                    return resultado;
                }


            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}

function EliminarEmpresaClienteTarifario(id) {
    var parameters = {
        id: id
    };

    $.ajax({
        url: URL_ELIMINAR_EMPRESA_CLIENTE_TARIFARIO,
        type: "POST",
        dataType: "json",
        data: parameters,
        success: function (data, text) {
            if ($TABLA_EMPRESA_CLIENTE_TARIFARIO != null) {
                $TABLA_EMPRESA_CLIENTE_TARIFARIO.draw();
            }
        },
        error: function(request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });
}