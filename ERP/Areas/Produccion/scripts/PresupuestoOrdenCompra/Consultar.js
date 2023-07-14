﻿var PresupuestoOrdenCompraConsultar = {
    $TABLA_ITEMS: null,
    $TABLA_ITEMS_ASOCIADOS: null,
    OnLoad: function () {
        this.CrearTablaItems();
        this.CrearTablaItemsAsociados();
    },
    CrearTablaItems: function () {
        var ordenCompraId = $("#OrdenCompraId").val();
        this.$TABLA_ITEMS = $("#tabla_orden_compra_items").dataTable({
            "ajax": {
                "url": URL_PRESUPUESTO_ITEMS_INTERNO_LISTAR_POR_ORDEN_COMPRA,
                "type": "POST",
                "data": function (d) {
                    //d.search['value'] = $filtro.val();
                    d.ordenCompraId = ordenCompraId;
                    return $.extend({}, d, {
                        "adicional": {
                        }
                    });
                }
            },
            "columns": [
                { "data": "Orden" },
                { "data": "Grupo" },
                { "data": "Nombre" },
                { "data": "Dias" },
                { "data": "Cantidad" },
                {
                    "data": "ValorUnitario",
                    "render": function (data, type, full, meta) {
                        var html = '<input type="text" class="form-control" data-format-price="" value="' + data + '" readonly="readonly" />';
                        return html;
                    }
                },
                {
                    "data": "SubTotal",
                    "render": function (data, type, full, meta) {
                        var html = '<input type="text" class="form-control" data-format-price="" value="' + data + '" readonly="readonly" />';
                        return html;
                    }
                },
                { "data": "Volumen" },
                {
                    "data": "Costo",
                    "render": function (data, type, full, meta) {
                        var html = '<input type="text" class="form-control" data-format-price="" value="' + data + '" readonly="readonly" />';
                        return html;
                    }
                }
            ],
            "drawCallback": function (settings) {
                Utils._InputFormatPrice();
            }
        });
    },
    CrearTablaItemsAsociados: function () {
        var ordenCompraId = $("#OrdenCompraId").val();
        this.$TABLA_ITEMS_ASOCIADOS = $("#tabla_orden_compra_items_asociados").dataTable({
            "ajax": {
                "url": URL_PRESUPUESTO_ITEMS_ASOCIADOS_LISTAR_POR_ORDEN_COMPRA,
                "type": "POST",
                "data": function (d) {
                    //d.search['value'] = $filtro.val();
                    d.ordenCompraId = ordenCompraId;
                    return $.extend({}, d, {
                        "adicional": {
                        }
                    });
                }
            },
            "columns": [
                { "data": "ItemOrden" },
                { "data": "Orden" },
                { "data": "Nombre" },
                { "data": "Dias" },
                { "data": "Cantidad" },
                {
                    "data": "ValorUnitario",
                    "render": function (data, type, full, meta) {
                        var html = '<input type="text" class="form-control" data-format-price="" value="' + data + '" readonly="readonly" />';
                        return html;
                    }
                },
                {
                    "data": "SubTotal",
                    "render": function (data, type, full, meta) {
                        var html = '<input type="text" class="form-control" data-format-price="" value="' + data + '" readonly="readonly" />';
                        return html;
                    }
                },
                { "data": "Volumen" },
                {
                    "data": "Costo",
                    "render": function (data, type, full, meta) {
                        var html = '<input type="text" class="form-control" data-format-price="" value="' + data + '" readonly="readonly" />';
                        return html;
                    }
                }
            ],
            "drawCallback": function (settings) {
                Utils._InputFormatPrice();
            }
        });
    },
    DescargarInforme: function () {
        var ordenCompraId = $("#OrdenCompraId").val();
        var parameters = {
            BaseUrl: ForDefault._UrlBase,
            OrdenCompraId: ordenCompraId,
        };
        ReportsP._OpenTab("PDF", "Produccion/PresupuestoOrdenCompra/OrdenCompra.trdp", parameters);
    }

};