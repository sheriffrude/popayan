var PresupuestoItemAnticipoDetalle = function () {
    return {

        URL_PRESUPUESTO_ANTICIPOS_DETALLE: null,
        ITEM_ID: null,

        init: function () {
            this.URL_PRESUPUESTO_ANTICIPOS_DETALLE = '/Produccion/PresupuestoItemAnticipo/Consultar';
            this.URL_DETALLE_ANTICIPO_ITEM = "/Produccion/PresupuestoItemAnticipo/ListarItemAnticiposDetalle";
        },

        /**
        *Funcion para ver el detalle del anticipo
        */
        AbrirModalDetalleAnticipos: function (id) {
            this.ITEM_ID = id;
            var url = PresupuestoItemAnticipoDetalle.URL_PRESUPUESTO_ANTICIPOS_DETALLE + "/?presupuestoId=" + PresupuestoConsultar.PRESUPUESTO_ID + "&versionPresupuestoId=" + PresupuestoConsultar.VERSION_PRESUPUESTO_ID + "&itemId=" + PresupuestoItemAnticipoDetalle.ITEM_ID;
            Utils._OpenModal(url, PresupuestoItemAnticipoDetalle.CargarDatosModal, "lg");
        },

        CargarDatosModal: function () {
            PresupuestoItemAnticipoDetalle.CrearTabla();
        },

        /**
         * CrearTabla
         */
        CrearTabla: function () {

            var $filtro = $("#input_filtro_listar_anticipos");

            this.$TABLA = $("#tabla_anticipo_detalle").DataTable({
                "scrollX": true,
                "bDestroy": true,
                "ajax": {
                    "url": PresupuestoItemAnticipoDetalle.URL_DETALLE_ANTICIPO_ITEM,
                    "type": "POST",
                    "data": function (d) {
                        d.search["value"] = $filtro.val();
                        d.presupuestoId = PresupuestoConsultar.PRESUPUESTO_ID;
                        d.versionPresupuestoId = PresupuestoConsultar.VERSION_PRESUPUESTO_ID;
                        d.itemId = PresupuestoItemAnticipoDetalle.ITEM_ID;

                        return $.extend({}, d, {
                            "adicional": {}
                        });
                    }
                },
                "columns": [
                    {
                        "data": "Anticipo",
                        "render": function (data, type, full, meta) {
                            return meta.row + meta.settings._iDisplayStart + 1;
                        }
                    },
                    { "data": "Anticipo" },
                    { "data": "Item" },
                    { "data": "Grupo" },
                    { "data": "Nombre" },
                    { "data": "Descripcion" },
                    { "data": "Dias" },
                    { "data": "Cantidad" },
                    {
                        "data": "ValorUnitario",
                        "orderable": false,
                        "searchable": false,
                        "width": "10%",
                        "render": function (data, type, full, meta) {
                            var html = '<input type="text" data-format-price value="' + data + '" disabled="disabled" />';
                            return html;
                        }
                    },
                    {
                        "data": "ValorItem",
                        "orderable": false,
                        "searchable": false,
                        "width": "10%",
                        "render": function (data, type, full, meta) {
                            var html = '<input type="text" data-format-price value="' + data + '" disabled="disabled" />';
                            return html;
                        }
                    },
                    {
                        "data": "ValorAnticipo",
                        "orderable": false,
                        "searchable": false,
                        "width": "10%",
                        "render": function (data, type, full, meta) {
                            var html = '<input type="text" data-format-price value="' + data + '" disabled="disabled" />';
                            return html;
                        }
                    },
                    {
                        "data": "ValorImpuestos",
                        "orderable": false,
                        "searchable": false,
                        "width": "10%",
                        "render": function (data, type, full, meta) {
                            var html = '<input type="text" data-format-price value="' + data + '" disabled="disabled" />';
                            return html;
                        }
                    },
                   
                    {
                        "data": "ValorTotal",
                        "orderable": false,
                        "searchable": false,
                        "width": "10%",
                        "render": function (data, type, full, meta) {
                            var html = '<input type="text" data-format-price value="' + data + '" disabled="disabled" />';
                            return html;
                        }
                    },
                    { "data": "Estado" },
                ],
                "drawCallback": function (settings) {
                    Utils._InputFormatPrice();
                    Utils._BuilderModal();
                    $("#tabla_anticipo").parent("div.col-sm-12").eq(0).css("overflow", "auto");
                }
            });
        },

    }
   
}();
PresupuestoItemAnticipoDetalle.init();