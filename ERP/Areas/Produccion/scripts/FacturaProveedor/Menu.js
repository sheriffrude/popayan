/*
*VARIABLES GLOBALES
*/
var $TABLA_ITEM_ORDEN_COMPRA_FACTURA = null;
var $TABLA_ASOCIADO_ORDEN_COMPRA_FACTURA = null;
var $TABLA_FACTURA = null;
var $TABLA_ANTICIPO_FACTURA = null;
var ORDEN_COMPRA = null;
var ORDEN_COMPRA_CONSULTADA = null;
var VOLUMEN = null;
var asociadoId = null;
var FACTURA_ID = 0;
var $TABLA_FACTURAS_RADICADAS = null;

var formatNumber = {
    separador: ",", // separador para los miles
    sepDecimal: '.', // separador para los decimales
    formatear: function (num) {
        num += '';
        var splitStr = num.split(',');
        var splitLeft = splitStr[0];
        var splitRight = splitStr.length > 1 ? this.sepDecimal + splitStr[1] : '';
        var regx = /(\d+)(\d{3})/;
        while (regx.test(splitLeft)) {
            splitLeft = splitLeft.replace(regx, '$1' + this.separador + '$2');
        }
        return this.simbol + splitLeft + splitRight;
    },
    new: function (num, simbol) {
        this.simbol = simbol || '';
        return this.formatear(num);
    }
}

/**
* OnLoad
*/
$(function () {
    $("#nav-tabs-facturacion a").on("click", function () { OnClickTab(this) });
});

/**
*Funcion para consultar la OC 
*/
function ConsultarOrdenCompra() {

    ORDEN_COMPRA = $("#numero-oc").val();

    if (ORDEN_COMPRA === "") {
        Utils._BuilderMessage("warning", "Debe ingresar el número de la Orden de compra");
        return true;
    }
    var $empresa = $("#empresa");
    var $cliente = $("#cliente");
    var $ordenTrabajo = $("#orden-trabajo");
    var $ordenTrabajoDescripcion = $("#descripcion-orden-trabajo");
    var $numeroPresupuesto = $("#numero-presupuesto");
    var $numeroPresupuestoCliente = $("#numero-presupuesto-cliente");
    var $fechaRadicacion = $("#fecha-radicacion");
    var $numeroOrden = $("#numero-orden");
    var $proveedor = $("#proveedor");
    var $nitProveedor = $("#nit-proveedor");
    var $telefonoProveedor = $("#telefono-proveedor");
    var $subtotal = $("#subtotal");
    var $impuesto = $("#iva");
    var $volumen = $("#volumen");
    var $total = $("#total");
    var $referencia = $("#referencia");

    var parameters = {
        id: ORDEN_COMPRA
    };


    RequestHttp._Post(URL_CONSULTAR_ORDEN_COMPRA_FACTURA, parameters, null, function (data) {
        if (data.data == null) {
            Utils._BuilderMessage('info', 'Esta OC no existe.');
            return true;
        }

        if (data.data == "Cancelada" || data.data == "Facturada pendiente por aprobar" || data.data == "Facturada" || data.data == "Pagada") {
            Utils._BuilderMessage('info', 'Esta OC está en estado: ' + data.data);
            return true;
        }

        var tipoMensaje = (data.state == true) ? "sucess" : "danger";
        Utils._BuilderMessage(tipoMensaje, data.message);

        ORDEN_COMPRA_CONSULTADA = data.data.NumeroOrdenCompra;
        $empresa.val(data.data.Empresa);
        $cliente.val(data.data.Cliente);
        $referencia.val(data.data.Referencia);
        $ordenTrabajo.val(data.data.OrdenTrabajo);
        $ordenTrabajoDescripcion.val(data.data.DescripcionOrdenTrabajo);
        $numeroPresupuesto.val(data.data.NumeroPresupuesto);
        $numeroPresupuestoCliente.val(data.data.NumeroPresupuestoCliente);
        $fechaRadicacion.val(data.data.FechaRadicacion);
        $numeroOrden.val(ORDEN_COMPRA_CONSULTADA);
        $proveedor.val(data.data.Proveedor);
        $nitProveedor.val(data.data.NitProveedor);
        $telefonoProveedor.val(data.data.TelefonoProveedor);
        $subtotal.val(formatNumber.new(data.data.Subtotal));
        $impuesto.val(formatNumber.new(data.data.Impuesto));
        $total.val(formatNumber.new(data.data.Total));
        $volumen.val(formatNumber.new(data.data.Volumen));

        VOLUMEN = data.data.Volumen;
        FACTURA_ID = data.data.FacturaId;

        if ($TABLA_ITEM_ORDEN_COMPRA_FACTURA != null) {
            $TABLA_ITEM_ORDEN_COMPRA_FACTURA.draw();
        } else {
            CrearTablaItemsOrdenCompra();
        }
        if ($TABLA_ASOCIADO_ORDEN_COMPRA_FACTURA != null) {
            $TABLA_ASOCIADO_ORDEN_COMPRA_FACTURA.draw();
        }

        $("#orden-compra-factura").removeClass('hidden');

        if (FACTURA_ID > 0) {
            if (!$("#button-registrar-factura").hasClass('hidden')) {
                $("#button-registrar-factura").addClass('hidden');
            }
            $("#button-cancelar-factura").removeClass('hidden');
            $("#factura").removeClass('hidden');
            if ($TABLA_FACTURA != null) {
                $TABLA_FACTURA.draw();
            } else {
                CrearTablaFactura();
            }
        } else {
            if (!$("#button-cancelar-factura").hasClass('hidden')) {
                $("#button-cancelar-factura").addClass('hidden');
            }
            $("#button-registrar-factura").removeClass('hidden');
            $("#factura").addClass('hidden');

        }

        if ($TABLA_ANTICIPO_FACTURA != null) {
            $TABLA_ANTICIPO_FACTURA.draw();
        } else {
            CrearTablaAnticipoFactura();
        }

    })
}

/*
*Funcion para utilizar las funciones javascript de cada tab
*/
function OnClickTab(e) {
    var tab = $(e).attr("data-number-tab");
    if (tab == 2) {
        OnloadEnviarDocumento();
    } else {
        if (tab == 3) {
            OnloadRevisarDocumento();
        }
    }
}

/**
*Funcion para crear tabla de los items 
*/
function CrearTablaItemsOrdenCompra() {

    $TABLA_ITEM_ORDEN_COMPRA_FACTURA = $("#tabla-item-orden-compra-factura").DataTable({
        "scrollY": "200px",
        "scrollCollapse": true,
        "ajax": {
            "url": URL_CONSULTAR_ITEM_ORDEN_COMPRA_FACTURA,
            "type": "POST",
            "data": function (d) {
                d.id = ORDEN_COMPRA,
                    d.volumen = VOLUMEN

                return $.extend({}, d, {
                    "adicional": {
                    }
                });
            }
        },
        "columns": [
            { "data": "DescripcionInterna" },
            { "data": "Dias" },
            { "data": "Cantidad" },
            {
                "data": "ValorUnitarioInterno",
                "render": function (data, type, full, meta) {

                    itemId = full.Id;
                    var ValorUnitarioInterno = '<div widt="5%"><input type="text" data-format-price class="form-control" value="' + data + '" readonly></div>'
                    return ValorUnitarioInterno;
                }
            },
            {
                "data": "SubTotalInterno",
                "render": function (data, type, full, meta) {
                    var costoItem = '<div widt="5%" data-item-orden-compra="' + itemId + '"><input type="text" class="form-control" data-format-price name="costoItem" value="' + data + '" size="7"  readonly></div>'
                    return costoItem;
                }
            },
            {
                "data": "ValorImpuestoInterno",
                "render": function (data, type, full, meta) {
                    var costoItem = '<div widt="5%" data-item-orden-compra="' + itemId + '"><input type="text" class="form-control" data-format-price name="costoItem" value="' + data + '" size="7"  readonly></div>'
                    return costoItem;
                }
            },
            {
                "data": "Total",
                "render": function (data, type, full, meta) {
                    var costoItem = '<div widt="5%" data-item-orden-compra="' + itemId + '"><input type="text" class="form-control" data-format-price name="costoItem" value="' + data + '" size="7"  readonly></div>'
                    return costoItem;
                }
            }

        ],
        "drawCallback": function (settings) {
            Utils._InputFormatPrice();
        }
    });
}

/**
*Funcion para crear tabla de la factura
*/
function CrearTablaFactura() {
    $TABLA_FACTURA = $("#tabla-factura").DataTable({
        "info": false,
        "pag": false,
        "ajax": {
            "url": URL_CONSULTAR_FACTURA,
            "type": "POST",
            "data": function (d) {
                d.id = FACTURA_ID
                return $.extend({}, d, {
                    "adicional": {
                    }
                });
            }
        },
        "columns": [
            { "data": "Usuario" },
            { "data": "FechaHora" },
            { "data": "TipoDocumento" },
            { "data": "NumeroDocumento" },
            {
                "data": "ValorDocumento",
                "render": function (data, type, full, meta) {
                    itemId = full.Id;
                    var ValorUnitarioInterno = '<div widt="5%"><input type="text" data-format-price class="form-control" value="' + data + '" readonly></div>'
                    return ValorUnitarioInterno;
                }
            },
            {
                "data": "ImpuestoDocumento",
                "render": function (data, type, full, meta) {
                    var costoItem = '<div widt="5%" data-item-orden-compra="' + itemId + '"><input type="text" class="form-control" data-format-price name="costoItem" value="' + data + '" size="7"  readonly></div>'
                    return costoItem;
                }
            },
            {
                "data": "ValorTotalDocumento",
                "render": function (data, type, full, meta) {
                    var costoItem = '<div widt="5%" data-item-orden-compra="' + itemId + '"><input type="text" class="form-control" data-format-price name="costoItem" value="' + data + '" size="7"  readonly></div>'
                    return costoItem;
                }
            }

        ],
        "drawCallback": function (settings) {
            Utils._InputFormatPrice();
        }
    });
}

/**
* Funcion para crear tabla de la factura
*/
function CrearTablaAnticipoFactura() {
    $TABLA_ANTICIPO_FACTURA = $("#tabla-anticipo-factura").DataTable({
        "info": false,
        "pag": false,
        "language": {
            "emptyTable": "No se encontraron Anticipos"
        },
        "ajax": {
            "url": URL_CONSULTAR_ANTICIPO_FACTURA,
            "type": "POST",
            "data": function (d) {
                //d.search['value'] = $filtro.val();
                d.id = ORDEN_COMPRA
                return $.extend({}, d, {
                    "adicional": {
                    }
                });
            }
        },
        "columns": [
            { "data": "NumeroAnticipo" },
            { "data": "FechaSolicitud" },
            { "data": "Usuario" }

        ],
        "drawCallback": function (settings) {
            MostrarTablaAnticipos();
        }
    });
}

/**
* Funcion para quitar la propiedad que oculta la tabla de anticipos
*/
function MostrarTablaAnticipos() {
    $("#anticipo-factura").removeClass('hidden');

}

/**
* Ver historico de ordenes
*/
function VerImpuestoOrdenCompra() {
    var id = ORDEN_COMPRA;
    URL_CONSULTAR_IMPUESTOS_ORDEN_COMPRA_FACTURAS = '';
    URL_CONSULTAR_IMPUESTOS_ORDEN_COMPRA_FACTURAS = URL_CONSULTAR_IMPUESTOS_ORDEN_COMPRA_FACTURA + "/" + id
    Utils._OpenModal(URL_CONSULTAR_IMPUESTOS_ORDEN_COMPRA_FACTURAS, 'impuestoOrdenCompra');
}

/**
* Registrar factura
*/
function RegistrarFactura() {
    var id = ORDEN_COMPRA;
    URL_REGISTRAR_FACTURAS = '';
    URL_REGISTRAR_FACTURAS = URL_REGISTRAR_FACTURA + "/" + id
    Utils._OpenModal(URL_REGISTRAR_FACTURAS, 'CrearFactura', 'all');
    CargarFacturasProveedor()
}

/**
* Cancelar factura
*/
function CancelarFactura(idFactura, idOrdenCompra) {
    FACTURA_ID = idFactura.value;
    ORDEN_COMPRA_CONSULTADA = idOrdenCompra;
    Utils._BuilderConfirmation('CANCELAR FACTURA', '¿Está seguro que desea realizar esta acción?', 'CancelarFacturas', RecargarTabla);
}

function RecargarTabla() {
    $TABLA_FACTURAS_RADICADAS.draw();
}

function CancelarFacturas() {
    if (ORDEN_COMPRA_CONSULTADA > 0 && FACTURA_ID > 0) {
        var parameters = {
            id: ORDEN_COMPRA_CONSULTADA,
            factura: FACTURA_ID
        };

        RequestHttp._Post(URL_CANCELAR_FACTURA, parameters, null, function (data) {

            if (data != null) {
                if (data.state == true) {
                    var tipoMensaje = (data.state == true) ? "success" : "danger";
                    Utils._BuilderMessage(tipoMensaje, data.message);
                } else {
                    var tipoMensaje = (data.state == true) ? "success" : "danger";
                    Utils._BuilderMessage(tipoMensaje, data.message);
                }
            }
        })
    }
}

/**
* Listar tabla facturas radicadas proveedor 
**/
function CargarFacturasProveedor() {

    var $filtro = $("#texto");
    $TABLA_FACTURAS_RADICADAS = $("#tabla-facturas-proveedor").DataTable(
        {
        "scrollX": true,
        "bDestroy": true,
        "ajax": {
            "url": URL_LISTAR_FACTURA,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = $filtro.val();
                d.estadoId = $("#TipoCierreId").val();
                d.grupoId = $("#GrupoId").val();
            }
        },
        "columns": [
            {
                "data": "OrdenCompra",
                "width": "10%",
                "render": function (data, type, full, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { "data": "OrdenCompra" },
            { "data": "Factura" },
            { "data": "Empresa" },
            { "data": "Cliente" },
            { "data": "OrdenTrabajo" },
            { "data": "ReferenciaOrdenTrabajo" },
            { "data": "NumeroPresupuesto" },
            { "data": "VersionPresupuestoInterno" },
            { "data": "VersionPresupuestoExterno" },
            { "data": "Proveedor" },
            { "data": "NitProveedor" },
            {
                "data": "Subtotal",
                "orderable": false,
                "searchable": false,
                "width": "20%",
            },
            {
                "data": "TotalImpuestos",
                "orderable": false,
                "searchable": false,
                "width": "20%",
            },
            {
                "data": "Total",
                "orderable": false,
                "searchable": false,
                "width": "20%",
            },
            { "data": "Estado" },
            { "data": "UsuarioRegistro" },
            {
                "data": "OrdenCompra", // Solicitar aprobación factura
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    var html = "";             
                    if (PERMISO_APROBACION_FACTURA_PROVEEDOR) {
                        if (data != null) {
                            if (full.Estado == "Registrada") {
                                html = '<a href="' + URL_APROBACION_FACTURA_PROVEEDOR_LISTAR + '?id=' + full.NumeroPresupuesto + '&facturaProveedorId=' + full.Id + '"  data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" > <i class="fa fa-share-square-o" aria-hidden="true"></i> Solicitar aprobación</a>'
                            }
                        }
                    }
                    return html;
                }
            },
            {
                "data": "Estado",
                "orderable": false,
                "width": "10%",
                "render": function (data, type, full, meta) {
                    var resultado = "";

                    if (data == "Registrada" || data == "Rechazada" || data == "Aprobada") {
                        //Estado: Registrado
                        var checked = "checked";
                        resultado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-persona" onchange="CancelarFactura(this' + ',' + full.OrdenCompra + ' )" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + full.Id + '">';

                    } else if (data == "Cancelada") {
                        //Estado: Finalizada
                        resultado = "";
                        resultado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-persona" onchange="CancelarFactura(this' + ',' + full.OrdenCompra + ' )" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + full.Id + '">';
                    } else {
                        //Estado: Otros estados
                        resultado = "";
                    }
                    return resultado;
                }
            },
            {
                "data": "OrdenCompra",
                "orderable": false,
                "searchable": false,
                "width": "10%",
                "render": function (data, type, full, meta) {
                    return '<input type="button" class="btn btn-secondary" value="Ver detalle" Onclick="DetalleFacturasProveedor(' + data + ')" >';
                }
            }

        ],
        "order": [[1, "desc"]],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
            $(".boton-desactivar-persona").bootstrapToggle({
                on: '',
                off: ''
            });
        }
    });

}

function LimpiarRegistroFactura() {
    $("#orden-compra-factura").addClass('hidden');
}

/**
* Mostrar el detalle de la factura del proveedor 
**/
function DetalleFacturasProveedor(id) {
    Utils._OpenModal(URL_DETALLE_FACTURA_PROVEEDOR + "?ordenCompraId=" + id, "OnLoadDetalleFactura", "lg");
}

function OnLoadDetalleFactura() {
    ORDEN_COMPRA = $("#OrdenCompra").val();
    VOLUMEN = $("#Volumen").val();
    CrearTablaItemsOrdenCompraFactura();
}

/**
*Funcion para crear tabla de los items 
*/
function CrearTablaItemsOrdenCompraFactura() {

    $TABLA_ITEM_ORDEN_COMPRA_FACTURA = $("#tabla_item_orden_compra_factura").DataTable({
        "scrollY": "200px",
        "scrollCollapse": true,
        "ajax": {
            "url": URL_CONSULTAR_ITEM_ORDEN_COMPRA_FACTURA,
            "type": "POST",
            "data": function (d) {
                d.id = ORDEN_COMPRA,
                    d.volumen = VOLUMEN

                return $.extend({}, d, {
                    "adicional": {
                    }
                });
            }
        },
        "columns": [
            { "data": "DescripcionInterna" },
            { "data": "Dias" },
            { "data": "Cantidad" },
            {
                "data": "ValorUnitarioInterno",
                "render": function (data, type, full, meta) {
                    itemId = full.Id;
                    var ValorUnitarioInterno = '<div widt="5%"><input type="text" data-format-price class="form-control" value="' + data + '" readonly></div>'
                    return ValorUnitarioInterno;
                }
            },
            {
                "data": "SubTotalInterno",
                "render": function (data, type, full, meta) {
                    var costoItem = '<div widt="5%" data-item-orden-compra="' + itemId + '"><input type="text" class="form-control" data-format-price name="costoItem" value="' + data + '" size="7"  readonly></div>'
                    return costoItem;
                }
            },
            {
                "data": "ValorImpuestoInterno",
                "render": function (data, type, full, meta) {
                    var costoItem = '<div widt="5%" data-item-orden-compra="' + itemId + '"><input type="text" class="form-control" data-format-price name="costoItem" value="' + data + '" size="7"  readonly></div>'
                    return costoItem;
                }
            },
            {
                "data": "Total",
                "render": function (data, type, full, meta) {
                    var costoItem = '<div widt="5%" data-item-orden-compra="' + itemId + '"><input type="text" class="form-control" data-format-price name="costoItem" value="' + data + '" size="7"  readonly></div>'
                    return costoItem;
                }
            }

        ],
        "drawCallback": function (settings) {
            Utils._InputFormatPrice();
        }
    });
}

