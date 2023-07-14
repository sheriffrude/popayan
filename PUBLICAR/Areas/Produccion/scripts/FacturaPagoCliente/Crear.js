var registrarFacturaPagoCliente = function () {
    return {

        IMAGEN_PAGO: "",
        IMAGEN_PAGO_GUARDAR: "",
        EMPRESA_ID: null,
        PRESUPUESTO_ID: null,
        FACTURA_ID: null,
        VALOR_FACTURA: null,
        VALOR_TOTAL_FACTURA: null,
        VALOR_TOTAL_PAGADO: null,
        DATA_IMPUESTOS: null,
        URL_CONSULTAR_DETALLE_FACTURA_CLIENTE: null,

        init: function () {

            $TABLA_DATOS_FACTURA = null;
            this.EMPRESA_ID = null;
            this.PRESUPUESTO_ID = null;
            this.FACTURA_ID = null;
            this.VALOR_FACTURA = null;
            this.VALOR_TOTAL_FACTURA = null;
            this.VALOR_TOTAL_PAGADO = null;
            this.DATA_IMPUESTOS = [];
            this.URL_CONSULTAR_DETALLE_FACTURA_CLIENTE = "/Produccion/FacturaCliente/ConsultarDetalleFacturaCliente";

            $.datepicker.setDefaults($.datepicker.regional["es"]);
            $("#FechaPago").datepicker({
                dateFormat: 'dd/mm/yy',
                firstDay: 1
            }).datepicker("setDate", new Date()).val('');
            Utils._InputFormatPrice();

            var $valorRealPago = $("#valor-real-pago");
            $valorRealPago.val(formatNumber.new(0));

            var $valorDescuentos = $("#valor-descuentos");
            $valorDescuentos.val(formatNumber.new(0));

            var $valorDescuentos = $("#valor-subtotal-pago");
            $valorDescuentos.val(formatNumber.new(0));
        },

        /**
         *  Cargar select de clientes
         * @param {any} e
         * @param {any} urlClientes
        */
        OnchangeEmpresa: function (e, urlClientes) {
            var id = $(e).val();
            id = (id == "") ? 0 : id;
            if (id != 0 && id != null) {
                registrarFacturaPagoCliente.EMPRESA_ID = id;
                var parameters = {
                    id: registrarFacturaPagoCliente.EMPRESA_ID
                };
                var $elementListClientes = $("#ClienteId");
                Utils._GetDropDownList($elementListClientes, urlClientes, parameters, true, 0);
                Utils._ClearDropDownList($("#PresupuestoId"));
                Utils._ClearDropDownList($("#FacturaId"));
                registrarFacturaPagoCliente.LimpiarCampos();
            } else {
                Utils._ClearDropDownList($("#ClienteId"));
                Utils._ClearDropDownList($("#PresupuestoId"));
                Utils._ClearDropDownList($("#FacturaId"));
                registrarFacturaPagoCliente.LimpiarCampos();
            }
        },

        /**
         * Cargar select de presupuestos
         * @param {any} e
         * @param {any} urlPresupuesto
         */
        OnchangeCliente: function (e, urlFactura) {
            var clienteId = $(e).val();
            if (clienteId != 0 && clienteId != null) {
                var parameters = {
                    id: clienteId
                };
                var $elementListFactura = $("#FacturaId");
                Utils._GetDropDownList($elementListFactura, urlFactura, parameters, true, 0);
                registrarFacturaPagoCliente.LimpiarCampos();
            } else {
                Utils._ClearDropDownList($("#FacturaId"));
                registrarFacturaPagoCliente.LimpiarCampos();
            }
        },

        /**
         * Cargar select de facturas
         * @param {any} e
         */
        OnchengePresupuesto: function (e, urlFactura) {

            registrarFacturaPagoCliente.PRESUPUESTO_ID = $(e).val();
            registrarFacturaPagoCliente.PRESUPUESTO_ID = (registrarFacturaPagoCliente.PRESUPUESTO_ID == "") ? 0 : registrarFacturaPagoCliente.PRESUPUESTO_ID;
            if (registrarFacturaPagoCliente.PRESUPUESTO_ID != 0 && registrarFacturaPagoCliente.PRESUPUESTO_ID != null) {

                var parameters = {
                    id: registrarFacturaPagoCliente.PRESUPUESTO_ID
                };

                var $elementListFactura = $("#FacturaId");
                Utils._GetDropDownList($elementListFactura, urlFactura, parameters, true, 0);
                registrarFacturaPagoCliente.LimpiarCampos();
            } else {
                Utils._ClearDropDownList($("#FacturaId"));
                registrarFacturaPagoCliente.LimpiarCampos();
            }
        },

        /**
         * Consultar totales factura
         * @param {any} e
         */
        OnchengeFactura: function (e) {

            registrarFacturaPagoCliente.FACTURA_ID = $(e).val();
            registrarFacturaPagoCliente.FACTURA_ID = (registrarFacturaPagoCliente.FACTURA_ID == "") ? 0 : registrarFacturaPagoCliente.FACTURA_ID;

            var parameters = {
                facturaId: registrarFacturaPagoCliente.FACTURA_ID
            };

            RequestHttp._Post(registrarFacturaPagoCliente.URL_CONSULTAR_DETALLE_FACTURA_CLIENTE, parameters, null, function (response) {

                if (response.data != null) {
                    $("#detalle-pago").removeClass("hidden");
                    var tipoMensaje = (response.state == true) ? "sucess" : "danger";
                    Utils._BuilderMessage(tipoMensaje, response.message);
                    $("#orden-trabajo").val(response.data.OrdenTrabajo);
                    $("#producto").val(response.data.Producto);
                    $("#estado-factura").val(response.data.EstadoFactura);
                    $("#numero-interno-factura").val(response.data.IdFactura);
                    $("#numero-factura").val(response.data.Factura);
                    $("#fecha-factura").val(response.data.FechaFactura);
                    $("#valor-factura").val(formatNumber.new(response.data.ValorFactura));
                    $("#valor-impuestos").val(formatNumber.new(response.data.ValorImpuestos));
                    $("#valor-total-factura").val(formatNumber.new(response.data.Total));
                    $("#usuario-registro").val(response.data.UsuarioRegistro);
                    $("#fecha-registro").val(response.data.FechaRegistro);
                    $("#valor-total-pagado").val(formatNumber.new(response.data.ValorTotalPagoCliente));
                    $("#pendiente-por-pagar").val(formatNumber.new(response.data.Total - response.data.ValorTotalPagoCliente));
                } else {
                    Utils._BuilderMessage('warning', 'NO SE ENCONTRARON DATOS DE ESTA FACTURA');
                    registrarFacturaPagoCliente.LimpiarCampos();
                }
            });


        },

        /**
         * Calcular total de pago
         * @param {any} e
        */
        CalcularTotalPago: function (e) {

            var valorIngresado = $(e).formatPriceGetVal();
            var valorPorPagar = parseFloat($("#pendiente-por-pagar").formatPriceGetVal());
            var $valorPago = $("#valor-pago");
            var $valorSubTotalPago = $("#valor-subtotal-pago");

            $valorPago.val(formatNumber.new(valorIngresado));
            $valorSubTotalPago.val(formatNumber.new(valorIngresado));

            var descuento = parseFloat($("#valor-descuentos").formatPriceGetVal());
            var $valorRealPago = $("#valor-real-pago");
            $valorRealPago.val(formatNumber.new(valorIngresado - descuento));

        },

        OnBeginFormCrearFacturaPagoCliente: function (jqXHR, settings) {
            var data = $(this).serializeObject();
            data.ValorPagado = $("#valor-real-pago").formatPriceGetVal();
            settings.data = jQuery.param(data);
            return true;
        },

        CrearPagoCliente: function () {
            Utils._BuilderConfirmation("Registrar pago cliente", "¿Esta seguro que desa registrar el pago del cliente?", registrarFacturaPagoCliente.RegistrarPagoCliente, registrarFacturaPagoCliente.NoRegistrarPago);
        },

        RegistrarPagoCliente: function (data) {
            $("#FormularioFacturaPagoCliente").submit();
        },

        NoRegistrarPago: function () {
        },

        OnCompleteFacturaPagoFacturaCliente: function (response) {

            var resultado = RequestHttp._ValidateResponse(response);

            if (resultado != null) {
                var mensaje = "";
                var tipoMensaje = "danger";
                if (resultado.state == true) {
                    tipoMensaje = "success"
                    mensaje = resultado.message + " " + resultado.data;
                    registrarFacturaPagoCliente.LimpiarCampos();
                }
                Utils._BuilderMessage(tipoMensaje, mensaje);
                Utils._ClearDropDownList($("#FacturaId"));
                Utils._ClearDropDownList($("#ClienteId"));
            }

        },

        AdicionarPresupuesto: function () {

            var ImpuestoId = $('#ImpuestoId').val();
            var ValorIvaFactura = $('#ValorIvaFactura').val();

            if (!Validations._Requerido(ValorIvaFactura)) {
                Utils._BuilderMessage("danger", "El valor de los impuestos es obligatorio.");
                return false;
            }

            $('#tabla-datos-impuestos').removeClass("hidden");

            var objectData = {
                "ImpuestoId": ImpuestoId,
                "Impuesto": $("#ImpuestoId").find('option:selected').text(),
                "ValorIvaFactura": ValorIvaFactura,
            };

            registrarFacturaPagoCliente.DATA_IMPUESTOS.push(objectData);

            registrarFacturaPagoCliente.RecargarTablaDatosFactura();

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

            var tamano = registrarFacturaPagoCliente.DATA_IMPUESTOS.length;

            for (var i = 0; i < tamano; i++) {
                registrarFacturaPagoCliente.DATA_IMPUESTOS[i]["id"] = i;
            }
            if ($TABLA_DATOS_FACTURA != null) {
                $TABLA_DATOS_FACTURA.fnDestroy();
            }
            registrarFacturaPagoCliente.ConstruirTablaDatosFactura();
        },

        /**
         * ResetearTabla
        */
        ResetearTabla: function () {

            if ($TABLA_DATOS_FACTURA != null) {
                $TABLA_DATOS_FACTURA.fnDestroy();
            }
            registrarFacturaPagoCliente.ConstruirTablaDatosFactura();
        },

        /**
         * Construye la tabla telefonos apartir de DATA_TELEFONOS
         */
        ConstruirTablaDatosFactura: function () {

            $TABLA_DATOS_FACTURA = $("#tabla-datos-impuestos").dataTable({
                "destroy": true,
                "serverSide": false,
                "info": false,
                "data": registrarFacturaPagoCliente.DATA_IMPUESTOS,
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
                            html += '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="registrarFacturaPagoCliente.EliminarRegistro(' + data + ')" />';
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

                    var valorFactura = parseFloat($("#valor-pago").formatPriceGetVal());

                    var $valorRealPago = $("#valor-real-pago");
                    $valorRealPago.val(formatNumber.new(valorFactura - totalPresupuesto));

                },
                "pageLength": 10
            });
        },

        EliminarRegistro: function (id) {
            registrarFacturaPagoCliente.DATA_IMPUESTOS.splice(id, 1);
            registrarFacturaPagoCliente.ConstruirTablaDatosFactura();
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
                    var valorFactura = parseFloat($("#valor-factura").formatPriceGetVal());
                    var valorImpuestos = parseFloat($("#valor-impuestos").formatPriceGetVal());

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

        /**
         * Funcion limpiar campos cuando hay un cambio en un select
         */
        LimpiarCampos: function () {
            $("#orden-trabajo").val("");
            $("#producto").val("");
            $("#estado-factura").val("");
            $("#numero-interno-factura").val("");
            $("#numero-factura").val("");
            $("#fecha-factura").val("");
            $("#valor-impuestos").val("");
            $("#valor-total-factura").val("");
            $("#valor - factura").val("");
            $("#usuario-registro").val("");
            $("#fecha-registro").val("");
            $("#pendiente-por-pagar").val("");
            $("#valor-total-pagado").val("");
            $("#FechaPago").val("");

            jQuery("#TipoPagoId option").filter(function () {
                return $.trim($(this).text()) == 'Seleccione'
            }).prop('selected', true);
            $('#TipoPagoId').selectpicker('refresh');

            var $valorPago = $("#valor-pago");
            $valorPago.val(formatNumber.new(0));

            $("#ValorPagado").val("");
            $("#detalle-pago").addClass("hidden");

            jQuery("#ImpuestoId option").filter(function () {
                return $.trim($(this).text()) == 'Seleccione'
            }).prop('selected', true);
            $('#ImpuestoId').selectpicker('refresh');

            registrarFacturaPagoCliente.DATA_IMPUESTOS = [];

            var $valorRealPago = $("#valor-real-pago");
            $valorRealPago.val(formatNumber.new(0));

            var $valorDescuentos = $("#valor-descuentos");
            $valorDescuentos.val(formatNumber.new(0));

            var $valorDescuentos = $("#valor-subtotal-pago");
            $valorDescuentos.val(formatNumber.new(0));

            registrarFacturaPagoCliente.ResetearTabla()
        },

    }
}();

$(function () {
    registrarFacturaPagoCliente.init();
});

