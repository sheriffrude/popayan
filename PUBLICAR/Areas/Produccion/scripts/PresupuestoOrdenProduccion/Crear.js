/**
 * this
 */
var PresupuestoOrdenProduccionCrear = {
    /**
     * Propiedades de la clase
     */
    $TABLA_ORDEN_PRODUCCION_ITEMS: null,
    $TABLA_ORDEN_PRODUCCION_ITEMS_ASOCIADOS: null,
    LISTA_ITEMS_SELECCIONADOS: [],
    LISTA_ITEMS_ASOCIADOS_SELECCIONADOS: [],
    ITEM_ID_BUSCAR_ASOCIADOS: null,
    /**
     * OnLoad
     */
    OnLoad: function () {
        $("#FechaEntrega, #FechaRadicacion, #FechaRadicacion, #FechaVigenciaInicial, #FechaVigenciaFinal").datepicker({
            minDate: -0,
            minMonth: -0,
            firstDay: 1
        }).datepicker("setDate", new Date()).val('');
    },
    /**
     * OnchangeProveedor
     */
    OnchangeProveedor: function (e) {
        var proveedorId = $(e).val();

        this.LISTA_ITEMS_SELECCIONADOS = [];
        this.LISTA_ITEMS_ASOCIADOS_SELECCIONADOS = [];

        if (!Validations._IsNull(proveedorId)) {
            this.CrearTablaItems(proveedorId);
            this.CrearTablaItemsAsociados(proveedorId);
        } else {
            $("#tabla_orden_produccion_items, #tabla_orden_produccion_items_asociados").addClass("display-none");
        }
    },
    /**
     * CrearTablaItems
     */
    CrearTablaItems: function (proveedorId) {
        if (this.$TABLA_ORDEN_PRODUCCION_ITEMS != null)
            this.$TABLA_ORDEN_PRODUCCION_ITEMS.fnDestroy();

        $("#tabla_orden_produccion_items").removeClass("display-none");

        this.$TABLA_ORDEN_PRODUCCION_ITEMS = $("#tabla_orden_produccion_items").dataTable({
            "ajax": {
                "url": URL_PRESUPUESTO_LISTAR_ITEMS_INTERNO_POR_PROVEEDOR,
                "type": "POST",
                "data": function (d) {
                    //d.search['value'] = $filtro.val();
                    d.proveedorId = proveedorId;
                    d.presupuestoId = PresupuestoConsultar.PRESUPUESTO_ID;
                    return $.extend({}, d, {
                        "adicional": {
                        }
                    });
                }
            },
            "columns": [
                {
                    "data": "Orden"
                },
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "width": "5%",
                    "render": function (data, type, full, meta) {
                        var itemSeleccionado = false;
                        for (var i = 0; i < PresupuestoOrdenProduccionCrear.LISTA_ITEMS_SELECCIONADOS.length; i++) {
                            if (PresupuestoOrdenProduccionCrear.LISTA_ITEMS_SELECCIONADOS[i] == full.Id) {
                                itemSeleccionado = true;
                                break;
                            }
                        }

                        var checked = (itemSeleccionado) ? 'checked="checked"' : '';

                        var html = '<div class="container-checkbox">' +
                            '<input type="checkbox" id="checkbox_op_item_seleccionar_' + full.Id + '" ' + checked + ' class="radio_item_seleccionar" onchange="PresupuestoOrdenProduccionCrear.OnChangeSeleccionarItem(this)" value="' + data + '" />' +
                            '<label for="checkbox_op_item_seleccionar_' + full.Id + '"></label>' +
                            '</div>';
                        return html;
                    }
                },
                { "data": "Grupo" },
                { "data": "Nombre" },
                { "data": "Dias" },
                { "data": "Cantidad" },
                { "data": "Iva" },
          
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
    /**
     * RecargarPaginaTablaItems
     */
    RecargarPaginaTablaItems: function () {
        this.$TABLA_ORDEN_PRODUCCION_ITEMS.fnDraw('page');
    },
    /**
     * OnChangeSeleccionarItem
     */
    OnChangeSeleccionarItem: function (e) {
        var itemId = $(e).val();
        var checked = $(e).is(":checked");

        var existe = false;
        for (var i = 0; i < this.LISTA_ITEMS_SELECCIONADOS.length; i++) {
            if (this.LISTA_ITEMS_SELECCIONADOS[i] == itemId) {
                existe = true;
                this.LISTA_ITEMS_SELECCIONADOS.splice(i, 1);
                break;
            }
        }

        if (!existe) {
            this.LISTA_ITEMS_SELECCIONADOS.push(itemId);

            //Eliminar checked Asociados del item
            var listaAsociadosTemp = [];
            for (var i = 0; i < this.LISTA_ITEMS_ASOCIADOS_SELECCIONADOS.length; i++) {
                if (this.LISTA_ITEMS_ASOCIADOS_SELECCIONADOS[i].ItemId != itemId)
                    listaAsociadosTemp.push(this.LISTA_ITEMS_ASOCIADOS_SELECCIONADOS[i]);
            }

            this.LISTA_ITEMS_ASOCIADOS_SELECCIONADOS = listaAsociadosTemp;
            this.RecargarPaginaTablaItemsAsociados();
        }
    },
    /**
     * CrearTablaItemsAsociados
     */
    CrearTablaItemsAsociados: function (proveedorId) {
        if (this.$TABLA_ORDEN_PRODUCCION_ITEMS_ASOCIADOS != null)
            this.$TABLA_ORDEN_PRODUCCION_ITEMS_ASOCIADOS.fnDestroy();

        $("#tabla_orden_produccion_items_asociados").removeClass("display-none");

        this.$TABLA_ORDEN_PRODUCCION_ITEMS_ASOCIADOS = $("#tabla_orden_produccion_items_asociados").dataTable({
            "ajax": {
                "url": URL_PRESUPUESTO_LISTAR_ITEMS_ASOCIADOS_POR_PROVEEDOR,
                "type": "POST",
                "data": function (d) {
                    //d.search['value'] = $filtro.val();
                    d.proveedorId = proveedorId;
                    d.presupuestoId = PresupuestoConsultar.PRESUPUESTO_ID;
                    return $.extend({}, d, {
                        "adicional": {
                        }
                    });
                }
            },
            "columns": [
                {
                    "data": "ItemOrden"
                },
                {
                    "data": "Orden"
                },
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "width": "5%",
                    "render": function (data, type, full, meta) {
                        var asociadoSeleccionado = false;
                        for (var i = 0; i < PresupuestoOrdenProduccionCrear.LISTA_ITEMS_ASOCIADOS_SELECCIONADOS.length; i++) {
                            if (PresupuestoOrdenProduccionCrear.LISTA_ITEMS_ASOCIADOS_SELECCIONADOS[i].AsociadoId == full.Id) {
                                asociadoSeleccionado = true;
                                break;
                            }
                        }

                        var checked = (asociadoSeleccionado) ? 'checked="checked"' : '';

                        var html = '<div class="container-checkbox">' +
                            '<input type="checkbox" id="checkbox_oc_item_asociado_seleccionar_' + full.Id + '" ' + checked + ' class="radio_item_seleccionar" onchange="PresupuestoOrdenProduccionCrear.OnChangeSeleccionarItemAsociado(this, ' + full.ItemId + ')" value="' + data + '" />' +
                            '<label for="checkbox_oc_item_asociado_seleccionar_' + full.Id + '"></label>' +
                            '</div>';
                        return html;
                    }
                },
                { "data": "Nombre" },
                { "data": "Dias" },
                { "data": "Cantidad" },
                { "data": "Iva" },
            
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
    /**
     * RecargarTablaItemsAsociados
     */
    RecargarPaginaTablaItemsAsociados: function () {
        this.$TABLA_ORDEN_PRODUCCION_ITEMS_ASOCIADOS.fnDraw('page');
    },
    /**
     * OnChangeSeleccionarItemAsociado
     */
    OnChangeSeleccionarItemAsociado: function (e, itemId) {
        var asociadoId = $(e).val();
        var checked = $(e).is(":checked");

        var existe = false;
        for (var i = 0; i < this.LISTA_ITEMS_ASOCIADOS_SELECCIONADOS.length; i++) {
            if (this.LISTA_ITEMS_ASOCIADOS_SELECCIONADOS[i].AsociadoId == asociadoId) {
                existe = true;
                this.LISTA_ITEMS_ASOCIADOS_SELECCIONADOS.splice(i, 1);
                break;
            }
        }

        if (!existe) {
            this.LISTA_ITEMS_ASOCIADOS_SELECCIONADOS.push({
                ItemId: itemId,
                AsociadoId: asociadoId
            });

            //Eliminar checked Item
            for (var i = 0; i < this.LISTA_ITEMS_SELECCIONADOS.length; i++) {
                if (this.LISTA_ITEMS_SELECCIONADOS[i] == itemId) {
                    this.LISTA_ITEMS_SELECCIONADOS.splice(i, 1);
                    break;
                }
            }

            this.RecargarPaginaTablaItems();
        }
    },
    /**
     * OnBegin
     */
    OnBegin: function (jqXHR, settings) {
        if (PresupuestoOrdenProduccionCrear.LISTA_ITEMS_SELECCIONADOS.length == 0 && PresupuestoOrdenProduccionCrear.LISTA_ITEMS_ASOCIADOS_SELECCIONADOS.length == 0) {
            Utils._BuilderMessage("warning", "Debe seleccionar los ítems o asociados de la Orden de Producción");
            return false;
        }

        var data = $(this).serializeObject();

        //Depurar array lista items asociados
        var listaItemAsociados = [];
        for (var i = 0; i < PresupuestoOrdenProduccionCrear.LISTA_ITEMS_ASOCIADOS_SELECCIONADOS.length; i++) {
            listaItemAsociados.push(PresupuestoOrdenProduccionCrear.LISTA_ITEMS_ASOCIADOS_SELECCIONADOS[i].AsociadoId);
        }

        data["PresupuestoId"] = PresupuestoConsultar.PRESUPUESTO_ID;
        data["ListaItems"] = PresupuestoOrdenProduccionCrear.LISTA_ITEMS_SELECCIONADOS;
        data["ListaItemsAsociados"] = listaItemAsociados;
        settings.data = jQuery.param(data);
        return true;
    },
    /**
     * OnComplete
     */
    OnComplete(response) {
        var resultado = RequestHttp._ValidateResponse(response);
        if (resultado != null) {
            var tipoMensaje = "danger";
            if (resultado.state == true) {
                tipoMensaje = "success"
                PresupuestoItemListar.RecargarPaginaTabla();
                Utils._CloseModal();
            }
            Utils._BuilderMessage(tipoMensaje, resultado.message);
        }
    }
}