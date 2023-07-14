$(function () {
    AprobacionFacturaProveedorListar.OnLoad();
});

var AprobacionFacturaProveedorListar = {
    $TABLA: null,
    PRESUPUESTO_ID: null,
    VERSION_PRESUPUESTO_ID: null,
    ITEM_ID: null,

    OnLoad: function () {
        this.CrearTabla();
        AprobacionFacturaProveedorListar.PRESUPUESTO_ID = 0;
        AprobacionFacturaProveedorListar.VERSION_PRESUPUESTO_ID = 0;
        AprobacionFacturaProveedorListar.ITEM_ID = 0;
        $("#form-filtro-tabla").submit(AprobacionFacturaProveedorListar.RecargarTabla);
    },

    CrearTabla: function () {

        var $filtro = $("#input-filtro");
        console.log($filtro, URL_APROBACION_FACTURA_PROVEEDORN_LISTAR, $("#Estado").val());
        this.$TABLA = $("#tabla_aprobaciones_facturas_proveedor").DataTable({
            "scrollX": true,
            "ajax": {
                "url": URL_APROBACION_FACTURA_PROVEEDORN_LISTAR,
                "type": "POST",
                "data": function (d) {
                    d.search["value"] = $filtro.val();
                    d.estado = $("#Estado").val();
                    return $.extend({}, d, {
                        "adicional": {}
                    });
                }
            },
            "columns": [
                {
                    "data": "NumeroDocumento"
                },
                { "data": "EstadoFactura" },
                { "data": "OrdenCompra" },
                {
                    "data": "OrdenCompra",
                    "orderable": false,
                    "searchable": false,
                    "width": "10%",
                    "render": function (data, type, full, meta) {

                        return '<input type="button" class="btn btn-secondary" value="Ver detalle" Onclick="AprobacionFacturaProveedorListar.DetalleFacturasProveedor(' + data + ')" >';
                    }
                },
                { "data": "NumeroPresupuesto" },
                { "data": "VersionExterna" },
                {
                    "data": "AprobacionPresupuestoGrupoUsuarioId",
                    "render": function (data, type, full, meta) {
                        var html = '';
                        if (full.EstadoId == 1) { ///Pendiente
                            var url = URL_APROBACION_FACTURA_PROVEEDOR_RESPONDER + '/' + data;
                            html = '<a href="' + url + '"  data-toggle="modal" data-target="#" class="btn btn-secondary" >Aprobar/Rechazar</a>';
                        }
                        return html;
                    }
                },
                { "data": "Empresa" },
                { "data": "Cliente" },
                {
                    "data": "OrdenTrabajo"
                },
                { "data": "DescripcionOrdenTrabajo" },
                { "data": "Referencia" },
                { "data": "EnviadoPor" },
                { "data": "FechaRadicacion" },
                {
                    "data": "Estado",
                    "render": function (data, type, full, meta) {
                        var html = '<label>' + data + '</label>';
                        var url = URL_JERARQUIA_APROBACION_FACTURA_PROVEEDOR_LISTAR + '/' + full.Id;
                        html += '<a href="' + url + '" class="btn btn-secondary" data-size="lg" data-toggle="modal" data-target="#" data-execute-onload="AprobacionFacturaProveedorListarJerarquia.Onload" >Ver Jerarquía</a>';
                        return html;
                    }
                },
            ],
            "drawCallback": function (settings) {
                Utils._BuilderModal();
            }
        });
    },

    RecargarTabla: function () {
        AprobacionFacturaProveedorListar.$TABLA.draw();
        return false;
    },
    RecargarTablaPage: function () {
        AprobacionFacturaProveedorListar.$TABLA.draw("Page");
        return false;
    },
    ResetearFiltroTabla: function () {
        $("#input-filtro").val("");
        $("#form-filtro-tabla")[0].reset();
        AprobacionFacturaProveedorListar.RecargarTabla();
        Utils._BuilderDropDown();
    },

    /**
    * Mostrar el detalle de la factura del proveedor 
    **/
    DetalleFacturasProveedor: function (id) {
        Utils._OpenModal(URL_DETALLE_FACTURA_PROVEEDOR + "?ordenCompraId=" + id, "AprobacionFacturaProveedorListar.OnLoadDetalleFactura", "lg");
    },

    OnLoadDetalleFactura: function () {
        ORDEN_COMPRA = $("#OrdenCompra").val();
        VOLUMEN = $("#Volumen").val();
        AprobacionFacturaProveedorListar.CrearTablaAsociadosOrdenCompraFactura();
        AprobacionFacturaProveedorListar.CrearTablaItemsOrdenCompraFactura();
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
    }

}