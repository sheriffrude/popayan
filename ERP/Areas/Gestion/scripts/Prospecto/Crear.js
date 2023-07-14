
/**
  * OnLoad Page
 **/
$(function () {
    $("#root-wizard").bootstrapWizard({});
});

/**
 * OnBeginCrearProspecto
 * @param {any} jqXHR
 * @param {any} settings
 */
function OnBeginCrearProspecto(jqXHR, settings) {
    var data = $(this).serializeObject();
    data["DatosBasicos"] = obtenerDatosBasicos();
    if (data["DatosBasicos"].Foto == null && data["DatosBasicos"].FotoSrc != null && data["DatosBasicos"].FotoSrc.length <= 0) {
        Utils._BuilderMessage('danger', 'La foto es obligatoria.');
        return false;
    }
    data["SeguridadSocial"] = obtenerSeguridadSocial();
    data["InformacionLaboral"] = obtenerInformacionLaboral();
    data["InformacionSalarial"] = obtenerInformacionSalarial();
    data["ProspectoDeduccion"] = obtenerDeduccion();
    settings.data = jQuery.param(data);
    return true;
}

/**
 * OnCompleteCrearProspecto
 * @param {any} response
 */
function OnCompleteCrearProspecto(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        if (resultado.state == true)
            Utils._BuilderMessage("success", resultado.message, 'RedireccionarListarProspectos');
        else
            Utils._BuilderMessage("danger", resultado.message);
    }
}

/**
 * Función de validación
 */
function registrarProspecto() {
    var $form = $('.datos-basicos');
    if ($form.valid()) {
        $form = $('.seguridad-social');
        if ($form.valid()) {
            $form = $('.info-laboral');
            if ($form.valid()) {
                $form = $('.info-salarial');
                if ($form.valid()) {
                    $form = $('.deduccion');
                    if ($form.valid()) {
                        // Resumen de registro
                        $("#registro-prospecto-form").submit();
                    } else {
                        Utils._BuilderMessage('info', "Debe completar los campos de la pestaña 'Deducción del trabajador'");
                        return false;
                    }
                } else {
                    Utils._BuilderMessage('info', "Debe completar los campos de la pestaña 'Información salarial'");
                    return false;
                }
            } else {
                Utils._BuilderMessage('info', "Debe completar los campos de la pestaña 'Información laboral'");
                return false;
            }
        } else {
            Utils._BuilderMessage('info', "Debe completar los campos de la pestaña 'Seguridad social y parafiscales'");
            return false;
        }
    } else {
        Utils._BuilderMessage('info', "Debe completar los campos de la pestaña 'Información básica'");
        return false;
    }
}

/**
 * RedireccionarListarProspectos
 */
function RedireccionarListarProspectos() {
    window.location = URL_LISTAR_PROSPECTOS;
}
