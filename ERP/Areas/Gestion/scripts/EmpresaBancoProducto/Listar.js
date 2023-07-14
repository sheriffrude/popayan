/// <reference path="~/Bower/bower_components/datatables.net/js/jquery.dataTables.js" />
/// <reference path="~/scripts/site.js" />
/// <reference path="~/Areas/Gestion/Views/BancoProducto/Listar.cshtml" />

//Variable Globales
var $TABLA_BANCO_PRODUCTO = null;

/**
 * Onload page
 */
$(function () {
    ConstruirTablaBancoProducto();
    $("#form-filtro-tabla").submit(RecargarTablaBancoProducto);
});

/**
 * Function para filtrar la tabla BancoProducto
 * @returns {boolean} false
 */
function RecargarTablaBancoProducto() {
    if ($TABLA_BANCO_PRODUCTO != null) {
        $TABLA_BANCO_PRODUCTO.draw();
    }
    return false;
}

/**
 * Funcion para construir la tabla BancoProducto
 */
function ConstruirTablaBancoProducto() {
    var $filtro = $("#input-filtro");
    $TABLA_BANCO_PRODUCTO = $("#tabla-banco-producto").DataTable({
        "scrollX": true,
        "ajax": {
            "url": URL_EMPRESA_BANCO_PRODUCTO_LISTAR,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            }
        },
        "columns": [
            { "data": "NumeroCuenta", },
            { "data": "Nombre" },
            { "data": "Tipo" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "20%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_EMPRESA_BANCO_PRODUCTO_EDITAR)
                        ? '<a href="' + URL_EMPRESA_BANCO_PRODUCTO_EDITAR + '?id=' + data + '" class="btn btn-info btn-sm" data-toggle="modal" data-target="#" >Editar</a>'
                        : "";
                }
            },
            {
                "data": "Estado",
                "orderable": false,
                "searchable": false,
                "width": "20%",
                "render": function (data, type, full, meta) {
                    var checked = (data == true) ? "checked" : "";
                    var botonEstado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-producto" onchange="CambiarEstadoProducto(this)" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + full.Id + '">'

                    var resultado = ""
                    resultado += (PERMISO_EMPRESA_BANCO_PRODUCTO_EDITAR) ? botonEstado : "";
                    return resultado;
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
            $(".boton-desactivar-producto").bootstrapToggle({
                on: '',
                off: ''
            });
        }
    });
}

/**
 * Funcion para cambiar el estado.
 * @param {Object} element.
 */
function CambiarEstadoProducto(e) {
    var estado = ($(e).is(":checked") == true);
    var id = $(e).val();
    var parameters = {
        id: id,
        estado: estado
    };

    $.ajax({
        url: URL_EMPRESA_BANCO_PRODUCTO_CAMBIAR_ESTADO,
        type: "POST",
        dataType: "json",
        data: parameters,
        success: function (data, text) {
            var tipoMensaje = (data.state == false) ? "danger" : "success";
            Utils._BuilderMessage(tipoMensaje, data.message);
        },
        error: function(request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });
}