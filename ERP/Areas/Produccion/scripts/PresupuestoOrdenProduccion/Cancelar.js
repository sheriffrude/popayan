var PresupuestoOrdenProduccionCancelar = {
    $TABLA_ITEMS: null,
    $TABLA_ITEMS_ASOCIADOS: null,
    OnLoad: function () {
        this.CrearTablaItems();
        this.CrearTablaItemsAsociados();
    },
    CrearTablaItems: function () {
        var ordenProduccionId = $("#OrdenProduccionId").val();
        this.$TABLA_ITEMS = $("#tabla_orden_Produccion_items").dataTable({
            "ajax": {
                "url": URL_PRESUPUESTO_ITEMS_INTERNO_LISTAR_POR_ORDEN_Produccion,
                "type": "POST",
                "data": function (d) {
                    //d.search['value'] = $filtro.val();
                    d.ordenProduccionId = ordenProduccionId;
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
        var ordenProduccionId = $("#OrdenProduccionId").val();
        this.$TABLA_ITEMS_ASOCIADOS = $("#tabla_orden_Produccion_items_asociados").dataTable({
            "ajax": {
                "url": URL_PRESUPUESTO_ITEMS_ASOCIADOS_LISTAR_POR_ORDEN_Produccion,
                "type": "POST",
                "data": function (d) {
                    //d.search['value'] = $filtro.val();
                    d.ordenProduccionId = ordenProduccionId;
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
    OnComplete: function (response) {
        alert("hola");
        var resultado = RequestHttp._ValidateResponse(response);
        if (!Validations._IsNull(resultado)) {
            if (resultado.state) {
                Utils._BuilderMessage("success", resultado.message);
                PresupuestoItemListar.RecargarPaginaTabla();
                Utils._CloseModal();
            } else
                Utils._BuilderMessage("danger", resultado.message);
        }
    }
};