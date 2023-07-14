$(function () {
    PresupuestoConsultar.OnLoad();
});

var PresupuestoConsultar = {
    PRESUPUESTO_ID: null,
    VERSION_PRESUPUESTO_ID: null,
    EMPRESA_ID: null,
    ESTADO_ID: null,
    LISTA_OPCIONES_PROVEEDORES: null,
    LISTA_OPCIONES_IMPUESTOS: null,
    AUTOGUARDADO: false,
    BLOQUEO: false,
    PRESUPUESTO_EDITABLE: false,
    /**
    * OnLoad
    */
    OnLoad: function () {
        $("#btn_autoguardar_presupuesto").prop('checked', false);
        $("#btn_bloquear_presupuesto").prop('checked', false);
        PresupuestoConsultar.PRESUPUESTO_ID = $("#PresupuestoId").val();
        PresupuestoConsultar.VERSION_PRESUPUESTO_ID = $("#PresupuestoVersionId").val();
        PresupuestoConsultar.EMPRESA_ID = $("#EmpresaId").val();
        PresupuestoConsultar.ESTADO_ID = $("#EstadoId").val();
        PresupuestoConsultar.PRESUPUESTO_EDITABLE = ($("#PresupuestoEditable").val() === "True");
        PresupuestoConsultar.BLOQUEO = ($("#Bloqueo").val());
        PresupuestoConsultar.CANCELACION = ($("#Cancelacion").val());
        PresupuestoItemListar.OnLoad();
    },
    /**
     * Consultar lista de proveedores
     */
    ConsultarListaProveedores: function () {
        var parametros = {
            id: PresupuestoConsultar.EMPRESA_ID
        };
        RequestHttp._Post(URL_LISTAR_OPCIONES_PROVEEDORES, parametros, null, function (response) {
            if (response != null) {
                if (response.state == true) {
                    PresupuestoConsultar.LISTA_OPCIONES_PROVEEDORES = response.data;
                    PresupuestoConsultar.ConsultarListaImpuestoPorEmpresa();
                }
                else
                    Utils._BuilderMessage("danger", response.message);
            }
        })
    },
    /**
     * ConsultarListaImpuestoPorEmpresa
     */
    ConsultarListaImpuestoPorEmpresa: function () {
        var parametros = {
            id: PresupuestoConsultar.EMPRESA_ID
        }
        RequestHttp._Post(URL_LISTAR_OPCIONES_IMPUESTOS_POR_EMPRESA, parametros, null, function (response) {
            if (response != null) {
                if (response.state == true) {
                    PresupuestoConsultar.LISTA_OPCIONES_IMPUESTOS = response.data;
                    PresupuestoItemListar.CrearTabla();
                }
                else
                    Utils._BuilderMessage("danger", response.message);
            }
        })
    },
    /**
     * OnChangeAutoGuardar
     * @param {any} e
     */
    OnChangeAutoGuardar: function (e) {
        PresupuestoConsultar.AUTOGUARDADO = $(e).is(":checked");
    },

    ConfirmarNuevaVersionInterna: function () {
        Utils._BuilderConfirmation("Nueva versión interna", "¿Está seguro que desea crear una nueva versión interna?", PresupuestoConsultar.NuevaVersionInterna);
    },
    NuevaVersionInterna: function () {
        var url = URL_PRESUPUESTO_VERSION_INTERNA_CREAR;
        var parametros = {
            presupuestoId: PresupuestoConsultar.PRESUPUESTO_ID
        };
        RequestHttp._Post(url, parametros, null, function (response) {
            if (!Validations._IsNull(response)) {
                if (response.state) {
                    Utils._BuilderMessage("success", response.message, Utils._ReloadPage);
                } else {
                    Utils._BuilderMessage("danger", response.message);
                }
            }
        });
    },
    ConfirmarNuevaVersionExterna: function () {
        Utils._BuilderConfirmation("Nueva versión externa", "¿Está seguro que desea crear una nueva versión externa?", PresupuestoConsultar.NuevaVersionExterna);
    },
    NuevaVersionExterna: function () {
        var url = URL_PRESUPUESTO_VERSION_EXTERNA_CREAR;
        var parametros = {
            presupuestoId: PresupuestoConsultar.PRESUPUESTO_ID
        };
        RequestHttp._Post(url, parametros, null, function (response) {
            if (!Validations._IsNull(response)) {
                if (response.state) {
                    Utils._BuilderMessage("success", response.message, Utils._ReloadPage);
                } else {
                    Utils._BuilderMessage("danger", response.message);
                }
            }
        });
    },
    ImprimirInterno: function () {
        var parametros = {
            BaseUrl: ForDefault._UrlBase,
            PresupuestoId: PresupuestoConsultar.PRESUPUESTO_ID,
            PresupuestoVersionId: PresupuestoConsultar.VERSION_PRESUPUESTO_ID
        };
        ReportsP._OpenTab("PDF", "Produccion/Presupuesto/PresupuestoInterno.trdp", parametros);
        return false;
    },
    ImprimirExterno: function () {
        var parametros = {
            BaseUrl: ForDefault._UrlBase,
            PresupuestoId: PresupuestoConsultar.PRESUPUESTO_ID,
            PresupuestoVersionId: PresupuestoConsultar.VERSION_PRESUPUESTO_ID
        };
        ReportsP._OpenTab("PDF", "Produccion/Presupuesto/PresupuestoExterno.trdp", parametros);
        return false;
    },
    ImprimirExternoConProveedor: function () {
        var parametros = {
            BaseUrl: ForDefault._UrlBase,
            PresupuestoId: PresupuestoConsultar.PRESUPUESTO_ID,
            PresupuestoVersionId: PresupuestoConsultar.VERSION_PRESUPUESTO_ID
        };
        ReportsP._OpenTab("PDF", "Produccion/Presupuesto/PresupuestoExternoConProveedor.trdp", parametros);
        return false;
    },
    OnClickVerPresupuesto: function(id) {
        window.open("Produccion/Presupuesto/ConsultaEjecutado/" + id, '_blank');
    }
    ,
    VerPresupuesto: function (id) {
        alert('entra');
    }
};

var Bloquar = {
    OnChangeBloquear: function (e, bloqueo) {
        //PresupuestoConsultar.BLOQUEO = $(e).is(":checked");
        //alert(e.value());
        console.log(bloqueo);
        if (bloqueo == 0) {
            bloqueo = 1;
        } else {
            bloqueo = 0;
        }
        var parametros = {
            presupuestoId: PresupuestoConsultar.PRESUPUESTO_ID,
            estado: bloqueo
        };
        RequestHttp._Post(URL_PRESUPUESTO_BOQUEAR, parametros, null, function (response) {
            if (!Validations._IsNull(response)) {
                if (response.state) {
                    Utils._BuilderMessage("success", response.message, Utils._ReloadPage);
                } else {
                    Utils._BuilderMessage("danger", response.message);
                }
            }
        });
    }
}

var Cancelacion = {
    OnChangeCancelacion: function (e, cancelacion) {
        //PresupuestoConsultar.BLOQUEO = $(e).is(":checked");
        //alert(e.value());
       
        
        var parametros = {
            presupuestoId: PresupuestoConsultar.PRESUPUESTO_ID,
            estado: cancelacion,
            presupuestoVersionId: PresupuestoConsultar.VERSION_PRESUPUESTO_ID
            
        };
        RequestHttp._Post(URL_PRESUPUESTO_CANCELACION, parametros, null, function (response) {
            if (!Validations._IsNull(response)) {
                if (response.state) {
                    Utils._BuilderMessage("success", response.message, Utils._ReloadPage);
                } else {
                    Utils._BuilderMessage("danger", response.message);
                }
            }
        });
    }
};