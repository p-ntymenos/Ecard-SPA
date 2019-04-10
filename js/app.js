
// create the module and name it scotchApp
var bombApp = angular.module('bombApp', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ngTagsInput', 'ngFileUpload']);

bombApp.filter('translate', function () {
    return function (input, scope) {
        trans = scope.trans[scope.lang][input];
        if (!trans) trans = input;
        return trans;//trans.el[input];
    };
});


//directives
/*
bombApp.directive('onload',  ['$rootScope', function($rootScope) {
    return {".recipients-wrapper").mCustomScrollbar({
                theme:"dark-thin"
            });
            
            
            pasteEmoji();
            
            
            
            //$(iElement).find("#viewContainer").mCustomScrollbar({
            //    theme:"dark-thin"
            //});
            
            
            $('.card img').imagesLoaded().
        restrict: 'EA',
        link: function(scope, iElement, attrs) {
            
            //console.log('Ok Directive worked');
            
            $(iElement).find(then(function(){
                //console.log('all images are loaded');

                //$('.card').matchHeight({
                //    byRow: false,
                //    property: 'height',
                //    target: null,
                //    remove: false
                //});

            });
            
        }
    };
}]);
*/

//image is loaded ng-src

bombApp.directive('imageonload', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('load', function () {
                //console.log('image is loaded');
                $('.header-img').fadeTo(200, 1)
            });
            element.bind('error', function () {
                //console.log('image could not be loaded');
            });
        }
    };
});


//image is loaded ng-src

bombApp.directive('dz', function ($rootScope) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            new Dropzone('.upload', {
                url: '/api/filess/',
                paramName: 'files[]',
                acceptedFiles: '.csv',
                headers: {
                    'x-xsrf-token': '',
                },
                uploadprogress: function (file, progress, bytesSent) {
                },
                success: function (data, response) {
                },
                error: function (error) {
                    Papa.parse(error, {
                        complete: function (results) {
                            $rootScope.$broadcast('csv-uploaded', results.data);
                            console.log(results.data);
                        }
                    });
                },
                addedfile: function (file) {
                },
            });

        }
    };
});



// configure our routes
bombApp.config(function ($routeProvider, $interpolateProvider) {

    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');

    $routeProvider
        // route for the home page
        .when('/:lang/:catid/', {
            templateUrl: function (params) { return '/bosonAjax/13?lang=' + params.lang + '&cat=' + params.catid + '&time=' + Math.random(); },
            controller: 'mainController',
            resolve: {
                loaded: function () {
                    //console.log('loading is done?');
                    return true;
                }
            }
        })
        // route for the category selection
        .when('/:lang/:catid/categories', {
            templateUrl: function (params) { return '/bosonAjax/13?lang=' + params.lang + '&cat=' + params.catid + '&time=' + Math.random(); },
            controller: 'mainController',
            resolve: {
                loaded: function () {
                    //console.log('loading is done?');
                    return true;
                }
            }
        })

        // route for the design selection
        .when('/:lang/:catid/design', {
            templateUrl: function (params) { return '/bosonAjax/4?lang=' + params.lang + '&cat=' + params.catid + '&time=' + Math.random(); },
            controller: 'mainController',
            resolve: {
                loaded: function () {



                    //console.log('Designs are done');
                    return true;
                }
            }
        })

        // route for the greeting selection
        .when('/:lang/:catid/greeting', {
            templateUrl: function (params) { return '/bosonAjax/6?lang=' + params.lang + '&cat=' + params.catid + '&time=' + Math.random(); },
            controller: 'mainController',
            resolve: {
                loaded: function () {
                    //console.log('loading is done?');
                    return true;
                }
            }
        })

        // route for the personalized message
        .when('/:lang/:catid/personalized', {
            templateUrl: function (params) { return '/bosonAjax/5?lang=' + params.lang + '&cat=' + params.catid + '&time=' + Math.random(); },
            controller: 'mainController',
            resolve: {
                loaded: function () {
                    //console.log('loading is done?');
                    return true;
                }
            }
        })

        // route for the send your card
        .when('/:lang/:catid/send', {
            templateUrl: function (params) { return '/bosonAjax/7?lang=' + params.lang + '&cat=' + params.catid + '&time=' + Math.random(); },
            controller: 'mainController',
            resolve: {
                loaded: function () {
                    //console.log('loading is done?');
                    return true;
                }
            }
        })

        .otherwise({ redirectTo: '/en/41/categories' });





});



bombApp.run(function ($rootScope, $location, $route, $timeout) {

    $rootScope.mailSuccess = false;

    $rootScope.lang = 'en';
    $rootScope.reloading = 0;



    $rootScope.config = {};
    $rootScope.config.app_url = $location.url();
    $rootScope.config.app_path = $location.path();
    $rootScope.layout = {};
    $rootScope.layout.loading = false;
    $rootScope.mails = [];

    $rootScope.$on('$routeChangeStart', function (e, current, pre) {

        //$('#viewContainer').fadeOut(300);
        $rootScope.reloading = 1;
        $('#spinner').fadeIn(400);
        $rootScope.layout.loading = true;
        if (!$rootScope.ChooseCategory && current.$$route.originalPath == '/design/:lang?/:catid?') {
            $location.path('/categories/' + $rootScope.lang);
        }


        if (!$rootScope.Cardid && (current.$$route.originalPath === '/:lang/:catid/greeting' || current.$$route.originalPath === '/:lang/:catid/personalized' || current.$$route.originalPath === '/:lang/:catid/send')) {
            //$location.path( '/categories/'+$rootScope.lang );
            $location.path('/' + $rootScope.lang + '/' + $rootScope.ChooseCategory + '/categories');
        }




    });


    $rootScope.$on('csv-uploaded', function (event, data) {
        console.log('data', data)
        console.log('event', event)
        var temp = [];
        var hasError = true;
        for (var i = 0; i < data.length; i++) {
            email = data[i][0];
            if ($rootScope.validateEmail(email)) {
                // We have a valid Email so no reason to throw an error.
                if (hasError) {
                    hasError = false;
                }
                // Add the Email Address to the Recipients array.
                temp.push({ "text": email });
            }
        }
        $rootScope.mails = temp;
        console.log($rootScope.mails)
    });



    $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {
        $rootScope.layout.loading = false;
        //console.log(e);
        //$('#viewContainer').fadeIn(300);
        $('#spinner').fadeOut(400);
        $rootScope.reloading = 0;


        //preselect wish languages
        var lang = $route.current.params.lang;
        setTimeout(function (_val) {
            if (_val === 'fr' || _val === 'en') {
                $('.nav.nav-pills a[data-target="#lang-' + _val + '"]').click();
                var _firstWishBtn = $('#lang-' + _val + ' a:eq(0)')[0];
                angular.element(_firstWishBtn).triggerHandler('click');
            }
        }, 800, lang);


    });

    $rootScope.$on('$routeChangeError', function () {

    });
});

bombApp.controller('routeController', ['$scope', '$route', '$rootScope', function ($scope, $route, $rootScope) {
    var lang = $route.current.params.lang;
    $rootScope.lang = lang;
    //console.log(paramValue); 
}]);

// create the controller and inject Angular's $scope
bombApp.controller('mainController', ['$scope', '$route', '$rootScope', '$http', '$location', function ($scope, $route, $rootScope, $http, $location) {



    //$rootScope.Cardid					= null;
    //$rootScope.ChooseGreeting			= "";
    //$rootScope.wishText		 	= "";
    //$rootScope.wishTextCustom		 	= "";
    //$rootScope.ChoosePersonalMessage	= "";
    //$rootScope.ChoosePersonalName		= "";


    //$rootScope.textDirection = 'ltr';
    //$rootScope.borderColor = 'transparent';
    //$rootScope.bgColor = '#ffffff';



    //$rootScope.ChooseDesign				= {};
    //$rootScope.ChooseDesign.thumbnail = '/media/noimg.jpg';
    //$rootScope.ChooseDesign.image = '';
    //$rootScope.ChooseDesign.id = '';

    //$rootScope.wishFont = 'Gotham';
    //$rootScope.wishColor = '#000000';
    //$rootScope.wishStyle = 'uppercase';
    //$rootScope.messageColor = '#000000';
    //$rootScope.logoImg =  '/media/logo.png';

    $rootScope.sendErrors = false;
    $rootScope.sendMessages = '';
    //console.log("Route:");
    //console.log($route.current);
    try {
        $rootScope.lang = $route.current.params.lang;

    } catch (e) {

        $rootScope.lang = 'en';

    }

    try {
        $rootScope.ChooseCategory = $route.current.params.catid;
    } catch (e) {
        $rootScope.ChooseCategory = 41;
    }
    //try{ $rootScope.ChooseCategory = $route.current.params.catid;   }catch(e){}


    $rootScope.markup = ' here lies ballin ';
    $rootScope.steps = ['/', '/categories', '/design', '/greeting', '/personalized', '/send'];
    $rootScope.formData = {};
    $rootScope.formData.XPR_PostbackAction = 'BMBSend';
    $rootScope.formData.FromEmail = "";
    $rootScope.formData.Subject = "";
    $rootScope.formData.Lang = 'en';
    $rootScope.Recipients = [];
    $rootScope.CsvRecipients = [];
    $rootScope.formData.Body = '';
    $rootScope.formData.TermsAndServices = false;
    $rootScope.mandrilResponse = 'Response here :';

    $rootScope.switchLanguage = function (value) {

        //$route.current.$$route.originalPath.replace(':lang',value);
        $('.lang-switcher a').removeClass('active');
        $('.lang-' + value).addClass('active');

        $route.updateParams({ lang: value });
        $route.reload()
        $rootScope.lang = value;
        //$route.reload();

    };

    $rootScope.prevStep = function () {

        $('.dash-left').removeClass('showmethemoney');
        $('.btn-preview').removeClass('opened');

        var prevStep = $rootScope.currentStep();
        prevStep--;
        if (prevStep >= 1)
            $location.path('/' + $rootScope.lang + '/' + $rootScope.ChooseCategory + $rootScope.steps[prevStep]);
    };

    $rootScope.nextStep = function () {

        $('.dash-left').removeClass('showmethemoney');
        $('.btn-preview').removeClass('opened');


        var nextStep = $rootScope.currentStep();
        nextStep++;
        if (nextStep <= 5)
            $location.path('/' + $rootScope.lang + '/' + $rootScope.ChooseCategory + $rootScope.steps[nextStep]);
    };



    $rootScope.addCategory = function (value, redir) {

        if (redir == null) redir = true;

        $rootScope.ChooseCategory = value;
        $('#chooseCategories li').removeClass('active');
        $('#chooseCategories li.category-' + value).addClass('active');
        //if(value && redir)$location.path( $rootScope.lang+'/'+$rootScope.ChooseCategory+'/design/' );
    };



    $rootScope.addDesign = function (card) {

        var parsed = JSON.parse(card);

        try {
            if ($rootScope.ChooseDesign.image != parsed._embedded.CustomFields._embedded.DesignImage.SourcePath) {
                $('.header-img').fadeTo(10, 0);
            }
        } catch (e) {

        }

        //console.log(parsed);
        $rootScope.ChooseDesign = {};
        $rootScope.Cardid = parsed.Id;
        $rootScope.ChooseDesign.id = parsed.Id;
        $rootScope.textDirection = parsed._embedded.CustomFields._embedded.TextDirection.Value;
        $rootScope.borderColor = parsed._embedded.CustomFields.BorderColor;
        $rootScope.bgColor = parsed._embedded.CustomFields.BackgroundColor;
        $rootScope.ChooseDesign.thumbnail = parsed._embedded.Picture.SourcePath;


        $rootScope.ChooseDesign.image = parsed._embedded.CustomFields._embedded.DesignImage.SourcePath;

        $rootScope.wishFont = parsed._embedded.CustomFields._embedded.WishFont.Value;
        $rootScope.wishFontBackup = parsed._embedded.CustomFields._embedded.WishFont.Value;
        $rootScope.wishColor = parsed._embedded.CustomFields.WishColor;
        try { $rootScope.wishStyle = parsed._embedded.CustomFields._embedded.WishStyle.Value; } catch (e) { }
        $rootScope.messageColor = parsed._embedded.CustomFields.MessageColor;
        $rootScope.logoImg = parsed._embedded.CustomFields._embedded.LogoImage.SourcePath;


    };



    $rootScope.addGreeting = function (value) {
        //$rootScope.ChooseGreeting = value;
        $rootScope.wishText = value;
        $rootScope.wishTextCustom = '';
    };

    $rootScope.addPersonal = function (value) {
        $rootScope.ChoosePersonal = value;
        $rootScope.messageText = value;
    };



    $rootScope.currentStep = function () {
        //console.log('Current uri: '+currentUri);
        var currentStep = -1;
        var currentUri = '/';
        try {
            currentUri = $route.current.$$route.originalPath;
        } catch (e) {

        }

        if (currentUri == '/:lang/:catid/categories') {
            return 1;
        } else if (currentUri == '/:lang/:catid/design') {
            return 2;
        } else if (currentUri == '/:lang/:catid/greeting') {
            return 3;
        } else if (currentUri == '/:lang/:catid/personalized') {
            return 4;
        } else if (currentUri == '/:lang/:catid/send') {
            return 5;
        }

        return currentStep;

    }

    //manipulate fonts accordingly to languages
    $rootScope.setWishDirection = function (wLang) {
        if (wLang === 'ar') {
            $rootScope.textDirection = 'rtl';
        } else {
            $rootScope.textDirection = 'ltr';
        }


        if (wLang === 'ar' || wLang === 'cn') {
            $rootScope.wishFont = 'Arial';
        } else {
            $rootScope.wishFont = $rootScope.wishFontBackup;
        }

    }


    $rootScope.$watch('ChooseCategory', function () {

        if ($rootScope.ChooseCategory) {
            //console.log('hey, category has changed! '+$rootScope.ChooseCategory);
            $('.nav.navbar-nav li:eq(1) a').removeClass('disabled')
            //if(!$rootScope.ChooseDesign)$location.path( '/design/'+$rootScope.lang );
        } else {
            $('.nav.navbar-nav li:eq(1) a').addClass('disabled')
        }
    });

    $rootScope.$watch('ChooseDesign', function () {
        if ($rootScope.ChooseDesign) {
            $('.nav.navbar-nav li:eq(2) a').removeClass('disabled');
            //if(!$rootScope.ChooseGreeting)$location.path( '/greeting/'+$rootScope.lang );
        } else {
            $('.nav.navbar-nav li:eq(2) a').addClass('disabled');
        }
    });


    $rootScope.$watch('ChooseDesign.image', function (newValue, oldValue) {
        if (newValue === oldValue) return;
        $('img.headerimg').hide();
        $('img.headerimg').fadeIn("slow", function () { });
    })





    $rootScope.$watch('wishText', function (newValue, oldValue) {

        if (newValue === oldValue) return;

        //if(newValue === 'undefined')return;
        //console.log(newValue);


    });


    $rootScope.$watch('wishTextCustom', function (newValue, oldValue) {
        if (newValue === oldValue) return;

        //console.log('Wish Custom Changed: '+$rootScope.wishTextCustom);
        if (typeof $rootScope.wishTextCustom === 'undefined' || $rootScope.wishTextCustom === '') {
            //$rootScope.wishText = $rootScope.ChooseGreeting;
            $rootScope.wishText = '';

        } else if ($rootScope.wishTextCustom != '' && typeof $rootScope.wishTextCustom != 'undefined') {
            $rootScope.wishText = $rootScope.wishTextCustom;
        } else {
            //$rootScope.wishText = $rootScope.wishTextCustom;
            $rootScope.wishText = $rootScope.ChooseGreeting;
        }

    });

    // For the CsvRecipents file upload we need the $watch on $scope.
    $scope.$watch('CsvRecipients', function () {
        var file = ($scope.CsvRecipients) ? $scope.CsvRecipients[0] : null;
        if (!(file instanceof File)) {
            return;
        }

        var reader = new FileReader();

        reader.onload = function (e) {
            csvText = reader.result;
            emails = Papa.parse(csvText);

            var hasError = true;
            for (var i = 0; i < emails.data.length; i++) {
                email = emails.data[i][0];
                if ($rootScope.validateEmail(email)) {
                    // We have a valid Email so no reason to throw an error.
                    if (hasError) {
                        hasError = false;
                    }
                    // Add the Email Address to the Recipients array.
                    $rootScope.Recipients.push({ "text": email });
                    // Click above to refresh the page
                    //jQuery('tags-input input').click();
                }
            }

            if (hasError) {
                $rootScope.sendErrors = true;

                if ($scope.trans[$rootScope.lang]["Invalid CSV file or no Emails where found"])
                    $rootScope.sendMessages = $scope.trans[$rootScope.lang]["Invalid CSV file or no Emails where found"];
                else
                    $rootScope.sendMessages = "Invalid CSV file or no Emails where found";

                jQuery('#sendMailForm div.drop-box').addClass('has-error');
                return false;
            } else {
                $rootScope.sendErrors = false;
                $rootScope.sendMessages = "";
                jQuery('#sendMailForm div.drop-box').removeClass('has-error');
            }
        };

        reader.readAsText(file);
    });


    $rootScope.skipeThisStep = function (stepIndex) {

        //choose your wish
        if (stepIndex === 1) {
            $rootScope.wishText = '';
            $rootScope.wishTextCustom = '';
            $rootScope.ChooseGreeting = '';
            //personal wish
        } else if (stepIndex === 2) {
            $rootScope.messageText = '';
            $rootScope.signatureText = '';
        }
        $rootScope.nextStep();

    }

    $rootScope.sendAnotherCard = function () {

        //re init most of the scope values
        $rootScope.ChooseDesign = {};
        $rootScope.Cardid = '';
        $rootScope.ChooseDesign.id = '';
        $rootScope.textDirection = '';
        $rootScope.borderColor = '';
        $rootScope.bgColor = '';
        $rootScope.ChooseDesign.thumbnail = '';
        $rootScope.ChooseDesign.image = '';
        $rootScope.wishFont = '';
        $rootScope.wishFontBackup = '';
        $rootScope.wishColor = '';
        $rootScope.wishStyle = '';
        $rootScope.messageColor = '';
        $rootScope.logoImg = '';
        $rootScope.wishText = '';
        $rootScope.wishTextCustom = '';
        $rootScope.messageText = '';
        $rootScope.signatureText = '';


        $location.path('/' + $rootScope.lang + '/' + $rootScope.ChooseCategory + '/categories');
        $rootScope.mailSuccess = false;

    }

    /**
    * FORM
    */


    //extra validate function
    $rootScope.validateEmail = function (email) {
        //var pattern = /^([\\w\\.\\-]+)@([\\w\\-]+)((\\.(\\w){2,9})+)$/i;
        //var pattern =/(\\w+@[\\w.]+\\w)$/i;
        var pattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
        return pattern.test(email);
    }

    //add email from input (as tag)

    $rootScope.addThisEmail = function () {

        //var e = $.Event('keypress');
        //e.which = 13; 
        //$('tags-input input').trigger(e);

        var email = jQuery('.tags.focused input').val();
        var validEmail = $rootScope.validateEmail(email);
        if (validEmail && email != '') {
            var temp = {};
            temp.text = $('tags-input input').val();
            $rootScope.Recipients.push(temp);
            jQuery('tags-input input').val('');
            jQuery('tags-input input').removeClass('invalid-tag');
        } else {
            jQuery('tags-input input').addClass('invalid-tag');
        }


    }

    // add emails from CSV input
    $rootScope.addEmailsfromCSV = function () {
        if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
            alert('The File APIs are not fully supported in this browser.');
            return;
        }

        var csvUpload = jQuery('#csvUpload')
        if (csvUpload.length > 0) {
            input = csvUpload[0];
            if (input.files && input.files[0]) {
                file = input.files[0];
            }
        }

        if (!(file instanceof File)) {
            return;
        }

        var reader = new FileReader();

        reader.onload = function (e) {
            csvText = reader.result;
            emails = Papa.parse(csvText);

            var hasError = true;
            for (var i = 0; i < emails.data.length; i++) {
                email = emails.data[i][0];
                if ($rootScope.validateEmail(email)) {
                    // We have a valid Email so no reason to throw an error.
                    if (hasError) {
                        hasError = false;
                    }
                    // Add the Email Address to the Recipients array.
                    $rootScope.Recipients.push({ "text": email });
                    // Click above to refresh the page
                    jQuery('tags-input input').click();
                }
            }

            if (hasError) {
                $rootScope.sendErrors = true;

                if ($scope.trans[$rootScope.lang]["Invalid CSV file or no Emails where found"])
                    $rootScope.sendMessages = $scope.trans[$rootScope.lang]["Invalid CSV file or no Emails where found"];
                else
                    $rootScope.sendMessages = "Invalid CSV file or no Emails where found";

                jQuery('#csvUpload').addClass('has-error');
                return false;
            } else {
                $rootScope.sendErrors = false;
                $rootScope.sendMessages = "";
                jQuery('#csvUpload').removeClass('has-error');
            }
        };

        reader.readAsText(file);
    }

    //remove email from list
    $rootScope.removeThisEmail = function (item) {
        var index = -1;
        angular.forEach($rootScope.Recipients, function (value, key) {
            if (value.text === item) {
                index = key;
            }
        });
        $rootScope.Recipients.splice(index, 1);
    }

    // process the form
    $rootScope.processForm = function () {

        $rootScope.formData.Lang = $rootScope.lang;

        if (!$rootScope.formData.FromEmail) {
            $rootScope.sendErrors = true;
            //$rootScope.sendMessages = "Please add sender's email.";
            if ($scope.trans[$rootScope.lang]["Please add sender's email"])
                $rootScope.sendMessages = $scope.trans[$rootScope.lang]["Please add sender's email"];
            else
                $rootScope.sendMessages = "Please add sender's email";

            jQuery('#sendMailForm input[name="FromEmail"]').addClass('has-error');
            jQuery('#sendMailForm input[name="FromEmail"]').focus();
            return false;
        } else {
            $rootScope.sendErrors = false;
            $rootScope.sendMessages = "";
            jQuery('#sendMailForm input[name="FromEmail"]').removeClass('has-error');
        }


        if (!$rootScope.validateEmail($rootScope.formData.FromEmail)) {
            $rootScope.sendErrors = true;

            if ($scope.trans[$rootScope.lang]["Please check email sender's format"])
                $rootScope.sendMessages = $scope.trans[$rootScope.lang]["Please check email sender's format"];
            else
                $rootScope.sendMessages = "Please check email sender's format";


            jQuery('#sendMailForm input[name="FromEmail"]').addClass('has-error');
            jQuery('#sendMailForm input[name="FromEmail"]').focus();
            return false;
        } else {
            $rootScope.sendErrors = false;
            $rootScope.sendMessages = "";
            jQuery('#sendMailForm input[name="FromEmail"]').removeClass('has-error');
        }


        if (!$rootScope.formData.Subject) {
            $rootScope.sendErrors = true;

            if ($scope.trans[$rootScope.lang]["Please add a subject"])
                $rootScope.sendMessages = $scope.trans[$rootScope.lang]["Please add a subject"];
            else
                $rootScope.sendMessages = "Please add a subject";

            jQuery('#sendMailForm input[name="Subject"]').addClass('has-error');
            jQuery('#sendMailForm input[name="Subject"]').focus();
            return false;
        } else {
            $rootScope.sendErrors = false;
            $rootScope.sendMessages = "";
            jQuery('#sendMailForm input[name="Subject"]').removeClass('has-error');
        }

        if ($rootScope.Recipients.length == 0) {
            $rootScope.sendErrors = true;

            if ($scope.trans[$rootScope.lang]["Please add recipient"])
                $rootScope.sendMessages = $scope.trans[$rootScope.lang]["Please add recipient"];
            else
                $rootScope.sendMessages = "Please add recipient";


            jQuery('#sendMailForm .tags input').addClass('has-error');
            jQuery('#sendMailForm .tags input').focus();
            return false;
        } else {
            $rootScope.sendErrors = false;
            $rootScope.sendMessages = "";
            jQuery('#sendMailForm .tags input').removeClass('has-error');
        }

        // Terms and services field has been removed so do not check for it.
        /*if(!$rootScope.formData.TermsAndServices){
            $rootScope.sendErrors = true;
            
            if($scope.trans[$rootScope.lang]["You need to accept the Terms and Services"])
            	$rootScope.sendMessages = $scope.trans[$rootScope.lang]["You need to accept the Terms and Services"];
            else
                $rootScope.sendMessages = "You need to accept the Terms and Services";
            
            jQuery('#sendMailForm input#terms-and-services').addClass('has-error');
            jQuery('#sendMailForm input#terms-and-services').focus();
            return false;
        }else{
            $rootScope.sendErrors = false;
            $rootScope.sendMessages = "";
            jQuery('#sendMailForm input#terms-and-services').removeClass('has-error');
        }*/


        $rootScope.sendErrors = false;
        $rootScope.sendMessages = "";


        $('#spinner').fadeIn(400);

        var Recipients = $rootScope.Recipients;
        var mutRecipients = [];
        for (var rk in Recipients) {
            mutRecipients.push(Recipients[rk].text)
        }

        $rootScope.formData.Recipients = mutRecipients;


        $rootScope.formData.Body = '';
        $rootScope.formData.Body += '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
        $rootScope.formData.Body += '<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">';
        $rootScope.formData.Body += '<head>';
        $rootScope.formData.Body += '<meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width"><title>MERRY CHRISTMAS</title>';
        $rootScope.formData.Body += "<!--[if !mso]><!-- --><style type=\\"text / css\\">@font-face{font-family:Gotham;src:url(http://dev.backbone.gr/newsletter_fonts/GothamLight/hinted-GothamLight.eot);src:local('Gotham Light'),local('GothamLight'),url(http://backbonetechnology.com/media/hinted-GothamLight.eot?#iefix) format('embedded-opentype'),url(http://dev.backbone.gr/newsletter_fonts/GothamLight/hinted-GothamLight.woff2) format('woff2'),url(http://dev.backbone.gr/newsletter_fonts/GothamLight/hinted-GothamLight.woff) format('woff'),url(http://dev.backbone.gr/newsletter_fonts/GothamLight/hinted-GothamLight.ttf) format('truetype'),url(http://dev.backbone.gr/newsletter_fonts/GothamLight/hinted-GothamLight.svg#GothamLight) format('svg');font-weight:300;font-style:normal}@font-face{font-family:Didot;src:url(http://dev.backbone.gr/newsletter_fonts/Didot/hinted-Didot.eot);src:local('Gotham Light'),local('Didot'),url(http://backbonetechnology.com/media/hinted-Didot.eot?#iefix) format('embedded-opentype'),url(http://dev.backbone.gr/newsletter_fonts/Didot/hinted-Didot.woff2) format('woff2'),url(http://dev.backbone.gr/newsletter_fonts/Didot/hinted-Didot.woff) format('woff'),url(http://dev.backbone.gr/newsletter_fonts/Didot/hinted-Didot.ttf) format('truetype'),url(http://dev.backbone.gr/newsletter_fonts/Didot/hinted-Didot.svg#Didot) format('svg');font-weight:300;font-style:normal}</style><!--<![endif]-->";
        $rootScope.formData.Body += '</head>';
        $rootScope.formData.Body += jQuery('#mailTemplate').val();
        $rootScope.formData.Body += '</html>';




        $http({
            method: 'POST',
            url: '/bosonAjax/7',//'/api/postHandlers/runner/BMBSend',
            data: $.param($scope.formData),  // pass in data as strings
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .success(function (data) {
                $('#spinner').fadeOut(400);
                var resp = JSON.parse($(data).filter('#jsonResponse').html())

                if (resp.Status === false) {

                    $rootScope.sendErrors = true;
                    $rootScope.sendMessages = resp.Message;

                } else {

                    $rootScope.mailSuccess = true;
                    $rootScope.sendErrors = false;

                }

                //console.log(jQuery(data).find('#jsonResponse'))

                //$rootScope.mailSuccess = true;
                //console.log(data);
                //$rootScope.formData.Recipients = [{value:0}];
                $rootScope.mandrilResponse = data;

                if (!data.success) {

                } else {


                }
            });

    };


}]);
