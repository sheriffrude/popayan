var tablaDirectorio = null;
var FILTRO_UNIDAD_NEGOCIO_ID = 0;
var FILTRO_AREA_ID = 0;
var FILTRO_CARGO_ID = 0;
var FILTRO_EMPRESA_ID = 0;
var FILTRO_ESTADO_ID = "";

var ListarDirectorio = function () {
    return {

        urlListar: "",
        urlAgregar: "",
        urlEditar: "",

        //Carga inicial que recibe las url de cada CRUD
        init: function (listar) {
            ListarDirectorio.construirTabla();
        },

        reconstruirTabla: function () {
            tablaDirectorio.draw();
        },

        ResetearTablaPais: function () {
            $("#input-filtro").val("");
            this.reconstruirTabla();
        },

        //Construye la tabla de salarios integrales
        construirTabla: function () {
            var filtro = $("#input-filtro");
            tablaDirectorio = $("#tabla-directorio").DataTable({
                "ajax": {
                    "url": urlListar,
                    "type": "POST",
                    "data": function (d) {
                        d.search['value'] = filtro.val();
                        return $.extend({}, d, {
                            "adicional": {
                                filtroEmpresaId: FILTRO_EMPRESA_ID,
                                filtroUnidadNegocioId: FILTRO_UNIDAD_NEGOCIO_ID,
                                filtroAreaId: FILTRO_AREA_ID,
                                filtroCargoId: FILTRO_CARGO_ID,
                                filtroEstadoId: FILTRO_ESTADO_ID
                            }
                        });
                    },

                }, "columns": [
                    { "data": "Nombre" },
                    { "data": "Empresa" },
                    { "data": "Cargo" },
                    { "data": "CorreoEmpresarial" },
                    { "data": "Celular" },
                    { "data": "Extension" },
                    { "data": "UnidadNegocio" },
                    { "data": "Area" },
                    { "data": "Estado" }
                ]
            });
        },
        OnchangeEmpresa: function (e) {
            var empresaId = $(e).val();
            if (empresaId > 0) {

                var parameters = {
                    id: empresaId
                };

                var $elementList = $("#UnidadNegocioId");
                Utils._GetDropDownList($elementList, URL_CAMBIO_EMPRESA, parameters, true);

                FILTRO_EMPRESA_ID = empresaId;
                if (tablaDirectorio != null) {
                    tablaDirectorio.draw();
                }
            }
        },
        OnchangeUnidadNegocio: function (e) {
            var unidadNegocioId = $(e).val();
            if (unidadNegocioId > 0) {

                var parameters = {
                    id: unidadNegocioId
                };
                var $elementList = $("#AreaId");
                Utils._GetDropDownList($elementList, URL_CAMBIO_UNIDAD_NEGOCIO, parameters, true);

                FILTRO_UNIDAD_NEGOCIO_ID = unidadNegocioId;
                if (tablaDirectorio != null) {
                    tablaDirectorio.draw();
                }
            }
        },
        OnChangeArea: function (e) {
            var id = $(e).val();
            if (typeof id === "undefined" || id === "") {
                id = 0;
            }

            FILTRO_AREA_ID = id;
            if (tablaDirectorio != null) {
                tablaDirectorio.draw();
            }
        },
        OnChangeCargo: function (e) {
            var id = $(e).val();
            if (typeof id === "undefined" || id === "") {
                id = 0;

            }
            FILTRO_CARGO_ID = id;

            if (tablaDirectorio != null) {
                tablaDirectorio.draw();
            }
        },
        OnChangeEstado: function (e) {
            var id = $(e).val();
            if (typeof id === "undefined" || id === "") {
                id = 0;

            }
            FILTRO_ESTADO_ID = id;

            if (tablaDirectorio != null) {
                tablaDirectorio.draw();
            }
        }
    }
}();




$(function () {
    ListarDirectorio.init();
});

