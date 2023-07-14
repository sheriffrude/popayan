/**
 * Variables globales
 */
var $TABLA_EMPRESA_DOCUMENTO_LEGAL = null;
var $FORM_FILTRO_TABLA_EMPRESA_DOCUMENTO_LEGAL = null;
var FILTRO_PROVEEDOR = 0;
var PROVEEDOR_DOCUMENTO_LEGAL = [];


function FiltrarTablaEmpresaProveedorContacto() {

    if ($TABLA_EMPRESA_PROVEEDOR_CONTACTO != null) {
        $TABLA_EMPRESA_PROVEEDOR_CONTACTO.draw();
    }
    return false;
}

//Onload page
$(function () {

    $FORM_FILTRO_TABLA_EMPRESA_DOCUMENTO_LEGAL = $("#form-filtro-tabla-documento-legal");

    $FORM_FILTRO_TABLA_EMPRESA_DOCUMENTO_LEGAL.on("submit", FiltrarTablaEmpresaProveedorContacto);

    ConstruirTablaProveedorContacto();
    //$("#form-filtro-tabla").submit(FiltrarTablaEmpresaProveedorContacto);
});

function ConstruirTablaProveedorContacto() {

    var $filtro = $FORM_FILTRO_TABLA_EMPRESA_DOCUMENTO_LEGAL.find("input[type=search]");
    $TABLA_EMPRESA_PROVEEDOR_CONTACTO = $("#tabla-empresa-proveedor-contacto").DataTable({
        "ajax": {
            "url": URL_EMPRESA_PROVEEDOR_CONTACTO,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {
                        proveedorId: FILTRO_PROVEEDOR
                    }
                });
            }
        },
        "columns": [
            { "data": "Nombre" },
            { "data": "Cargos" },
            { "data": "Correo" },
            {
                "data": "Telefonos",
                "render": function (data, type, full, meta) {
                    var html = "";
                    if (data != null) {
                        var telefonos = data.split(",");
                        var tamanoTelefonos = telefonos.length;
                        for (var i = 0; i < tamanoTelefonos; i++) {
                            html += telefonos[i] + "<br/>";
                        }
                    }
                    return html;
                }
            },
            {
                "data": "Celulares",
                "render": function (data, type, full, meta) {
                    var html = "";
                    if (data != null) {
                        var celulares = data.split(",");
                        var tamanoCelulares = celulares.length;
                        for (var i = 0; i < tamanoCelulares; i++) {
                            html += celulares[i] + "<br/>";
                        }
                    }
                    return html;
                }
            },
            { "data": "Proveedor" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "20%",
                "render": function (data, type, full, meta) {
                    var botonEditar = '<a href="' + URL_EMPRESA_PROVEEDOR_CONTACTO_EDITAR + '?id=' + data + '" class="btn btn-secondary" >Editar</a>'

                    var resultado = ""
                    resultado += (PERMISO_EDITAR_EMPRESA_PROVEEDOR) ? botonEditar : "";

                    return resultado;
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}


function OnChangeProveedor(e) {
    var id = $(e).val();
    if (typeof id === "undefined" || id === "") {
        id = 0;

    }
    FILTRO_PROVEEDOR = id;

    if ($TABLA_EMPRESA_PROVEEDOR_CONTACTO != null) {
        $TABLA_EMPRESA_PROVEEDOR_CONTACTO.draw();
    }
}

