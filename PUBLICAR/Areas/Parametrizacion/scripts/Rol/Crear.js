$(function () {
    RolCrear.OnLoad();
});

var RolCrear = {
    MODULOS: {
        Parametrizacion: 1,
        Gestion: 2,
        Trafico: 3,
        HorasHombre: 4,
        Produccion: 5,
        Reportes: 6,
    },
    $PERMISOS_PARAMETRIZACION: null,
    $PERMISOS_GESTION: null,
    $PERMISOS_HOH: null,
    $PERMISOS_PRODUCCION: null,
    $PERMISOS_REPORTES: null,
    OnLoad: function () {
        this.$PERMISOS_PARAMETRIZACION = $("#contenedor_permisos_parametrizacion").tree({
            primaryKey: 'id',
            //uiLibrary: 'bootstrap4',
            //iconsLibrary: 'fontawesome',
            dataSource: URL_PERMISOS_POR_MODULO_LISTAR + "/" + this.MODULOS.Parametrizacion,
            checkboxes: true
        });

        this.$PERMISOS_GESTION = $("#contenedor_permisos_gestion").tree({
            primaryKey: 'id',
            //uiLibrary: 'bootstrap4',
            //iconsLibrary: 'fontawesome',
            dataSource: URL_PERMISOS_POR_MODULO_LISTAR + "/" + this.MODULOS.Gestion,
            checkboxes: true
        });

        this.$PERMISOS_TRAFICO = $("#contenedor_permisos_trafico").tree({
            primaryKey: 'id',
            //uiLibrary: 'bootstrap4',
            //iconsLibrary: 'fontawesome',
            dataSource: URL_PERMISOS_POR_MODULO_LISTAR + "/" + this.MODULOS.Trafico,
            checkboxes: true
        });

        this.$PERMISOS_HOH = $("#contenedor_permisos_hoh").tree({
            primaryKey: 'id',
            //uiLibrary: 'bootstrap4',
            //iconsLibrary: 'fontawesome',
            dataSource: URL_PERMISOS_POR_MODULO_LISTAR + "/" + this.MODULOS.HorasHombre,
            checkboxes: true
        });

        this.$PERMISOS_PRODUCCION = $("#contenedor_permisos_produccion").tree({
            primaryKey: 'id',
            //uiLibrary: 'bootstrap4',
            //iconsLibrary: 'fontawesome',
            dataSource: URL_PERMISOS_POR_MODULO_LISTAR + "/" + this.MODULOS.Produccion,
            checkboxes: true
        });

        this.$PERMISOS_REPOTES = $("#contenedor_permisos_reportes").tree({
            primaryKey: 'id',
            //uiLibrary: 'bootstrap4',
            //iconsLibrary: 'fontawesome',
            dataSource: URL_PERMISOS_POR_MODULO_LISTAR + "/" + this.MODULOS.Reportes,
            checkboxes: true
        });
    },
    OnBegin: function (jqXHR, settings) {
        //var permisosParametrizacion = RolEditar.$PERMISOS_PARAMETRIZACION.getCheckedNodes();
        var permisosParametrizacion = [];
        $("#contenedor_permisos_parametrizacion input[type=checkbox]").each(function () {
            if ($(this).is(":checked")) {
                var id = parseInt($(this).closest("li").attr("data-id"));
                permisosParametrizacion.push(id);
            }
        });

        //var permisosGestion = RolEditar.$PERMISOS_GESTION.getCheckedNodes();
        var permisosGestion = [];
        $("#contenedor_permisos_gestion input[type=checkbox]").each(function () {
            if ($(this).is(":checked")) {
                var id = parseInt($(this).closest("li").attr("data-id"));
                permisosGestion.push(id);
            }
        });

        //var permisosTrafico = RolEditar.$PERMISOS_TRAFICO.getCheckedNodes();
        var permisosTrafico = [];
        $("#contenedor_permisos_trafico input[type=checkbox]").each(function () {
            if ($(this).is(":checked")) {
                var id = parseInt($(this).closest("li").attr("data-id"));
                permisosTrafico.push(id);
            }
        });

        //var permisosHorasHombre = RolEditar.$PERMISOS_HOH.getCheckedNodes();
        var permisosHorasHombre = [];
        $("#contenedor_permisos_hoh input[type=checkbox]").each(function () {
            if ($(this).is(":checked")) {
                var id = parseInt($(this).closest("li").attr("data-id"));
                permisosHorasHombre.push(id);
            }
        });

        //var permisosProduccion = RolEditar.$PERMISOS_PRODUCCION.getCheckedNodes();
        var permisosProduccion = [];
        $("#contenedor_permisos_produccion input[type=checkbox]").each(function () {
            if ($(this).is(":checked")) {
                var id = parseInt($(this).closest("li").attr("data-id"));
                permisosProduccion.push(id);
            }
        });

        //var permisosReportes = RolEditar.$PERMISOS_REPORTES.getCheckedNodes();
        var permisosReportes = [];
        $("#contenedor_permisos_reportes input[type=checkbox]").each(function () {
            if ($(this).is(":checked")) {
                var id = parseInt($(this).closest("li").attr("data-id"));
                permisosReportes.push(id);
            }
        });

        var data = $(this).serializeObject();
        data["ListaPermisosParametrizacion"] = permisosParametrizacion;
        data["ListaPermisosGestion"] = permisosGestion;
        data["ListaPermisosTrafico"] = permisosTrafico;
        data["ListaPermisosHorasHombre"] = permisosHorasHombre;
        data["ListaPermisosHorasProduccion"] = permisosProduccion;
        data["ListaPermisosHorasReportes"] = permisosReportes;
        settings.data = jQuery.param(data);
        return true;
    },
    OnComplete: function (response) {
        var resultado = RequestHttp._ValidateResponse(response);
        if (resultado != null) {
            if (resultado.state) {
                Utils._BuilderMessage("success", resultado.message, RolCrear.Cancelar);
            } else {
                Utils._BuilderMessage("danger", resultado.message);

            }
        }
    },
    ConsultarPermisosCheckeados: function () {
        var permisos = this.$PERMISOS_PARAMETRIZACION.getCheckedNodes();
        alert(permisos.join());
    },
    Cancelar: function () {
        location.href = URL_ROL_LISTAR;
    }
}
