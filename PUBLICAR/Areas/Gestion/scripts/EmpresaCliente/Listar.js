///Variables globales
var $TABLA_CLIENTES = null;

//Onload page
$(function () {
    ConstruirTablaClientes();
    $("#form-filtro-tabla").submit(FiltrarTablaClientes);
});

function FiltrarTablaClientes() {

    if ($TABLA_CLIENTES != null) {
        $TABLA_CLIENTES.draw();
    }
    return false;
}

function ConstruirTablaClientes() {
    var $filtro = $("#input-filtro");

    $TABLA_CLIENTES = $("#tabla-Clientes").DataTable({
        "ajax": {
            "url": URL_LISTAR_CLIENTES,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            },
        }, "columns": [
            { "data": "Nit" },
            {
                "data": "NombreComercial",
                "orderable": false,
                "searchable": false,
                "width": "20%",
                "render": function (data, type, full, meta) {
                    var nombre = '';
                    if (PERMISO_CLIENTE_VER)
                        nombre = '<a class="btn btn-secondary" href="' + URL_VER_DETALLE_CLIENTES + '/' + full.Id + '">' + data + '</a>';
                    else
                        nombre = data;
                    return nombre;
                }
            },
            { "data": "Telefonos" },
            { "data": "Direccion" },
            { "data": "Ciudad" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var checked = (full.Estado == true) ? "checked" : "";
                    var botonEstado = '';
                    if (PERMISO_CLIENTE_EDITAR) {
                        botonEstado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-cliente" onchange="CambiarEstadoCliente(this)" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" data-size="mini" value="' + data + '">'
                    }
                    return botonEstado;
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
            $(".boton-desactivar-cliente").bootstrapToggle({
                on: '',
                off: ''
            });
        }
    });
}

/**
 * Cambiar estado  proveedor
 * @param {int} id 
 */
function CambiarEstadoCliente(e) {

    var estado = ($(e).is(":checked") == true);
    var id = $(e).val();
    var parameters = {
        id: id,
        estado: estado
    };

    $.ajax({
        url: URL_CAMBIAR_ESTADO_CLIENTES,
        type: "POST",
        dataType: "json",
        data: parameters,
        success: function (data, text) {
            if ($TABLA_CLIENTES != null) {
                $TABLA_CLIENTES.draw();
            }
        },
        error: function(request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });
}

function reconstruirTabla() {
    $TABLA_CLIENTES.draw();
}

function resetearTabla() {
    $("#input-filtro").val("");
    reconstruirTabla();
}