/**
 * Variables globales
 */
var $TABLA_EMPRESA_PROVEEDOR = null;
var $FORM_FILTRO_TABLA_EMPRESA_PROVEEDOR = null;

/**
 * Onload page
 */
$(function () {
    $FORM_FILTRO_TABLA_EMPRESA_PROVEEDOR = $("#form-filtro-tabla-empresa-proveedor");
    $FORM_FILTRO_TABLA_EMPRESA_PROVEEDOR.on("submit", FiltrarTablaEmpresaProveedor);

    ConstruirTablaEmpresaProveedor();
});

/**
 * Filtrar tabla proveedores
 * @returns {boolean} 
 */
function FiltrarTablaEmpresaProveedor() {
    if ($TABLA_EMPRESA_PROVEEDOR != null)
        $TABLA_EMPRESA_PROVEEDOR.draw();
    return false;
}

/**
 * Construye tabla de proveedores
 */
function ConstruirTablaEmpresaProveedor() {
    var $filtro = $FORM_FILTRO_TABLA_EMPRESA_PROVEEDOR.find("input[type=search]");
    $TABLA_EMPRESA_PROVEEDOR = $("#tabla-empresa-proveedor").DataTable({
        "ajax": {
            "url": URL_LISTAR_EMPRESA_PROVEEDOR,
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
            { "data": "Nit" },
            {
                "data": "Nombre",
                "orderable": false,
                "searchable": false,
                "width": "20%",
                "render": function (data, type, full, meta) {
                    var botonVer = '<a class="btn btn-secondary" href="' + URL_VER_EMPRESA_PROVEEDOR + '?proveedorId=' + full.ProveedorId + '">' + data + '</a>'
                    return (PERMISO_VER_EMPRESA_PROVEEDOR) ? botonVer : "";
                }
            },
            { "data": "Direccion" },
            { "data": "Telefono" },
            { "data": "Email" },
           {
               "data": "Servicios",
               "orderable": false,
               "searchable": false,
               "width": "12%",
               "render": function (data, type, full, meta) {
                   var cant = data.length;
                    var servicios = '';
                    for (var i = 0; i < cant; i++) {
                        servicios += '<span class="label label-primary">' + data[i]['Nombre'] + '</span> ';
                    }
                    return servicios;
               }

           },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "12%",
                "render": function (data, type, full, meta) {
                    var botonDocumento = '<a href="' + URL_DOCUMENTO_EMPRESA_PROVEEDOR + '&id=' + data + '" class="btn btn-secondary" >DOCUMENTOS</a>'
                    return (PERMISO_DOCUMENTO_EMPRESA_PROVEEDOR) ? botonDocumento : "";
                }

            },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var checked = (full.Estado == true) ? "checked" : "";
                    var botonEstado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-empresa-proveedor" onchange="CambiarEstadoEmpresaProveedor(this)" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + data + '">'
                    return (PERMISO_CAMBIAR_ESTADO_EMPRESA_PROVEEDOR) ? botonEstado : "";
                }
            }

        ],
        "drawCallback": function (settings) {
            $(".boton-desactivar-empresa-proveedor").bootstrapToggle({
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
function CambiarEstadoEmpresaProveedor(e) {
    var estado = ($(e).is(":checked") == true);
    var id = $(e).val();
  
    var parameters = {
        id: id,
        estado: estado
    };
    $.ajax({
        url: URL_CAMBIAR_ESTADO_EMPRESA_PROVEEDOR,
        type: "POST",
        dataType: "json",
        data: parameters,
        success: function (result) {
            var tipoRespuesta = (result.state == true) ? "success" : "danger";
            Utils._BuilderMessage(tipoRespuesta, result.message);
            if ($TABLA_EMPRESA_PROVEEDOR != null) {
                $TABLA_EMPRESA_PROVEEDOR.draw();
            }
        },
        error: function(request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });
}