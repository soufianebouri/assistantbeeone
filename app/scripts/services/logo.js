'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.logo
 * @description
 * # logo
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('logo', function() {
    return {
      getlogobyclient: function(appFor) {
        if (appFor === 'domaine') {
          return `<?xml version="1.0" encoding="UTF-8"?>
<svg version="1.1" viewBox="0 0 1024 1024" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(0)" d="m0 0h1024v1024h-1024z" fill="#FDFEFD"/>
<path transform="translate(192,458)" d="m0 0h16l18 4 14 7 4 3v2l4 2v2h2l7 12 4 14v14l-3 13-5 10-9 10-10 7-10 4-14 3-10 1h-16l-16-1-5-2-1-1v-99l2-2 15-2z" fill="#A58E5B"/>
<path transform="translate(411,582)" d="m0 0h9l1 5-1-2-5 1 2 8 2-2v3h2l2-9 6-1h17l5 1 4 1 5 6 2 4 1-4 2-6 3-2h7l1 3 1 44 1 3v8h-5l-8-4-1-10-3-1 1-5 1-11 1-3h-2l-2 8-4 4 3 3v2l-3 2 5 8v6l2 1-4 3-4 1v-2l-6-1v-3l-6-8-5-8h-4l-1 7v8l-1 3h-2v2l-7 1v-2l-7 1-16-1v2h-12l-4-1-1-2h-5l-2-1-6 1h-7-3v-2l-4-2-2-6-3-1v-4l-3-2h-9v2l-5 5v5l-4 6-3-1-1 3h-5l-1-2v-9l1-5 2-4v-7l3-2-5-2-1-6 5-2 4 6 1-3h2l1-4-1-5 3-1v2h2l3-9 4-5 6 1 4 5v3h2l1-3h2v-2l4 1-1 7h-3l1 6-1 2 5 2-1 2 1 3 2 8 1 2v-23l2-3h2l1-7 3-1 1-6 5-1h16l8-1h3z" fill="#FDFEF3"/>
<path transform="translate(508,236)" d="m0 0h8l11 4 9 8 5 6v2l3 1 9 11 2 4h2l7 9 13 15 12 14 4 4 4 1 124 6 67 4 49 3 11 1v1h-72l-187-1-5-2-8-9v-2h-2l-8-10-7-8v-2h-2l-5-6v-2h-2l-9-11-13-15-7-8-7-4-10 1v2l-7 6-9 11-10 11-6 8h-2l-2 4-2 3h-2l-2 4-3 4h-2l-2 4-9 11-4 5h-2v2l-3 2-13 1-160 1-72 1h-40v-1l82-5 91-5 86-4 17-1 5-3 5-6h2l2-4 9-11 8-9 1-2h2l2-4 3-4h2l3-6h2l2-4 11-13 1-2h2v-2l6-5z" fill="#A58E5B"/>
<path transform="translate(155,693)" d="m0 0h50l219 2 12 1 4 2 9 11 3 3v2h2l3 4v2h2l5 6v2h2l4 5v2h2l9 11 7 8v2h2l9 11 5 5 6 2 6-1 6-4 10-11 18-22h2l2-4 9-11 5-6h2l2-4 2-3h2l2-4 7-8 2-1 197-1h64v1l-112 7-72 4-64 3-8 2-12 13-9 11-10 11-4 6h-2l-2 4-10 12h-2l-3 6h-2l-2 4-9 7-8 3h-9l-12-5-8-7v-2h-2l-9-11-3-3v-2h-2l-3-4v-2h-2l-9-11-8-9v-2h-2l-7-9-6-7v-2l-4-2-7-2-99-4-88-5-82-5z" fill="#A58E5B"/>
<path transform="translate(373,461)" d="m0 0 12 2 9 5 6 5 8 10 8 12 8 17 7 19 5-12 7-17 8-14 11-14h2l2-4 11-7 7-2h5v51l1 32v18l-7-1-5-5-3-6-3-16v-48l-5 2-5 4-7 14-12 33-7 18-2 3h-2l-1 2-6-8-10-29-9-21-6-12-8-7-2-1v57l-4 13-5 6-5 2-4-1 2-49v-24l-2-26z" fill="#A58E5B"/>
<path transform="translate(627,580)" d="m0 0 6 1 2 4h18l2 1 1-3 5 1 3 5 4-2 4-3h3v-2l-3-1h15l-1 3h3v2l5-1 7 6 2 8h-7l-6-4-5-3h-8l-2 5 1 6 8 5 15 8 5 8-1 9-3 7-5 5-21 1-6-5v2l-6 3h-6v-2h-16v2h-9l-5-4v2h-34v-56h10l1 48 22 1 1-1v-49l-2-2 1-4z" fill="#FDFEF3"/>
<path transform="translate(929,360)" d="m0 0 2 4 6 47 5 37 7 6 10 6 13 8 10 6 2 1v2l5 2 12 7 11 7 6 5 6 12v10l-4 9-2 3h-2v2l-10 7-22 13-22 14-18 11-2 3-5 37-6 45-1 7h-2l-1-74v-21l3-5 19-12 21-13 16-10 17-11 5-6v-7l-3-5-9-7-17-10-19-12-11-7-14-9-7-5-1-3 1-70z" fill="#A58E5B"/>
<path transform="translate(187,468)" d="m0 0h16l10 2 10 5 9 8 6 11 2 7v19l-4 13-7 11-9 6-10 4-6 1h-23v-85z" fill="#FDFEFD"/>
<path transform="translate(94,357)" d="m0 0h2v99l-9 7-31 19-24 15-11 7-3 3h-2l-2 6 1 7 7 7 20 12 19 12 26 16 8 6 1 1v36l-1 62h-2l-11-88-3-5-14-9-10-6-7-5-9-5-16-10-15-10v-2h-2l-4-6-2-6v-10l4-9 4-5 24-16 7-4 21-13 13-8 7-5 2-5 10-79z" fill="#A58E5B"/>
<path transform="translate(309,469)" d="m0 0h16l10 5 8 9 5 13 1 6v14l-3 16-6 12-8 7-8 3h-12l-9-3-7-6-6-10-3-10-1-13-1-5 5-19 5-10 7-6z" fill="#FDFEFD"/>
<path transform="translate(309,459)" d="m0 0h15l12 3 10 5 9 7 7 11 4 11 2 13v19l-4 10-6 9-8 8-8 5-13 4-17 1-11-2-10-4-11-8-8-11-5-15-1-13 2-17 5-12 6-8 9-8 13-6zm0 10-10 5-6 7-5 14-3 12 2 18 3 10 6 10 7 6 9 3h12l10-4 8-9 5-13 2-12v-14l-3-12-5-10-7-7-9-4z" fill="#A58E5B"/>
<path transform="translate(619,461)" d="m0 0h7l14 5 11 8 5 4v2l4 2 2 4h2l7 8 12 14 9 11 1 3h2l1-60h16v100l-4-2-9-12-10-15-13-16-5-6-14-14-13-10-4-2v40l-3 19-5 12-6 5-4 2h-4v-15l1-20z" fill="#A58E5B"/>
<path transform="translate(537,462)" d="m0 0h13l5 10 8 20 15 36 13 32v2h-10l-8-4-3-2v-2h-2l-6-13-4-8v-2l-20-1h-16l-2 6-9 23-3 3-4 1-9-1 3-9 12-28 12-29 13-32z" fill="#A58E5B"/>
<path transform="translate(457,379)" d="m0 0h8l2 1 1 8 1 28h3v-2l4 2 1 4-4 2h-3l1 5 1 3 8-4 3-4 4 3 1 3 2-1 1 2 1-45 1-2h32v4l-21 1-1 1v15l1 1 17 1 2 3-1 4-9 2 5 4h-6l-4 1-2-1-1 9h16l6 1-1-3 4-4h5l6 8 5 2 8-1 2-2v-7l-4-5-15-8-6-5-2-3v-10l4-6 8-4 8-1 13 5 2 3v5l-4 1-11-7h-7l-3 4 1 7 8 5 13 6v2h2v2h2l2 4v11l-3 5-7 4h-17l-11-4v2h-2l-1 3-9 3-2-1h-21l-5-3-8 3-25-1-3-2 1-51 2-5z" fill="#FDFEF3"/>
<path transform="translate(724,461)" d="m0 0h60v10l-41 1-1 33h36v9l-1 1h-35v37h42v10l-4 1h-55l-3-3v-96z" fill="#A58E5B"/>
<path transform="translate(820,459)" d="m0 0h9l19 6 8 8 1 7-5 4-7-1-8-9v-2l-5-2-10-2-9 3-4 5-1 3v7l2 6 4 2 16 9 21 11 7 8 3 7v12l-3 9-4 5-9 6-10 3-11 1-13-2-11-4-8-8-3-6 1-7 4-3h6l5 4 8 11 6 4 9 1 8-2 5-5 2-4v-10l-3-5-16-9-11-6-10-6-8-7-4-8v-14l3-7h2l2-4 8-5z" fill="#A58E5B"/>
<path transform="translate(429,585)" d="m0 0h17l5 1 4 1 5 6 2 4 1-4 2-6 3-2h7l1 3 1 44 1 3v8h-5l-8-4-1-10-3-1 1-5 1-11 1-3h-2l-2 8-4 4 3 3v2l-3 2 5 8v6l2 1-4 3-4 1v-2l-6-1v-3l-6-8-5-8h-4l-1 7v8l-1 2h-8l-1-2-1-37-1-10 2-7z" fill="#A58E5B"/>
<path transform="translate(557,586)" d="m0 0 11 1 10 5 6 7 3 8v17l-5 9-2 3h-2v2l-10 5-11 1-9-2-9-6-6-10-1-4v-14l4-10 5-6 10-5z" fill="#A58E5B"/>
<path transform="translate(592,461)" d="m0 0h15l3 3v98l-2 1-6-3v-2h-2l-6-10-3-12-1-8v-65z" fill="#A58E5B"/>
<path transform="translate(528,373)" d="m0 0 6 1 2 2v2l9-1 9 1 6 1v2l5 4 3 8 2 1 1 5-3 2-4-4v-2l-6-1-8-3-7-3v2h-2l2 7 4 2 3 1 2 4-6-2-6-4-2-3 1-7 3-3h7l11 7h3l-1-7-14-5-10 2-6 4-2 4v10l4 5 10 6 8 4 5 6v7l-3 3-8 1-6-3-5-7h-5l-3 4v2h-19l-3-1-1-2v-8l6 1h2l1-2 1 1-2-3 1-1 9-2-1-5-17-1-2-2v-15l2-2h21v-4h-32l-1 47h-1l-1-45-2-4 3-4 4 1 1 3h32l2 3 2-1-1-2-3-1v-3l-2-1z" fill="#FDFEFD"/>
<path transform="translate(156,690)" d="m0 0 1 2 6-2h53l64 1v1h10l13 1v-2h9l2-1 6 1 3 1 76-1 2 2h7l5-1v1h23l2 1v2h3v2h2v2h4l4 4-1 2-2-1 3 3 2-1 3 5h3v7h2l3 5 5 2 2 4 3 5 4 2 2 2v2l7 10 7 6h2v2l7 1 4 12 10-1 5-6 3-4 2 1 2-5 3-5 4-1 2-6 5-3 4-5 3-1-2 4-13 15-11 13-6 5-4 2-7-1-5-3-12-13v-2h-2l-9-11-7-8v-2h-2l-4-5v-2h-2l-5-6v-2h-2l-3-4v-2h-2l-9-11-3-3v-2l-16-2-219-2h-37l120 7v1l-12 1-37-1-4-1-14 1-12-1-2-2-25-1-14-1h-8l-1-1-13-1h-13l-3-2 3-2h21z" fill="#FDFEF3"/>
<path transform="translate(333,448)" d="m0 0 4 1 12 2 1 1v7l-3 5 1 3 9 4 2 2v7l-9-9-9-6-11-4-6-1h-15l-13 4-9 5-10 9-5 9-4 13-1 14 2 15 3 8-1 3-4-2v-4l-3 1-2-5-1 1-1 3-1 2h-2v3h-2l-2 5-4 9h-2l-1 2h-6l-2 4-7 2-1-2 13-8 7-7 6-11 3-9 1-6v-14l-4-14-6-10v-2h-2l-4-4v-2l-18-9-18-4h-16l-24 2-5 2v99l5 2 16 1h16l24-3v3l-13 2h-44l-6-2-2-4v-98l1-3 8-2 2-4 4 1 1 1h17l17-1v2l4-1 9 2 3-1 6 3 1 3 5 2 5 4 5 2 5 5v2h2l2 6 5 5 1 14h4l1-13 1-2-2-1 2-2 2-1 2-5h2l1-5h2v-2l7-5 2-3 8-2v-3l9-1 4-1h13l4-1 9 1 7 5h2l1-4-5-2v-4l-4-2z" fill="#FDFEF3"/>
<path transform="translate(553,592)" d="m0 0h12l5 3 4 6 3 11-1 9-3 9-3 4h-2v2l-10 2-8-3-5-6-2-7v-16l3-8z" fill="#FDFEFD"/>
<path transform="translate(623,456)" d="m0 0 2 2 8 1 1 4 10 1 4 4 2 3 2-3 4 1-1 6 1 3-4-2-9-7-8-4-9-3-7-1 1 17v50l-2 35 10-3-1 2h-2l-1 4-7-1-1-1-12 2-5-5-4-3v2h-2l-1 6h-10l-6-2-5-5v-2h-2l-1-3h2v2l4 2 7 3 10 1-15-36 1-3 1 4 4 1v5l1 3h2v2l3 1v11l4 1-2-12-1-3-2-1 1-31v-40l2-4h22l1 4v3h2v5l-2 1 1 46 1 9-1 2-1 14v15l3 1v-14l1-2v-24l1-10v-31l-1-7v-8l2-5zm-31 5-2 2v65l3 17 5 10 2 3h2v2l7 3 1-1v-98l-3-3z" fill="#FDFEF3"/>
<path transform="translate(344,588)" d="m0 0 6 1 4 9 15 36 2 7h-7l-5-4-4-9-5-3h-12l-4 2-5 13-3 2-5-1 1-5 11-26 8-19z" fill="#A58E5B"/>
<path transform="translate(389,587)" d="m0 0h15l7 3 4 4v5l-1 1h-5l-7-7-2-1h-8l-6 4h-2l-4 12v13l4 10 5 5 3 1h8l4-3h2l1-9v-9l2-4 7 1 1 1v29l-9-1-5 1h-14l-10-5-5-5-4-8-1-4v-13l4-10 3-4h2v-2l8-4z" fill="#A58E5B"/>
<path transform="translate(678,586)" d="m0 0h10l9 4 3 3v6l-6-1-6-5-7-1h-4l-2 5 1 6 8 5 15 8 5 8-1 9-4 6-8 4-3 1h-8l-9-3-6-5-1-7 2-2 6 1 7 8 2 1h7l4-3 1-6-1-4-4-2-17-9-6-7-1-6 3-8 7-5z" fill="#A58E5B"/>
<path transform="translate(429,585)" d="m0 0h17l5 1 4 1 5 6 2 4 1-4 2-6 3-2h7l1 3 1 44 1 3v8h-5l-8-4-1-10-3-1 1-5 1-11 1-3h-2l-2 8-4 4 3 3v2l-3 2 5 8v6l2 1-4 3-4 1v-2l-6-1v-3l2-1 8 1-5-9-5-8 5-5 4-5 1-3v-11l-4-8-6-3h-25l-1 14h-1l-1-10 2-7z" fill="#FDFEF3"/>
<path transform="translate(548,379)" d="m0 0 14 5 2 3v5l-4 1-11-7h-7l-3 4 1 7 8 5 13 6v2h2v2h2l2 4v11l-3 5-7 4h-17l-7-3-5-5v-5l2-2h5l6 8 5 2 8-1 2-2v-7l-4-5-15-8-6-5-2-3v-10l4-6 8-4z" fill="#A58E5B"/>
<path transform="translate(506,586)" d="m0 0 11 1 6 3 4 4v6h-7l-5-6-5-2-8 1-4 3h-2l-3 10-1 5 1 13 5 9 6 4 9-1 5-4 4-5 6-2 3 3-1 5-6 7-8 3-4 1h-8l-12-5-5-5-4-5-2-5v-16l4-10 5-6 6-4z" fill="#A58E5B"/>
<path transform="translate(628,588)" d="m0 0h33v5h-22l1 17 18 1v5l-1 1h-18l1 19 22 1v5h-33l-1-1z" fill="#A58E5B"/>
<path transform="translate(657,594)" d="m0 0h3l4 7 2 12 6 2v2l7 1 4 3 3 5 4 2v5l-3 2h-5l-7-5v-2l-10-2-2 1-2 7h-20l-1-1v-15h17v2l4-4-1-3-3-4-2 1-4-2h3v-3l-13-1-1 3v-8l1-1 14-1z" fill="#FDFEFD"/>
<path transform="translate(833,688)" d="m0 0 4 1-2 1 4 1-1-3h6l-4 1v2l6-1 2-2 3 2 13 1v1h6l3-1 2 1-1 3h-90l-197 1-5 4-5 6h-1v-5l2-3v-2h3l-2-2h5l4-2 37-1 78 1h29l52 1v-2h43z" fill="#FDFEF3"/>
<path transform="translate(574,316)" d="m0 0h2l9 11 4 1 187 1h72l2-2 1 1 15 1h12v2h-5v2h-5v-1h-48l-4-1v2h-16l-16 1-1 2-2 1h-11l-2-1v-3l2-1h-67l-50 1h-29l-30-1-1 2-5-3-8-1-6-12z" fill="#FDFEF3"/>
<path transform="translate(391,593)" d="m0 0h7l4 4h2l2 5 11-1 1 7-3 1v2h-7l-5-2-1 6 2 1v17l-6 2h-8l-4-2-1-4v-4l-3 1-1-2v-16l11-1-1-4-5-1-1-3h3v-2l3-3z" fill="#FDFEFD"/>
<path transform="translate(493,382)" d="m0 0h32v4l-21 1-1 1v15l1 1 17 1 1 4-1 1-19 1 1 18 1 1 21 1-1 5h-31l-1-5v-47z" fill="#A58E5B"/>
<path transform="translate(528,373)" d="m0 0 6 1 2 2v2l9-1 9 1 6 1v2l5 4 3 8 2 1 1 5-3 2-4-4v-2l-6-1-8-3-7-3v2h-2l2 7 4 2 3 1 2 4-6-2-6-4-2-3 1-7 3-3h7l11 7h3l-1-7-14-5-10 2-6 4-2 4v10l4 5 10 6 8 4 5 6v7l-3 3-2-1 2-5-4-2 2-1 2 1v-4l-6-2-1-2-11-3-4-6-4-5-3-3h-3l-2-4 7-2v-4l-20 1 1 6-2 2-1-1v6l4-1 11 1v2l3 1-1 3-1-2-17-1-2-2v-15l2-2h21v-4h-32l-1 47h-1l-1-45-2-4 3-4 4 1 1 3h32l2 3 2-1-1-2-3-1v-3l-2-1z" fill="#FDFEF3"/>
<path transform="translate(375,456)" d="m0 0 1 2 7 1 5 5-15-2 2 26v24l-2 49 6-1 5-4 4-10 1-5 1-57 5 2 7 8-1 3-2-1-2-4-6-1v5l2 1v29l-1 17-2 7 1 3h2l1 6-4 2-5-4-2 4-2 2-1 2-2-1-1 2h-2v-2l-5-1 1-3h-2v-9l2-4-1-9v-3-15l-1 8h-1l-1-19-3-16-5-13 4 1 1 5h3v4l2-3 2-1v-20l-3-3 1-4 6-1z" fill="#FDFEF3"/>
<path transform="translate(187,468)" d="m0 0h16l10 2 10 5 9 8 6 11 2 7v19l-4 13-7 11-9 6-10 4-6 1h-23v-85zm16 2-17 1-3 3v7h2l-1 61-1 1v7l4 4h6l1-1h15l5-2 4-4h5l2-9 3 4 1-6 4-2 3-13v-4h2l-1-4 1-1v-9l-2-8-2-5-5-2v-2h-2v-2l2-1-1-3-9-2-3-3-4-2-3-1-1-2z" fill="#FDFEF3"/>
<path transform="translate(833,695)" d="m0 0h15l-1 3 2 1-1 2-16-1h-10l-22 1h-13l-3 1h-13l-3 1h-12l-8 1h-21l-24 1h-16v2l-12 1-3 2-19-1h-29v2h-31l-1 4-4 3 1 2h-5l4-6 6-5 6-1 102-5 84-5z" fill="#FDFEF3"/>
<path transform="translate(592,588)" d="m0 0h10l1 48 21 1v5h-32z" fill="#A58E5B"/>
<path transform="translate(806,510)" d="m0 0 6 2 7 4 18 10 5 4 2 4v10l-5 8-5 3-11 1-7-3-6-5-8-11-2-1h-6l-4 4 1 7 4 6 7 6 12 4 12 1 13-2 8-2-1 2-3 1 6 3-1 4-4 1-4-4-4-1-3 1h-21l-7-3-1-2-7-2v-2l-3 1-3-5-1 3-2-7-3-3 1-4h2l-1-3 3-6h2l1-2 5 1 1-2 8 5 6 11 3 1 1 3 6 2v-2l9 2 5-3 2-3 2-8-1-4-1-3h-5l-3-4h-2v-2h-2v-2l-4-1h-3l-7-3-5-5-3-4z" fill="#FDFEF3"/>
<path transform="translate(456,382)" d="m0 0h9l1 1 1 47 19 1 1 4h-31z" fill="#A58E5B"/>
<path transform="translate(539,483)" d="m0 0h2l13 35v3h-29l11-30z" fill="#FDFEFD"/>
<path transform="translate(784,461)" d="m0 0 2 1v7l-1 3-2 1-30 1-9 3 1 6v10 3h-2l1 4 8 2h15l4-1h8l2 3v8l-2 4-6 3-5-2h-17l-4 2-1 5-1 1v22l7 3h30l2 2h-42v-37l35-1 1-9h-36v-33l1-1h41z" fill="#FDFEF3"/>
<path transform="translate(1023,520)" d="m0 0h1v9h-2v2h-2l1 3-8 6h-4l-2 4-6 1-1 4-6 1h-2l-1 4-5 2-2 3-6 1-3 5-6 3h-2v2l-7 1-1 2h-3l-1 2-2 3-3-1-2 2h2v2h-2l-1 6h-5l-1 12 1 13h-2l-1 10-2 10v9h-2l1 5v10l-1 8-2 7-6 1 3-1 1-13 6-47 4-29 5-5 40-25 15-9 11-7 4-2v-2h2l2-4z" fill="#FDFEF3"/>
<path transform="translate(697,459)" d="m0 0h14l3 2 1 100-1 2h-5v-3l3 2v-100h-16v61l-3-1-9-11-11-13 1-2 3 2 3-2h5v4l-4 2 2 4 2 1-1 2h2v2h4l1 2 3 1v-53z" fill="#FDFEF3"/>
<path transform="translate(466,588)" d="m0 0h8l1 1v52l-4-1-4-5-2-9v-37z" fill="#A58E5B"/>
<path transform="translate(470,485)" d="m0 0 3 1v48l3 16 4 8 6 3 4 1-1-18v-32h1l1 14 1 2v15l1 1 1 15 1 3h10l5-3 2-2v6l-5 2-6 2-6-1-6-2-7-1h-3l-3-6v-2l-3 1v-5l-2-3-1-20v-35l-6-1-3 4v5l-5 7-2 12-4 5-2 1 1-6 8-21 6-9z" fill="#FDFEF3"/>
<path transform="translate(929,357)" d="m0 0h2l2 6h2l-1 20h2l2 12v15l2 4 1-7 2 2-2 19v5h2l1 7 1 3h-2l3 7 3 1v2l6 1v2h8l5 1 1 6h2l2 4 5 3 8 3 6 3 1 5 2 1-4-1-7-4v-2l-5-2-11-6-10-7-13-8-4-4-7-53-4-31-1 20h-1v-26z" fill="#FDFEF3"/>
<path transform="translate(435,592)" d="m0 0h8l5 3 3 7v7l-3 7-6 3h-7l-2-2v-21z" fill="#FDFEF3"/>
<path transform="translate(91,355)" d="m0 0 5 1-2 1-11 88-3 6-9 6-21 13-11 7-4 3h-3l1-4 1 1 4-4 5-2 4-2 7-6h2v-5h2v-2h11l1-2 5-1 1-2 4-4v-7l1-5 1-4v-10l2-5v-16h2l1-16 1-1v-16l3-9h2v-2z" fill="#FDFEF3"/>
<path transform="translate(514,577)" d="m0 0h4l1 5 4-1 3 4-1 2-3-1 4 2v2h2v11l-5 2-5-3-4-3-5 1-2-5-4 2-1 2h-2v2l-4 2-2 6v19l-2-2-1-13 3-12 5-5 7-3 7 1 7 6v2h7l-1-8-4-2-5-2-11-1-10 2-7 5-5 8-2 6h-1l1-11 1-3 3-3h2l1-4 1-2 15-1 7-1 2-1z" fill="#FDFEF3"/>
<path transform="translate(539,592)" d="m0 0 2 1-6 9-2 6v14l4 10 4 5 10 5 12 1 12-3-3 3-8 4-13-1-6-2-3-3-3-1-5-5h-4l-1 5h-3l-2-1 6-8-1-4-3-1-6 4-4 5-7 3-7-1-6-5-2-6 1-2h3l-1 3 4 5 9 1v-3l4 1 1-3h2l3-3 3-1h8v-23z" fill="#FDFEF3"/>
<path transform="translate(703,320)" d="m0 0h38v2l15-1 19 1h9l1 1h5l2-1 13 1h9l4 1 4-1h10l14 1 2 2v3h-11l-81-5-53-3z" fill="#FDFEF3"/>
<path transform="translate(440,720)" d="m0 0 5 4 3 4v2h2l9 11 8 9v2h2l3 4v2h2l9 11 3 3v2h2l5 6 12 6 3 1h9l10-3-1 3 2-1-1 4 2 1-2 3-6-1v-3l-10 1-7-1v-2l-5-2-8-5v2h-5l-1-4-4-1v-2h2l-1-4-4-4-3-1-3-5-2-4h-2l-1-4-4-3-1-4h-4v-2h-2l-3-4h2l-2-4-8-7h-2l-3-8z" fill="#FDFEF3"/>
<path transform="translate(723,458)" d="m0 0h60l1 3-60 1-1 2v96l2 2h59v2l-47 1-2 2-6-1-6-2v-2l-3-1v-99z" fill="#FDFEF3"/>
<path transform="translate(148,329)" d="m0 0h4v2l40-1h70v1l-6 1v4h-15l2-2h-80l-4-1h-9l-3 1-7-2 1-2z" fill="#FDFEF3"/>
<path transform="translate(3,528)" d="m0 0 3 2v2h2v2l4 2 13 8 19 12 11 7 10 6 15 10 3 5 2 16v8l-3-4v-7l-2-4 1-5-1-5-4-1-4-2-1-3-6-3-1-4-7-1-7-4-3-3-1-2-6-1-3-3-4-2-1-4h-6l-3-3v-2l-9-2-4-2-5-5-3-2z" fill="#FDFEF3"/>
<path transform="translate(509,249)" d="m0 0 7 1 6 4 11 12 9 11 8 9-1 2-3-1-4-4-4-2-2-5v-4l-4-1-4-6-4-2-1-4-2-1 1-2h-3l-2-3-4-1-3 1h-3l-3 8h-2l1 3-8 2-4 5-4 3v2h-3l-4 8 1 4-2 3-4-3h-2l2-4 12-14 13-15 4-2v-2z" fill="#FDFEF3"/>
<path transform="translate(640,485)" d="m0 0 5 2 9 7 10 9 5 5v2l4 2 10 12 2 4-5-2-2-4-4-2-2-4-1-4-10-1-1-3-4-2-1-8-2-1v-2l-6-2h-5l1 4v14l-1 3h2l-1 3-1 8-1 9-1 10h-3l1-10 1-9z" fill="#FDFEF3"/>
<path transform="translate(561,584)" d="m0 0 7 1h6l3 3-1 2 7 2 2 1 2 7 1 3 4-1v40l-2-2 1-12-8 7-4 5-3 1v-3h2v-2h2l6-12v-17l-4-9-4-5-10-5-11-1-9 2-5 3-2-1 3-4 8-2z" fill="#FDFEF3"/>
<path transform="translate(288,320)" d="m0 0h16v2l-139 8h-11l4-2 11-1 15-1h8v-2l23-1h24l31-2h11z" fill="#FDFEF3"/>
<path transform="translate(328,704)" d="m0 0h19l77 3 7 2 9 9-1 2-8-8-31-3h-24l-4-1h-21l15 3 3 1-2 4h-11l-2-2 6-1-7-1v-1l-9-2-1-2-15-2z" fill="#FDFEF3"/>
<path transform="translate(447,317)" d="m0 0 2 4h-2l-1 5-3-1-3 4-5 1-73 1h-59l-11 1-30-1 2-2 160-1 13-1 3-1v-2h2l2-4z" fill="#FDFEF3"/>
<path transform="translate(544,458)" d="m0 0h6l4 3 1 8 4 5 2 9 4 3 3-3-1 11 2 6 4 6 1 7 2 4 1 4-2 2-20-48-4-10-1-3-13 1-5 11-3 7h-1v-9l4-2-1-6 5-5z" fill="#FDFEF3"/>
<path transform="translate(849,327)" d="m0 0 2 1 15 1h12v2h-5v2h-5v-1h-48l-4-1v2h-16l-16 1-1 2-2 1h-11l-2-1v-3l2-1h14v-2l64-1z" fill="#FDFEF3"/>
<path transform="translate(539,483)" d="m0 0h2l13 35v3h-29l11-30zm-1 8-4 10-1 9-5 5 1 3 5 1h13l2-3-1-6-1-5-4 1 1-8-2-7z" fill="#FDFEF3"/>
<path transform="translate(447,493)" d="m0 0 1 2-7 14-9 23-2-1-9-24-5-9v-2h5l1 4 3 6 2 7 5 1h2l2-4 2-5 5-6z" fill="#FDFEF3"/>
<path transform="translate(584,304)" d="m0 0h3v2h2l2 2 2 4 2 1h13v2h64l1 1h5l3-2 4 1v2l5 1 13 1v1h-23l-83-4-5-2-8-8z" fill="#FDFEF3"/>
<path transform="translate(536,242)" d="m0 0h2l1 3 2 1-1 4 3 3 1 3h3l1 4 3 1 1 4 5 2 3 4 2 6 5 2 3 2 3 4-1 2 2 2 2 1v3l5 2 3 7-1 2-11-12-9-11-6-7v-2h-2l-9-11-10-11-5-7z" fill="#FDFEF3"/>
<path transform="translate(494,239)" d="m0 0 2 2-4 4h-2v2h-2l-2 4-11 13-1 2h-2l-3 6h-2l-2 4-3 4h-2l-2 4-9 10-7 9-2 1 2-8 5-3 4-5h2l1-6h2l2-5 6-2 1-4 2-3v-2h3v-3l6-5 1-2h3l2-4 2-3-3-2 4-1 2-5z" fill="#FDFEF3"/>
<path transform="translate(927,457)" d="m0 0 5 2 14 9 23 15 20 12-4 2-5-4-13-3-4 1-1-4h3v-2l-2-1v-3l-4-1v-2l-5-2-11-5h-5l-3-6-5-4-3-2z" fill="#FDFEF3"/>
<path transform="translate(822,467)" d="m0 0 10 2 5 3 7 9 3 2 7-1 2-2v-7l2 1 3 6-4 6-8 1-7-2-4-7v-2l-5-2-2-3h-15l-4 4-1 13 2 1v2h3l1 5-7-4-3-6v-7l3-6 5-4z" fill="#FDFEF3"/>
<path transform="translate(438,304)" d="m0 0h2v2h-2l-2 4-5 5-3 1-79 4h-21v-1h8l1-2v2l5-2 4 2 1-2 15-1 9-1h45v-2h13l3-2 2-5z" fill="#FDFEF3"/>
<path transform="translate(605,581)" d="m0 0 3 1v6l-4 1 1 34 3 1v2l3 1-1 3-5-2-1 6h4v2h16v1h-21l-1-1v-48h-10l1-2 8-3z" fill="#FDFEF3"/>
<path transform="translate(583,720)" d="m0 0 1 2-3 7-5 2-1 3-4 3-3 7-4 3h-2l-2 7-8 7-5 7h-3v2l-12 12-5 2 5-5 4-5h2l2-4 7-8 8-10h2l2-4 9-11 10-11z" fill="#FDFEF3"/>
<path transform="translate(525,529)" d="m0 0h19l12 1 4 4v2l-6 1v-2l-12-3h-14l-3 1v2h-2l-3 9h-2l1 7-2 4-5 1 3-10 5-13 2-3z" fill="#FDFEF3"/>
<path transform="translate(85,608)" d="m0 0h1l7 56v8h2v-62h1l1 31v15l-1 18-4-1-3-3 1-14h-2l-3-38z" fill="#FDFEF3"/>
<path transform="translate(439,593)" d="m0 0 5 1 4 6 1 9-3 6h-3-4l-1-6 3-2-1-3-2-1-2 4v-2h-2l1-5 1-3h2z" fill="#FDFEFD"/>
<path transform="translate(552,404)" d="m0 0 11 1 5 6 1 5 2 1-1 6-3 9-2 3-2 4-3 1v-2l-12 1h-9v-2l-5-1-3-4 9 3h17l5-3h2l2-5v-11l-1-4h-2v-2h-2v-2l-5-1z" fill="#FDFEF3"/>
<path transform="translate(553,592)" d="m0 0h12l5 3 4 6 2 7-1 6-5-2-1-2 3-1 2 1v-2l-3-1-1-7-5-5-12 2-2 3h-2v2h-2l-1 5-1 4-1 11h-1v-16l3-8z" fill="#FDFEF3"/>
<path transform="translate(753,568)" d="m0 0h15l15 2-1 3-14 1-30-1-2-3 1-1z" fill="#FDFEF3"/>
<path transform="translate(992,498)" d="m0 0 5 2 8 6 3 3 1 3v7l-7 8-18 11-6 4h-2l1-4 14-7 3-3 3-1 5-6 4-1 1-3-2-7h-2v-2l-4-2h-2l-2 2-3-3 1-5z" fill="#FDFEF3"/>
<path transform="translate(344,600)" d="m0 0 3 4 5 13v3h-16l3-9 4-10z" fill="#FDFEF3"/>
<path transform="translate(291,528)" d="m0 0 2 3 4 9v3l5 2v2h7l5 5 8-1 5-4 3-1 4 1 2 1-8 5-4 1h-12l-9-3-7-6-6-10-1-6z" fill="#FDFEF3"/>
<path transform="translate(309,469)" d="m0 0h16l10 5 8 9 4 10-1 3h-3l-4-5-4-10-7-2v-3h2l-6-5h-10l-1 2h-2v-2l-4-1z" fill="#FDFEF3"/>
<path transform="translate(480,458)" d="m0 0 9 1 3 3 1 3-1 15-1 1-1 15h-1v-35l-12 3-11 7-8 9-2-4h2v-3l5-3 1-2 10-5 5-3z" fill="#FDFEF3"/>
<path transform="translate(681,591)" d="m0 0 7 1 6 5 6 2-4 2-7-1-2-5-5-2-4 1v6h4l2 6 5 2 4 3 7 3 4 7-1 3-4-6v-2l-5-2-17-9-3-4 1-6 2-3z" fill="#FDFEF3"/>
<path transform="translate(402,496)" d="m0 0 3 3 9 21 2 5-1 3-1-3-6 2-3-4 1-4-4-1-1-4 5-3-1-5-1-4-2-1z" fill="#FDFEF3"/>
<path transform="translate(816,457)" d="m0 0h18l9 3 2 2 7 2 3 5-1 3-6-6-19-6h-9l-16 5-4 1v-3l5-2 1-2z" fill="#FDFEF3"/>
<path transform="translate(574,621)" d="m0 0h1l-1 7-4 6h-2v2l-10 2-8-3-5-6-1-5 5 2 3 6 8 2v-7h4v6l2 1v-2l3-3 2-5h3z" fill="#FDFEF3"/>
<path transform="translate(24,528)" d="m0 0 5 1 5 2 6 2 5 5 3 1v3l9 3 8 6 6 2v2h2l3 5-5-2-20-12-19-12-8-5z" fill="#FDFEF3"/>
<path transform="translate(497,230)" d="m0 0 6 1 2 2 16 1v-3l6-1 2 4-2 2h-3v2l3 1-2 1-9-3h-8l-9 3-3-1 3-2-4-4z" fill="#FDFEF3"/>
<path transform="translate(927,573)" d="m0 0 1 3v90h-1l-1-45-1-4 1-1-1-7-1-32h2z" fill="#FDFEF3"/>
<path transform="translate(818,495)" d="m0 0 6 1v2l6 2 2 1v2h6l6 4 3 3 6 2 1 2v-2h8v3h-2v2l-3 1-1 2-8-7-26-13-5-4z" fill="#FDFEF3"/>
<path transform="translate(967,544)" d="m0 0h6l-5 4-38 24-2 1v-3l15-9 1-2 4-2-2-5 1-2 4 2h3l5-2 2-4z" fill="#FDFEF3"/>
<path transform="translate(514,512)" d="m0 0 1 3-15 36-4 9-1-3 1-6h2l3-15h2l1-3h2l-1-6 2-7 4-2 2-5z" fill="#FDFEF3"/>
<path transform="translate(293,560)" d="m0 0 5 1 6 2 16 1 13-2 9-2-2 5-3-1-1 2-13 1h-19l-4-1-5-1z" fill="#FDFEF3"/>
<path transform="translate(574,706)" d="m0 0h2v2h-2l-2 4-2 3h-2l-2 4-10 11-4 6h-2l2-5-2-1 3-1v-3l5-3 3-4h2l2-6 3-4h4v-2z" fill="#FDFEF3"/>
<path transform="translate(264,516)" d="m0 0 2 3v6h2l4 12-1 3-4-2v-4l-3 1-2-5-1-2v-10z" fill="#FDFEFC"/>
<path transform="translate(347,496)" d="m0 0h1l1 6v14l-3 16-6 12-4 3 2-4 1-7 3-2 1-3h2l-1-10 1-9 2-9z" fill="#FDFEF3"/>
<path transform="translate(302,472)" d="m0 0h2v2l-5 2-1 4-2 5 1 9-4 2h-3l-1 3-1-4 5-14 7-8z" fill="#FDFEF3"/>
<path transform="translate(421,595)" d="m0 0h1l1 8v13l-1 8-2 1-1-2v-7h-2l-4-5h2v-2h3l1-8h1z" fill="#FDFEF7"/>
<path transform="translate(550,288)" d="m0 0h2l5 6v2h2l7 9 8 9-1 2-5-2-3-3-2-7-5-1v-2l-7-5z" fill="#FDFEF3"/>
<path transform="translate(470,289)" d="m0 0 2 1-2 7-5 3h-2v4h-2l1 6h-3l-7 6-4 1 2-4 7-9h2l2-4 3-4h2l2-4z" fill="#FDFEF3"/>
<path transform="translate(77,559)" d="m0 0 11 5 4 3 4 2 2 5v14l-1 20h-1l-1-34-8-6-11-7z" fill="#FDFEF3"/>
<path transform="translate(434,624)" d="m0 0 5 1 7 11 3 4-5-2-5-4v-2h-4l-1 4h2v3h-2v3h-2v-11z" fill="#FDFEF3"/>
<path transform="translate(791,476)" d="m0 0 1 3v14l4 8 8 7-2 2v-2l-6-2-2-1-2 2-1-4h2l-2-6-3-1v-16z" fill="#FDFEF3"/>
<path transform="translate(32,496)" d="m0 0h2v2l-7 4-5 6-1 1 1 4-1 1h-5v7l-2-1-1-7 3-6 12-9z" fill="#FDFEF3"/>
<path transform="translate(416,528)" d="m0 0 2 2 9 26 5 7-4-2-4-5-4-6-2-8-2-4-1-9z" fill="#FDFEF3"/>
<path transform="translate(95,456)" d="m0 0v3l-4 2 1 3-7 2-5 5-4 2-3 1h-2v2l-5 2-1 2h-5l4-4 20-12z" fill="#FDFEF3"/>
<path transform="translate(447,526)" d="m0 0h1v10l-3 2-2 10-1 3-4 4-1 5-5 2v-2h2l2-6z" fill="#FDFEF3"/>
<path transform="translate(367,528)" d="m0 0h1v8l-4 5-3 5-1 4h-2l-2 4-4 1-1 2-3 1-1 2h-5l5-4 10-9 6-9z" fill="#FDFEF3"/>
<path transform="translate(927,392)" d="m0 0h1v48l-1 13h-1l-1-6v-17h1z" fill="#FDFEF3"/>
<path transform="translate(849,327)" d="m0 0 2 1 15 1h12v2h-5v2h-5v-1h-28v-2l8-1z" fill="#FDFEF3"/>
<path transform="translate(857,520)" d="m0 0h3l1 6h2l1 6v13l-4 4-1 3h-2l3-11v-12z" fill="#FDFEF3"/>
<path transform="translate(272,540)" d="m0 0 4 4 5 7 12 8v1h-6l-2-1v-2h-3v-2h-2l-4-4-1-3h-2l-1-2z" fill="#FDFEF3"/>
<path transform="translate(188,477)" d="m0 0 2 6v62h-1l-1-61-3-5z" fill="#FDFEF3"/>
<path transform="translate(665,652)" d="m0 0h28v4h-5l-2-2h-13l-4 1v2l-7-1 1-3z" fill="#FDFEF3"/>
<path transform="translate(30,479)" d="m0 0 2 2-15 10-7 5-2-1 5-5h2l2-5 5-2 4-3z" fill="#FDFEF3"/>
<path transform="translate(540,447)" d="m0 0 11 1 2 3-5 2h-9l-3-2 1-3z" fill="#FDFEF3"/>
<path transform="translate(480,608)" d="m0 0h1l1 16 6 12 4 2 12 5v1h-6l-9-5-5-6-2-1-2-7z" fill="#FDFEF3"/>
<path transform="translate(477,645)" d="m0 0 1 3-1 5-11 2 1-7z" fill="#FDFEF3"/>
<path transform="translate(529,419)" d="m0 0 9 2 4 4 2 1v-3l4-1v4l-4 1v2l7 2v1l-8-1-5-5-3-4h-5l-2 1z" fill="#FDFEF3"/>
<path transform="translate(135,695)" d="m0 0h7l1 4-2 2h-10l-1-4z" fill="#FDFEF3"/>
<path transform="translate(341,585)" d="m0 0h7l3 2 1 5-2-1v-2h-6l-3 4-4 9h-1v-5l4-9z" fill="#FDFEF3"/>
<path transform="translate(388,464)" d="m0 0h6l6 5v3h3v2h2l1 6-6-5-5-5-7-5z" fill="#FDFEF3"/>
<path transform="translate(627,307)" d="m0 0h11l2 3-3 2h-9l-3-1v-3z" fill="#FDFEF3"/>
<path transform="translate(387,307)" d="m0 0h11v4l-3 1h-7l-3-1v-3z" fill="#FDFEF3"/>
<path transform="translate(627,712)" d="m0 0 12 1v3l-1 1h-11l-2-1v-3z" fill="#FDFEF3"/>
<path transform="translate(685,528)" d="m0 0 5 5 7 10-1 2-5-2-1-3-2-4v-3l-5-1 1-3z" fill="#FDFEF3"/>
<path transform="translate(267,525)" d="m0 0 2 4 3 8-1 3-4-2v-4l-3 1-2-5 5-2z" fill="#FDFEF3"/>
<path transform="translate(354,332)" d="m0 0h6v2l-12 1v1h-17l-3-2z" fill="#FDFEF3"/>
<path transform="translate(1008,490)" d="m0 0h6l5 6 2 6h2l1-2v10l-2-3-6-10-8-6z" fill="#FDFEF3"/>
<path transform="translate(1022,487)" d="m0 0h2v13l-1 2h-2l-2-3 1-9z" fill="#FDFEF8"/>
<path transform="translate(754,521)" d="m0 0h12l1 3-2 1h-12l-1-3z" fill="#FDFEF3"/>
<path transform="translate(504,602)" d="m0 0 5 2 1 2-5 2h-9l-1-4h5z" fill="#FDFEF3"/>
<path transform="translate(626,447)" d="m0 0 7 1v3l-8 3-4-2v-2z" fill="#FDFEF3"/>
<path transform="translate(448,480)" d="m0 0 5 2 4-2-4 7-4 6h-1z" fill="#FDFEF3"/>
<path transform="translate(522,640)" d="m0 0 2 1-3 5h-9l-7-1v-1l15-3z" fill="#FDFEF3"/>
<path transform="translate(177,569)" d="m0 0 3 1v2h22l4 2h-28z" fill="#FDFEF3"/>
<path transform="translate(560,536)" d="m0 0 2 2 5 12 1 4-3-1-5-6z" fill="#FDFEF3"/>
<path transform="translate(287,500)" d="m0 0 2 4v17l-2 4-1-13-1-5z" fill="#FDFEF3"/>
<path transform="translate(504,649)" d="m0 0h6v4h-11l-2-1v-2z" fill="#FDFEF3"/>
<path transform="translate(341,610)" d="m0 0 4 1 2 2 1 3h-2l-1 3-4-2-1-5z" fill="#FDFEFD"/>
<path transform="translate(656,478)" d="m0 0 5 2 7 9 5 5h-3l-6-6v-2h-2l-4-5-2-1z" fill="#FDFEF3"/>
<path transform="translate(840,491)" d="m0 0 10 1-1 4h-9l-1-3z" fill="#FDFEF3"/>
<path transform="translate(571,644)" d="m0 0h5l1 3-1 3-4 1-4-4z" fill="#FDFEF3"/>
<path transform="translate(520,479)" d="m0 0 3 1 1 5-3 3-4-3 1-5z" fill="#FDFEF3"/>
<path transform="translate(913,577)" d="m0 0 2 2v13l-3-1v-13z" fill="#FDFEF3"/>
<path transform="translate(338,569)" d="m0 0 5 1 2 4-5 1-1 3-3-1 2-7z" fill="#FDFEF3"/>
<path transform="translate(697,545)" d="m0 0 4 4 7 11-3-1-5-5-1-2h-2l-1-5z" fill="#FDFEF3"/>
<path transform="translate(780,516)" d="m0 0h4v6l-4 1-4-2 2-4z" fill="#FDFEF3"/>
<path transform="translate(411,468)" d="m0 0h3l2 3v7l-4-1-2-8z" fill="#FDFEF3"/>
<path transform="translate(843,453)" d="m0 0 5 1 1 4-1 2-5-1-3-2v-2z" fill="#FDFEF3"/>
<path transform="translate(530,435)" d="m0 0 5 3-1 4-6 1v-6z" fill="#FDFEF3"/>
<path transform="translate(498,788)" d="m0 0h4l1 5-5 2-2-1v-5z" fill="#FDFEF3"/>
<path transform="translate(801,563)" d="m0 0 4 2 3 3-4 3-4-1-1-4 2-2z" fill="#FDFEF3"/>
<path transform="translate(520,496)" d="m0 0h2l-3 10-3 6-1-3v-5l3-5z" fill="#FDFEF3"/>
<path transform="translate(998,481)" d="m0 0h2l2 3 5 2 1 4-6-2-7-5z" fill="#FDFEF3"/>
<path transform="translate(636,544)" d="m0 0h1v8h-2l-2 7-5 1 6-10z" fill="#FDFEF3"/>
<path transform="translate(802,453)" d="m0 0 6 2-1 3-7 2-1-3 1-3z" fill="#FDFEF3"/>
<path transform="translate(618,448)" d="m0 0h2l-2 4-8 1-3 1 2-4 1-1z" fill="#FDFEF3"/>
<path transform="translate(148,329)" d="m0 0h4v3l-2 2-9-1v-3z" fill="#E9E5D2"/>
<path transform="translate(455,520)" d="m0 0h2l2 5-1 3-4 1-2-5z" fill="#FDFEF3"/>
<path transform="translate(580,466)" d="m0 0h2v13h-2l-1-2v-10z" fill="#FDFEF3"/>
<path transform="translate(7,496)" d="m0 0v3l-4 5-2 6h-1v-10z" fill="#FDFEF3"/>
<path transform="translate(406,480)" d="m0 0h5l1 7 1 3h2l2 5-3-1-8-12z" fill="#FDFEF3"/>
<path transform="translate(1008,480)" d="m0 0h9l-2 4h-6z" fill="#FDFEF3"/>
<path transform="translate(867,329)" d="m0 0h11v2h-5v2h-5l-2-3z" fill="#ECE9D6"/>
<path transform="translate(47,487)" d="m0 0v3l-2 2-5 2-4 3-2-2z" fill="#FDFEF3"/>
<path transform="translate(483,573)" d="m0 0h12l-1 2-10 1-2-2z" fill="#FDFEF3"/>
<path transform="translate(527,481)" d="m0 0 1 3-5 12-1-4 1-5z" fill="#FDFEF3"/>
<path transform="translate(471,449)" d="m0 0h6v7l-5-3z" fill="#FDFEF3"/>
<path transform="translate(225,513)" d="m0 0h3l1 5-3 3-2-1z" fill="#FDFEF3"/>
<path transform="translate(307,473)" d="m0 0h4l1 5-7-1-1 3-1-4z" fill="#FDFEF3"/>
<path transform="translate(529,405)" d="m0 0 3 1-1 4-4 1-2-2v-3z" fill="#FDFEF3"/>
<path transform="translate(499,528)" d="m0 0 2 4-2 4-3-1v-5z" fill="#FDFEF3"/>
<path transform="translate(58,480)" d="m0 0 2 1-3 1v3h-3l-1 2h-5l3-3z" fill="#FDFEF3"/>
<path transform="translate(101,576)" d="m0 0 3 1 1 2v10l-2-1-1-9z" fill="#FDFEF3"/>
<path transform="translate(226,568)" d="m0 0h4v2h2v4l-5-1z" fill="#FDFEF3"/>
<path transform="translate(856,555)" d="m0 0 6 1-2 4-5-1v-3z" fill="#FDFEF3"/>
<path transform="translate(536,242)" d="m0 0h2l1 3 2 1v3l-4-1-3-3v-2z" fill="#FDFEF6"/>
</svg>`;
        } else if (appFor === 'demo') {
          return `<?xml version="1.0" encoding="UTF-8"?>
<svg version="1.1" viewBox="0 0 2048 573" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(260)" d="m0 0h17l20 4 12 5 26 14 24 13 23 13 18 10 26 14 23 13 28 15 24 14 11 8 10 10 7 11 7 15 3 12v95l-5 4-19 10-21 12-6-1-9-5-4-1-16-1-6-9-17-29-3-6 2-3h2l2-4 6-10 3-7 1-5v-17l-4-12-5-9-7-8-11-7-10-4-14-2-17 2-14 7-12 11-5 8-4 11-1 6v10l1 11-13 8-24 13-45 25-56 31-24 13-23 13-24 13-21 12-26 14h-6l-6-3-9-1-5-4-19-32-17-28-16-27-10-15-2-4v-73l5-18 10-18 11-12 10-9 26-14 24-14 28-15 24-13 17-10 30-16 21-12 28-15 11-4z" fill="#004E2B"/>
<path transform="translate(355,238)" d="m0 0h5l8 6 12 6 9 2h16l8-1 7 10 13 22 7 12-6 10-2 6v14l3 10 9 10 6 4 10 3h14l11-4 9-7 5-7 3-10 1-12 5-5 20-10 9-5h2v109l-5 16-7 14-7 9-8 8-17 11-23 13-56 31-29 16-23 13-26 14-23 13-16 7-16 4h-25l-14-3-13-5-28-15-47-26-23-13-22-12-23-13-25-14-24-14-13-9-10-10-7-11-5-12-3-13-1-8v-101l5 4 17 29 17 28 6 10 1 7-3 7v13l5 10 7 6 10 4h10l10-4 6-4 5-8 3-12 5-5 44-24 25-14 24-13 23-13 26-14 23-13 21-11 24-14 34-18z" fill="#004E2B"/>
<path transform="translate(1339,202)" d="m0 0h74l28 2 19 5 16 8 9 6 10 9 9 11 9 16 5 14 2 10 1 18-2 16-5 16-8 15-7 9-5 6-8 7-11 8-19 9-15 4-15 2h-89l-1-2v-185zm27 24-1 3v137l1 3h19l37-1 14-2 15-5 12-7 10-9 7-9 7-14 4-17v-18l-4-16-7-14-9-11-11-8-12-6-16-4-7-1-17-1z" fill="#004E2B"/>
<path transform="translate(957,199)" d="m0 0h24l19 3 21 6 13 5 5 5v25l-6-2-19-8-21-6-14-2h-19l-16 3-12 5-10 6-8 7h-2l-2 4-6 7-6 11-4 10-3 16 1 16 4 15 8 15 11 12 10 7 14 7 15 4 8 1h13l18-3 18-4 2-1 1-5v-34h-32l-6-1v-24h66l1 1v78l-4 4-16 6-21 5-22 3h-21l-21-3-17-5-16-8-12-9-13-13-9-14-6-13-4-15-1-7v-18l4-20 5-14 6-11 9-12 11-11 15-10 15-7 18-5z" fill="#004E2B"/>
<path transform="translate(1089,202)" d="m0 0h42l23 1 14 3 12 6 9 7 7 9 4 8 3 16-1 16-5 13-7 9-8 7-8 4-3 2 10 9 9 9 13 18 12 18 24 34v2h-33l-6-7-24-36-11-14-11-13-8-7-10-4-6-1h-15v80l-1 2h-28v-188zm27 23-1 4v57h12l21-2 10-3 8-6 5-9 1-4v-14l-4-9-6-7-8-4-15-3z" fill="#004E2B"/>
<path transform="translate(750,200)" d="m0 0 10 1 6 5 8 16 19 41 17 36 19 41 19 40 5 13h-29l-6-10-19-40-3-5h-85l-2 6-17 38-5 10-1 1h-29l5-13 43-96 32-72 4-8 5-3zm3 44-7 14-21 49-1 5h60l-1-5-16-34-11-24-2-5z" fill="#004E2B"/>
<path transform="translate(1615,200)" d="m0 0h7l7 3 5 6 15 32 11 24 14 30 13 28 17 36 15 33v1h-28l-6-9-16-34-6-12-3-1h-78l-5 3-21 48-4 5h-29l10-23 15-33 32-72 19-43 7-16 5-5zm3 44-23 54-5 11v3h61l-5-12-26-56z" fill="#004E2B"/>
<path transform="translate(1945,200)" d="m0 0 10 1 5 3 6 10 18 40 17 36 15 33 19 40 11 24 2 6h-28l-6-8-13-28-8-17v-2l-5-1h-77l-5 3-16 36-6 14-3 3h-28l3-9 17-37 10-23 13-29 40-90 5-4zm2 44-18 42-10 23v3h60l-1-5-15-33-14-30z" fill="#004E2B"/>
<path transform="translate(1700,201)" d="m0 0h163l2 1 1 6v16l-3 2-66 1-1 164-2 2h-26l-1-1-1-166h-65l-3-3v-19z" fill="#004E2B"/>
<path transform="translate(1482,100)" d="m0 0h2l-2 5-9 17-10 14-12 12-13 9-15 8-18 6-16 3h-30l-24-1-16 1-19 4-19 7-8 4h-2l2-6 9-14 9-10 11-11 8-7 12-11 11-8 9-4 9-2 11-1 79-1 17-3 14-5z" fill="#004E2B"/>
<path transform="translate(1263,202)" d="m0 0h27l2 3v186l-1 2h-27l-2-4v-185z" fill="#004E2B"/>
<path transform="translate(1453,414)" d="m0 0h12l12 3 9 5 7 6 6 10 3 11v9l-3 11-6 9-7 6-12 6-11 2h-12l-11-3-8-4-8-7-5-9-3-8v-14l3-10 7-11 10-7 11-4zm-2 11-10 4-8 7-4 9-1 4v9l4 11 5 6 8 5 7 2h14l10-4 8-7 4-6 2-7v-9l-4-11-8-8-12-5z" fill="#004E2B"/>
<path transform="translate(1885,416)" d="m0 0h7l5 3 12 13 18 20 11 12 7 8 1-56h10l1 2v70l-4 4-7-3-8-7-14-15-7-8-14-15-7-8-2-1v56h-10v-74z" fill="#004E2B"/>
<path transform="translate(1583,415)" d="m0 0 6 2v72l-3 3-6-1-10-9-7-8-13-14-7-8-9-10-7-6-1 54-1 1h-6l-3-2v-71l2-2h6l7 5 7 8 7 7 7 8 11 12 7 8 7 7 1-54z" fill="#004E2B"/>
<path transform="translate(2008,414)" d="m0 0 15 1 16 4 3 2v11l-13-5-10-2h-10l-10 3-9 7-6 12v13l5 10 5 5 6 4 7 2h15l8-2 2-4-1-10-2-1-11-1-1-1v-5l3-3h22l2 3v26l-4 4-13 4-8 1h-9l-14-3-10-5-8-8-5-10-2-10 1-13 6-12 6-7 11-7 6-2z" fill="#004E2B"/>
<path transform="translate(1658,416)" d="m0 0h10l1 1 1 49 3 8 5 5 8 3h9l10-3 6-5 2-6 1-51 1-1h10l1 2v44l-2 13-6 9-10 6-10 2h-14l-9-2-10-6-6-10-2-11v-38z" fill="#004E2B"/>
<path transform="translate(1370,414)" d="m0 0h15l16 4 4 3v11l-18-6-11-1-10 2-8 4-5 4-4 8-2 7v8l4 10 7 8 9 4 5 1h8l21-5 5 1v7l-5 4-10 3-7 1h-13l-12-3-10-5-7-7-6-12-2-11 1-11 6-12 9-9 12-6z" fill="#004E2B"/>
<path transform="translate(1621,414)" d="m0 0 13 1 8 3 2 3v7l-4 1-16-4-7 1-3 4 1 7 5 5 14 9 8 7 4 6 1 3v8l-3 7-5 6-6 3-4 1h-12l-10-3-4-5v-11l13 6 7 2 7-1 4-4v-7l-4-6-20-13-7-8-1-3v-9l4-8 7-6z" fill="#004E2B"/>
<path transform="translate(1783,415)" d="m0 0h58l3 2-1 8-26 1-1 64-1 1h-10l-1-66h-26l-1-7 1-2z" fill="#004E2B"/>
<path transform="translate(1743,415)" d="m0 0 10 2v64h34l1 1v8l-1 1h-44l-2-4v-70z" fill="#004E2B"/>
<path transform="translate(1855,416)" d="m0 0h10l1 1v73l-1 1h-9l-2-7v-67z" fill="#004E2B"/>
</svg>`
        } else {
          return false
        }
      }
    };
  });