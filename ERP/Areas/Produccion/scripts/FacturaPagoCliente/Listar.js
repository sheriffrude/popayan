var consultarFacturaPagoCliente = function () {

    return {

        URL_LISTAR_TIPO_DOCUMENTO: null,
        DATA_TIPO_DOCUMENTO: null,
        ID_PAGO: null,

        init: function () {
            $TABLA_FACTURA_PAGO_CLIENTE = null;
            this.URL_LISTAR_TIPO_DOCUMENTO = '/Produccion/FacturaPagoProveedor/ListarEmpresas';
            this.DATA_TIPO_DOCUMENTO = null;
            this.ID_PAGO = null;
            consultarFacturaPagoCliente.CargarComboEmpresas();
        },

        /**
        *Funcion para crear tabla de los pagos de las facturas de proveedores
        */
        CrearTablaFacturasPagoCliente: function () {

            var $filtro = $("#texto");
            var IdEmpresa = $("#select-empresa").val();
            if (IdEmpresa === "0")
                IdEmpresa = null;

            $TABLA_FACTURA_PAGO_CLIENTE = $("#tabla_factura_pago_cliente").DataTable(
                {
                    "scrollX": true,
                    "bDestroy": true,
                    "ajax": {
                        "url": URL_CONSULTAR_FACTURA_PAGO_CLIENTE,
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
                            "data": "IdPago",
                            "width": "10%",
                            "render": function (data, type, full, meta) {
                                return meta.row + meta.settings._iDisplayStart + 1;
                            }
                        },
                        { "data": "NumeroInternoFactura" },
                        { "data": "Empresa" },
                        { "data": "Cliente" },
                        { "data": "Producto" },
                        { "data": "OrdenTrabajo" },
                        { "data": "NumeroPresupuesto" },
                        { "data": "NumeroFactura" },
                        {
                            "data": "ValorFactura",
                            "orderable": false,
                            "searchable": false,
                            "width": "20%",
                        },
                        {
                            "data": "Impuestos",
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
                        { "data": "EstadoFactura" },
                        { "data": "TipoPago" },
                        {
                            "data": "TotalPago",
                            "orderable": false,
                            "searchable": false,
                            "width": "20%",
                        },
                        { "data": "FechaPago" },
                        { "data": "UsuarioRegistroPago" },
                        {
                            "data": "EstadoPago",
                            "orderable": false,
                            "width": "10%",
                            "render": function (data, type, full, meta) {
                                var resultado = "";
                                if (data == 1) {
                                    var checked = "checked";
                                    resultado = 'Activa';
                                } else {
                                    resultado = 'Cancelada';
                                }
                                return resultado;
                            }
                        },
                        {
                            "data": "EstadoPago",
                            "orderable": false,
                            "width": "10%",
                            "render": function (data, type, full, meta) {
                                var resultado = "";
                                if (data == 1) {
                                    var checked = "checked";
                                    resultado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-persona btn-sm" onchange="consultarFacturaPagoCliente.CambiarEstadoPagoProveedor(' + full.IdPago + ' )" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + data + '">';
                                } else {
                                    resultado = "";
                                    resultado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-persona btn-sm" onchange="consultarFacturaPagoCliente.CambiarEstadoPagoProveedor(' + full.IdPago + ' )" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + data + '">';
                                }
                                return resultado;
                            }
                        },
                        {
                            "data": "IdPago",
                            "orderable": false,
                            "searchable": false,
                            "width": "10%",
                            "render": function (data, type, full, meta) {
                                return '<input type="button" class="btn btn-secondary" value="Ver detalle" Onclick="consultarDetalleFacturaPagoCliente.VerDetallePagoCliente(' + data + ')" >';
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
            RequestHttp._Post(consultarFacturaPagoCliente.URL_LISTAR_TIPO_DOCUMENTO, null, null, function (data) {
                if (data != null) {
                    var tipoMensaje = (data.state == true) ? "sucess" : "danger";
                    Utils._BuilderMessage(tipoMensaje, data.message);
                    if (data.state == true) {
                        consultarFacturaPagoCliente.DATA_TIPO_DOCUMENTO = data.data;
                        consultarFacturaPagoCliente.CargarEmpresa();
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

            $.each(consultarFacturaPagoCliente.DATA_TIPO_DOCUMENTO, function (index, item) {
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
            
            var url = '/Produccion/FacturaPagoProveedor/ListarClientes';
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
            var url = '/Produccion/FacturaPagoProveedor/ListarProductos';
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
            var url = '/Produccion/FacturaPagoProveedor/ListarOts';
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
        CambiarEstadoPagoProveedor: function (IdPago) {
            consultarFacturaPagoCliente.ID_PAGO = IdPago;
            Utils._BuilderConfirmation('CANCELAR FACTURA', '¿Está seguro que desea realizar esta acción?', consultarFacturaPagoCliente.CancelarFacturas, consultarFacturaPagoCliente.RecargarTabla);
        },

        CancelarFacturas: function () {

            var parameters = {
                id: consultarFacturaPagoCliente.ID_PAGO,
            };

            RequestHttp._Post(URL_CANCELAR_PAGO_FACTURA_CLIENTE, parameters, null, function (data) {

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
        },

        RecargarTabla: function () {
            $TABLA_FACTURA_PAGO_CLIENTE.draw();
        }

    }
}();
consultarFacturaPagoCliente.init();