$(function () {
    AprobacionLegalizacionListar.OnLoad();
});

var AprobacionLegalizacionListar = {
    $TABLA: null,
    PRESUPUESTO_ID: null,
    VERSION_PRESUPUESTO_ID: null,
    ITEM_ID: null,

    OnLoad: function () {

        this.CrearTabla();
        AprobacionLegalizacionListar.PRESUPUESTO_ID = 0;
        AprobacionLegalizacionListar.VERSION_PRESUPUESTO_ID = 0;
        AprobacionLegalizacionListar.ITEM_ID = 0;
        AprobacionLegalizacionListar.URL_PRESUPUESTO_ANTICIPOS_DETALLE = '/Produccion/PresupuestoItemAnticipo/Consultar';
        AprobacionLegalizacionListar.URL_DETALLE_ANTICIPO_ITEM = "/Produccion/PresupuestoItemAnticipo/ListarItemAnticiposDetalle";
        $("#form_filtro_tabla_aprobacion_legalizaciones")[0].reset();
        $("#form_filtro_tabla_aprobacion_legalizaciones").submit(this.RecargarTabla);
    },
    CrearTabla: function () {
        var filtro = $("#search");
        //var $mostrar = $filtro.val();
        //alert(filtro.val());
        //console.log($("#Estado").val());
        this.$TABLA = $("#tabla_aprobaciones_legalizaciones").DataTable({
            "scrollX": true,
            "ajax": {
                "url": URL_APROBACION_LEGALIZACION_LISTAR,
                "type": "POST",
                "data": function (d) {
                    d.search["value"] = filtro.val();
                    d.estado = $("#Estado").val();
                    return $.extend({}, d, {
                        "adicional": {}
                    });
                }
            },
            "columns": [
                {
                    "data": "PresupuestoId",
                    "render": function (data, type, full, meta) {
                        var url = URL_PRESUPUESTO_CONSULTAR + '/' + data;
                        var html = '<a href="' + url + '" target="_blank" class="btn btn-secondary" >Abrir # ' + data + '</a>';
                        return html;
                    }
                },
                {
                    "data": "AprobacionPresupuestoGrupoUsuarioId",
                    "render": function (data, type, full, meta) {
                        var html = '';
                        if (full.EstadoId == 1) {///Pendiente
                            var url = URL_APROBACION_LEGALIZACION_RESPONDER + '/' + data;
                            html = '<a href="' + url + '"  data-toggle="modal" data-target="#" class="btn btn-secondary" >Aprobar/Rechazar</a>';
                        }
                        return html;
                    }
                },
                { "data": "Empresa" },
                { "data": "Cliente" },
                { "data": "Producto" },
                { "data": "OrdenTrabajo" },
                { "data": "EnviadoPor" },
                { "data": "FechaHora" },
                { "data": "AnticipoId" },
                //{
                //    "data": "AnticipoId",
                //    "render": function (data, type, full, meta) {
                //        var html = "";
                //        if (data != null) {
                //            html = '<button value="' + full.Id + '" class="btn btn-secondary" onclick="AprobacionLegalizacionListar.AbrirModalDetalleAnticipos(' + data + "," + full.PresupuestoId + "," + full.VersionPresupuesto + ')">' +
                //                'Detalle anticipo # ' + data + '</button>';
                //        }
                //        return html;
                //    }   
                //},
                { "data": "LegalizacionId" },
                { "data": "Version" },
                { "data": "EstadoLegalizacion" },
                { "data": "TotalValor" },
                { "data": "TotalImpuestos" },
                { "data": "Total" },
                {
                    "data": "Estado",
                    "render": function (data, type, full, meta) {
                        var html = '<label>' + data + '</label>';
                        var url = URL_JERARQUIA_APROBACION_LEGALIZACION_LISTAR + '/' + full.LegalizacionId;
                        html += '<a href="' + url + '" class="btn btn-secondary" data-size="lg" data-toggle="modal" data-target="#" data-execute-onload="AprobacionLegalizacionListarJerarquia.Onload" >Ver Jerarquía</a>';
                        return html;
                    }
                }
            ],
            "drawCallback": function (settings) {
                Utils._BuilderModal();
            }
        });
    },

    RecargarTabla: function () {
        AprobacionLegalizacionListar.$TABLA.draw();
        return false;
    },
    RecargarTablaPage: function () {
        AprobacionLegalizacionListar.$TABLA.draw("Page");
        return false;
    },
    ResetearFiltroTabla: function () {
        $("#search").val("");
        $("#form_filtro_tabla_aprobacion_legalizaciones")[0].reset();
        AprobacionLegalizacionListar.RecargarTabla();
        Utils._BuilderDropDown();
    },

    /**
     * AbrirModalDetalleAnticipos
     
    AbrirModalDetalleAnticipos: function (id, presupuestoId, versionId) {
        AprobacionLegalizacionListar.PRESUPUESTO_ID = presupuestoId;
        AprobacionLegalizacionListar.VERSION_PRESUPUESTO_ID = versionId;
        AprobacionLegalizacionListar.ITEM_ID = id;
        var url = AprobacionLegalizacionListar.URL_PRESUPUESTO_ANTICIPOS_DETALLE + "/?presupuestoId=" + presupuestoId + "&versionPresupuestoId=" + versionId + "&itemId=" + id;
        Utils._OpenModal(url, AprobacionLegalizacionListar.CargarDatosModal, "lg");
    },*/

    /**
     * CargarDatosModal
     */
    CargarDatosModal: function () {
        AprobacionLegalizacionListar.CrearTablaDetalle();
    }

    /**
     * CrearTablaDetalle
     
    CrearTablaDetalle: function () {

        var $filtro = $("#input_filtro_listar_anticipos");
        this.$TABLA = $("#tabla_anticipo_detalle").DataTable({
            "scrollX": true,
            "bDestroy": true,
            "ajax": {
                "url": AprobacionLegalizacionListar.URL_DETALLE_ANTICIPO_ITEM,
                "type": "POST",
                "data": function (d) {
                    d.search["value"] = $filtro.val();
                    d.presupuestoId = AprobacionLegalizacionListar.PRESUPUESTO_ID;
                    d.versionPresupuestoId = AprobacionLegalizacionListar.VERSION_PRESUPUESTO_ID;
                    d.itemId = AprobacionLegalizacionListar.ITEM_ID;

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
            ],
            "drawCallback": function (settings) {
                Utils._InputFormatPrice();
                Utils._BuilderModal();
                $("#tabla_anticipo").parent("div.col-sm-12").eq(0).css("overflow", "auto");
            }
        });
    },*/

}