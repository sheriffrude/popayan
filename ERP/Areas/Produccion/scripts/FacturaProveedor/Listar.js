var consultarFacturaProveedor = function () {

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

            consultarFacturaProveedor.CargarComboEmpresas();

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
     * Listar tabla facturas radicadas proveedor
     **/

        CargarFacturasProveedor: function () {
            var $filtro = $("#texto");
            var IdEmpresa = $("#select-empresa").val();
            if (IdEmpresa === "0")
                IdEmpresa = null;

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
                            d.empresaId = IdEmpresa;
                            d.proveedorId = $("#select-cliente").val();
                            d.productoId = $("#select-producto").val();
                            d.otId = $("#select-ot").val();
                            d.fechaInico = $("#FechaInicio").val();
                            d.fechaFin = $("#FechaFin").val();

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
                        { "data": "Id" },
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
                            "render": function (data, type, full, meta) {
                                var html = '<input type="text" data-format-price value="' + data + '" disabled="disabled" />';
                                return html;
                            }
                        },
                        {

                            "data": "TotalImpuestos",
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
                                console.log(PERMISO_CAMBIO_ESTADO_FACTURA_PROVEEDOR);
                                if (PERMISO_CAMBIO_ESTADO_FACTURA_PROVEEDOR ==true) {


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
                        Utils._InputFormatPrice();
                    }
                });

        }
        ,

        /**
         * Cargar opcion de el selector de empresas
        */
        CargarComboEmpresas: function () {
            RequestHttp._Post(consultarFacturaProveedor.URL_LISTAR_EMPRESAS, null, null, function (data) {
                if (data != null) {
                    var tipoMensaje = (data.state == true) ? "sucess" : "danger";
                    Utils._BuilderMessage(tipoMensaje, data.message);
                    if (data.state == true) {
                        consultarFacturaProveedor.DATA_EMPRESAS = data.data;
                        consultarFacturaProveedor.CargarEmpresa();
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
            $.each(consultarFacturaProveedor.DATA_EMPRESAS, function (index, item) {
                $selectTipoDocumento.append($("<option/>", { value: item.Value, text: item.Text }));
            });
            Utils._BuilderDropDown();
        },

        OnChangeEmpresa: function (e) {

            var empresaId = $(e).val();
            var proveedorId = $("#select-cliente").val();


            if (empresaId == "0") {
                jQuery("#select-cliente option").filter(function () {
                    return $.trim($(this).text()) == 'Seleccione'
                }).prop('selected', true);
                $('#select-cliente').selectpicker('refresh');




                return true;
            }

            var url = "/Produccion/FacturaProveedor/ListarProveedores";

            var $dropDownList = $("#select-cliente");
            var parameters = {
                id: empresaId
            };
            Utils._GetDataDropDownList($dropDownList, url, parameters);
            Utils._BuilderDropDown();
        },
        OnChangeProveedor: function (e) {

            var proveedorId = $(e).val();
            var productoId = $("#select-producto").val();

            if (proveedorId == "0" || proveedorId == "") {
                jQuery("#select-producto option").filter(function () {
                    return $.trim($(this).text()) == 'Seleccione'
                }).prop('selected', true);
                $('#select-producto').selectpicker('refresh');

                jQuery("#select-ot option").filter(function () {
                    return $.trim($(this).text()) == 'Seleccione'
                }).prop('selected', true);
                $('#select-ot').selectpicker('refresh');


                return true;
            }
            var url = "/Produccion/FacturaCliente/ListarProductos";
            var $dropDownList = $("#select-producto");
            var parameters = {
                id: proveedorId
            };
            Utils._GetDataDropDownList($dropDownList, url, parameters);
            Utils._BuilderDropDown();
        },

        ////////////////////////


        LimpiarRegistroFactura: function () {
            $("#orden-compra-factura").addClass('hidden');
        },

        /**
        * Mostrar el detalle de la factura del proveedor 
        **/
        DetalleFacturasProveedor: function (id) {
            Utils._OpenModal(URL_DETALLE_FACTURA_PROVEEDOR + "?ordenCompraId=" + id, "OnLoadDetalleFactura", "lg");
        },

        OnLoadDetalleFactura: function () {
            ORDEN_COMPRA = $("#OrdenCompra").val();
            VOLUMEN = $("#Volumen").val();
            CrearTablaItemsOrdenCompraFactura();
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
        },





        /**
* Cancelar factura
*/
        CancelarFactura: function (idFactura, idOrdenCompra) {
            FACTURA_ID = idFactura.value;
            ORDEN_COMPRA_CONSULTADA = idOrdenCompra;
            Utils._BuilderConfirmation('CANCELAR FACTURA', '¿Está seguro que desea realizar esta acción?', 'CancelarFacturas', RecargarTabla);
        },

        RecargarTabla: function () {
            $TABLA_FACTURAS_RADICADAS.draw();
        },

        CancelarFacturas: function () {
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
        },




        ////////////////////////



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
                facturaId: consultarFacturaCliente.NUMERO_FACTURA,
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

        RecargarTabla: function () {
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

consultarFacturaProveedor.init();