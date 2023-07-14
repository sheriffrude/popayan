/**
* VARIBLES GLOBALES
*/
var $TABLA_HISTORICO_FACTURA_CLIENTE = null;
var PRESUPUESTO_ID = null;
var FACTURA_CLIENTE_ID = null;

/**
 * Onload
 */
function FacturaClienteHistorico() {
    PRESUPUESTO_ID = $("#PresupuestoId").val();
    CrearTablaFacturaClientehistorico();
    CargarValorTotal();
}

/**
 * Crear tabla de historico de las facturas del cliente
 */
function CrearTablaFacturaClientehistorico() {
    $TABLA_HISTORICO_FACTURA_CLIENTE = $("#tabla-historico-factura-cliente").DataTable({
        //"initComplete": function (settings, json) {
        //    cargarImpuestoAnticipoMasivo(0);
        //    //CalcularValorDisponible();
        //},
        "order": [[1, "desc"]],
        "ajax": {
            "url": URL_CONSULTAR_HISTORICO_FACTURA_CLIENTE,
            "type": "POST",
            "data": function (d) {
                //d.search['value'] = $filtro.val(),
                d.id = PRESUPUESTO_ID
                return $.extend({}, d, {
                    "adicional": {
                    }
                });
            }
        },
        "columns": [
            { "data": "NumeroFactura" },
            {
                "data": "ValorFacturaSinIva",
                "render": function (data, type, full, meta) {
                    //var TotalSolicitado = '<span data-format-price>' + data + '</span>'
                    var ValorSolicitado = '<div widt="5%"><input type="text" data-format-price class="form-control text-center" value="' + data + '" readonly></div>'
                    //var resultado = ""
                    //resultado += (PERMISO_CAMBIAR_ESTADO_PROVEEDOR) ? botonEstado : "";
                    return ValorSolicitado;
                }
            },
            {
                "data": "ValorIvaFactura",
                "render": function (data, type, full, meta) {
                    //var TotalSolicitado = '<span data-format-price>' + data + '</span>'
                    var ValorSolicitado = '<div widt="5%"><input type="text" data-format-price class="form-control text-center" value="' + data + '" readonly></div>'
                    //var resultado = ""
                    //resultado += (PERMISO_CAMBIAR_ESTADO_PROVEEDOR) ? botonEstado : "";
                    return ValorSolicitado;
                }
            },
            {
                "data": "ValorTotalFactura",
                "render": function (data, type, full, meta) {
                    //var TotalSolicitado = '<span data-format-price>' + data + '</span>'
                    var ValorSolicitado = '<div widt="5%"><input type="text" data-format-price class="form-control text-center" value="' + data + '" readonly></div>'
                    //var resultado = ""
                    //resultado += (PERMISO_CAMBIAR_ESTADO_PROVEEDOR) ? botonEstado : "";
                    return ValorSolicitado;
                }
            },
            { "data": "FechaFactura" },
            { "data": "UsuarioRegistro" },
            { "data": "FechaRechazo" },
            { "data": "HoraFecha" },
            { "data": "UsuarioRechazo" },
            {
                "data": "Id",
                "render": function (data, type, full, meta) {
                    var BotonEstado = '';
                    switch (full.EstadoSigla) {
                        case 'REG':
                            BotonEstado = '<div widt="5%"><button type="button" name="estado" class="btn btn-danger" onclick="RechazarFacturaCliente(' + data + ')" >RECHAZAR</button></div>';
                            break;
                        case 'REC':
                            BotonEstado = '<div widt="5%"><span>RECHAZADA</span></div>';
                            break;
                        case 'PGP':
                            BotonEstado = '<div widt="5%"><span>PAGO PARCIAL</span></div>'
                            break;
                        case 'PGT':
                            BotonEstado = '<div widt="5%"><span>PAGO TOTAL</span></div>'
                            break;
                        default:
                            BotonEstado = '<div widt="5%"><span>CONSULTE AL ADMINISTRADOR</span></div>'
                    }

                    //if (full.EstadoSigla == 'REG') {
                    //    BotonEstado = '<div widt="5%"><button type="button" name="estado" class="btn btn-danger" onclick="RechazarFacturaCliente(' + data + ')" >RECHAZAR</button></div>'
                    //} else {
                    //    BotonEstado = '<div widt="5%"><span>RECHAZADA</span></div>'
                    //}


                    //var resultado = ""
                    //resultado += (PERMISO_CAMBIAR_ESTADO_PROVEEDOR) ? botonEstado : "";
                    return BotonEstado;
                }
            }

        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
            Utils._InputFormatPrice();

        }
    });
}

function CargarValorTotal() {
    var PresupuestoId = $("#PresupuestoId").val();
    var parameters = {
        id: PresupuestoId
    };
    RequestHttp._Post(URL_CONSULTAR_VALOR_TOTAL_FACTURA, parameters, null, function (response) {
        if (response != null) {
            var tipoMensaje = (response.state == true) ? "sucess" : "danger";
            Utils._BuilderMessage(tipoMensaje, response.message);

            var valorPendientePorFacturar = (response.data.ValorPendientePorFacturar == null) ? 0 : response.data.ValorPendientePorFacturar;
            var valorTotalFactura = (response.data.ValorTotalFactura == null) ? 0 : response.data.ValorTotalFactura;
            $("#valor-total-pendiente-facturar").val(formatNumber.new(valorPendientePorFacturar));
            $("#valor-total-factura").val(formatNumber.new(valorTotalFactura));
            

        }
    })
}

/**
 * Pregunta si desea Rechazar factura cliente
 * @param {any} id
 */
function RechazarFacturaCliente(id) {
    FACTURA_CLIENTE_ID = id;
    Utils._BuilderConfirmation('RECHAZAR FACTURA', '¿DESEA RECHAZAR ESTA FACTURA?', 'RechazarFacturasCliente', '');


}

/**
 * Rechaza la factura del cliente
 */
function RechazarFacturasCliente() {
    var PresupuestoId = $("#PresupuestoId").val();
    var parameters = {
        id: FACTURA_CLIENTE_ID,
        presupuestoId: PresupuestoId
    };
    RequestHttp._Post(URL_RECHAZAR_FACTURA_CLIENTE, parameters, null, function (data) {
        if (data != null) {
            var tipoMensaje = (data.state == true) ? "sucess" : "danger";
            Utils._BuilderMessage(tipoMensaje, data.message);
            if ($TABLA_HISTORICO_FACTURA_CLIENTE != null) {
                $TABLA_HISTORICO_FACTURA_CLIENTE.draw();
            } else {
                FacturaClienteHistorico();
            }

            CargarValorTotal();
            //if (data.data.NumeroOrdenCompra != 0) {
            //    FACTURA_ID = data.data.FacturaId;
            //    if ($TABLA_ITEM_ORDEN_COMPRA_FACTURA != null) {
            //        $TABLA_ITEM_ORDEN_COMPRA_FACTURA.draw();
            //    } else {
            //        CrearTablaItemsOrdenCompra();
            //    }

            //} else {
            //    Utils._BuilderMessage('info', 'El numero de la OC no existe');
            //}

        }
    })
}