/**
 * Object PresupuestoItemAsociadoListar
 */
var PresupuestoItemAsociadoListar = {
    /**
     * Variables Globales
     */
    $TABLA: null,
    PRESUPUESTO_ITEM_ASOCIADO_SELECCIONADO: null,
    LISTA_ITEMS_ASOCIADOS_MODIFICADOS: [],
    ASOCIADO_SELECCIONADO: null,
    ITEM_ID: null,
    /**
     * OnLoadListarAsociados
     */
    OnLoad: function () {
        PresupuestoItemAsociadoListar.ITEM_ID = $("#ItemId").val();

        PresupuestoItemAsociadoListar.CrearTabla();
        if (PresupuestoConsultar.PRESUPUESTO_EDITABLE)
            $("#content_btns_edicion_items_asociados").removeClass("display-none");
    },

    /**
     * CrearTablaPresupuestoItemsAsociados
     */
    CrearTabla: function () {
        var itemId = PresupuestoItemAsociadoListar.ITEM_ID;
        //DEFINIR PERMISOS DE VISUALIZACIÓN DEL PRESUPUESTO
        var permisosVisualizacion = [];
        if (!PresupuestoConsultar.PRESUPUESTO_EDITABLE) {
            permisosVisualizacion = [
                {
                    "targets": [1],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [2],
                    "visible": false,
                    "searchable": false
                }
            ];
        }

        PresupuestoItemAsociadoListar.$TABLA = $("#tabla_presupuesto_items_asociados").DataTable({
            "ajax": {
                "url": URL_PRESUPUESTO_ITEM_ASOCIADO_LISTAR,
                "type": "POST",
                "data": function (d) {
                    d.search["value"] = null;
                    d.itemId = itemId;
                    return $.extend({}, d, {
                        "adicional": {}
                    });
                }
            },
            "columns": [
                //Inerno
                { "data": "Orden" },
                {
                    "data": "Id",//Eliminar
                    "orderable": false,
                    "searchable": false,
                    "width": "5%",
                    "render": function (data, type, full, meta) {


                        var disabled = (!PresupuestoConsultar.PRESUPUESTO_EDITABLE || full.Bloquear) ? "disabled='disabled'" : "";
                        return '<button class="btn btn-round btn-danger btn-xs" ' + disabled + ' data-item-id="' + itemId + '" onclick="PresupuestoItemAsociadoEliminar.ConfirmarEliminar(this)" value="' + data + '">' +
                            '<span class="glyphicon glyphicon-minus"></span>' +
                            '</button>';
                    }
                },
                {
                    "data": "Id",//Seleccionar
                    "orderable": false,
                    "searchable": false,
                    "width": "5%",
                    "render": function (data, type, full, meta) {
                        var disabled = (full.Bloquear) ? 'disabled="disabled"' : '';
                        var checked = (data == PresupuestoItemAsociadoListar.PRESUPUESTO_ITEM_ASOCIADO_SELECCIONADO) ? 'checked="checked"' : '';
                        var html = '<div class="container-radio">' +
                            '<input type="radio" name="radio_item_seleccionar_asociado" id="radio_item_seleccionar_asociado_' + full.Id + '" class="regular-radio radio_item_seleccionar_asociado" onchange="PresupuestoItemAsociadoListar.OnChangeSeleccionar(this)" value="' + data + '" />' +
                            '<label for="radio_item_seleccionar_asociado_' + full.Id + '"></label>' +
                            '</div>'
                        return html;
                    }
                },
                {
                    "data": "Id", //Anticipos
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        var html = "";
                        if (PresupuestoConsultar.ESTADO_ID == "7" || PresupuestoConsultar.ESTADO_ID == "5") {
                            if (data != null) {
                                html = '<button value="' + full.Id + '" class="btn btn-secondary" onclick="PresupuestoItemListar.AbrirModalAnticipos(this, ' + full.Id + ')">' +
                                    '<i class="fa fa-money" aria-hidden="true"></i></button>';
                            }
                            return html;
                        } else {
                            return html;
                        }
                    }
                },
                {
                    "data": "OrdenProduccionId",//OP
                    "render": function (data, type, full, meta) {
                        var html = "";
                        if (data != null) {
                            var url = URL_PRESUPUESTO_ORDEN_PRODUCCION_CONSULTAR + '/' + data;
                            html = '<a href="' + url + '" class="btn btn-secondary" data-size="all" data-toggle="modal" data-target="#" data-execute-onload="PresupuestoOrdenProduccionConsultar.OnLoad" >' +
                                '<i class="fa fa-suitcase" aria-hidden="true"></i> OP # ' + data +
                                '</a>';
                        }
                        return html;
                    }
                },
                {
                    "data": "OrdenCompraId",//OC
                    "render": function (data, type, full, meta) {
                        var html = "";
                        if (data != null) {
                            var url = URL_PRESUPUESTO_ORDEN_COMPRA_CONSULTAR + '/' + data;
                            var html = '<a href="' + url + '" class="btn btn-secondary" data-size="all" data-toggle="modal" data-target="#" data-execute-onload="PresupuestoOrdenCompraConsultar.OnLoad" >' +
                                '<i class="fa fa-suitcase" aria-hidden="true"></i> OC # ' + data +
                                '</a>'
                        }
                        return html;
                    }
                },
                {
                    "data": "Nombre",
                    "render": function (data, type, full, meta) {
                        var disabled = (!PresupuestoConsultar.PRESUPUESTO_EDITABLE || full.Bloquear) ? "disabled='disabled'" : "";
                        var valor = data;
                        for (var i = 0; i < PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS.length; i++) {
                            if (PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].Nombre))
                                valor = PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].Nombre;
                        }
                        return '<input type="text" class="form-control input_nombre_item_asociado" ' + disabled + ' data-item-asociado-id="' + full.Id + '" value="' + valor + '" data-valor="' + data + '" onkeyup="PresupuestoItemAsociadoEditar.OnKeyUpNombre(this, ' + full.Id + ')" maxlength="100" />';
                    }
                },
                {
                    "data": "Descripcion",
                    "render": function (data, type, full, meta) {
                        var disabled = (!PresupuestoConsultar.PRESUPUESTO_EDITABLE || full.Bloquear) ? "disabled='disabled'" : "";
                        var valor = data;
                        for (var i = 0; i < PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS.length; i++) {
                            if (PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].Descripcion))
                                valor = PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].Descripcion;
                        }
                        return '<textarea class="form-control textarea_descripcion_item_asociado" ' + disabled + ' data-item-asociado-id="' + full.Id + '" data-valor="' + data + '" onkeyup="PresupuestoItemAsociadoEditar.OnKeyUpDescripcion(this, ' + full.Id + ')"  maxlength="100" >' +
                            valor +
                            '</textarea>';
                    }
                },
                {
                    "data": "ProveedorId",
                    "orderable": false,
                    "searchable": false,
                    "width": "5%",
                    "render": function (data, type, full, meta) {
                        var disabled = (!PresupuestoConsultar.PRESUPUESTO_EDITABLE || full.Bloquear) ? "disabled='disabled'" : "";
                        var valor = data;
                        for (var i = 0; i < PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS.length; i++) {
                            if (PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].ProveedorId))
                                valor = PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].ProveedorId;
                        }
                        return '<select class="selectpicker select_proveedor_item_asociado" ' + disabled + ' data-live-search="true" data-item-asociado-id="' + full.Id + '" data-proveedor-id="' + valor + '" data-valor="' + data + '" onchange="PresupuestoItemAsociadoEditar.OnChangeProveedor(this, ' + full.Id + ')" ></select>';
                    }
                },
                {
                    "data": "Dias",
                    "render": function (data, type, full, meta) {
                        var disabled = (!PresupuestoConsultar.PRESUPUESTO_EDITABLE || full.Bloquear) ? "disabled='disabled'" : "";
                        var valor = data;
                        for (var i = 0; i < PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS.length; i++) {
                            if (PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].Dias))
                                valor = PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].Dias;
                        }
                        return '<input type="number" class="form-control input_dias_item_asociado" ' + disabled + ' data-item-asociado-id="' + full.Id + '" value="' + valor + '" data-valor="' + data + '" onchange="PresupuestoItemAsociadoEditar.OnKeyUpDias(this, ' + full.Id + ')" onkeyup="PresupuestoItemAsociadoEditar.OnKeyUpDias(this, ' + full.Id + ')" />';
                    }
                },
                {
                    "data": "Cantidad",
                    "render": function (data, type, full, meta) {
                        var disabled = (!PresupuestoConsultar.PRESUPUESTO_EDITABLE || full.Bloquear) ? "disabled='disabled'" : "";
                        var valor = data;
                        for (var i = 0; i < PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS.length; i++) {
                            if (PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].Cantidad))
                                valor = PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].Cantidad;
                        }
                        return '<input type="number" class="form-control input_cantidad_item_asociado" ' + disabled + ' min="0" data-item-asociado-id="' + full.Id + '" value="' + valor + '" data-valor="' + data + '" onchange="PresupuestoItemAsociadoEditar.OnKeyUpCantidad(this, ' + full.Id + ')" onkeyup="PresupuestoItemAsociadoEditar.OnKeyUpCantidad(this, ' + full.Id + ')" />';
                    }
                },
                {
                    "data": "ValorUnitario",
                    "render": function (data, type, full, meta) {
                        var disabled = (!PresupuestoConsultar.PRESUPUESTO_EDITABLE || full.Bloquear) ? "disabled='disabled'" : "";
                        var valor = data;
                        for (var i = 0; i < PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS.length; i++) {
                            if (PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].ValorUnitario))
                                valor = PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].ValorUnitario;
                        }
                        var html = '<div class="input-group">' +
                            '<label class="input-group-addon">$</label>' +
                            '<input type="text" class="form-control input_valor_unitario_item_asociado" ' + disabled + ' data-format-price="" data-item-asociado-id="' + full.Id + '"  value="' + valor + '" data-valor="' + data + '" onkeyup="PresupuestoItemAsociadoEditar.OnKeyUpValorUnitario(this, ' + full.Id + ')" />' +
                            '</div>';
                        return html;
                    }
                },
                {
                    "data": "SubTotal",
                    "render": function (data, type, full, meta) {
                        var valor = data;
                        for (var i = 0; i < PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS.length; i++) {
                            if (PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].SubTotal))
                                valor = PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].SubTotal;
                        }
                        var html = '<div class="input-group">' +
                            '<label class="input-group-addon">$</label>' +
                            '<input type="text" class="form-control input_sub_total_item_asociado" data-format-price="" data-item-asociado-id="' + full.Id + '" value="' + valor + '" readonly="readonly" />' +
                            '</div>';
                        return html;
                    }
                },
                {
                    "data": "PorcentajeAnticipo",
                    "render": function (data, type, full, meta) {
                        var html = '<div class="input-group">' +
                            '<label class="input-group-addon">%</label>' +
                            '<button type="button" class="form-control btn btn-dark" value="' + data + '" data-item-asociado-id="' + full.Id + '" onclick="PresupuestoItemAsociadoEditar.ListarAnticipos(this)">' +
                            + data +
                            '</button>' +
                            '</div>';
                        return html;
                    }
                },
                {
                    "data": "Impuestos",//Impuestos internos
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        var disabled = (!PresupuestoConsultar.PRESUPUESTO_EDITABLE || full.Bloquear) ? "disabled='disabled'" : "";
                        var valor = data;
                        for (var i = 0; i < PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS.length; i++) {
                            if (PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].Impuestos))
                                valor = PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].Impuestos;
                        }
                        return '<select class="selectpicker select_impuestos_item_asociado" ' + disabled + ' multiple data-live-search="true" data-impuestos="' + valor + '" data-item-asociado-id="' + full.Id + '" onchange="PresupuestoItemAsociadoEditar.OnChangeImpuestos(this, ' + full.Id + ')">' +
                            '</select>';
                    }
                },
                {
                    "data": "Volumen",
                    "render": function (data, type, full, meta) {
                        var disabled = (!PresupuestoConsultar.PRESUPUESTO_EDITABLE || full.Bloquear) ? "disabled='disabled'" : "";
                        var valor = data;
                        for (var i = 0; i < PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS.length; i++) {
                            if (PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].Volumen))
                                valor = PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].Volumen;
                        }
                        var html = '<div class="input-group">' +
                            '<label class="input-group-addon">%</label>' +
                            '<input type="number" class="form-control input_volumen_item_asociado" ' + disabled + ' data-item-asociado-id="' + full.Id + '" value="' + valor + '" onchange="PresupuestoItemAsociadoEditar.OnKeyUpVolumen(this, ' + full.Id + ')" onkeyup="PresupuestoItemAsociadoEditar.OnKeyUpVolumen(this, ' + full.Id + ')" />' +
                            '</div>';
                        return html;
                    }
                },
                {
                    "data": "Costo",
                    "render": function (data, type, full, meta) {
                        var valor = data;
                        for (var i = 0; i < PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS.length; i++) {
                            if (PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].Costo))
                                valor = PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].Costo;
                        }
                        var html = '<div class="input-group">' +
                            '<label class="input-group-addon">$</label>' +
                            '<input type="text" class="form-control input_costo_item_asociado" data-format-price="" data-item-asociado-id="' + full.Id + '" value="' + valor + '" readonly="readonly" />' +
                            '</div>';
                        return html;
                    }
                },
            ],
            "columnDefs": permisosVisualizacion,
            "drawCallback": function (settings) {
                PresupuestoItemAsociadoListar.PRESUPUESTO_ITEM_ASOCIADO_SELECCIONADO = null;

                //Dias y Cantidad
                $(".input_dias_item_asociado, .input_cantidad_item_asociado").onlyNumbers({
                    min: 0
                });

                //Volumen
                $(".input_volumen_item_asociado").onlyNumbers({
                    min: 0,
                    max: 100
                });

                Utils._InputFormatPrice();

                //Selec Proveedor
                $(".select_proveedor_item_asociado").each(function () {
                    var valorPorDefecto = $(this).attr("data-proveedor-id");
                    Utils._LoadDataToDropDownList($(this), PresupuestoConsultar.LISTA_OPCIONES_PROVEEDORES, valorPorDefecto);
                });

                //Select Impuestos
                $(".select_impuestos_item_asociado").each(function () {
                    var valoresPorDefecto = $(this).attr("data-impuestos");
                    valoresPorDefecto = valoresPorDefecto.split(",");
                    Utils._LoadDataToDropDownListMultiple($(this), PresupuestoConsultar.LISTA_OPCIONES_IMPUESTOS, valoresPorDefecto);
                });

                //Tabla
                $("#tabla_presupuesto_items_asociados").parent("div.col-sm-12").eq(0).css("overflow", "auto");

                Utils._BuilderModal();
                Utils._InputFocus();
            }
        });
    },

    /**
     * Recargar la tabla de items asociados del presupuesto
     */
    RecargarTabla: function () {
        PresupuestoItemAsociadoListar.$TABLA.draw();
    },

    /**
     * Recargar pagina de la tabla de items asociados del presupuesto
     */
    RecargarPaginaTabla: function () {
        PresupuestoItemAsociadoListar.$TABLA.draw('page');
    },

    /**
     * OnChangeSeleccionar Asociado
     */
    OnChangeSeleccionar: function (e) {
        PresupuestoItemAsociadoListar.ASOCIADO_SELECCIONADO = $(e).val();
    }
}