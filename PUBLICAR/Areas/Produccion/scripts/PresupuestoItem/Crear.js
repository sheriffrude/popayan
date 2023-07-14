var PresupuestoItemCrear = {

    /**
     * Insertar registro vacio para asignar Id al item
     */
    CrearItem: function () {
        var parametros = {
            presupuestoId: PresupuestoConsultar.PRESUPUESTO_ID,
            itemSeleccionadoId: PresupuestoItemListar.PRESUPUESTO_ITEM_SELECCIONADO
        };

        RequestHttp._Post(URL_PRESUPUESTO_ITEM_CREAR, parametros, null, function (response) {
            if (!Validations._IsNull(response)) {
                if (response.state) {
                    PresupuestoItemListar.RecargarPaginaTabla();
                } else
                    Utils._BuilderMessage("danger", response.message);
            }
        });
    },

    /**
     * DuplicarItem
     */
    DuplicarItem: function () {
        if (PresupuestoItemListar.PRESUPUESTO_ITEM_SELECCIONADO == null) {
            Utils._BuilderMessage("warning", "Debe seleccionar el ítem a Copiar.")
            return false;
        }

        var parametros = {
            presupuestoId: PresupuestoConsultar.PRESUPUESTO_ID,
            itemSeleccionadoId: PresupuestoItemListar.PRESUPUESTO_ITEM_SELECCIONADO
        };

        RequestHttp._Post(URL_PRESUPUESTO_ITEM_DUPLICAR, parametros, null, function (response) {
            if (!Validations._IsNull(response)) {
                if (response.state) {
                    PresupuestoItemListar.RecargarPaginaTabla();
                } else
                    Utils._BuilderMessage("danger", response.message);
            }
        });
    },

    /**
     * DuplicarItem
     */
    DuplicarItemPorGrupo: function () {
        if (PresupuestoItemListar.PRESUPUESTO_ITEM_SELECCIONADO == null) {
            Utils._BuilderMessage("warning", "Debe seleccionar el ítem a Copiar.")
            return false;
        }

        var parametros = {
            presupuestoId: PresupuestoConsultar.PRESUPUESTO_ID,
            itemSeleccionadoId: PresupuestoItemListar.PRESUPUESTO_ITEM_SELECCIONADO
        };

        RequestHttp._Post(URL_PRESUPUESTO_ITEM_DUPLICAR_POR_GRUPO, parametros, null, function (response) {
            if (!Validations._IsNull(response)) {
                if (response.state) {
                    PresupuestoItemListar.RecargarPaginaTabla();
                } else
                    Utils._BuilderMessage("danger", response.message);
            }
        });
    },

    BuscarPresupuestos: function () {
        var url = URL_PRESUPUESTO_LISTAR;
    },

    DuplicarItemsOtroPresupuesto: function (items) {
        var url = URL_PRESUPUESTO_ITEM_OTRO_PRESUPUESTO_DUPLICAR;
        var parametros = {
            presupuestoId: PresupuestoConsultar.PRESUPUESTO_ID,
            items: items
        }
        RequestHttp._Post(url, parametros, null, function (response) {
            if (!Validations._IsNull(response)) {
                if (response.state) {
                    Utils._BuilderMessage("success", response.message);
                    Utils._CloseModal();
                    PresupuestoItemListar.RecargarPaginaTabla();
                } else
                    Utils._BuilderMessage("danger", response.message);
            }
        })
    }
}