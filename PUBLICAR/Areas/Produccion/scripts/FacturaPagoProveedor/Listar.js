var consultarFacturaPagoProveedor = function () {

    return {

        URL_LISTAR_TIPO_DOCUMENTO: null,
        DATA_TIPO_DOCUMENTO: null,
        NUMERO_PAGO_ID: null,
        NUMERO_FACTURA: null,
        NUMERO_ORDEN: null,

        init: function () {
            $TABLA_FACTURA_PAGO_PROVEEDOR = null;
            this.URL_LISTAR_TIPO_DOCUMENTO = 'ListarEmpresas';
            this.DATA_TIPO_DOCUMENTO = null;
            this.NUMERO_PAGO_ID = null;
            this.NUMERO_FACTURA = null;
            this.NUMERO_ORDEN = null;
            consultarFacturaPagoProveedor.CargarComboEmpresas();
        },

        /**
        *Funcion para crear tabla de los pagos de las facturas de proveedores
        */
        CrearTablaFacturasPagoProveedor: function () {

            var $filtro = $("#texto");
            var IdEmpresa = $("#select-empresa").val();
            if (IdEmpresa === "0")
                IdEmpresa = null;

            $TABLA_FACTURA_PAGO_PROVEEDOR = $("#tabla_factura_pago_proveedor").DataTable(
                {
                    "scrollX": true,
                    "bDestroy": true,
                    "ajax": {
                        "url": URL_CONSULTAR_FACTURA_PAGO_PROVEEDOR,
                        "type": "POST",
                        "data": function (d) {
                            d.search["value"] = $filtro.val();
                            d.empresaId = IdEmpresa;
                            d.clienteId = $("#select-cliente").val();
                            d.productoId = $("#select-producto").val();
                            d.otId = $("#select-ot").val();
                        }
                    },
                    "columns": [
                        {
                            "data": "IdFactura",
                            "width": "10%",
                            "render": function (data, type, full, meta) {
                                return meta.row + meta.settings._iDisplayStart + 1;
                            }
                        },
                        {
                            "data": "OrdenCompra"
                        },
                        { "data": "Empresa" },
                        { "data": "Cliente" },
                        { "data": "OrdenTrabajo" },
                        { "data": "ReferenciaOrdenTrabajo" },
                        { "data": "NumeroPresupuesto" },
                        { "data": "VersionPresupuestoInterno" },
                        { "data": "VersionPresupuestoExterno" },
                        { "data": "Proveedor" },
                        { "data": "NitProveedor" },
                        { "data": "TipoDocumento" },
                        { "data": "NumeroFactura" },
                        { "data": "FechaFactura" },
                        { "data": "FechaVencimiento" },
                        { "data": "FechaRegistro" },
                        { "data": "EstadoFactura" },
                        { "data": "NumeroPago" },
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
                        { "data": "EstadoPago" },
                        { "data": "Observacion" },
                        { "data": "FechaPago" },
                        { "data": "UsuarioRegistro" },
                        {
                            "data": "EstadoPago",
                            "orderable": false,
                            "width": "10%",
                            "render": function (data, type, full, meta) {
                                var resultado = "";
                                if (data == "Registrado") {
                                    //Estado: Registrado
                                    var checked = "checked";
                                    resultado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-persona" onchange="consultarFacturaPagoProveedor.CambiarEstadoPagoProveedor(' + full.NumeroPago + ',' + full.IdFactura + ',' + full.OrdenCompra + ' )" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + full.NumeroPago + '">';

                                } else if (data == "Cancelado") {
                                    //Estado: Finalizada
                                    resultado = "";
                                    resultado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-persona" onchange="consultarFacturaPagoProveedor.CambiarEstadoPagoProveedor(' + full.NumeroPago + ',' + full.IdFactura + ',' + full.OrdenCompra + ' )" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + full.NumeroPago + '">';
                                }

                                return resultado;
                            }
                        },
                        {
                            "data": "NumeroPago",
                            "orderable": false,
                            "searchable": false,
                            "width": "10%",
                            "render": function (data, type, full, meta) {
                                return '<input type="button" class="btn btn-produccion" value="Ver detalle" Onclick="consultarDetalleFacturaPagoProveedor.VerDetallePagoProveedor(' + data + ')" >';
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

        },

        /**
         * Cargar opcion de el selector de empresas
        */
        CargarComboEmpresas: function () {
            RequestHttp._Post(consultarFacturaPagoProveedor.URL_LISTAR_TIPO_DOCUMENTO, null, null, function (data) {
                if (data != null) {
                    var tipoMensaje = (data.state == true) ? "sucess" : "danger";
                    Utils._BuilderMessage(tipoMensaje, data.message);
                    if (data.state == true) {
                        consultarFacturaPagoProveedor.DATA_TIPO_DOCUMENTO = data.data;
                        consultarFacturaPagoProveedor.CargarEmpresa();
                    } else {
                        Utils._BuilderMessage("danger", data.message);
                    }
                }
            })
        },

        /**
         * Cargar opcion de el selector de empresas
        */
        CargarEmpresa: function () {
            $selectTipoDocumento = $("#select-empresa");
            $selectTipoDocumento.append($("<option/>", { value: 0, text: "Seleccione" }));
            $.each(consultarFacturaPagoProveedor.DATA_TIPO_DOCUMENTO, function (index, item) {
                $selectTipoDocumento.append($("<option/>", { value: item.Value, text: item.Text }));
            });
            Utils._BuilderDropDown();
        },

        OnChangeEmpresa: function (e) {

            var empresaId = $(e).val();
            var clienteId = $("#select-cliente").val();
            var productoId = $("#select-producto").val();

            if (empresaId == "0") {
                jQuery("#select-cliente option").filter(function () {
                    return $.trim($(this).text()) == 'Seleccione'
                }).prop('selected', true);
                $('#select-cliente').selectpicker('refresh');
                
                jQuery("#select-producto option").filter(function () {
                    return $.trim($(this).text()) == 'Seleccione'
                }).prop('selected', true);
                $('#select-producto').selectpicker('refresh');

                jQuery("#select-ot option").filter(function () {
                    return $.trim($(this).text()) == 'Seleccione'
                }).prop('selected', true);
                $('#select-ot').selectpicker('refresh');

                Utils._BuilderMessage("warning", "Debe seleccionar una empresa (*)");
                return true;
            }
            var url = 'ListarClientes';
            var $dropDownList = $("#select-cliente");
            var parameters = {
                id: empresaId
            };
            Utils._GetDataDropDownList($dropDownList, url, parameters);
            Utils._BuilderDropDown();
        },

        OnChangeCliente: function (e) {
            var clienteId = $(e).val();
            var productoId = $("#select-producto").val();

            if (clienteId == "0" || clienteId == "") {
                jQuery("#select-producto option").filter(function () {
                    return $.trim($(this).text()) == 'Seleccione'
                }).prop('selected', true);
                $('#select-producto').selectpicker('refresh');

                jQuery("#select-ot option").filter(function () {
                    return $.trim($(this).text()) == 'Seleccione'
                }).prop('selected', true);
                $('#select-ot').selectpicker('refresh');

                Utils._BuilderMessage("warning", "Debe seleccionar un cliente (*)");
                return true;
            }
            var url = 'ListarProductos';
            var $dropDownList = $("#select-producto");
            var parameters = {
                id: clienteId
            };
            Utils._GetDataDropDownList($dropDownList, url, parameters);
            Utils._BuilderDropDown();
        },

        OnChangeProducto: function (e) {
            var empresaId = $("#select-empresa").val();
            var clienteId = $("#select-cliente").val();
            var productoId = $(e).val();

            if (productoId == "0" || productoId == "") {
                jQuery("#select-ot option").filter(function () {
                    return $.trim($(this).text()) == 'Seleccione'
                }).prop('selected', true);
                $('#select-ot').selectpicker('refresh');
                Utils._BuilderMessage("warning", "Debe seleccionar un producto (*)");
                return true;
            }
            var url = 'ListarOts';
            var $dropDownList = $("#select-ot");
            var parameters = {
                clienteId: clienteId,
                empresaId: empresaId,
                productoId: productoId
            };
            Utils._GetDataDropDownList($dropDownList, url, parameters);
            Utils._BuilderDropDown();
        },

        /**
        * Cancelar factura
        */
        CambiarEstadoPagoProveedor: function (numeroPago, factura, orden) {
            consultarFacturaPagoProveedor.NUMERO_PAGO_ID = numeroPago;
            consultarFacturaPagoProveedor.NUMERO_FACTURA = factura;
            consultarFacturaPagoProveedor.NUMERO_ORDEN = orden;
            Utils._BuilderConfirmation('CANCELAR FACTURA', '¿Está seguro que desea realizar esta acción?', consultarFacturaPagoProveedor.AbrirModalCierreSolicitud, consultarFacturaPagoProveedor.RecargarTabla);
        },

        AbrirModalCierreSolicitud: function () {
            Utils._OpenModal(URL_CANCELAR_PAGO_FACTURA_PROVEEDOR + "?idPagoProveedor=" + consultarFacturaPagoProveedor.NUMERO_PAGO_ID + "&idFactura=" + consultarFacturaPagoProveedor.NUMERO_FACTURA + "&idOrdenCompra=" + consultarFacturaPagoProveedor.NUMERO_ORDEN, consultarFacturaPagoProveedor.ExecuteOnLoad, "md");
        },

        ExecuteOnLoad: function () {
        },

        RecargarTabla: function() {
            $TABLA_FACTURA_PAGO_PROVEEDOR.draw();
        },

        OnBeginCancelar: function (jqXHR, settings) {
            var data = $(this).serializeObject();
            settings.data = jQuery.param(data);
            return true;
        },

        OnCompleteCierreSolicitud: function(resultado) {
            var tipoMensaje = "danger";
            if (resultado.state == true) {
                tipoMensaje = "success";
            }
            Utils._BuilderMessage(tipoMensaje, resultado.message);
            Utils._CloseModal();
            consultarFacturaPagoProveedor.RecargarTabla();
        }

    }

}();

consultarFacturaPagoProveedor.init();