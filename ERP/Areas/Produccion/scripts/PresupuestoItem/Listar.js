/**
 * PresupuestoItemListar
 */
var PresupuestoItemListar = {
    /**
     * Variables Globales
     */
    $TABLA: null,
    $TABLA_RESUMEN_ACTIVIDAD: null,
    $TABLA_RESUMEN_IMPUESTOS: null,
    PRESUPUESTO_ITEM_SELECCIONADO: null,
    PRESUPUESTO_ITEM_SELECCIONADO_LISTAR_ASOCIADOS: null,
    LISTA_ITEMS_MODIFICADOS: [],
    OnLoad: function () {
        $("#form-filtro-tabla-presupuesto").submit(PresupuestoItemListar.RecargarTabla);

        PresupuestoConsultar.ConsultarListaProveedores();
        //Carga resumen del presupuesto
        PresupuestoItemListar.ConsultarRentabilidadPresupuesto();
        PresupuestoItemListar.ConsultarRentabilidadPresupuestoFinal();
        PresupuestoItemListar.ConsultarResumenActividad();
        PresupuestoItemListar.ConsultarResumenImpuestos();
    },

    /**
     * Crear la tabla de items del Presupuesto
     */
    CrearTabla: function () {
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

        if (!PERMISO_VER_INTERNO) {
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
                },
                {
                    "targets": [3],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [4],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [5],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [6],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [7],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [8],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [9],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [10],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [11],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [12],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [13],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [14],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [15],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [16],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [17],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [18],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [19],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [20],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [21],
                    "visible": false,
                    "searchable": false
                }
            ];
        }

        if (!PERMISO_VER_EXTERNO) {
            permisosVisualizacion.push(
                {
                    "targets": [22],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [23],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [24],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [25],
                    "visible": false,
                    "searchable": false
                }
            );
        }

        if (!PERMISO_VER_RENTABILIDAD) {
            permisosVisualizacion.push(
                {
                    "targets": [26],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [27],
                    "visible": false,
                    "searchable": false
                }
            );
        }

        var $filtro = $("#input-filtro-tabla-presupuesto");
        PresupuestoItemListar.$TABLA = $("#tabla_presupuesto_items").DataTable({
            "pageLength": 30,
            "ajax": {
                "url": URL_PRESUPUESTO_ITEM_LISTAR,
                "type": "POST",
                "data": function (d) {
                    d.search["value"] = $filtro.val();
                    d.presupuestoId = PresupuestoConsultar.PRESUPUESTO_ID;
                    d.presupuestoVersionId = PresupuestoConsultar.VERSION_PRESUPUESTO_ID
                    return $.extend({}, d, {
                        "adicional": {}
                    });
                }
            },
            "columns": [
                //Inerno
                { "data": "Orden" },
                {
                    "data": "Id", //Eliminar
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        var html = '';
                        var disabled = (!PresupuestoConsultar.PRESUPUESTO_EDITABLE || full.Bloquear) ? "disabled='disabled'" : "";
                        html = '<button class="btn btn-round btn-danger btn-xs" ' + disabled + ' onclick="PresupuestoItemEliminar.ConfirmarEliminar(this)" value="' + data + '">' +
                            '<span class="glyphicon glyphicon-minus"></span>' +
                            '</button>';
                        return html;
                    }
                },
                {
                    "data": "Id", //Seleccionar
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        var html = '<div class="container-radio">' +
                            '<input type="radio" name="radio_item_seleccionar" id="radio_item_seleccionar_' + full.Id + '" class="radio_item_seleccionar" onchange="PresupuestoItemListar.OnChangeSeleccionarItem(this)" value="' + data + '" />' +
                            '<label for="radio_item_seleccionar_' + full.Id + '"></label>' +
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
                    "data": "Comisionable",
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        var disabled = (!PresupuestoConsultar.PRESUPUESTO_EDITABLE || full.Bloquear) ? "disabled='disabled'" : "";
                        var checked = (data == true) ? "checked" : "";
                        return '<input type="checkbox" ' + checked + ' ' + disabled + ' class="boton_comisionable_item" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" data-size="mini" value="' + data + '"  onchange="PresupuestoItemEditar.OnChangeComision(this, ' + full.Id + ')" >';
                    }
                },
                {
                    "data": "Mandato",
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        var disabled = (!PresupuestoConsultar.PRESUPUESTO_EDITABLE || full.Bloquear) ? "disabled='disabled'" : "";
                        var checked = (data == true) ? "checked" : "";
                        return '<input type="checkbox" ' + checked + ' ' + disabled + ' class="boton_mandato_item" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" data-size="mini" value="' + data + '"  onchange="PresupuestoItemEditar.OnChangeMandato(this, ' + full.Id + ')">';
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
                    "data": "CantidadAsociados",//Asociados
                    "render": function (data, type, full, meta) {
                        return '<button value="' + full.Id + '" class="btn btn-secondary" onclick="PresupuestoItemListar.AbrirModalListarAsociados(this, ' + full.Id + ')">' +
                            '<i class="fa fa-list-ol" aria-hidden="true"></i>' +
                            ' (' + data + ') ' +
                            '</button>';
                    }
                },
                {
                    "data": "Grupo",
                    "render": function (data, type, full, meta) {
                        var disabled = (!PresupuestoConsultar.PRESUPUESTO_EDITABLE || full.Bloquear) ? "disabled='disabled'" : "";
                        var valor = data;
                        for (var i = 0; i < PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.length; i++) {
                            if (PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Grupo))
                                valor = PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Grupo;
                        }
                        return '<input type="text" class="form-control input_grupo_item" ' + disabled + ' data-item-id="' + full.Id + '" value="' + valor + '" data-valor="' + data + '" onkeyup="PresupuestoItemEditar.OnKeyUpGrupo(this, ' + full.Id + ')" maxlength="100" />';
                    }
                },
                {
                    "data": "Nombre",
                    "render": function (data, type, full, meta) {
                        var disabled = (!PresupuestoConsultar.PRESUPUESTO_EDITABLE || full.Bloquear) ? "disabled='disabled'" : "";
                        var valor = data;
                        for (var i = 0; i < PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.length; i++) {
                            if (PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Nombre))
                                valor = PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Nombre;
                        }
                        return '<input type="text" class="form-control input_nombre_item" ' + disabled + ' data-item-id="' + full.Id + '" value="' + valor + '" data-valor="' + data + '" onkeyup="PresupuestoItemEditar.OnKeyUpNombre(this, ' + full.Id + ')" maxlength="100" />';
                    }
                },
                {
                    "data": "DescripcionInterna",
                    "render": function (data, type, full, meta) {
                        var disabled = (!PresupuestoConsultar.PRESUPUESTO_EDITABLE || full.Bloquear) ? "disabled='disabled'" : "";
                        var valor = data;
                        for (var i = 0; i < PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.length; i++) {
                            if (PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].DescripcionInterna))
                                valor = PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].DescripcionInterna;
                        }
                        return '<textarea class="form-control textarea_descripcion_interno_item" ' + disabled + ' data-item-id="' + full.Id + '" data-valor="' + data + '" onkeyup="PresupuestoItemEditar.OnKeyUpDescripcionInterna(this, ' + full.Id + ')" onchange="PresupuestoItemListar.OnDescripcionInterna(this, ' + full.Id + ')" >' + 
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
                        for (var i = 0; i < PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.length; i++) {
                            if (PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].ProveedorId))
                                valor = PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].ProveedorId;
                        }
                        return '<select class="selectpicker select_proveedor_item" ' + disabled + ' data-live-search="true" data-item-id="' + full.Id + '" data-proveedor-id="' + valor + '" data-valor="' + data + '" onchange="PresupuestoItemEditar.OnChangeProveedor(this, ' + full.Id + ')" ></select>';
                    }
                },
                {
                    "data": "Dias",
                    "render": function (data, type, full, meta) {
                        var disabled = (!PresupuestoConsultar.PRESUPUESTO_EDITABLE || full.Bloquear) ? "disabled='disabled'" : "";
                        var valor = data;
                        for (var i = 0; i < PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.length; i++) {
                            if (PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Dias))
                                valor = PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Dias;
                        }
                        return '<input type="number" class="form-control input_dias_item" ' + disabled + ' data-item-id="' + full.Id + '" value="' + valor + '" data-valor="' + data + '" onchange="PresupuestoItemEditar.OnKeyUpDias(this, ' + full.Id + ')" onkeyup="PresupuestoItemEditar.OnKeyUpDias(this, ' + full.Id + ')" />';
                    }
                },
                {
                    "data": "Cantidad",
                    "render": function (data, type, full, meta) {
                        var disabled = (!PresupuestoConsultar.PRESUPUESTO_EDITABLE || full.Bloquear) ? "disabled='disabled'" : "";
                        var valor = data;
                        for (var i = 0; i < PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.length; i++) {
                            if (PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Cantidad))
                                valor = PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Cantidad;
                        }
                        return '<input type="number" class="form-control input_cantidad_item" ' + disabled + ' min="0" data-item-id="' + full.Id + '" value="' + valor + '" data-valor="' + data + '" onchange="PresupuestoItemEditar.OnKeyUpCantidad(this, ' + full.Id + ')" onkeyup="PresupuestoItemEditar.OnKeyUpCantidad(this, ' + full.Id + ')" />';
                    }
                },
                {
                    "data": "ValorUnitarioInterno",
                    "render": function (data, type, full, meta) {
                        var disabled = (!PresupuestoConsultar.PRESUPUESTO_EDITABLE || full.Bloquear) ? "disabled='disabled'" : "";
                        var valor = data;
                        for (var i = 0; i < PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.length; i++) {
                            if (PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].ValorUnitarioInterno))
                                valor = PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].ValorUnitarioInterno;
                        }
                        var html = '<div class="input-group">' +
                            '<label class="input-group-addon">$</label>' +
                            '<input type="text" class="form-control input_valor_unitario_interno_item" ' + disabled + ' data-format-price="" data-item-id="' + full.Id + '"  value="' + valor + '" data-valor="' + data + '" onkeyup="PresupuestoItemEditar.OnKeyUpValorUnitarioInterno(this, ' + full.Id + ')" onchange="PresupuestoItemListar.OnValorUnitario(this, ' + full.Id + ')" />' +
                            '</div>';
                        return html;
                    }
                },
                {
                    "data": "SubTotalInterno",
                    "render": function (data, type, full, meta) {
                        var valor = data;
                        for (var i = 0; i < PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.length; i++) {
                            if (PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].SubTotalInterno))
                                valor = PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].SubTotalInterno;
                        }
                        var html = '<div class="input-group">' +
                            '<label class="input-group-addon">$</label>' +
                            '<input type="text" class="form-control input_sub_total_interno_item" data-format-price="" data-item-id="' + full.Id + '" value="' + valor + '" readonly="readonly" />' +
                            '</div>';
                        return html;
                    }
                },
                {
                    "data": "SubTotalAsociados",
                    "render": function (data, type, full, meta) {
                        var html = '';
                        if (full.CantidadAsociados > 0) {
                            var diferencia = (full.SubTotalInterno - data);
                            var classAdd = "";
                            if (diferencia < 0)
                                classAdd = "has-error";
                            else if (diferencia > 0)
                                classAdd = "has-success";
                            html += '<label>SubTotal Asociado(s)</label>' +
                                '<div class="input-group">' +
                                '<label class="input-group-addon">$</label>' +
                                '<input type="text" class="form-control input_sub_total_asociados_item" data-format-price="" data-item-id="' + full.Id + '" value="' + data + '" readonly="readonly" />' +
                                '</div>';
                            html += '<label>Excedente Asociado(s)</label>' +
                                '<div class="input-group">' +
                                '<label class="input-group-addon">$</label>' +
                                '<input type="text" class="form-control input_sub_total_asociados_item ' + classAdd + '" data-format-price="" data-item-id="' + full.Id + '" value="' + diferencia + '" readonly="readonly" />' +
                                '</div>';
                        }
                        return html;
                    }
                },
                {
                    "data": "PorcentajeAnticipo",
                    "render": function (data, type, full, meta) {
                        var html = '<div class="input-group">' +
                            '<label class="input-group-addon">%</label>' +
                            '<button type="button" class="form-control btn btn-dark" value="' + data + '" data-item-id="' + full.Id + '" onclick="PresupuestoItemEditar.ListarAnticipos(this)">' +
                            + data +
                            '</button>' +
                            '</div>';
                        return html;
                    }
                },
                {
                    "data": "ImpuestosInterno",//Impuestos internos
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        var disabled = (!PresupuestoConsultar.PRESUPUESTO_EDITABLE || full.Bloquear) ? "disabled='disabled'" : "";
                        var valor = data;
                        for (var i = 0; i < PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.length; i++) {
                            if (PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].ImpuestosInterno))
                                valor = PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].ImpuestosInterno;
                        }
                        return '<select class="selectpicker select_impuestos_interno_item" ' + disabled + ' multiple data-live-search="true" data-impuestos="' + valor + '" data-item-id="' + full.Id + '" onchange="PresupuestoItemEditar.OnChangeImpuestosInterno(this, ' + full.Id + ')">' +
                            '</select>';
                    }
                },
                {
                    "data": "Volumen",
                    "render": function (data, type, full, meta) {
                        var disabled = (!PresupuestoConsultar.PRESUPUESTO_EDITABLE || full.Bloquear) ? "disabled='disabled'" : "";
                        var valor = data;
                        for (var i = 0; i < PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.length; i++) {
                            if (PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Volumen))
                                valor = PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Volumen;
                        }
                        var html = '<div class="input-group">' +
                            '<label class="input-group-addon">%</label>' +
                            '<input type="number" class="form-control input_volumen_item" ' + disabled + ' data-item-id="' + full.Id + '" value="' + valor + '" onchange="PresupuestoItemEditar.OnKeyUpVolumen(this, ' + full.Id + ')" onkeyup="PresupuestoItemEditar.OnKeyUpVolumen(this, ' + full.Id + ')" />' +
                            '</div>';
                        return html;
                    }
                },
                {
                    "data": "CostoInterno",
                    "render": function (data, type, full, meta) {
                        var valor = data;
                        for (var i = 0; i < PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.length; i++) {
                            if (PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].CostoInterno))
                                valor = PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].CostoInterno;
                        }
                        var html = '<div class="input-group">' +
                            '<label class="input-group-addon">$</label>' +
                            '<input type="text" class="form-control input_costo_interno_item" data-format-price="" data-item-id="' + full.Id + '" value="' + valor + '" readonly="readonly" />' +
                            '</div>';
                        return html;
                    }
                },
                //Externo
                {
                    "data": "DescripcionExterna",
                    "render": function (data, type, full, meta) {
                        var disabled = (!PresupuestoConsultar.PRESUPUESTO_EDITABLE || full.Bloquear) ? "disabled='disabled'" : "";
                        var valor = data;
                        for (var i = 0; i < PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.length; i++) {
                            if (PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].DescripcionExterna))
                                valor = PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].DescripcionExterna;
                        }
                        return '<textarea class="form-control textarea_descripcion_externo_item" ' + disabled + ' id="descripcion-' + full.Id +'"  data-item-id="' + full.Id + '" data-valor="' + data + '" onkeyup="PresupuestoItemEditar.OnChangeDescripcionExterna(this, ' + full.Id + ')"  >' + valor + '</textarea>';
                    }
                },
                {
                    "data": "ValorUnitarioExterno",
                    "render": function (data, type, full, meta) {
                        var disabled = (!PresupuestoConsultar.PRESUPUESTO_EDITABLE || full.Bloquear) ? "disabled='disabled'" : "";
                        var valor = data;
                        for (var i = 0; i < PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.length; i++) {
                            if (PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].ValorUnitarioExterno))
                                valor = PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].ValorUnitarioExterno;
                        }
                        var html = '<div class="input-group">' +
                            '<label class="input-group-addon">$</label>' +
                            '<input type="text" class="form-control input_valor_unitario_externo_item" ' + disabled + ' data-format-price="" data-item-id="' + full.Id + '"  value="' + valor + '" data-valor="' + data + '" onkeyup="PresupuestoItemEditar.OnKeyUpValorUnitarioExterno(this, ' + full.Id + ')" onchange="PresupuestoItemListar.OnValorUnitario(this, ' + full.Id + ')" />' +
                            '</div>';
                        return html;
                    }
                },
                {
                    "data": "SubTotalExterno",
                    "render": function (data, type, full, meta) {
                        var valor = data;
                        for (var i = 0; i < PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.length; i++) {
                            if (PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].SubTotalExterno))
                                valor = PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].SubTotalExterno;
                        }
                        var html = '<div class="input-group">' +
                            '<label class="input-group-addon">$</label>' +
                            '<input type="text" class="form-control input_sub_total_externo_item" data-format-price="" data-item-id="' + full.Id + '" value="' + valor + '" readonly="readonly" />' +
                            '</div>';
                        return html;
                    }
                },
                {
                    "data": "ImpuestosExterno",//Impuestos externo
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        var disabled = (!PresupuestoConsultar.PRESUPUESTO_EDITABLE || full.Bloquear) ? "disabled='disabled'" : "";
                        var valor = data;
                        for (var i = 0; i < PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.length; i++) {
                            if (PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].ImpuestosExterno))
                                valor = PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].ImpuestosExterno;
                        }
                        return '<select class="selectpicker select_impuestos_externo_item" ' + disabled + ' multiple data-live-search="true" data-impuestos="' + valor + '" data-item-id="' + full.Id + '" onchange="PresupuestoItemEditar.OnChangeImpuestosExterno(this, ' + full.Id + ')">' +
                            '</select>';
                    }
                },
                {
                    "data": "CostoExterno",
                    "render": function (data, type, full, meta) {
                        var valor = data;
                        //for (var i = 0; i < PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.length; i++) {
                        //    if (PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].CostoExterno))
                        //        valor = PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].CostoExterno;
                        //}
                        var html = '<div class="input-group">' +
                            '<label class="input-group-addon">$</label>' +
                            '<input type="text" class="form-control input_costo_interno_item" data-format-price="" data-item-id="' + full.Id + '" value="' + valor + '" readonly="readonly" />' +
                            '</div>';
                        return html;
                    }
                },
                {
                    "data": "PorcentajeRentabilidadParcial",
                    "render": function (data, type, full, meta) {
                        var valor = data;
                        for (var i = 0; i < PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.length; i++) {
                            if (PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].PorcentajeRentabilidadParcial))
                                valor = PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].PorcentajeRentabilidadParcial;
                        }

                        var claseInput = (valor <= 0) ? "has-error" : "has-success";

                        var html = '<div class="input-group">' +
                            '<label class="input-group-addon">%</label>' +
                            '<input type="text" class="form-control input_porcentaje_rentabilidad_parcial_item ' + claseInput + '" data-item-id="' + full.Id + '" value="' + valor + '" readonly="readonly" />' +
                            '</div>';
                        return html;
                    }
                },
                {
                    "data": "RentabilidadParcial",
                    "render": function (data, type, full, meta) {
                        var valor = data;
                        for (var i = 0; i < PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.length; i++) {
                            if (PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Id == full.Id && !Validations._IsNull(PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].RentabilidadParcial))
                                valor = PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].RentabilidadParcial;
                        }

                        var claseInput = (valor <= 0) ? "has-error" : "has-success";

                        var html = '<div class="input-group">' +
                            '<label class="input-group-addon">$</label>' +
                            '<input type="text" class="form-control input_rentabilidad_parcial_item ' + claseInput + '" data-format-price="" data-item-id="' + full.Id + '" value="' + valor + '" readonly="readonly" />'
                        '</div>';
                        return html;
                    }
                },
            ],
            "columnDefs": permisosVisualizacion,
            "drawCallback": function (settings) {
                PresupuestoItemListar.PRESUPUESTO_ITEM_SELECCIONADO = null;

                //Dias y Cantidad
                $(".input_dias_item, .input_cantidad_item").onlyNumbers({
                    min: 0
                });

                //Volumen
                $(".input_volumen_item").onlyNumbers({
                    min: 0,
                    max: 100
                });

                Utils._InputFormatPrice();

                //RadioBotones Comisionable y Mandato
                $(".boton_comisionable_item, .boton_mandato_item").bootstrapToggle({
                    on: '',
                    off: ''
                });

                //Selec Proveedor
                $(".select_proveedor_item").each(function () {
                    var valorPorDefecto = $(this).attr("data-proveedor-id");
                    Utils._LoadDataToDropDownList($(this), PresupuestoConsultar.LISTA_OPCIONES_PROVEEDORES, valorPorDefecto);
                });

                //Select Impuestos Interno
                $(".select_impuestos_interno_item, .select_impuestos_externo_item").each(function () {
                    var valoresPorDefecto = $(this).attr("data-impuestos");
                    valoresPorDefecto = valoresPorDefecto.split(",");
                    Utils._LoadDataToDropDownListMultiple($(this), PresupuestoConsultar.LISTA_OPCIONES_IMPUESTOS, valoresPorDefecto);
                });

                $("#tabla_presupuesto_items").parent("div.col-sm-12").eq(0).addClass("tabla_presupuesto_items_active");

                Utils._BuilderModal();
                Utils._InputFocus();
            }
        });

    },

    /**
     * Recargar la tabla de items del presupuesto
     */
    RecargarTabla: function () {
        PresupuestoItemListar.$TABLA.draw();
        return false;
    },

    /**
     * Recargar pagina de la tabla de items del presupuesto
     */
    RecargarPaginaTabla: function () {
        PresupuestoItemListar.$TABLA.draw('page');
    },

    /**
     * Resetear Tabla
     */
    ResetearTabla: function () {
        $("#form-filtro-tabla-presupuesto")[0].reset();
        PresupuestoItemListar.$TABLA.draw();
    },

    /**
     * Seleccionar item
     * @param {any} e
     */
    OnChangeSeleccionarItem: function (e) {
        PresupuestoItemListar.PRESUPUESTO_ITEM_SELECCIONADO = ($(e).is(":checked")) ? $(e).val() : null;
    },

    /**
     * ListarAsociados
     * @param {any} e
     * @param {any} itemId
     */
    AbrirModalListarAsociados: function (e, itemId) {
        var url = URL_PRESUPUESTO_ITEM_ASOCIADO_LISTAR + "/" + itemId;
        Utils._OpenModal(url, PresupuestoItemAsociadoListar.OnLoad, "all");
    },

    ConsultarRentabilidadPresupuesto: function () {
        var parameters = {
            id: PresupuestoConsultar.PRESUPUESTO_ID
        };

        RequestHttp._Post(URL_CONSULTAR_RENTABILIDAD_PRESUPUESTO, parameters, null, function (data) {
            //TotalInterno
            var $totalInterno = $("#TotalSubtotalInterno");
            $totalInterno.val(data.data.SubTotalInterno);

            // Sub total asociados
            var $totalAsociados = $("#TotalSubtotalAsociados");
            $totalAsociados.val(data.data.SubTotalAsociados);

            // TotalCostoInterno
            var $totalCostoInterno = $("#TotalCostoInterno");
            $totalCostoInterno.val(data.data.TotalCostoInterno);

            // Sub total presupuesto interno: SubTotalExterno 
            var $totalCostoExterno = $("#TotalSubtotalExterno");
            $totalCostoExterno.val(data.data.SubTotalExterno);

            // Total rentabilidad neta: TotalRentabilidadNeta
            var $totalRentabilidadBruta = $("#TotalRentabilidadParcial");
            $totalRentabilidadBruta.val(data.data.TotalRentabilidadNeta);

            // Porcentaje Rentabilidad
            var $porcentajeRentabilidadNeta = $("#PorcentajeRentabilidadNeta");
            $porcentajeRentabilidadNeta.val(data.data.RentabilidadNeta);

            var $porcentajeRentabilidadBruta = $("#PorcentajeRentabilidadbruta");
            $porcentajeRentabilidadBruta.val(data.data.RentabilidadBruta);

        })

    },

    ConsultarRentabilidadPresupuestoFinal: function () {
        console.log(URL_CONSULTAR_RENTABILIDAD_PRESUPUESTO_FINAL);
        var parameters = {
            id: PresupuestoConsultar.PRESUPUESTO_ID
        };

        RequestHttp._Post(URL_CONSULTAR_RENTABILIDAD_PRESUPUESTO_FINAL, parameters, null, function (data) {
            if (data.data != null) {
                //TotalInterno
                var $totalInterno = $("#TotalSubtotalInterno");
                $totalInterno.val(data.data.SubTotalInterno);

                // Sub total asociados
                var $totalAsociadosF = $("#TotalSubtotalAsociadosF");
                $totalAsociadosF.val(data.data.SubTotalAsociados);

                // TotalCostoInterno
                var $totalCostoInternoF = $("#TotalCostoInternoF");
                $totalCostoInternoF.val(data.data.TotalCostoInterno);

                // Sub total presupuesto interno: SubTotalExterno 
                var $totalCostoExternoF = $("#TotalSubtotalExternoF");
                $totalCostoExternoF.val(data.data.SubTotalExterno);

                // Total rentabilidad neta: TotalRentabilidadNeta
                var $totalRentabilidadNetaF = $("#totalRentabilidadNetaF");
                $totalRentabilidadNetaF.val(data.data.TotalRentabilidadNeta);

                // Porcentaje Rentabilidad Neta
                var $porcentajeRentabilidadNetaF = $("#porcentajeRentabilidadNetaF");
                $porcentajeRentabilidadNetaF.val(data.data.RentabilidadNeta);

                // Total rentabilidad Bruta: RentabilidadBruta
                var $totalRentabilidadBrutaF = $("#totalRentabilidadBrutaF");
                $totalRentabilidadBrutaF.val(data.data.TotalRentabilidadBruta);

                // Porcentaje Rentabilidad Bruta
                var $porcentajeRentabilidadBrutaF = $("#porcentajeRentabilidadBrutaF");
                $porcentajeRentabilidadBrutaF.val(data.data.RentabilidadBruta);

                // Total rentabilidad neta con comision: TotalRentabilidadNetaComision
                var $totalRentabilidadNetaComisionF = $("#totalRentabilidadBrutaComisionF");
                $totalRentabilidadNetaComisionF.val(data.data.TotalRentabilidadBrutaComision);

                var $porcentajeRentabilidadNetaComisionF = $("#porcentajeRentabilidadBrutaComisionF");
                $porcentajeRentabilidadNetaComisionF.val(data.data.RentabilidadBrutaComision);

                var $comisionF = $("#comisionF");
                $comisionF.val(data.data.ValorComision);
            } else {
                console.log(data.data);
            }
            
        })

    },

    ConsultarResumenActividad: function () {
        if (PresupuestoItemListar.$TABLA_RESUMEN_ACTIVIDAD != null) {
            PresupuestoItemListar.$TABLA_RESUMEN_ACTIVIDAD.draw();
        } else {
            //Cargar tabla resumen actividad
            PresupuestoItemListar.$TABLA_RESUMEN_ACTIVIDAD = $("#tabla_resumen_actividad").DataTable({
                "scrollX": true,
                "ajax": {
                    "url": URL_PRESUPUESTO_RESUMEN_ACTIVIDAD,
                    "type": "POST",
                    "data": function (d) {

                        d.presupuestoId = PresupuestoConsultar.PRESUPUESTO_ID;
                        return $.extend({}, d, {
                            "adicional": {}
                        });
                    }
                },
                "columns": [
                    {
                        "data": "TotalLegalizado",
                        "render": function (data, type, full, meta) {
                            return '<div class="input-group success">' +
                                '<label class="input-group-addon">$</label>' +
                                '<input type="text" class="form-control input_valor_total" value="' + data + '" data-format-price="" readonly="readonly" />' +
                                '</div>';
                        }
                    },
                    {
                        "data": "TotalValoresComisionables",
                        "render": function (data, type, full, meta) {
                            return '<div class="input-group">' +
                                '<label class="input-group-addon">$</label>' +
                                '<input type="text" class="form-control input_valor_total" value="' + data + '" data-format-price="" readonly="readonly" />' +
                                '</div>';
                        }
                    },
                    {
                        "data": "TotalValoresNoComisionables",
                        "render": function (data, type, full, meta) {
                            return '<div class="input-group">' +
                                '<label class="input-group-addon">$</label>' +
                                '<input type="text" class="form-control input_valor_total" value="' + data + '" data-format-price="" readonly="readonly" />' +
                                '</div>';
                        }
                    },
                    {
                        "data": "TotalExcedenteAsociados",
                        "render": function (data, type, full, meta) {
                            return '<div class="input-group">' +
                                '<label class="input-group-addon">$</label>' +
                                '<input type="text" class="form-control input_valor_total" value="' + data + '" data-format-price="" readonly="readonly" />' +
                                '</div>';
                        }
                    },
                    {
                        "data": "TotalCostosEjecucion",
                        "render": function (data, type, full, meta) {
                            return '<div class="input-group">' +
                                '<label class="input-group-addon">$</label>' +
                                '<input type="text" class="form-control input_valor_total" value="' + data + '" data-format-price="" readonly="readonly" />' +
                                '</div>';
                        }
                    },
                    {
                        "data": "TotalComisionPresupuesto",
                        "render": function (data, type, full, meta) {
                            return '<div class="input-group">' +
                                '<label class="input-group-addon">$</label>' +
                                '<input type="text" class="form-control input_valor_total" value="' + data + '" data-format-price="" readonly="readonly" />' +
                                '</div>';
                        }
                    },
                    {
                        "data": "TotalActividad",
                        "render": function (data, type, full, meta) {
                            return '<div class="input-group">' +
                                '<label class="input-group-addon">$</label>' +
                                '<input type="text" class="form-control input_valor_total" value="' + data + '" data-format-price="" readonly="readonly" />' +
                                '</div>';
                        }
                    },
                    {
                        "data": "RentabilidadBrutaPresupuesto",
                        "render": function (data, type, full, meta) {
                            return '<div class="input-group">' +
                                '<label class="input-group-addon">$</label>' +
                                '<input type="text" class="form-control input_valor_total" value="' + data + '" data-format-price="" readonly="readonly" />' +
                                '</div>';
                        }
                    },
                    {
                        "data": "UtilidadComercial",
                        "render": function (data, type, full, meta) {
                            return '<div class="input-group">' +
                                '<label class="input-group-addon">$</label>' +
                                '<input type="text" class="form-control input_valor_total" value="' + data + '" data-format-price="" readonly="readonly" />' +
                                '</div>';
                        }
                    },
                    {
                        "data": "Volumen",
                        "render": function (data, type, full, meta) {
                            return '<div class="input-group">' +
                                '<label class="input-group-addon">%</label>' +
                                '<input type="text" class="form-control" value="' + data + '" data-format-price="" readonly="readonly" size="5"  />' +
                                '</div>';
                        }
                    },
                ],
                "drawCallback": function (settings) {
                    Utils._InputFormatPrice();
                    $("#tabla_resumen_actividad_paginate").hide();
                }
            });
        }
    },

    ConsultarResumenImpuestos: function () {
        //Cargar tabla Impuestos
        if (PresupuestoItemListar.$TABLA_RESUMEN_IMPUESTOS != null) {
            PresupuestoItemListar.$TABLA_RESUMEN_IMPUESTOS.draw();
        } else {
            PresupuestoItemListar.$TABLA_RESUMEN_IMPUESTOS = $("#tabla_resumen_impuestos").DataTable({
                "ajax": {
                    "url": URL_PRESUPUESTO_RESUMEN_IMPUESTOS,
                    "type": "POST",
                    "data": function (d) {
                        d.presupuestoId = PresupuestoConsultar.PRESUPUESTO_ID;
                        return $.extend({}, d, {
                            "adicional": {}
                        });
                    }
                },
                "columns": [
                    {
                        "data": "TotalValorSinImpuestos",
                        "render": function (data, type, full, meta) {
                            return '<div class="input-group">' +
                                '<label class="input-group-addon">$</label>' +
                                '<input type="text" class="form-control input_valor_total" value="' + data + '" data-format-price="" readonly="readonly" />' +
                                '</div>';
                        }
                    },
                    {
                        "data": "TotalImpuestos",
                        "render": function (data, type, full, meta) {
                            return '<div class="input-group">' +
                                '<label class="input-group-addon">$</label>' +
                                '<input type="text" class="form-control input_valor_total" value="' + data + '" data-format-price="" readonly="readonly" />' +
                                '</div>';
                        }
                    },
                    {
                        "data": "Factoring",
                        "render": function (data, type, full, meta) {
                            var html = '<div class="input-group">' +
                                '<label class="input-group-addon">$</label>' +
                                '<input type="text" class="form-control input_valor_factoring" data-format-price="" data-item-id="' + data + '"  value="' + data + '" data-valor="' + data + '" onkeyup="PresupuestoItemListar.OnChangeFactoring(this)" />' +
                                '</div>';
                            return html;

                        }
                    },
                    //{
                    //    "data": "AnticiposInteresesBancarios",
                    //    "render": function (data, type, full, meta) {
                    //        return '<input type="text" class="form-control" value="' + data + '" data-format-price="" readonly="readonly" />';
                    //    }
                    //},
                    {
                        "data": "TotalCostosFinancierosMasImpuestos",
                        "render": function (data, type, full, meta) {
                            return '<div class="input-group">' +
                                '<label class="input-group-addon">$</label>' +
                                '<input type="text" class="form-control input_valor_total" value="' + data + '" data-format-price="" readonly="readonly" />' +
                                '</div>';
                        }
                    },
                    {
                        "data": "UtilidadFinal",
                        "render": function (data, type, full, meta) {
                            return '<div class="input-group">' +
                                '<label class="input-group-addon">$</label>' +
                                '<input type="text" class="form-control input_valor_total" value="' + data + '" data-format-price="" readonly="readonly" />' +
                                '</div>';
                        }
                    },
                ],
                "drawCallback": function (settings) {
                    Utils._InputFormatPrice();
                    Utils._BuilderModal();
                    $("#tabla_resumen_impuestos_paginate").hide();
                }
            });
        }
    },

    OnChangeFactoring: function (e) {

        var parametros = {
            Id: PresupuestoConsultar.PRESUPUESTO_ID,
            Valor: e.value
        };

        RequestHttp._Post(URL_PRESUPUESTO_EDITAR_FACTORING, parametros, null, function (response) {
            if (!Validations._IsNull(response)) {
                if (!response.state) {
                    Utils._BuilderMessage("danger", response.message);
                } else {
                    Utils._BuilderMessage("success", response.message);
                }
            }
        });
    },

    /**
     * Listar modal anticipos
     * @param {any} e
     * @param {any} itemId
     */
    AbrirModalAnticipos: function (e, itemId) {
        var url = URL_PRESUPUESTO_ANTICIPOS + "/?presupuestoId=" + PresupuestoConsultar.PRESUPUESTO_ID + "&versionPresupuestoId=" + PresupuestoConsultar.VERSION_PRESUPUESTO_ID + "&itemId=" + itemId + "&asociado=" + 0;
        Utils._OpenModal(url, consultarItemPresupuestoAnticipo.init, "all");
    },

    AbrirModalAnticiposMasivosItems: function () {
        var itemId = 0;
        var url = URL_PRESUPUESTO_ANTICIPOS + "/?presupuestoId=" + PresupuestoConsultar.PRESUPUESTO_ID + "&versionPresupuestoId=" + PresupuestoConsultar.VERSION_PRESUPUESTO_ID + "&itemId=" + itemId + "&asociado=" + 0;
        Utils._OpenModal(url, consultarItemPresupuestoAnticipo.init, "all");
    },
    FullScreen: function () {
        var $container = $('#container_tabla_presupuesto_items');
        var $tabla = $("#tabla_presupuesto_items").parent("div.col-sm-12").eq(0);

        if (!$container.hasClass("container_tabla_presupuesto_items_active")) {
            $tabla.removeClass("tabla_presupuesto_items_active");
            $container.addClass("container_tabla_presupuesto_items_active");
        } else {
            $tabla.addClass("tabla_presupuesto_items_active");
            $container.removeClass("container_tabla_presupuesto_items_active");
        }

        screenfull.toggle($('#container_tabla_presupuesto_items')[0]);
    },

    VerPresupuesto: function (id) {
        window.open("/Produccion/Presupuesto/ConsultaEjecutado/" + id, '_blank');
    },

    OnDescripcionInterna: function (e, itemId) {
        var $DescripcionExterna = $("#descripcion-" + itemId);
        $DescripcionExterna.val(e.value);
    },

    OnValorUnitario: function (e, itemId) {
        var $ValorUnitario = $("#valorUnitario-" + itemId);
        $ValorUnitario.val(e.value);
        console.log(e);
    }
};