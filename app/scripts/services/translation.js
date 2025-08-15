'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.translation
 * @description
 * # translation
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('translation', function($window) {

    // Public API here
    return {
      getObjectTranslated: function() {
        var obj = {};
        obj.currentYear = moment().format('YYYY');
        obj.lang = $window.localStorage.getItem("lang");
        if (obj.lang === "EN") {
          obj.Deconnexion = "Logout";
          obj.Vousnetespasconnectes = "You are not connected !!";
          obj.LeserveurnerepondpasVeillezreessayer = "Server does not respond. Please try again !!";
          obj.Referentiels = "Repositories";
          obj.ParcellesPhysiques = "Physical Parcels";
          obj.ParcellesCulturales = "Parcelles Culturales";
          obj.Listedupersonnel = "Personnel list";
          obj.Listedesoperations = "Référentiel opérations";
          obj.culture = "Gestion des cultures";
          obj.cultureModalTitle = "Ajouter une culture";
          obj.photo = "Photo";
          obj.famille = "Famille";
          obj.id = "ID";
          obj.ref = "Reference";
          obj.idFamilleCulture = "ID famille culture";
          obj.variete = "Gestion des variétés";
          obj.typeVariete = "Type de variete";
          obj.operation = "Operation";
          obj.carence = "Gestion des Niveaux de carence";
          obj.coloration = "Gestion des Niveaux de coloration";
          obj.elements_mineraux = "Gestion des Eléments minéraux";
          obj.intensite_Stade = "Gestion des Intensités de stade";
          obj.Login = "Login";
          obj.Password = "Password";
          obj.Connexion = "Log in";
          obj.Yourlogin = "Your login";
          obj.Yourpassword = "Your password";
          obj.LoginoumotdepasseincorrecteVeuillezreessayer = "Incorrect Login or password. Retry!!";
          obj.refCultural = "Référentiel cultural";
          obj.refObservation = "Référentiel observations";
          obj.refColoration = "Référentiel Mensuration et rendement";
          obj.refRessource = "Référentiel ressources";
          obj.refLieuElim = " Référentiel des lieux d'élimination";
          obj.refModeApplication = "Référentiel des modes d'application";
          obj.niveauAttaque = "Gestion des unités de niveaux d’attaque";
          obj.refMesure = "Référentiel Mesures";
          obj.NiveauConformite = "Gestion des Niveaux de conformité";
          obj.repartion_attaque = "Répartition d'attaque";
          obj.validation_auto_obs = " Validation automatique des observations";
          obj.objt_observation = "Objets d’observation";
          obj.gestionStade = "Gestion des qualités stade";
          obj.refParcellaire = "Référentiel parcellaire";
          obj.gestionPays = "Gestion des Pays, régions et zônes";
          obj.trancheAge = "Gestion des tranches age";
          obj.RefeArbre = "Référencement des arbres";
          obj.RefPiege = "Référencement des pièges";
          obj.RefUser = "Utilisateurs";
          obj.ManageProfile = "Gestion des profils";
          obj.GestionEquipe = "Gestion des équipes";
          obj.Dernieres_nouveautes = "Latest release";
          obj.new = "new";
          obj.HEADER = { TEST: "Test" };
        } else if (obj.lang === "ES") {
          obj.Deconnexion = "Cerrar sesión";
          obj.Vousnetespasconnectes = "No estás conectado !!";
          obj.LeserveurnerepondpasVeillezreessayer = "El servidor no responde. ¡Inténtalo de nuevo!";
          obj.Referentiels = "Datos de referencia";
          obj.ParcellesPhysiques = "Parcelas físicas";
          obj.ParcellesCulturales = "Parcelas culturales";
          obj.Listedupersonnel = "Lista de personal";
          obj.Listedesoperations = "Referencial de operaciones";
          obj.culture = "Gestión de cultivos";
          obj.cultureModalTitle = "Añadir un cultivo";
          obj.photo = "Foto";
          obj.famille = "Familia";
          obj.id = "ID";
          obj.ref = "Referencia";
          obj.idFamilleCulture = "ID familia cultivo";
          obj.variete = "Gestión de variedades";
          obj.typeVariete = "Tipo de variedad";
          obj.operation = "Operación";
          obj.carence = "Gestión de niveles de carencia";
          obj.coloration = "Gestión de niveles de coloración";
          obj.elements_mineraux = "Gestión de elementos minerales";
          obj.intensite_Stade = "Gestión de intensidades de estadio";
          obj.Login = "Usuario";
          obj.Password = "Contraseña";
          obj.Connexion = "Iniciar sesión";
          obj.Yourlogin = "Su usuario";
          obj.Yourpassword = "Su contraseña";
          obj.LoginoumotdepasseincorrecteVeuillezreessayer = "Usuario o contraseña incorrectos. ¡Inténtalo de nuevo!";
          obj.refCultural = "Referencial cultural";
          obj.refObservation = "Referencial observaciones";
          obj.refColoration = "Referencial medición y rendimiento";
          obj.refRessource = "Referencial recursos";
          obj.refLieuElim = " Referencial de lugares de eliminación";
          obj.refModeApplication = "Referencial de modos de aplicación";
          obj.niveauAttaque = "Gestión de unidades de niveles de ataque";
          obj.refMesure = "Referencial medidas";
          obj.NiveauConformite = "Gestión de niveles de conformidad";
          obj.repartion_attaque = "Distribución de ataque";
          obj.validation_auto_obs = " Validación automática de observaciones";
          obj.objt_observation = "Objetos de observación";
          obj.gestionStade = "Gestión de calidades de estadio";
          obj.refParcellaire = "Referencial parcelario";
          obj.gestionPays = "Gestión de países, regiones y zonas";
          obj.trancheAge = "Gestión de tramos de edad";
          obj.RefeArbre = "Referenciación de árboles";
          obj.RefPiege = "Referenciación de trampas";
          obj.RefUser = "Usuarios";
          obj.ManageProfile = "Gestión de perfiles";
          obj.GestionEquipe = "Gestión de equipos";
          obj.Dernieres_nouveautes = "Últimas novedades";
          obj.new = "nuevo";
          obj.HEADER = { TEST: "Prueba" };
          obj.Madeby = "Hecho por";
        } else if (obj.lang === "FR" || obj.lang === null) {
          if (obj.lang === null) {
            $window.localStorage.setItem("lang", "FR");
            obj.reload = true;
          }
          obj.Deconnexion = "Déconnexion";
          obj.Vousnetespasconnectes = "Vous n'êtes pas connectés !!";
          obj.LeserveurnerepondpasVeillezreessayer = "Le serveur ne répond pas. Veillez réessayer !!";
          obj.Referentiels = "Référentiels";
          obj.ParcellesPhysiques = "Parcelles Physiques";
          obj.ParcellesCulturales = "Parcelles Culturales";
          obj.Listedupersonnel = "Liste du personnel";
          obj.Listedesoperations = "Référentiel opérations";
          obj.culture = "Gestion des cultures";
          obj.cultureModalTitle = "Ajouter une culture";
          obj.photo = "Photo";
          obj.famille = "Famille";
          obj.id = "ID";
          obj.ref = "Reference";
          obj.idFamilleCulture = "ID famille culture";
          obj.variete = "Gestion des variétés";
          obj.typeVariete = "Gestion de types des variétés";
          obj.operation = "Operation";
          obj.carence = "Gestion des Niveaux de carence";
          obj.coloration = "Gestion des Niveaux de coloration";
          obj.elements_mineraux = "Gestion des Eléments minéraux";
          obj.intensite_Stade = "Gestion des Intensités de stade";
          obj.Login = "Identifiant";
          obj.Password = "Mot de passe";
          obj.Connexion = "Connexion";
          obj.Madeby = "Faite par";
          obj.Yourlogin = "Votre identifiant";
          obj.Yourpassword = "Votre mot de passe";
          obj.LoginoumotdepasseincorrecteVeuillezreessayer = "Login ou mot de passe incorrecte. Veuillez réessayer !!";
          obj.refCultural = "Référentiel cultural";
          obj.refObservation = "Référentiel observations";
          obj.refColoration = "Référentiel Mensuration et rendement";
          obj.refRessource = "Référentiel ressources";
          obj.refLieuElim = " Référentiel des lieux d'élimination";
          obj.refModeApplication = "Référentiel des modes d'application";
          obj.niveauAttaque = "Gestion des unités de niveaux d’attaque";
          obj.refMesure = "Référentiel Mesures";
          obj.NiveauConformite = "Gestion des Niveaux de conformité";
          obj.repartion_attaque = "Répartition d'attaque";
          obj.validation_auto_obs = " Validation automatique des observations";
          obj.objt_observation = "Objets d’observation";
          obj.gestionStade = "Gestion des qualités stade";
          obj.refParcellaire = "Référentiel parcellaire";
          obj.gestionPays = "Gestion des Pays, régions et zônes";
          obj.trancheAge = "Gestion des tranches age";
          obj.RefeArbre = "Référencement des arbres";
          obj.RefPiege = "Référencement des pièges";
          obj.RefUser = "Utilisateurs";
          obj.ManageProfile = "Gestion des profils";
          obj.GestionEquipe = "Gestion des équipes";
          obj.Dernieres_nouveautes = "Dernières nouveautés";
          obj.new = "new";
          obj.HEADER = { TEST: "Test" };
        } else if (obj.lang === "AR") {
          obj.Deconnexion = "خروج";
          obj.Vousnetespasconnectes = "!! أنت غير متصل";
          obj.LeserveurnerepondpasVeillezreessayer = "!! لا يستجيب الخادم. حاول مرة اخرى";
          obj.Referentiels = "الإطار المرجعي";
          obj.ParcellesPhysiques = "قطعة أرض";
          obj.ParcellesCulturales = "قطعة ارض زراعية";
          obj.Listedupersonnel = "قائمة الموظفين";
          obj.Listedesoperations = "Référentiel opérations";
          obj.culture = "Gestion des cultures";
          obj.cultureModalTitle = "Ajouter une culture";
          obj.photo = "Photo";
          obj.famille = "Famille";
          obj.id = "ID";
          obj.ref = "Reference";
          obj.idFamilleCulture = "ID famille culture";
          obj.variete = "Gestion des variétés";
          obj.typeVariete = "Type de variete";
          obj.operation = "Operation";
          obj.carence = "Gestion des Niveaux de carence";
          obj.coloration = "Gestion des Niveaux de coloration";
          obj.elements_mineraux = "Éléments Éléments minéraux";
          obj.intensite_Stade = "Gestion des Intensités de stade";
          obj.Login = "رمز دخول";
          obj.Password = "كلمه السر";
          obj.Connexion = " دخول";
          obj.Yourlogin = "كلمة دخول";
          obj.Yourpassword = "كلمه السر";
          obj.LoginoumotdepasseincorrecteVeuillezreessayer = "تسجيل الدخول أو كلمة سر خاطئة. إعادة المحاولة !!"
          obj.refCultural = "Référentiel cultural";
          obj.refObservation = "Référentiel observations";
          obj.refColoration = "Référentiel Mensuration et rendement";
          obj.refRessource = "Référentiel ressources";
          obj.refLieuElim = " Référentiel des lieux d'élimination";
          obj.refModeApplication = "Référentiel des modes d'application";
          obj.niveauAttaque = "Gestion des unités de niveaux d’attaque";
          obj.refMesure = "Référentiel Mesures";
          obj.NiveauConformite = "Gestion des Niveaux de conformité";
          obj.repartion_attaque = "Répartition d'attaque";
          obj.validation_auto_obs = " Validation automatique des observations";
          obj.objt_observation = "Objets d’observation";
          obj.gestionStade = "Gestion des qualités stade";
          obj.refParcellaire = "Référentiel parcellaire";
          obj.gestionPays = "Gestion des Pays, régions et zônes";
          obj.trancheAge = "Gestion des tranches age";
          obj.RefeArbre = "Référencement des arbres";
          obj.RefPiege = "Référencement des pièges";
          obj.RefUser = "Utilisateurs";
          obj.ManageProfile = "Gestion des profils";
          obj.GestionEquipe = "Gestion des équipes";
          obj.Dernieres_nouveautes = "أخر تحديتات";
          obj.new = "أخر تحديتات";
        }

        return obj;
      }
    };
  });
