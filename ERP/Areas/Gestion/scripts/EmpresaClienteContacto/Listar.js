/**
 * Variables globales
 */
var TABLA_EMPRESA_CLIENTE_CONTACTO = null;
var $FORM_FILTRO_TABLA_EMPRESA_CLIENTE_CONTACTO = null;
var $FORM_FILTRO_TABLA_EMPRESA_DOCUMENTO_LEGAL = null;
var FILTRO_CLIENTE = 0;

//Onload page
$(function () {
    $FORM_FILTRO_TABLA_EMPRESA_CLIENTE_CONTACTO = $("#form-filtro-tabla");
    $("#form-filtro-tabla")[0].reset();
    $FORM_FILTRO_TABLA_EMPRESA_CLIENTE_CONTACTO.on("submit", FiltrarTablaEmpresaClienteContacto);
    ConstruirTablaClienteContacto();
});

function FiltrarTablaEmpresaClienteContacto() {
    if ($TABLA_EMPRESA_CLIENTE_CONTACTO != null) {
        $TABLA_EMPRESA_CLIENTE_CONTACTO.draw();
    }
    return false;
}

function ConstruirTablaClienteContacto() {
    var $filtro = $FORM_FILTRO_TABLA_EMPRESA_CLIENTE_CONTACTO.find("input[type=search]");
    $TABLA_EMPRESA_CLIENTE_CONTACTO = $("#tabla-empresa-cliente-contacto").DataTable({
        "ajax": {
            "url": URL_EMPRESA_CLIENTE,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = $filtro.val();
                d.clienteId = FILTRO_CLIENTE;
                return $.extend({}, d, {
                    "adicional": {}
                });
            }
        },
        "columns": [
            { "data": "Cliente" },
            { "data": "NombreCompleto" },
            { "data": "Cargo" },
            { "data": "Correo" },
            { "data": "Telefono" },
            { "data": "Celular" },
            {
                "data": "Mes",
                "render": function (data, type, full, meta) {
                    return moment.months(data - 1);
                }
            },
            { "data": "Dia" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_EMPRESA_CLIENTE_CONTACTO_EDITAR) ?
                        '<a href="' + URL_EMPRESA_CLIENTE_CONTACTO_EDITAR + '/' + data + '" class="btn btn-secondary btn-sm" data-toggle="modal" data-target="#" >Editar</a>'
                        : "";
                }
            },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var checked = (full.Estado == true) ? "checked" : "";
                    return '<input type="checkbox" ' + checked + ' class="boton-desactivar" onchange="CambiarEstado(this)" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" data-size="mini" value="' + data + '">'
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
            $(".boton-desactivar").bootstrapToggle({
                on: '',
                off: ''
            });
        }
    });
}

function OnChangeCliente(e) {
    var id = $(e).val();
    if (typeof id === "undefined" || id === "") {
        id = 0;
    }
    FILTRO_CLIENTE = id;

    if ($TABLA_EMPRESA_CLIENTE_CONTACTO != null) {
        $TABLA_EMPRESA_CLIENTE_CONTACTO.draw();
    }
}

/**
 * Cambiar estado
 * @param {int} id 
 */
function CambiarEstado(e) {
    var estado = ($(e).is(":checked") == true);
    var id = $(e).val();
    var parameters = {
        Id: id,
        Estado: estado
    };

    RequestHttp._Post(URL_EMPRESA_CLIENTE_CONTACTO_CAMBIAR_ESTADO, parameters, null, function (data) {
        if (!Validations._IsNull(data)) {
            var tipoMensaje = "danger";
            if (data.state) {
                tipoMensaje = "success";
                FiltrarTablaEmpresaClienteContacto();
            }
            Utils._BuilderMessage(tipoMensaje, data.message);
        }
    });
}