
/**
  * OnLoad Page
 **/
$(function () {
    $("#root-wizard").bootstrapWizard({});
});

/**
 * OnBeginCrearEmpleado
 * @param {any} jqXHR
 * @param {any} settings
 */
function OnBeginCrearEmpleado(jqXHR, settings) {
    var data = $(this).serializeObject();
    data["DatosBasicos"] = obtenerDatosBasicos();
    if (data["DatosBasicos"].Foto == null && data["DatosBasicos"].DetalleFoto.length <= 0) {
        Utils._BuilderMessage('danger', 'La foto es obligatoria.');
        return false;
    }
    data["ContactoEmergencia"] = obtenerContactoEmergencia();
    data["Conyugue"] = obtenerConyugue();
    data["Hijos"] = obtenerHijos();
    data["SeguridadSocial"] = obtenerSeguridadSocial();
    data["InformacionLaboral"] = obtenerInformacionLaboral();
    data["InformacionSalarial"] = obtenerInformacionSalarial();
    if (data["InformacionSalarial"].RegistroDistribucion == true && data["InformacionSalarial"].TotalPorcentaje < 100) {
        Utils._BuilderMessage('info', 'Verifique los porcentajes de la distribución del pago salaria.');
        return false;
    }
    settings.data = jQuery.param(data);
    return true;
}

/**
 * OnCompleteCrearEmpleado
 * @param {any} response
 */
function OnCompleteCrearEmpleado(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        if (resultado.state == true)
            Utils._BuilderMessage("success", resultado.message, 'RedireccionarListarEmpleados');
        else
            Utils._BuilderMessage("danger", resultado.message);
    }
}

/**
 * Función de validación
 */
function registrarEmpleado() {
    var $form = $('#tab-info-basica .datos-basicos');
    if ($form.valid()) {
        $form = $('#tab-contacto-emergencia .contacto-emergencia');
        if ($form.valid()) {
            $form = $('#conyugue-form .conyugue');
            if (($form.length <= 0) || ($form.length > 0 && $form.valid())) {
                $form = $('#seguridad-social-form .seguridad-social');
                if ($form.valid()) {
                    $form = $('#info-laboral-form .info-laboral');
                    if ($form.valid()) {
                        $form = $('#info-salarial-form .info-salarial');
                        if ($form.valid()) {
                            // Resumen de registro
                            $("#registro-empleado-form").submit();
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
            }
            else {
                Utils._BuilderMessage('info', "Debe completar los campos de la pestaña 'Conyugue'");
                return false;
            }
        } else {
            Utils._BuilderMessage('info', "Debe completar los campos de la pestaña 'Contacto de emergencia'");
            return false;
        }
    } else {
        Utils._BuilderMessage('info', "Debe completar los campos de la pestaña 'Información básica'");
        return false;
    }
}

/**
 * RedireccionarListarEmpleados
 */
function RedireccionarListarEmpleados() {
    window.location = URL_LISTAR_EMPLEADOS;
}
