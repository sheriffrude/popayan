var PresupuestoItemEditar = {
    /**
     * GuardarCambiosItems
     */
    GuardarCambios: function () {

        if (PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.length == 0) {
            Utils._BuilderMessage("warning", "No ha realizado ningún cambio en los ítem del presupuesto.");
            return false;
        }

        var parametros = {
            id: PresupuestoConsultar.PRESUPUESTO_ID,
            listaItems: PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS
        }
        RequestHttp._Post(URL_LISTA_PRESUPUESTO_ITEMS_EDITAR, parametros, null, function (response) {
            if (!Validations._IsNull(response)) {
                if (response.state) {
                    if (!PresupuestoConsultar.AUTOGUARDADO) {
                        Utils._BuilderMessage("success", response.message);

                        //Carga resumen del presupuesto
                        PresupuestoItemListar.ConsultarRentabilidadPresupuesto();
                        PresupuestoItemListar.ConsultarResumenActividad();
                        PresupuestoItemListar.ConsultarResumenImpuestos();
                    }

                    PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS = [];
                } else {
                    Utils._BuilderMessage("danger", response.message);
                }

                if (!PresupuestoConsultar.AUTOGUARDADO)
                    PresupuestoItemListar.RecargarPaginaTabla();
            }
        }, !PresupuestoConsultar.AUTOGUARDADO);
    },

    /**
     * GuardarCambiosTemporales
     * @param {any} itemId
     */
    GuardarCambiosTemporales: function (itemId) {
        var impuestosInterno = $("select.select_impuestos_interno_item[data-item-id='" + itemId + "']").val();
        impuestosInterno = (impuestosInterno == null) ? [] : impuestosInterno;

        var impuestosExterno = $("select.select_impuestos_externo_item[data-item-id='" + itemId + "']").val();
        impuestosExterno = (impuestosExterno == null) ? [] : impuestosExterno;
        
        var existeItem = false;
        var data = {
            Id: itemId,
            //Interno
            Grupo: $("input.input_grupo_item[data-item-id='" + itemId + "']").val(),
            Nombre: $("input.input_nombre_item[data-item-id='" + itemId + "']").val(),
            DescripcionInterna: $("textarea.textarea_descripcion_interno_item[data-item-id='" + itemId + "']").val(),
            ProveedorId: $(".select_proveedor_item[data-item-id='" + itemId + "']").val(),
            Dias: $("input.input_dias_item[data-item-id='" + itemId + "']").val(),
            Cantidad: $("input.input_cantidad_item[data-item-id='" + itemId + "']").val(),
            ValorUnitarioInterno: $("input.input_valor_unitario_interno_item[data-item-id='" + itemId + "']").formatPriceGetVal(),
            SubTotalInterno: $("input.input_sub_total_interno_item[data-item-id='" + itemId + "']").formatPriceGetVal(),
            //Falta Porcentaje Anticipos
            ImpuestosInterno: impuestosInterno,
            Volumen: $("input.input_volumen_item[data-item-id='" + itemId + "']").val(),
            CostoInterno: $("input.input_costo_interno_item[data-item-id='" + itemId + "']").formatPriceGetVal(),
            //Externo
            DescripcionExterna: $("textarea.textarea_descripcion_externo_item[data-item-id='" + itemId + "']").val(),
            ValorUnitarioExterno: $("input.input_valor_unitario_externo_item[data-item-id='" + itemId + "']").formatPriceGetVal(),
            SubTotalExterno: $("input.input_sub_total_externo_item[data-item-id='" + itemId + "']").formatPriceGetVal(),
            ImpuestosExterno: impuestosExterno,
            //Rentabilidad
            PorcentajeRentabilidadParcial: $("input.input_porcentaje_rentabilidad_parcial_item[data-item-id='" + itemId + "']").val(),
            RentabilidadParcial: $("input.input_rentabilidad_parcial_item[data-item-id='" + itemId + "']").formatPriceGetVal(),
        }

        for (var i = 0; i < PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.length; i++) {
            if (PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Id == itemId) {
                existeItem = true;
                PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i] = data;
            }
        }

        if (!existeItem)
            PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.push(data);

        if (PresupuestoConsultar.AUTOGUARDADO)
            PresupuestoItemEditar.GuardarCambios();

        PresupuestoItemEditar.CalcularSubTotalInterno(itemId);
        PresupuestoItemEditar.CalcularSubTotalExterno(itemId);
    },

    //INTERNO

    /**
     * OnKeyUpGrupoItem
     * @param {any} e
     * @param {any} itemId
     */
    OnKeyUpGrupo: function (e, itemId) {
        PresupuestoItemEditar.GuardarCambiosTemporales(itemId);
    },

    /**
     * OnKeyUpNombreItem
     * @param {any} e
     * @param {any} itemId
     */
    OnKeyUpNombre: function (e, itemId) {
        PresupuestoItemEditar.GuardarCambiosTemporales(itemId);
    },

    /**
     * OnKeyUpDescripcionItemInterna
     * @param {any} e
     * @param {any} itemId
     */
    OnKeyUpDescripcionInterna: function (e, itemId) {
        PresupuestoItemEditar.GuardarCambiosTemporales(itemId);
      
    },

    OnBlurDescripcionInterna: function (e, itemId) {
        if ($("textarea.textarea_descripcion_externo_item[data-item-id='" + itemId + "']").val() == "") {
            $("textarea.textarea_descripcion_externo_item[data-item-id='" + itemId + "']").val($("textarea.textarea_descripcion_interno_item[data-item-id='" + itemId + "']").val());
        }
    },   

    /**
     * OnChangeProveedor
     * @param {any} e
     * @param {any} itemId
     */
    OnChangeProveedor: function (e, itemId) {
        PresupuestoItemEditar.GuardarCambiosTemporales(itemId);
    },

    /**
     * OnKeyUpDiasItem
     * @param {any} e
     * @param {any} itemId
     */
    OnKeyUpDias: function (e, itemId) {
        PresupuestoItemEditar.GuardarCambiosTemporales(itemId);
    },

    /**
     * OnKeyUpCantidadItem
     * @param {any} e
     * @param {any} itemId
     */
    OnKeyUpCantidad: function (e, itemId) {
        PresupuestoItemEditar.GuardarCambiosTemporales(itemId);
    },

    /**
     * OnKeyUpValorUnitarioInternoItem
     * @param {any} e
     * @param {any} itemId
     */
    OnKeyUpValorUnitarioInterno: function (e, itemId) {
        PresupuestoItemEditar.GuardarCambiosTemporales(itemId);
    },

    /**
     * OnChangeImpuestosInternos
     * @param {any} e
     * @param {any} itemId
     */
    OnChangeImpuestosInterno: function (e, itemId) {
        console.log(e);
        console.log(itemId);
        PresupuestoItemEditar.GuardarCambiosTemporales(itemId);
    },

    /**
     * CalcularSubTotalInternoItem
     * @param {any} itemId
     */
    CalcularSubTotalInterno: function (itemId) {
        var dias = $("input.input_dias_item[data-item-id='" + itemId + "']").val();
        var cantidad = $("input.input_cantidad_item[data-item-id='" + itemId + "']").val();
        var valorUnitarioInterno = $(".input_valor_unitario_interno_item[data-item-id='" + itemId + "']").formatPriceGetVal();

        var subTotalInternoItem = parseFloat(dias * cantidad * valorUnitarioInterno).toFixed(2);
        $("input.input_sub_total_interno_item[data-item-id='" + itemId + "']").val(subTotalInternoItem).formatPrice();

        //Adiciona o actualiza el valor en el array LISTA_ITEMS_MODIFICADOS
        var existeItem = false;
        for (var i = 0; i < PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.length; i++) {
            if (PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Id == itemId) {
                existeItem = true;
                PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].SubTotalInternoItem = subTotalInternoItem;
            }
        }

        if (!existeItem) {
            var data = {
                Id: itemId,
                SubTotalInternoItem: subTotalInternoItem
            }
            PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.push(data);
        }

        PresupuestoItemEditar.CalcularRentabilidadParcial(itemId);
        PresupuestoItemEditar.CalcularCostoInterno(itemId);
    },

    /**
     * OnKeyUpVolumenItem
     * @param {any} e
     * @param {any} itemId
     */
    OnKeyUpVolumen: function (e, itemId) {
        PresupuestoItemEditar.GuardarCambiosTemporales(itemId);
    },

    /**
     * CalcularCostoInterno
     * @param {any} itemId
     */
    CalcularCostoInterno: function (itemId) {
        var subTotalInterno = $("input.input_sub_total_interno_item[data-item-id='" + itemId + "']").formatPriceGetVal();
        var volumen = $("input.input_volumen_item[data-item-id='" + itemId + "']").val();
        var costoInterno = parseFloat(subTotalInterno - (subTotalInterno * (volumen / 100))).toFixed(2);;

        $("input.input_costo_interno_item[data-item-id='" + itemId + "']").val(costoInterno).formatPrice();

        //Adiciona o actualiza el valor en el array LISTA_ITEMS_MODIFICADOS
        var existeItem = false;
        for (var i = 0; i < PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.length; i++) {
            if (PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Id == itemId) {
                existeItem = true;
                PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].CostoInterno = costoInterno;
            }
        }

        if (!existeItem) {
            var data = {
                Id: itemId,
                CostoInterno: costoInterno
            }
            PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.push(data);
        }
    },

    ///EXTERNO

    /**
     * OnChangeDescripcionExterna
     * @param {any} e
     * @param {any} itemId
     */
    OnChangeDescripcionExterna: function (e, itemId) {
        PresupuestoItemEditar.GuardarCambiosTemporales(itemId);
    },

    /**
     * OnKeyUpValorUnitarioExternoItem
     * @param {any} e
     * @param {any} itemId
     */
    OnKeyUpValorUnitarioExterno: function (e, itemId) {
        PresupuestoItemEditar.GuardarCambiosTemporales(itemId);
    },

    /**
     * OnChangeImpuestosExternos
     * @param {any} e
     * @param {any} itemId
     */
    OnChangeImpuestosExterno: function (e, itemId) {
        PresupuestoItemEditar.GuardarCambiosTemporales(itemId);
    },

    /**
     * CalcularSubTotalExternoItem
     * @param {any} itemId
     */
    CalcularSubTotalExterno: function (itemId) {
        var dias = $("input.input_dias_item[data-item-id='" + itemId + "']").val();
        var cantidad = $("input.input_cantidad_item[data-item-id='" + itemId + "']").val();
        var valorUnitarioExterno = $(".input_valor_unitario_externo_item[data-item-id='" + itemId + "']").formatPriceGetVal();

        var subTotalExterno = (dias * cantidad * valorUnitarioExterno).toFixed(2);
        $("input.input_sub_total_externo_item[data-item-id='" + itemId + "']").val(subTotalExterno).formatPrice();

        //Actualiza el valor en el array LISTA_ITEMS_MODIFICADOS
        var existeItem = false;
        for (var i = 0; i < PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.length; i++) {
            if (PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Id == itemId) {
                existeItem = true;
                PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].SubTotalExterno = subTotalExterno;
            }
        }

        if (!existeItem) {
            var data = {
                Id: ItemId,
                SubTotalExterno: subTotalExterno
            }
            PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.push(data);
        }

        PresupuestoItemEditar.CalcularRentabilidadParcial(itemId);
    },

    /**
     * CalcularPorcentajeRentabilidadItem
     * @param {any} itemId
     */
    CalcularRentabilidadParcial: function (itemId) {
        var totalInternoItem = $("input.input_costo_interno_item[data-item-id='" + itemId + "']").formatPriceGetVal();
        var subTotalExternoItem = $(".input_sub_total_externo_item[data-item-id='" + itemId + "']").formatPriceGetVal();

        var rentabilidadParcial = parseFloat(subTotalExternoItem - totalInternoItem).toFixed(2);;

        var porcentajeRentabilidadParcial = (subTotalExternoItem == 0) ? -100
            : parseFloat((rentabilidadParcial / subTotalExternoItem) * 100).toFixed(2);
        porcentajeRentabilidadParcial = porcentajeRentabilidadParcial;

        //Adiciona el total de la rentabilidad
        $("input.input_rentabilidad_parcial_item[data-item-id='" + itemId + "']").val(rentabilidadParcial).formatPrice();
        if (rentabilidadParcial <= 0)
            $("input.input_rentabilidad_parcial_item[data-item-id='" + itemId + "']").removeClass("has-success").addClass("has-error");
        else if (rentabilidadParcial > 0)
            $("input.input_rentabilidad_parcial_item[data-item-id='" + itemId + "']").removeClass("has-error").addClass("has-success");
        else
            $("input.input_rentabilidad_parcial_item[data-item-id='" + itemId + "']").removeClass("has-success, has-error");

        //Adiciona el porcentaje de la rentabilidad
        $("input.input_porcentaje_rentabilidad_parcial_item[data-item-id='" + itemId + "']").val(porcentajeRentabilidadParcial);
        if (porcentajeRentabilidadParcial <= 0)
            $("input.input_porcentaje_rentabilidad_parcial_item[data-item-id='" + itemId + "']").removeClass("has-success").addClass("has-error");
        else if (porcentajeRentabilidadParcial > 0)
            $("input.input_porcentaje_rentabilidad_parcial_item[data-item-id='" + itemId + "']").removeClass("has-error").addClass("has-success");
        else
            $("input.input_porcentaje_rentabilidad_parcial_item[data-item-id='" + itemId + "']").removeClass("has-success, has-error");

        //Adiciona o actualiza la información del array LISTA_ITEMS_MODIFICADOS
        var existeItem = false;
        for (var i = 0; i < PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.length; i++) {
            if (PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].Id == itemId) {
                existeItem = true;
                PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].PorcentajeRentabilidadParcial = porcentajeRentabilidadParcial;
                PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS[i].RentabilidadParcial = rentabilidadParcial;
            }
        }

        if (!existeItem) {
            var data = {
                Id: itemId,
                PorcentajeRentabilidadParcial: porcentajeRentabilidadParcial,
                RentabilidadParcial: rentabilidadParcial
            }
            PresupuestoItemListar.LISTA_ITEMS_MODIFICADOS.push(data);
        }
    },

    /**
     * OnChangeComisionItem
     * @param {any} e
     * @param {any} itemId
     */
    OnChangeComision: function (e, itemId) {
        var parametros = {
            Id: PresupuestoConsultar.PRESUPUESTO_ID,
            ItemId: itemId,
            Comisionable: $(e).is(":checked")
        };

        RequestHttp._Post(URL_COMISION_ITEM_EDITAR, parametros, null, function (response) {
            if (!Validations._IsNull(response)) {
                if (response.state) {
                    //Carga resumen del presupuesto
                    PresupuestoItemListar.ConsultarRentabilidadPresupuesto();
                    PresupuestoItemListar.ConsultarResumenActividad();
                    PresupuestoItemListar.ConsultarResumenImpuestos();
                } else
                    Utils._BuilderMessage("danger", response.message);
            }
        });
    },

    /**
     * OnChangeMandatoItem
     * @param {any} e
     * @param {any} itemId
     */
    OnChangeMandato: function (e, itemId) {
        var parametros = {
            Id: PresupuestoConsultar.PRESUPUESTO_ID,
            ItemId: itemId,
            Mandato: $(e).is(":checked")
        };

        RequestHttp._Post(URL_MANDATO_ITEM_EDITAR, parametros, null, function (response) {
            if (!Validations._IsNull(response)) {
                if (!response.state) {
                    Utils._BuilderMessage("danger", response.message);
                }
            }
        });
    },
}