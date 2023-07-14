var consultarFacturaCliente = function () {

    return {

        URL_LISTAR_EMPRESAS: null,
        URL_CONSULTAR_FACTURA_PAGO_PROVEEDOR: null,
        URL_CAMBIAR_ESTADO: null,
        DATA_EMPRESAS: null,
        NUMERO_FACTURA: null,
        NUMERO_PRESUPUESTO: null,

        init: function () {

            this.URL_LISTAR_EMPRESAS = "/Produccion/FacturaPagoProveedor/ListarEmpresas";
            this.URL_CONSULTAR_FACTURA_PAGO_PROVEEDOR = "/Produccion/FacturaCliente/Listar";
            this.URL_CAMBIAR_ESTADO = "/Produccion/FacturaCliente/Cancelar";
            $TABLA_FACTURAS_CLIENTES = null;
            this.DATA_EMPRESAS = null;
            this.NUMERO_FACTURA = null;
            this.NUMERO_PRESUPUESTO = null;

            consultarFacturaCliente.CargarComboEmpresas();
       
            $("#FechaInicio").datepicker({
                dateFormat: 'dd/mm/yy',
                firstDay: 1
            }).datepicker("setDate", new Date()).val('');

            $("#FechaFin").datepicker({
                dateFormat: 'dd/mm/yy',
                firstDay: 1
            }).datepicker("setDate", new Date()).val('');

        },

        /**
        *Funcion para crear tabla del registro de facturas de clientes
        */
        CrearTablaFacturasClientes: function () {
            var $filtro = $("#texto");
            var IdEmpresa = $("#select-empresa").val();
            if (IdEmpresa === "0")
                IdEmpresa = null;

            $TABLA_FACTURAS_CLIENTES = $("#tabla_factura_cliente").DataTable(
                {
                    "scrollX": true,
                    "bDestroy": true,
                    "ajax": {
                        "url": consultarFacturaCliente.URL_CONSULTAR_FACTURA_PAGO_PROVEEDOR,
                        "type": "POST",
                        "data": function (d) {
                            d.search["value"] = $filtro.val();
                            d.empresaId = IdEmpresa;
                            d.clienteId = $("#select-cliente").val();
                            d.productoId = $("#select-producto").val();
                            d.otId = $("#select-ot").val();
                            d.fechaInico = $("#FechaInicio").val();
                            d.fechaFin = $("#FechaFin").val();
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
                        { "data": "Empresa" },
                        { "data": "Cliente" },
                        { "data": "Producto" },
                        { "data": "OrdenTrabajo" },
                        { "data": "NumeroPresupuesto" },
                        { "data": "IdFactura" },
                        { "data": "Factura" },
                        { "data": "FechaFactura" },                        
                        {
                            "data": "ValorFactura",
                            "orderable": false,
                            "searchable": false,
                            "width": "20%",
                            "render": function (data, type, full, meta) {
                                var html = '<input type="text" data-format-price value="' + data + '" disabled="disabled" />';
                                return html;
                            }
                        },
                        {
                            "data": "ValorImpuestos",
                            "orderable": false,
                            "searchable": false,
                            "width": "20%",
                            "render": function (data, type, full, meta) {
                                var html = '<input type="text" data-format-price value="' + data + '" disabled="disabled" />';
                                return html;
                            }
                        },
                        {
                            "data": "Total",
                            "orderable": false,
                            "searchable": false,
                            "width": "20%",
                            "render": function (data, type, full, meta) {
                                var html = '<input type="text" data-format-price value="' + data + '" disabled="disabled" />';
                                return html;
                            }
                        },
                        { "data": "FechaRegistro" },
                        { "data": "UsuarioRegistro" },
                        { "data": "EstadoFactura" },
                        {
                            "data": "EstadoFactura",
                            "orderable": false,
                            "width": "10%",
                            "render": function (data, type, full, meta) {
                                var resultado = "";
                                if (data == "Registrada") {
                                    //Estado: Registrado
                                    var checked = "checked";
                                    resultado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-persona btn-sm" onchange="consultarFacturaCliente.CambiarEstadoFacturaCliente(' + full.IdFactura + ',' + full.NumeroPresupuesto + ' )" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + full.IdFactura + '">';

                                } else if (data == "Cancelada") {
                                    //Estado: Finalizada
                                    resultado = "";
                                    resultado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-persona btn-sm" onchange="consultarFacturaCliente.CambiarEstadoFacturaCliente(' + full.IdFactura + ',' + full.NumeroPresupuesto + ' )" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + full.IdFactura + '">';
                                }
                                return resultado;
                            }
                        },
                        {
                            "data": "IdFactura",
                            "orderable": false,
                            "searchable": false,
                            "width": "10%",
                            "render": function (data, type, full, meta) {
                                return '<input type="button" class="btn btn-secondary" value="Ver detalle" Onclick="consultarDetalleFacturaCliente.VerDetalleFacturaCliente(' + data + ')" >';
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
                        Utils._InputFormatPrice();
                    }
                });
        },

        /**
         * Cargar opcion de el selector de empresas
        */
        CargarComboEmpresas: function () {
            RequestHttp._Post(consultarFacturaCliente.URL_LISTAR_EMPRESAS, null, null, function (data) {
                if (data != null) {
                    var tipoMensaje = (data.state == true) ? "sucess" : "danger";
                    Utils._BuilderMessage(tipoMensaje, data.message);
                    if (data.state == true) {
                        consultarFacturaCliente.DATA_EMPRESAS = data.data;
                        consultarFacturaCliente.CargarEmpresa();
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
            $.each(consultarFacturaCliente.DATA_EMPRESAS, function (index, item) {
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

            var url = "/Produccion/FacturaCliente/ListarClientes";

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
            var url = "/Produccion/FacturaCliente/ListarProductos";
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

            var url = "/Produccion/FacturaCliente/ListarOts";
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
        * CambiarEstadoFacturaCliente
        */
        CambiarEstadoFacturaCliente: function (factura, presupuesto) {
            consultarFacturaCliente.NUMERO_FACTURA = factura;
            consultarFacturaCliente.NUMERO_PRESUPUESTO = presupuesto;
            Utils._BuilderConfirmation('CANCELAR FACTURA', '¿Está seguro que desea realizar esta acción?', consultarFacturaCliente.AbrirModalCambioEstado, consultarFacturaCliente.RecargarTabla);
        },

        AbrirModalCambioEstado: function () {

            var parameters = {
                facturaId: consultarFacturaCliente.NUMERO_FACTURA ,
                presupuestoId: consultarFacturaCliente.NUMERO_PRESUPUESTO
            };
            RequestHttp._Post(consultarFacturaCliente.URL_CAMBIAR_ESTADO, parameters, null, function (data) {
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
            //Utils._OpenModal(consultarFacturaCliente.URL_CAMBIAR_ESTADO + "?facturaId=" + consultarFacturaCliente.NUMERO_FACTURA + "&presupuestoId=" + consultarFacturaCliente.NUMERO_PRESUPUESTO, consultarFacturaCliente.ExecuteOnLoad, "md");
        },

        ExecuteOnLoad: function () {
            consultarFacturaCliente.RecargarTabla();
        },

        RecargarTabla: function() {
            $TABLA_FACTURAS_CLIENTES.draw();
        },

        OnBeginCambioEstado: function (jqXHR, settings) {
            var data = $(this).serializeObject();
            settings.data = jQuery.param(data);
            return true;
        },

        OnCompleteCambioEstado: function (resultado) {
            var tipoMensaje = "danger";
            if (resultado.state == true) {
                tipoMensaje = "success";
            }
            Utils._BuilderMessage(tipoMensaje, resultado.message);
            Utils._CloseModal();
            consultarFacturaCliente.RecargarTabla();
        }

    }

}();

consultarFacturaCliente.init();