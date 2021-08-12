'use strict';



angular.module('inspinia')
    .directive('inspWrapper', function() {

        return {
            transclude: true,
            replace: true,
            template: '<div id="wrapper" ng-cloak ng-transclude></div>',
        }

    });

angular.module('inspinia')
    .directive('inspSideNavigation', function() {

        return {
            transclude: true,
            replace: true,
            template: '<nav class="navbar-default navbar-static-side" role="navigation" ng-cloak>' +
                '<div class="sidebar-collapse" ng-transclude>' +
                '</div></nav>'

        }
    });

angular.module('inspinia')
    .directive('inspTopNavigation', function() {

        return {
            transclude: true,
            replace: true,
            template: '<div class="row">' +
                '<nav class="navbar navbar-static-top" role="navigation" ng-transclude>' +
                '</nav></div>',
            link: function(scope, elem, attrs) {
                elem.find('.navbar-minimalize').on('click', function() {
                    $("body").toggleClass("mini-navbar");
                    return false;
                });
            }
        }
    });

angular.module('inspinia')
    .directive('inspPage', function() {

        return {
            transclude: true,
            replace: true,
            template: '<div id="page-wrapper" ng-transclude></div>'

        }
    });

angular.module('inspinia')
    .directive('inspHeader', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            template: '<div class="row wrapper page-heading" ng-transclude></div>'
        }
    });

angular.module('inspinia')
    .directive('inspHeaderTitle', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            template: '<h2 ng-transclude></h2>'
        }
    });

angular.module('inspinia')
    .directive('inspFooter', function() {

        return {
            transclude: true,
            replace: true,
            template: '<div class="footer" ng-transclude></div>'

        }
    });


angular.module('inspinia')
    .directive('inspContent', function() {

        return {
            transclude: true,
            replace: true,
            template: '<div class="wrapper wrapper-content" ng-transclude></div>'

        }
    });







angular.module('inspinia')
    .directive('metisMenu', function($timeout) {

        return {
            transclude: true,
            replace: true,
            template: '<ul class="nav metismenu" id="side-menu" ng-transclude></ul>',
            link: function(scope, element) {
                $timeout(function() {
                    element.metisMenu();
                });
            }

        }
    });

angular.module('inspinia')
    .directive('metisItem', function($timeout) {

        return {
            transclude: true,
            replace: true,
            template: '<li ng-transclude></li>'
        }
    });


angular.module('inspinia')
    .directive('ibox', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            template: '<div class="ibox" ng-transclude> </div>',
        };
    });

angular.module('inspinia')
    .directive('iboxHeader', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            template: '<div class="ibox-title" ng-transclude> </div>'
        };
    });

angular.module('inspinia')
    .directive('iboxTitle', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            template: '<h5 ng-transclude> </h5>'
        };
    })

angular.module('inspinia')
    .directive('iboxContent', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            template: '<div class="ibox-content" ng-transclude> </div>'
        };
    });

angular.module('inspinia')
    .directive('iboxTools', function($timeout) {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            template: '<div class="ibox-tools" ng-transclude></div>',
            link: function($scope, $element, attrs) {

                var collapsable = $scope.$eval(attrs.iboxCollapsable) || false;
                var closable = $scope.$eval(attrs.iboxClosable) || false;
                var collapsed = $scope.$eval(attrs.iboxCollapsed) || false;
                if (collapsable) {
                    var collapse = angular.element('<a><i class="fa fa-chevron-up"></i></a>');
                    $element.append(collapse);
                    collapse.bind('click', function() {
                        _resizeContent(200, 50);
                    });
                }

                if (closable) {
                    var close = angular.element('<a><i class="fa fa-times"></i></a>');
                    $element.append(close);
                    close.bind('click', function() {
                        var ibox = $element.closest('div.ibox');
                        ibox.remove();
                    });
                }

                if (collapsed) {
                    $timeout(function() {
                        _resizeContent(10, 10);
                    });
                }

                var _resizeContent = function(slideToggle, timeout) {
                    var ibox = $element.closest('div.ibox');
                    var icon = $element.find('i:first');
                    var content = ibox.find('div.ibox-content');
                    content.slideToggle(slideToggle);
                    icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                    ibox.toggleClass('').toggleClass('border-bottom');
                    $timeout(function() {
                        ibox.resize();
                        ibox.find('[id^=map-]').resize();
                    }, timeout);
                }

            }
        };
    });

angular.module('inspinia')
    .directive('iboxFooter', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            template: '<div class="ibox-footer" ng-transclude></div>'
        };
    });

angular.module('inspinia')
    .directive('flashMessage', function($rootScope) {
        return {
            restrict: 'E',
            template: '<div id="flash-message" ng-show="$root.flashMessageShow" class="{{ $root.flashMessage.type }}">' +
                '<span>{{ $root.flashMessage.content }}</span>' +
                '<a class="close-button" ng-click="$root.flashMessageShow = false" href="">&times;</a>' +
                '</div>',
            scope: {
                flashMessage: '='
            }
        }
    });


/**
 * @ngdoc directive
 * @name insBreadcrum
 * @module inspinia
 *
 * @element ANY
 * 
 * @description
 *
 * Use this directive to create a Breadcrum.
 *
 * Breadcrum is a path for navigation. This element help you to navigate better.
 *
 * @example:
 * This example shows how to use `breadcrum` tag.
   ```html
    <insp-breadcrumb>
        <insp-breadcrumb-item ui-sref="items.list">Items</insp-breadcrumb-item>
        <insp-breadcrumb-item item-active="true">{{ item.name }}</insp-breadcrumb-item>
    </insp-breadcrumb>
   ```
 *
 */
angular.module('inspinia')
    .directive('inspBreadcrumb', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            template: '<ol class="breadcrumb" ng-transclude></ol>'
        }
    })
    .directive('inspBreadcrumbItem', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            template: '<li><a ng-transclude></a></li>',
            link: function($scope, $element, $attrs) {
                var active = $attrs.itemActive || false;
                if (active) {
                    $element.addClass("active");
                    $element
                        .append($('<strong></strong>')
                            .append($element.children())
                        );

                }
            }
        }
    });

/**
* @ngdoc directive
* @name insModal
* @module inspinia
*
* @element ANY
* 
* @description
*
* Use this directive to create a Modal Panel
*
*
* @example:
 * This example shows how to use `modal` tag.
   ```html
    <button insp-modal-open="#myModal" class="btn btn-primary">Remove item</button>
    
    ...

    <insp-modal id="myModal"/>
        <insp-modal-header>Remove item</insp-modal-header>
        <insp-modal-body>Are you sure to remove item?</insp-modal-body>
        <insp-modal-footer class="text-right">
            <button data-dismiss="modal" class="btn btn-default">No</button>
            <button data-dismiss="modal" ng-click="removeItem()" class="btn btn-primary">Yes</button>
        </insp-modal-footer>
    </insp-modal>
   ```
 *
 */
angular.module('inspinia')
    .directive('inspModal', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            template: '<div class="modal" role="dialog">' +
                '<div class="modal-dialog">' +
                '<div class="modal-content" ng-transclude>' +
                '</div></div></div>',
            link: function($scope, $element, $attrs) {
                var animation = $attrs.modalAnimation || 'fade';
                $element.addClass(animation);
            }
        };
    })
    .directive('inspModalHeader', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            template: '<div class="modal-header"><h5 ng-transclude></h5></div>'
        };
    })
    .directive('inspModalBody', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            template: '<div class="modal-body" ng-transclude></div>'
        };
    })
    .directive('inspModalFooter', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            template: '<div class="modal-footer" ng-transclude></div>'
        };
    })
    .directive('inspModalOpen', function() {
        return {
            restrict: 'A',
            link: function($scope, $element, $attrs) {
                var modalId = $attrs.inspModalOpen;
                if (modalId) {
                    $element.attr("data-toggle", "modal");
                    $element.attr("data-target", modalId);
                }
            }
        };
    });
