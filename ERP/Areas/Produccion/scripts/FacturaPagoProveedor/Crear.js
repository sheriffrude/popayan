var registrarFacturaPagoProveedor = function () {
    return {

        IMAGEN_PAGO: "",
        IMAGEN_PAGO_GUARDAR: "",
        DATA_IMPUESTOS: null,

        init: function () {

            $TABLA_DATOS_FACTURA = null;
            $.datepicker.setDefaults($.datepicker.regional["es"]);
            $("#FechaPago").datepicker().datepicker("setDate", new Date()).val('');
            Utils._InputFormatPrice(); 
            $TABLA_ASOCIADO_ORDEN_COMPRA_FACTURA = null;
            $TABLA_ITEM_ORDEN_COMPRA_FACTURA = null;
            this.IMAGEN_PAGO = [];
            this.IMAGEN_PAGO_GUARDAR = [];
            this.DATA_IMPUESTOS = [];
            registrarFacturaPagoProveedor.LimpiarDatos();
        },

        /**
         * Consultar datos fatura proveedor
         */
        ConsultarFacturaProveedor: function (e) {

            var factura = $("#Factura").val();
            var ordenCompraId = $("#NumeroOrdenCompra").val();
            if (ordenCompraId !== "0" || factura !== "") {

                if (ordenCompraId == "" && factura === "") {
                    Utils._BuilderMessage('warning', 'DEBE INGRESAR UN NÚMERO DE ORDEN DE COMPRA O UN NÚMERO DE FACTURA');
                    registrarFacturaPagoProveedor.LimpiarDatos();
                    return true;
                }

                if (ordenCompraId == "")
                    ordenCompraId = null;
                var parameters = {
                    ordenId: ordenCompraId,
                    factura: factura
                };

                RequestHttp._Post(URL_CONSULTAR_FACTURA_PROVEEDOR, parameters, null, function (response) {
                    var tipoMensaje = (response.state == true) ? "sucess" : "danger";
                    Utils._BuilderMessage(tipoMensaje, response.message);

                    if (response.data == null) {
                        Utils._BuilderMessage('warning', 'EL NÚMERO DE ORDEN DE COMPRA O FACTURA NO EXISTE');
                        registrarFacturaPagoProveedor.LimpiarDatos();
                    }
                    else {

                        if (response.data.EstadoFactura !== "Aprobada") {
                            Utils._BuilderMessage('warning', 'La factura se encuentra en estado: ' + response.data.EstadoFactura);
                            registrarFacturaPagoProveedor.LimpiarDatos();
                            return true;
                        }

                        if (response.data.EstadoOrden !== "Facturada") {
                            Utils._BuilderMessage('warning', 'La órden de compra se encuentra en estado: ' + response.data.EstadoOrden);
                            registrarFacturaPagoProveedor.LimpiarDatos();
                            return true;
                        }

                        $("#datosFactura").show();
                        ORDEN_COMPRA = response.data.OrdenCompra;
                        VOLUMEN = response.data.Volumen;

                        if ($TABLA_ASOCIADO_ORDEN_COMPRA_FACTURA != null) {
                            $TABLA_ASOCIADO_ORDEN_COMPRA_FACTURA.draw();
                        } else {
                            registrarFacturaPagoProveedor.CrearTablaAsociadosOrdenCompraFactura();
                        }

                        if ($TABLA_ITEM_ORDEN_COMPRA_FACTURA != null) {
                            $TABLA_ITEM_ORDEN_COMPRA_FACTURA.draw();
                        } else {
                            registrarFacturaPagoProveedor.CrearTablaItemsOrdenCompraFactura();
                        }
                        //Datos OC
                        var OrdenCompra = response.data.OrdenCompra;
                        var EstadoOrden = response.data.EstadoOrden;
                        var Empresa = response.data.Empresa;
                        var Cliente = response.data.Cliente;
                        var OrdenTrabajo = response.data.OrdenTrabajo;
                        var ReferenciaOrdenTrabajo = response.data.ReferenciaOrdenTrabajo;
                        var NumeroPresupuesto = response.data.NumeroPresupuesto;
                        var VersionPresupuestoInterno = response.data.VersionPresupuestoInterno;
                        var VersionPresupuestoExterno = response.data.VersionPresupuestoExterno;
                        var FechaRadicacion = response.data.FechaRadicacion;
                        $("#numero-oc").val(OrdenCompra);
                        $("#estado-oc").val(EstadoOrden);
                        $("#empresa").val(Empresa);
                        $("#cliente").val(Cliente);
                        $("#ot").val(OrdenTrabajo);
                        $("#referencia-ot").val(ReferenciaOrdenTrabajo);
                        $("#numero-presupuesto").val(NumeroPresupuesto);
                        $("#version-interno").val(VersionPresupuestoInterno);
                        $("#version-externo").val(VersionPresupuestoExterno);
                        $("#fecha-radicacion").val(FechaRadicacion);

                        //Datos proveedor
                        var facturaId = response.data.Id;
                        var Proveedor = response.data.Proveedor;
                        var RazonSocialProveedor = response.data.RazonSocialProveedor;
                        var NitProveedor = response.data.NitProveedor;
                        var TelefonoProveedor = response.data.TelefonoProveedor;
                        $("#NumeroFacturaProveedorId").val(facturaId);
                        $("#proveedor").val(Proveedor);
                        $("#razon-social-proveedor").val(RazonSocialProveedor);
                        $("#nit-proveedor").val(NitProveedor);
                        $("#telefono-proveedor").val(TelefonoProveedor);

                        //Datos factura
                        var TipoDocumento = response.data.TipoDocumento;
                        var NumeroFactura = response.data.NumeroFactura;
                        var FechaFactura = response.data.FechaFactura;
                        var FechaVencimiento = response.data.FechaVencimiento;
                        var FechaRegistro = response.data.FechaRegistro;
                        var Observacion = response.data.Observacion;
                        var AdjuntoComprimido = response.data.AdjuntoComprimido;
                        var UsuarioRegistro = response.data.UsuarioRegistro;
                        var EstadoFactura = response.data.EstadoFactura;
                        var Impuesto = response.data.Impuesto;
                        var Subtotal = response.data.Subtotal;
                        var Total = response.data.Total;
                        $("#adjunto").attr("href", AdjuntoComprimido);

                        $("#tipo-documento").val(TipoDocumento);
                        $("#numero-factura-proveedor").val(NumeroFactura);
                        $("#fecha-factura").val(FechaFactura);
                        $("#fecha-factura-vencimiento").val(FechaVencimiento);
                        $("#fecha-factura-registro").val(FechaRegistro);
                        $("#observacion").val(Observacion);
                        $("#usuario-registro").val(UsuarioRegistro);
                        $("#estado-factura").val(EstadoFactura);
                        $("#subtotal-factura").val(formatNumber.new(Subtotal));
                        $("#impuesto-factura").val(formatNumber.new(Impuesto));
                        $("#total-factura").val(formatNumber.new(Total));
                        $("#valor-total-factura").val(formatNumber.new(Total));

                        /////////////////////////////////////////////////////////
                        //Valor descuentos inicial
                        var $valorDescuentos = $("#valor-descuentos");
                        $valorDescuentos.val(formatNumber.new(0));
                        //Total de la factura inicial
                        var valorTotalFactura = parseFloat($("#total-factura").formatPriceGetVal());
                        //Cargar el subtotal de la factura
                        var $valorSubTotalPago = $("#valor-subtotal-pago");
                        $valorSubTotalPago.val(formatNumber.new(valorTotalFactura));
                        //Cargar valor real pagado valor-real-pago
                        var $valorRealPago = $("#valor-real-pago");
                        $valorRealPago.val(formatNumber.new(valorTotalFactura));

                    }
                });
            } else {
                Utils._BuilderMessage('warning', 'DEBE INGRESAR UN NÚMERO DE ORDEN DE COMPRA O UN NÚMERO DE FACTURA');
                registrarFacturaPagoProveedor.LimpiarDatos();
            }
        },

        /**
         * Limpiar datos factura proveedor
         */
        LimpiarDatos: function () {
            $("#numero-oc").val("");
            $("#estado-oc").val("");
            $("#empresa").val("");
            $("#cliente").val("");
            $("#ot").val("");
            $("#referencia-ot").val("");
            $("#numero-presupuesto").val("");
            $("#version-interno").val("");
            $("#version-externo").val("");
            $("#fecha-radicacion").val("");
            $("#NumeroFacturaProveedorId").val(0);
            $("#proveedor").val("");
            $("#razon-social-proveedor").val("");
            $("#nit-proveedor").val("");
            $("#telefono-proveedor").val("");
            $("#tipo-documento").val("");
            $("#numero-factura-proveedor").val("");
            $("#fecha-factura").val("");
            $("#fecha-factura-vencimiento").val("");
            $("#fecha-factura-registro").val("");
            $("#observacion").val("");
            $("#adjunto").val("");
            $("#usuario-registro").val("");
            $("#estado-factura").val("");
            $("#subtotal-factura").val(formatNumber.new(0));
            $("#impuesto-factura").val(formatNumber.new(0));
            $("#total-factura").val(formatNumber.new(0));
            $("#valor-total-factura").val(formatNumber.new(0));
            $("#datosFactura").hide();
        },

        UploadFilePago: function (e) {
            RequestHttp._UploadFile(e, URL_UPLOAD, function (result) {
                if (result != null) {
                    FILE = {
                        'Name': result.Name,
                        'Path': result.Path,
                        'Nombre': result.OriginalName,
                        'Url': result.Url
                    };
                    FILEGUARDAR = {
                        'OriginalName': result.OriginalName,
                        'Name': result.Name,
                        'Path': result.Path,
                        'Url': result.Url
                    };
                    registrarFacturaPagoProveedor.IMAGEN_PAGO.push(FILE);
                    registrarFacturaPagoProveedor.IMAGEN_PAGO_GUARDAR.push(FILEGUARDAR);
                }
            });
        },

        OnBeginFormCrearFacturaPagoCliente: function (jqXHR, settings) {
            var data = $(this).serializeObject();
            data["ValorIvaFactura"] = parseFloat($("#valor-descuentos").formatPriceGetVal());;
            data["TotalFactura"] = parseFloat($("#total-factura").formatPriceGetVal());;
            data["TotalPago"] = parseFloat($("#valor-real-pago").formatPriceGetVal());;
            data["Adjuntos"] = registrarFacturaPagoProveedor.IMAGEN_PAGO_GUARDAR;
            settings.data = jQuery.param(data);
            return true;
        },

        OnCompleteFacturaPagoFacturaCliente: function (response) {
            var resultado = RequestHttp._ValidateResponse(response);
            if (resultado != null) {
                var mensaje = "";
                var tipoMensaje = "danger";
                if (resultado.state == true) {
                    tipoMensaje = "success"
                    mensaje = resultado.message + " " + resultado.data;
                    registrarFacturaPagoProveedor.LimpiarDatos();
                }
                Utils._BuilderMessage(tipoMensaje, mensaje);
            }
        },

        /**
        *Funcion para crear tabla de los items 
        */
        CrearTablaItemsOrdenCompraFactura: function () {

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
                            //var TotalSolicitado = '<span data-format-price>' + data + '</span>'
                            var ValorUnitarioInterno = '<div widt="5%"><input type="text" data-format-price class="form-control" value="' + data + '" readonly></div>'
                            //var resultado = ""
                            //resultado += (PERMISO_CAMBIAR_ESTADO_PROVEEDOR) ? botonEstado : "";
                            return ValorUnitarioInterno;
                        }
                    },
                    {
                        "data": "SubTotalInterno",
                        "render": function (data, type, full, meta) {
                            var costoItem = '<div widt="5%" data-item-orden-compra="' + itemId + '"><input type="text" class="form-control" data-format-price name="costoItem" value="' + data + '" size="7"  readonly></div>'
                            //var resultado = ""
                            //resultado += (PERMISO_CAMBIAR_ESTADO_PROVEEDOR) ? botonEstado : "";
                            return costoItem;
                        }
                    },
                    {
                        "data": "ValorImpuestoInterno",
                        "render": function (data, type, full, meta) {
                            var costoItem = '<div widt="5%" data-item-orden-compra="' + itemId + '"><input type="text" class="form-control" data-format-price name="costoItem" value="' + data + '" size="7"  readonly></div>'
                            //var resultado = ""
                            //resultado += (PERMISO_CAMBIAR_ESTADO_PROVEEDOR) ? botonEstado : "";
                            return costoItem;
                        }
                    },
                    {
                        "data": "Total",
                        "render": function (data, type, full, meta) {
                            var costoItem = '<div widt="5%" data-item-orden-compra="' + itemId + '"><input type="text" class="form-control" data-format-price name="costoItem" value="' + data + '" size="7"  readonly></div>'
                            //var resultado = ""
                            //resultado += (PERMISO_CAMBIAR_ESTADO_PROVEEDOR) ? botonEstado : "";
                            return costoItem;
                        }
                    }

                ],
                "drawCallback": function (settings) {
                    Utils._InputFormatPrice();
                }
            });
         },

        /**
        *Funcion para crear tabla de los asoiados
        */
        CrearTablaAsociadosOrdenCompraFactura: function() {

            $TABLA_ASOCIADO_ORDEN_COMPRA_FACTURA = $("#tabla_asociado_orden_compra_factura").DataTable({
                    "scrollY": "200px",
                    "scrollCollapse": true,
                    "ajax": {
                        "url": URL_CONSULTAR_ASOCIADO_ORDEN_COMPRA_FACTURA,
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
                        { "data": "Descripcion" },
                        { "data": "Dias" },
                        { "data": "Cantidad" },
                        {
                            "data": "ValorUnitario",
                            "render": function (data, type, full, meta) {
                                var ValorUnitarioInterno = '<div widt="5%"><input type="text" data-format-price class="form-control" value="' + data + '" readonly></div>'
                                return ValorUnitarioInterno;
                            }
                        },
                        {
                            "data": "SubTotal",
                            "render": function (data, type, full, meta) {
                                asociadoId = full.Id;
                                var costoItem = '<div widt="5%" data-item-orden-compra="' + asociadoId + '"><input type="text" class="form-control" data-format-price name="costoItem" value="' + data + '" size="7"  readonly></div>'
                                return costoItem;
                            }
                        },
                        {
                            "data": "ValorImpuesto",
                            "render": function (data, type, full, meta) {
                                var costoItem = '<div widt="5%" data-item-orden-compra="' + asociadoId + '"><input type="text" class="form-control" data-format-price name="costoItem" value="' + data + '" size="7"  readonly></div>'
                                return costoItem;
                            }
                        },
                        {
                            "data": "Total",
                            "render": function (data, type, full, meta) {
                                var costoItem = '<div widt="5%" data-item-orden-compra="' + asociadoId + '"><input type="text" class="form-control" data-format-price name="costoItem" value="' + data + '" size="7"  readonly></div>'
                                return costoItem;
                            }
                        }

                    ],
                    "drawCallback": function (settings) {
                        Utils._InputFormatPrice();
                    }
                });
        },

        OnChangeImpuesto: function (e, url) {

            var impuestoId = $(e).val();
            if (impuestoId == 0 || impuestoId == null || impuestoId == "") {
                return false;
            }

            var parameters = {
                id: impuestoId,
            };

            $.ajax({
                url: url,
                type: "POST",
                dataType: "json",
                data: parameters,
                success: function (data, text) {

                    var porcentaje = data.Porcentaje;
                    var valorFactura = parseFloat($("#subtotal-factura").formatPriceGetVal());
                    var valorImpuestos = parseFloat($("#impuesto-factura").formatPriceGetVal());

                    if (data.Nombre == "RETEFUENTE" || data.Nombre == "RETEICA") {
                        var descuento = Math.round((valorFactura * porcentaje) / 100);
                        $("#ValorIvaFactura").val(formatNumber.new(descuento));
                    }

                    if (data.Nombre == "RETEIVA") {
                        var descuento = Math.round((valorImpuestos * porcentaje) / 100);
                        $("#ValorIvaFactura").val(formatNumber.new(descuento));
                    }

                    if (data.Nombre == "DESCUENTO VOLUMEN") {
                        $("#ValorIvaFactura").val(formatNumber.new(0));
                    }
                },
                error: function(request, status, error) {
                    Utils._BuilderMessage("danger", error);
                }
            });
            return false;
        },

        AdicionarPresupuesto: function () {

            var ImpuestoId = $('#ImpuestoId').val();
            var ValorIvaFactura = $('#ValorIvaFactura').val();

            if (!Validations._Requerido(ValorIvaFactura)) {
                Utils._BuilderMessage("danger", "El valor de los impuestos es obligatorio.");
                return false;
            }

            $('#tabla-datos-impuestos2').removeClass("hidden");

            var objectData = {
                "ImpuestoId": ImpuestoId,
                "Impuesto": $("#ImpuestoId").find('option:selected').text(),
                "ValorIvaFactura": ValorIvaFactura,
            };

            registrarFacturaPagoProveedor.DATA_IMPUESTOS.push(objectData);

            registrarFacturaPagoProveedor.RecargarTablaDatosFactura();

            jQuery("#ImpuestoId option").filter(function () {
                return $.trim($(this).text()) == 'Seleccione'
            }).prop('selected', true);
            $('#ImpuestoId').selectpicker('refresh');

            $("#ValorIvaFactura").val("");

        },

        /**
         * Recarga la tabla telefonos
         */
        RecargarTablaDatosFactura: function () {

            var tamano = registrarFacturaPagoProveedor.DATA_IMPUESTOS.length;

            for (var i = 0; i < tamano; i++) {
                registrarFacturaPagoProveedor.DATA_IMPUESTOS[i]["id"] = i;
            }
            if ($TABLA_DATOS_FACTURA != null) {
                $TABLA_DATOS_FACTURA.fnDestroy();
            }
            registrarFacturaPagoProveedor.ConstruirTablaDatosFactura();
        },

        /**
         * Construye la tabla telefonos apartir de DATA_TELEFONOS
         */
        ConstruirTablaDatosFactura: function () {

            $TABLA_DATOS_FACTURA = $("#tabla-datos-impuestos2").dataTable({
                "destroy": true,
                "serverSide": false,
                "info": false,
                "data": registrarFacturaPagoProveedor.DATA_IMPUESTOS,
                "columns": [
                    {
                        "data": "ImpuestoId",
                        "orderable": false,
                    },
                    {
                        "data": "Impuesto",
                        "orderable": false,
                    },
                    {
                        "data": "ValorIvaFactura",
                        "width": "15%",
                        "orderable": false,
                    },
                    {
                        "data": "id",
                        "orderable": false,
                        "searchable": false,
                        "width": "10%",
                        "render": function (data, type, full, meta) {
                            var html = '<input type="hidden" name="ListaTelefonos" value="' + full.telefono + '" />';
                            html += '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="registrarFacturaPagoProveedor.EliminarRegistro(' + data + ')" />';
                            return html;
                        }
                    },
                ],
                "footerCallback": function (row, data, start, end, display) {


                    var api = this.api(), data;
                    // Remove the formatting to get integer data for summation
                    var intVal = function (i) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '') * 1 :
                            typeof i === 'number' ?
                                i : 0;
                    };


                    // Total over all pages
                    totalPresupuesto = api.column(2).data().reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                    // Update footer
                    $(api.column(2).footer()).html(
                        '$ ' + formatNumber.new(totalPresupuesto)
                    );

                    var $valorDescuentos = $("#valor-descuentos");
                    $valorDescuentos.val(formatNumber.new(totalPresupuesto));

                    var valorFactura = parseFloat($("#valor-subtotal-pago").formatPriceGetVal());

                    var $valorRealPago = $("#valor-real-pago");
                    $valorRealPago.val(formatNumber.new(valorFactura - totalPresupuesto));

                },
                "pageLength": 10
            });
        },

        EliminarRegistro: function (id) {
            registrarFacturaPagoProveedor.DATA_IMPUESTOS.splice(id, 1);
            registrarFacturaPagoProveedor.ConstruirTablaDatosFactura();
        },

    }
}();

$(function () {
    registrarFacturaPagoProveedor.init();
});