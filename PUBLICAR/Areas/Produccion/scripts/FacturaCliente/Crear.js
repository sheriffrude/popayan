var registrarFacturaCliente = function () {
    return {

        EMPRESA_ID: "",
        PRESUPUESTO_ID: "",
        VALOR_EXTERNO: "",
        PENDIENTE_FACTURAR: "",
        DATA_FACTURA_CLIENTE: "",

        init: function () {
            $.datepicker.setDefaults($.datepicker.regional["es"]);
            $("#FechaFactura").datepicker({
                dateFormat: 'dd/mm/yy',
                firstDay: 1
            }).datepicker("setDate", new Date()).val('');

            Utils._InputFormatPrice();
            $TABLA_DATOS_FACTURA = null;
            this.EMPRESA_ID = null;
            this.PRESUPUESTO_ID = null;
            this.VALOR_EXTERNO = 0;
            this.PENDIENTE_FACTURAR = 0;
            this.DATA_FACTURA_CLIENTE = [];
            this.URL_CONSULTAR_VALOR_PRESUPUESTO_EXTERNO = '/Produccion/Presupuesto/ConsultarPresupuestoExterno';
            this.URL_CONSULTAR_VALOR_PENDIENTE_FACTURAR = '/Produccion/Presupuesto/ConsultarValorPendienteFacturar';
            this.URL_CONSULTAR_VALOR_IMPUESTOS = '/Produccion/Presupuesto/ConsultarValorImpuestos';
            
        },

        /**
         *  Cargar select de clientes
         * @param {any} e
         * @param {any} urlClientes
         */
        OnchangeEmpresa: function (e, urlClientes) {
            var id = $(e).val();
            if (id != 0 && id != null) {
                registrarFacturaCliente.EMPRESA_ID = id;
                var parameters = {
                    id: registrarFacturaCliente.EMPRESA_ID
                };

                var $elementListClientes = $("#ClienteId");
                Utils._GetDropDownList($elementListClientes, urlClientes, parameters, true, null);
            }
        },

        /**
         * Cargar select de productos
         * @param {any} e
         * @param {any} urlProducto
         */
        OnchangeCliente: function (e, urlProducto) {
            var clienteId = $(e).val();
            var parameters = {
                id: clienteId
                //empresaId: EMPRESA_ID
            };

            var $elementListProducto = $("#ProductoId");
            Utils._GetDropDownList($elementListProducto, urlProducto, parameters, true, null);
        },

        /**
        * Cargar select de ordenes de trabajo
        * @param {any} e
        * @param {any} urlOrdenTrabajo
        */
        OnchangeProducto: function (e, urlOrdenTrabajo) {

            var productoId = $(e).val();
            var parameters = {
                id: productoId,
                empresaId: registrarFacturaCliente.EMPRESA_ID
            };
            var $elementListOrdenProducto = $("#OrdenTrabajoId");
            Utils._GetDropDownList($elementListOrdenProducto, urlOrdenTrabajo, parameters, true, null);
        },

        /**
        * Cargar select de presupuestos
        * @param {any} e
        * @param {any} urlPresupuesto
        */
        OnchangeOrdenTrabajo: function (e, urlPresupuesto) {
            var ordenTrabajoId = $(e).val();
            var parameters = {
                id: ordenTrabajoId
            };

            var $elementListPresupuesto = $("#PresupuestoId");
            Utils._GetDropDownList($elementListPresupuesto, urlPresupuesto, parameters, true, null);
        },

        /**
         * Mostrar boton de historico de factura proveedor
         * @param {any} e
         */
        OnchengePresupuesto: function (e) {

            registrarFacturaCliente.PRESUPUESTO_ID = $(e).val();

            if (registrarFacturaCliente.PRESUPUESTO_ID != 'Seleccione') {
                $("#caja-historico-factura-cliente").removeClass('hidden');
                $("#valor-total-presupuesto").removeClass('hidden');

                var parametersPresupuestoExterno = {
                    id: registrarFacturaCliente.PRESUPUESTO_ID
                };

                RequestHttp._Post(registrarFacturaCliente.URL_CONSULTAR_VALOR_PRESUPUESTO_EXTERNO, parametersPresupuestoExterno, null, function (response) {
                    if (response != null) {
                        var tipoMensaje = (response.state == true) ? "sucess" : "danger";
                        Utils._BuilderMessage(tipoMensaje, response.message);
                        registrarFacturaCliente.VALOR_EXTERNO = response.data;
                        if (registrarFacturaCliente.VALOR_EXTERNO == null)
                            registrarFacturaCliente.VALOR_EXTERNO = 0;
                        $("#valor-presupuesto").val(formatNumber.new(registrarFacturaCliente.VALOR_EXTERNO));
                    }
                });

                var parametersPendienteFacturar = {
                    id: registrarFacturaCliente.PRESUPUESTO_ID
                };

                RequestHttp._Post(registrarFacturaCliente.URL_CONSULTAR_VALOR_PENDIENTE_FACTURAR, parametersPendienteFacturar, null, function (responseData) {
                    if (responseData != null) {
                        var tipoMensaje = (responseData.state == true) ? "sucess" : "danger";
                        Utils._BuilderMessage(tipoMensaje, responseData.message);
                        registrarFacturaCliente.PENDIENTE_FACTURAR = responseData.data;
                        $("#valor-pendiente").val(formatNumber.new(registrarFacturaCliente.PENDIENTE_FACTURAR));
                    }
                });

                RequestHttp._Post(registrarFacturaCliente.URL_CONSULTAR_VALOR_IMPUESTOS, parametersPendienteFacturar, null, function (responseData) {
                    if (responseData != null) {
                        var tipoMensaje = (responseData.state == true) ? "sucess" : "danger";
                        Utils._BuilderMessage(tipoMensaje, responseData.message);
                        $("#ValorIvaFactura").val(formatNumber.new(responseData.data));
                    }
                });
            } else {
                $("#caja-historico-factura-cliente").addClass('hidden');
                $("#valor-presupuesto").val("");
                $("#valor-pendiente").val("");
            }

        },

        /**
         * Función para validar que el valor ingresado no sobrepase el valor del presupuesto externo
         * @param {any} e
         */
        ValidarValorFactura: function (e) {
        },

        /**
         * Abrir modal de historico de factura cliente
         */
        VerHistoricoFacturaCliente: function () {
            URL_VER_HISTORICO_FACTURA_CLIENTES = '/Produccion/FacturaCliente/Historico';
            URL_VER_HISTORICO_FACTURA_CLIENTES = URL_VER_HISTORICO_FACTURA_CLIENTES + "/" + registrarFacturaCliente.PRESUPUESTO_ID;
            Utils._OpenModal(URL_VER_HISTORICO_FACTURA_CLIENTES, 'FacturaClienteHistorico', 'all');
        },

        /**
         * Limpiar campos
         */
        FacturaClienteLimpiarCampos: function () {
            $("#FormularioFacturaCliente")[0].reset();
            registrarFacturaCliente.VALOR_EXTERNO = 0;
            registrarFacturaCliente.PENDIENTE_FACTURAR = 0;
            registrarFacturaCliente.DATA_FACTURA_CLIENTE = [];
        },

        OnBeginFormCrearFacturaCliente: function (jqXHR, settings) {

            if (registrarFacturaCliente.DATA_FACTURA_CLIENTE.length <= 0) {
                Utils._BuilderMessage('warning', 'Debe agregar al menos un registro de datos de factura');
                return false;
            } else {
                var data = $(this).serializeObject();
                for (var i = 0; i < registrarFacturaCliente.DATA_FACTURA_CLIENTE.length; i++) {
                    registrarFacturaCliente.DATA_FACTURA_CLIENTE[i].ValorFacturaSinIva = intVal(registrarFacturaCliente.DATA_FACTURA_CLIENTE[i].ValorFacturaSinIva);
                    registrarFacturaCliente.DATA_FACTURA_CLIENTE[i].ValorIvaFactura = intVal(registrarFacturaCliente.DATA_FACTURA_CLIENTE[i].ValorIvaFactura);
                }

                data["ListaDatosFactura"] = registrarFacturaCliente.DATA_FACTURA_CLIENTE;
                settings.data = jQuery.param(data);
                return true;
            }
        },

        OnCompleteCrearFacturaCliente: function (response) {

            var resultado = RequestHttp._ValidateResponse(response);
            if (resultado != null) {
                var mensaje = "";
                var tipoMensaje = "danger";
                if (resultado.state == true) {
                    tipoMensaje = "success"
                    mensaje = resultado.message;
                    $("#tabla-datos-factura").addClass('hidden');
                    registrarFacturaCliente.FacturaClienteLimpiarCampos();
                }
                Utils._BuilderMessage(tipoMensaje, mensaje);
            }
        },

        AdicionarPresupuesto: function () {

            var Empresa = $('#EmpresaId').val();
            var Cliente = $('#ClienteId').val();
            var Producto = $('#ProductoId').val();
            var Ot = $('#OrdenTrabajoId').val();
            var Presupuesto = $('#PresupuestoId').val();
            var FechaFactura = $('#FechaFactura').val();
            var NumeroFactura = $('#NumeroFactura').val();
            var ValorFacturaSinIva = $('#ValorFacturaSinIva').val();
            var ValorIvaFactura = $('#ValorIvaFactura').val();
            var ValorPresupuesto = $('#valor-presupuesto').val();
            var PendienteFacturar = $('#valor-pendiente').val();

            if (!Validations._Requerido(Producto)) {
                Utils._BuilderMessage("danger", "El producto es obligatorio.");
                return false;
            }
            if (!Validations._Requerido(Ot)) {
                Utils._BuilderMessage("danger", "La Órden de trabajo es obligatoria.");
                return false;
            }
            if (!Validations._Requerido(Presupuesto)) {
                Utils._BuilderMessage("danger", "El presupuesto es obligatorio.");
                return false;
            }

            if (!Validations._Requerido(FechaFactura)) {
                Utils._BuilderMessage("danger", "La fecha de la factura es obligatoria.");
                return false;
            }

            if (!Validations._Requerido(NumeroFactura)) {
                Utils._BuilderMessage("danger", "El número de la factura es obligatorio.");
                return false;
            }

            if (!Validations._Requerido(ValorFacturaSinIva)) {
                Utils._BuilderMessage("danger", "El valor de la factura es obligatorio.");
                return false;
            }

            if (!Validations._Requerido(ValorIvaFactura)) {
                Utils._BuilderMessage("danger", "El valor de los impuestos es obligatorio.");
                return false;
            }
            $('#tabla-datos-factura').removeClass("hidden");
            var tamano = registrarFacturaCliente.DATA_FACTURA_CLIENTE.length;
            var valorTotal = parseInt($("#ValorFacturaSinIva").formatPriceGetVal()) + parseInt($("#ValorIvaFactura").formatPriceGetVal());

            var objectData = {
                "EmpresaId": Empresa,
                "ClienteId": Cliente,
                "ProductoId": Producto,
                "OrdenTrabajoId": Ot,
                "PresupuestoId": Presupuesto,
                "totalpresupuesto": ValorPresupuesto,
                "pendientefacturar": PendienteFacturar,
                "NumeroFactura": NumeroFactura,
                "FechaFactura": FechaFactura,
                "ValorFacturaSinIva": ValorFacturaSinIva,
                "ValorIvaFactura": ValorIvaFactura,
                "valortotal": formatNumber.new(valorTotal),

            };

            for (var i = 0; i < tamano; i++) {
                if (registrarFacturaCliente.DATA_FACTURA_CLIENTE[i].PresupuestoId == objectData.PresupuestoId) {
                    Utils._BuilderMessage("danger", "No se puede facturar dos veces el mismo presupuesto en esta factura");
                    return false;
                }
            }
            registrarFacturaCliente.DATA_FACTURA_CLIENTE.push(objectData);
            registrarFacturaCliente.RecargarTablaDatosFactura();

            jQuery("#EmpresaId option").filter(function () {
                return $.trim($(this).text()) == 'Seleccione'
            }).prop('selected', true);
            $('#EmpresaId').selectpicker('refresh');

            jQuery("#ProductoId option").filter(function () {
                return $.trim($(this).text()) == 'Seleccione'
            }).prop('selected', true);
            $('#ProductoId').selectpicker('refresh');

            jQuery("#OrdenTrabajoId option").filter(function () {
                return $.trim($(this).text()) == 'Seleccione'
            }).prop('selected', true);
            $('#OrdenTrabajoId').selectpicker('refresh');

            jQuery("#PresupuestoId option").filter(function () {
                return $.trim($(this).text()) == 'Seleccione'
            }).prop('selected', true);
            $('#PresupuestoId').selectpicker('refresh');

            jQuery("#ClienteId option").filter(function () {
                return $.trim($(this).text()) == 'Seleccione'
            }).prop('selected', true);
            $('#ClienteId').selectpicker('refresh');

            jQuery("#OrdenTrabajoId option").filter(function () {
                return $.trim($(this).text()) == 'Seleccione'
            }).prop('selected', true);
            $('#OrdenTrabajoId').selectpicker('refresh');

            jQuery("#ImpuestoId option").filter(function () {
                return $.trim($(this).text()) == 'Seleccione'
            }).prop('selected', true);
            $('#ImpuestoId').selectpicker('refresh');

            $("#ValorFacturaSinIva").val("");
            $("#ValorIvaFactura").val("");
            $("#valor-presupuesto").val("");
            $("#valor-pendiente").val("");
            $("#ImpuestoId").val("0");  
            $("#FechaFactura").val("");  
            $("#NumeroFactura").val(""); 
        },

        /**
         * Recarga la tabla telefonos
         */
        RecargarTablaDatosFactura: function () {
            var tamano = registrarFacturaCliente.DATA_FACTURA_CLIENTE.length;

            for (var i = 0; i < tamano; i++) {
                registrarFacturaCliente.DATA_FACTURA_CLIENTE[i]["id"] = i;
            }
            if ($TABLA_DATOS_FACTURA != null) {
                $TABLA_DATOS_FACTURA.fnDestroy();
            }
            registrarFacturaCliente.ConstruirTablaDatosFactura();
        },

        /**
         * Construye la tabla telefonos apartir de DATA_TELEFONOS
         */
        ConstruirTablaDatosFactura: function () {

            $TABLA_DATOS_FACTURA = $("#tabla-datos-factura").dataTable({

                "destroy": true,
                "serverSide": false,
                "info": false,
                "data": registrarFacturaCliente.DATA_FACTURA_CLIENTE,
                "columns": [
                    {
                        "data": "OrdenTrabajoId",
                        "orderable": false,
                    },
                    {
                        "data": "ProductoId",
                        "orderable": false,
                    },
                    {
                        "data": "PresupuestoId",
                        "orderable": false,
                    },
                    {
                        "data": "totalpresupuesto",
                        "width": "15%",
                        "orderable": false,
                    },
                    {
                        "data": "pendientefacturar",
                        "width": "15%",
                        "orderable": false,
                    },
                    {
                        "data": "NumeroFactura",
                        "orderable": false,
                    },
                    {
                        "data": "FechaFactura",
                        "orderable": false,
                    },
                    {
                        "data": "ValorFacturaSinIva",
                        "width": "15%",
                        "orderable": false,
                    },
                    {
                        "data": "ValorIvaFactura",
                        "width": "15%",
                        "orderable": false,
                    },
                    {
                        "data": "valortotal",
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
                            html += '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="registrarFacturaCliente.EliminarRegistro(' + data + ')" />';
                            return html;
                        }
                    }
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
                    totalPresupuesto = api.column(3).data().reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                    totalPendienteFacturar = api.column(4).data().reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                    totalFacturaSinImpuestos = api.column(7).data().reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                    totalImpuestos = api.column(8).data().reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                    total = api.column(9).data().reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                    // Total over this page
                    /*
                    pageTotal = api.column(3, { page: 'current' }).data().reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);
                    */

                    // Update footer
                    $(api.column(3).footer()).html(
                        '$ ' + formatNumber.new(totalPresupuesto)
                    );
                    $(api.column(4).footer()).html(
                        '$ ' + formatNumber.new(totalPendienteFacturar)
                    );
                    $(api.column(7).footer()).html(
                        '$ ' + formatNumber.new(totalFacturaSinImpuestos)
                    );
                    $(api.column(8).footer()).html(
                        '$ ' + formatNumber.new(totalImpuestos)
                    );
                    $(api.column(9).footer()).html(
                        '$ ' + formatNumber.new(total)
                    );
                },
                "pageLength": 10
            });
        },

        EliminarRegistro: function (id) {
            registrarFacturaCliente.DATA_FACTURA_CLIENTE.splice(id, 1);
            registrarFacturaCliente.ConstruirTablaDatosFactura();
        },

        FacturaCerrar: function () {
            window.location.href = '/Produccion/IngresoCosto/Menu/'
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
                        registrarFacturaCliente.ORDEN_COMPRA = response.data.OrdenCompra;
                        registrarFacturaCliente.VOLUMEN = response.data.Volumen;

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
        CrearTablaAsociadosOrdenCompraFactura: function () {

            $TABLA_ASOCIADO_ORDEN_COMPRA_FACTURA = $("#tabla_asociado_orden_compra_factura").DataTable({
                "scrollY": "200px",
                "scrollCollapse": true,
                "ajax": {
                    "url": URL_CONSULTAR_ASOCIADO_ORDEN_COMPRA_FACTURA,
                    "type": "POST",
                    "data": function (d) {
                        d.id = registrarFacturaPagoProveedor.ORDEN_COMPRA,
                            d.volumen = registrarFacturaPagoProveedor.VOLUMEN
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
            var $textBox = $("#ValorIvaFactura");

            if (impuestoId == 0 || impuestoId == null || impuestoId == "") {
                $textBox.val(0);
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
                    //Guardar el porcentaje seleccionado
                    var porcentaje = data;
                    var valorFacturaSinIva = parseInt($("#ValorFacturaSinIva").formatPriceGetVal());
                    var impuesto = (valorFacturaSinIva * porcentaje) / 100;
                    $("#ValorIvaFactura").val(formatNumber.new(impuesto));
                },
                error: function(request, status, error) {
                    Utils._BuilderMessage("danger", error);
                }
            });
            return false;
        },

    }
}();


registrarFacturaCliente.init();


function UploadFile(e) {
    RequestHttp._UploadFile(e, URL_UPLOAD_FOTO, function (data) {
        if (data != null) {
            FILE = {
                'Name': data.Name,
                'Path': data.Path,
                'Url': data.Url
            };
            $("#content-foto > img").attr("src", data.Url);
            $("#content-foto").show();
        }
    });
}