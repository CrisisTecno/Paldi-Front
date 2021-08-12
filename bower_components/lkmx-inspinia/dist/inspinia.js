/*
 *
 *   INSPINIA - Responsive Admin Theme
 *   version 2.6
 *
 */
require("jquery-slimscroll");
require("metisMenu");
require("bootstrap/assets/javascripts/bootstrap");

$(document).ready(function () {
	// Add body-small class if window less than 768px
	if ($(this).width() < 769) {
		$("body").addClass("body-small");
	} else {
		$("body").removeClass("body-small");
	}

	// MetsiMenu
	$("#side-menu").metisMenu();

	// Collapse ibox function
	$(".collapse-link").on("click", function () {
		var ibox = $(this).closest("div.ibox");
		var button = $(this).find("i");
		var content = ibox.find("div.ibox-content");
		content.slideToggle(200);
		button.toggleClass("fa-chevron-up").toggleClass("fa-chevron-down");
		ibox.toggleClass("").toggleClass("border-bottom");
		setTimeout(function () {
			ibox.resize();
			ibox.find("[id^=map-]").resize();
		}, 50);
	});

	// Close ibox function
	$(".close-link").on("click", function () {
		var content = $(this).closest("div.ibox");
		content.remove();
	});

	// Fullscreen ibox function
	$(".fullscreen-link").on("click", function () {
		var ibox = $(this).closest("div.ibox");
		var button = $(this).find("i");
		$("body").toggleClass("fullscreen-ibox-mode");
		button.toggleClass("fa-expand").toggleClass("fa-compress");
		ibox.toggleClass("fullscreen");
		setTimeout(function () {
			$(window).trigger("resize");
		}, 100);
	});

	// Run menu of canvas
	$("body.canvas-menu .sidebar-collapse").slimScroll({
		height: "100%",
		railOpacity: 0.9,
	});

	// Open close right sidebar
	$(".right-sidebar-toggle").on("click", function () {
		$("#right-sidebar").toggleClass("sidebar-open");
	});

	// Initialize slimscroll for right sidebar
	$(".sidebar-container").slimScroll({
		height: "100%",
		railOpacity: 0.4,
		wheelStep: 10,
	});

	// Open close small chat
	$(".open-small-chat").on("click", function () {
		$(this).children().toggleClass("fa-comments").toggleClass("fa-remove");
		$(".small-chat-box").toggleClass("active");
	});

	// Initialize slimscroll for small chat
	$(".small-chat-box .content").slimScroll({
		height: "234px",
		railOpacity: 0.4,
	});

	// Small todo handler
	$(".check-link").on("click", function () {
		var button = $(this).find("i");
		var label = $(this).next("span");
		button.toggleClass("fa-check-square").toggleClass("fa-square-o");
		label.toggleClass("todo-completed");
		return false;
	});

	// Minimalize menu
	$(".navbar-minimalize").on("click", function () {
		$("body").toggleClass("mini-navbar");
		SmoothlyMenu();
	});

	// Tooltips demo
	$(".tooltip-demo").tooltip({
		selector: "[data-toggle=tooltip]",
		container: "body",
	});

	// Full height of sidebar
	function fix_height() {
		var heightWithoutNavbar = $("body > #wrapper").height() - 61;
		$(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");

		var navbarHeigh = $("nav.navbar-default").height();
		var wrapperHeigh = $("#page-wrapper").height();

		if (navbarHeigh > wrapperHeigh) {
			$("#page-wrapper").css("min-height", navbarHeigh + "px");
		}

		if (navbarHeigh < wrapperHeigh) {
			$("#page-wrapper").css("min-height", $(window).height() + "px");
		}

		if ($("body").hasClass("fixed-nav")) {
			if (navbarHeigh > wrapperHeigh) {
				$("#page-wrapper").css("min-height", navbarHeigh - 60 + "px");
			} else {
				$("#page-wrapper").css(
					"min-height",
					$(window).height() - 60 + "px"
				);
			}
		}
	}

	fix_height();

	// Fixed Sidebar
	$(window).bind("load", function () {
		if ($("body").hasClass("fixed-sidebar")) {
			$(".sidebar-collapse").slimScroll({
				height: "100%",
				railOpacity: 0.9,
			});
		}
	});

	// Move right sidebar top after scroll
	$(window).scroll(function () {
		if ($(window).scrollTop() > 0 && !$("body").hasClass("fixed-nav")) {
			$("#right-sidebar").addClass("sidebar-top");
		} else {
			$("#right-sidebar").removeClass("sidebar-top");
		}
	});

	$(window).bind("load resize scroll", function () {
		if (!$("body").hasClass("body-small")) {
			fix_height();
		}
	});

	$("[data-toggle=popover]").popover();

	// Add slimscroll to element
	$(".full-height-scroll").slimscroll({
		height: "100%",
	});

	$("a[ignore-click]").click(function (e) {
		e.preventDefault();
	});
});

// Minimalize menu when screen is less than 768px
$(window).bind("resize", function () {
	if ($(this).width() < 769) {
		$("body").addClass("body-small");
	} else {
		$("body").removeClass("body-small");
	}
});

// Local Storage functions
// Set proper body class and plugins based on user configuration
$(document).ready(function () {
	if (localStorageSupport()) {
		var collapse = localStorage.getItem("collapse_menu");
		var fixedsidebar = localStorage.getItem("fixedsidebar");
		var fixednavbar = localStorage.getItem("fixednavbar");
		var boxedlayout = localStorage.getItem("boxedlayout");
		var fixedfooter = localStorage.getItem("fixedfooter");

		var body = $("body");

		if (fixedsidebar == "on") {
			body.addClass("fixed-sidebar");
			$(".sidebar-collapse").slimScroll({
				height: "100%",
				railOpacity: 0.9,
			});
		}

		if (collapse == "on") {
			if (body.hasClass("fixed-sidebar")) {
				if (!body.hasClass("body-small")) {
					body.addClass("mini-navbar");
				}
			} else {
				if (!body.hasClass("body-small")) {
					body.addClass("mini-navbar");
				}
			}
		}

		if (fixednavbar == "on") {
			$(".navbar-static-top")
				.removeClass("navbar-static-top")
				.addClass("navbar-fixed-top");
			body.addClass("fixed-nav");
		}

		if (boxedlayout == "on") {
			body.addClass("boxed-layout");
		}

		if (fixedfooter == "on") {
			$(".footer").addClass("fixed");
		}
	}
});

// check if browser support HTML5 local storage
function localStorageSupport() {
	return "localStorage" in window && window["localStorage"] !== null;
}

// For demo purpose - animation css script
function animationHover(element, animation) {
	element = $(element);
	element.hover(
		function () {
			element.addClass("animated " + animation);
		},
		function () {
			//wait for animation to finish before removing classes
			window.setTimeout(function () {
				element.removeClass("animated " + animation);
			}, 2000);
		}
	);
}

function SmoothlyMenu() {
	if (
		!$("body").hasClass("mini-navbar") ||
		$("body").hasClass("body-small")
	) {
		// Hide menu in order to smoothly turn on when maximize menu
		$("#side-menu").hide();
		// For smoothly turn on menu
		setTimeout(function () {
			$("#side-menu").fadeIn(400);
		}, 200);
	} else if ($("body").hasClass("fixed-sidebar")) {
		$("#side-menu").hide();
		setTimeout(function () {
			$("#side-menu").fadeIn(400);
		}, 100);
	} else {
		// Remove all inline style from jquery fadeIn function to reset menu state
		$("#side-menu").removeAttr("style");
	}
}

// Dragable panels
function WinMove() {
	var element = "[class*=col]";
	var handle = ".ibox-title";
	var connect = "[class*=col]";
	$(element)
		.sortable({
			handle: handle,
			connectWith: connect,
			tolerance: "pointer",
			forcePlaceholderSize: true,
			opacity: 0.8,
		})
		.disableSelection();
}

angular.module("inspinia", []);

angular.module("inspinia").run(function ($rootScope, $timeout) {
	$rootScope.$on("flashMessage", function (event, args) {
		$rootScope.flashMessage = args;
		$rootScope.flashMessageShow = true;
		$timeout(function () {
			$rootScope.flashMessageShow = false;
		}, 3000);
	});
});

("use strict");

angular.module("inspinia").directive("inspWrapper", function () {
	return {
		transclude: true,
		replace: true,
		template: '<div id="wrapper" ng-cloak ng-transclude></div>',
	};
});

angular.module("inspinia").directive("inspSideNavigation", function () {
	return {
		transclude: true,
		replace: true,
		template:
			'<nav class="navbar-default navbar-static-side" role="navigation" ng-cloak>' +
			'<div class="sidebar-collapse" ng-transclude>' +
			"</div></nav>",
	};
});

angular.module("inspinia").directive("inspTopNavigation", function () {
	return {
		transclude: true,
		replace: true,
		template:
			'<div class="row">' +
			'<nav class="navbar navbar-static-top" role="navigation" ng-transclude>' +
			"</nav></div>",
		link: function (scope, elem, attrs) {
			elem.find(".navbar-minimalize").on("click", function () {
				$("body").toggleClass("mini-navbar");
				return false;
			});
		},
	};
});

angular.module("inspinia").directive("inspPage", function () {
	return {
		transclude: true,
		replace: true,
		template: '<div id="page-wrapper" ng-transclude></div>',
	};
});

angular.module("inspinia").directive("inspHeader", function () {
	return {
		restrict: "E",
		transclude: true,
		replace: true,
		template: '<div class="row wrapper page-heading" ng-transclude></div>',
	};
});

angular.module("inspinia").directive("inspHeaderTitle", function () {
	return {
		restrict: "E",
		transclude: true,
		replace: true,
		template: "<h2 ng-transclude></h2>",
	};
});

angular.module("inspinia").directive("inspFooter", function () {
	return {
		transclude: true,
		replace: true,
		template: '<div class="footer" ng-transclude></div>',
	};
});

angular.module("inspinia").directive("inspContent", function () {
	return {
		transclude: true,
		replace: true,
		template: '<div class="wrapper wrapper-content" ng-transclude></div>',
	};
});

angular.module("inspinia").directive("metisMenu", function ($timeout) {
	return {
		transclude: true,
		replace: true,
		template:
			'<ul class="nav metismenu" id="side-menu" ng-transclude></ul>',
		link: function (scope, element) {
			$timeout(function () {
				element.metisMenu();
			});
		},
	};
});

angular.module("inspinia").directive("metisItem", function ($timeout) {
	return {
		transclude: true,
		replace: true,
		template: "<li ng-transclude></li>",
	};
});

angular.module("inspinia").directive("ibox", function () {
	return {
		restrict: "E",
		transclude: true,
		replace: true,
		template: '<div class="ibox" ng-transclude> </div>',
	};
});

angular.module("inspinia").directive("iboxHeader", function () {
	return {
		restrict: "E",
		transclude: true,
		replace: true,
		template: '<div class="ibox-title" ng-transclude> </div>',
	};
});

angular.module("inspinia").directive("iboxTitle", function () {
	return {
		restrict: "E",
		transclude: true,
		replace: true,
		template: "<h5 ng-transclude> </h5>",
	};
});

angular.module("inspinia").directive("iboxContent", function () {
	return {
		restrict: "E",
		transclude: true,
		replace: true,
		template: '<div class="ibox-content" ng-transclude> </div>',
	};
});

angular.module("inspinia").directive("iboxTools", function ($timeout) {
	return {
		restrict: "E",
		transclude: true,
		replace: true,
		template: '<div class="ibox-tools" ng-transclude></div>',
		link: function ($scope, $element, attrs) {
			var collapsable = $scope.$eval(attrs.iboxCollapsable) || false;
			var closable = $scope.$eval(attrs.iboxClosable) || false;
			var collapsed = $scope.$eval(attrs.iboxCollapsed) || false;
			if (collapsable) {
				var collapse = angular.element(
					'<a><i class="fa fa-chevron-up"></i></a>'
				);
				$element.append(collapse);
				collapse.bind("click", function () {
					_resizeContent(200, 50);
				});
			}

			if (closable) {
				var close = angular.element(
					'<a><i class="fa fa-times"></i></a>'
				);
				$element.append(close);
				close.bind("click", function () {
					var ibox = $element.closest("div.ibox");
					ibox.remove();
				});
			}

			if (collapsed) {
				$timeout(function () {
					_resizeContent(10, 10);
				});
			}

			var _resizeContent = function (slideToggle, timeout) {
				var ibox = $element.closest("div.ibox");
				var icon = $element.find("i:first");
				var content = ibox.find("div.ibox-content");
				content.slideToggle(slideToggle);
				icon.toggleClass("fa-chevron-up").toggleClass(
					"fa-chevron-down"
				);
				ibox.toggleClass("").toggleClass("border-bottom");
				$timeout(function () {
					ibox.resize();
					ibox.find("[id^=map-]").resize();
				}, timeout);
			};
		},
	};
});

angular.module("inspinia").directive("iboxFooter", function () {
	return {
		restrict: "E",
		transclude: true,
		replace: true,
		template: '<div class="ibox-footer" ng-transclude></div>',
	};
});

angular.module("inspinia").directive("flashMessage", function ($rootScope) {
	return {
		restrict: "E",
		template:
			'<div id="flash-message" ng-show="$root.flashMessageShow" class="{{ $root.flashMessage.type }}">' +
			"<span>{{ $root.flashMessage.content }}</span>" +
			'<a class="close-button" ng-click="$root.flashMessageShow = false" href="">&times;</a>' +
			"</div>",
		scope: {
			flashMessage: "=",
		},
	};
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
angular
	.module("inspinia")
	.directive("inspBreadcrumb", function () {
		return {
			restrict: "E",
			transclude: true,
			replace: true,
			template: '<ol class="breadcrumb" ng-transclude></ol>',
		};
	})
	.directive("inspBreadcrumbItem", function () {
		return {
			restrict: "E",
			transclude: true,
			replace: true,
			template: "<li><a ng-transclude></a></li>",
			link: function ($scope, $element, $attrs) {
				var active = $attrs.itemActive || false;
				if (active) {
					$element.addClass("active");
					$element.append(
						$("<strong></strong>").append($element.children())
					);
				}
			},
		};
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
angular
	.module("inspinia")
	.directive("inspModal", function () {
		return {
			restrict: "E",
			transclude: true,
			replace: true,
			template:
				'<div class="modal" role="dialog">' +
				'<div class="modal-dialog">' +
				'<div class="modal-content" ng-transclude>' +
				"</div></div></div>",
			link: function ($scope, $element, $attrs) {
				var animation = $attrs.modalAnimation || "fade";
				$element.addClass(animation);
			},
		};
	})
	.directive("inspModalHeader", function () {
		return {
			restrict: "E",
			transclude: true,
			replace: true,
			template: '<div class="modal-header"><h5 ng-transclude></h5></div>',
		};
	})
	.directive("inspModalBody", function () {
		return {
			restrict: "E",
			transclude: true,
			replace: true,
			template: '<div class="modal-body" ng-transclude></div>',
		};
	})
	.directive("inspModalFooter", function () {
		return {
			restrict: "E",
			transclude: true,
			replace: true,
			template: '<div class="modal-footer" ng-transclude></div>',
		};
	})
	.directive("inspModalOpen", function () {
		return {
			restrict: "A",
			link: function ($scope, $element, $attrs) {
				var modalId = $attrs.inspModalOpen;
				if (modalId) {
					$element.attr("data-toggle", "modal");
					$element.attr("data-target", modalId);
				}
			},
		};
	});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVpLWFkanVzdC5qcyIsInJ1bi5qcyIsImRpcmVjdGl2ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Imluc3BpbmlhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICpcclxuICogICBJTlNQSU5JQSAtIFJlc3BvbnNpdmUgQWRtaW4gVGhlbWVcclxuICogICB2ZXJzaW9uIDIuNlxyXG4gKlxyXG4gKi9cclxuXHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcblxyXG5cclxuICAgIC8vIEFkZCBib2R5LXNtYWxsIGNsYXNzIGlmIHdpbmRvdyBsZXNzIHRoYW4gNzY4cHhcclxuICAgIGlmICgkKHRoaXMpLndpZHRoKCkgPCA3NjkpIHtcclxuICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2JvZHktc21hbGwnKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2JvZHktc21hbGwnKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIE1ldHNpTWVudVxyXG4gICAgJCgnI3NpZGUtbWVudScpLm1ldGlzTWVudSgpO1xyXG5cclxuICAgIC8vIENvbGxhcHNlIGlib3ggZnVuY3Rpb25cclxuICAgICQoJy5jb2xsYXBzZS1saW5rJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpYm94ID0gJCh0aGlzKS5jbG9zZXN0KCdkaXYuaWJveCcpO1xyXG4gICAgICAgIHZhciBidXR0b24gPSAkKHRoaXMpLmZpbmQoJ2knKTtcclxuICAgICAgICB2YXIgY29udGVudCA9IGlib3guZmluZCgnZGl2Lmlib3gtY29udGVudCcpO1xyXG4gICAgICAgIGNvbnRlbnQuc2xpZGVUb2dnbGUoMjAwKTtcclxuICAgICAgICBidXR0b24udG9nZ2xlQ2xhc3MoJ2ZhLWNoZXZyb24tdXAnKS50b2dnbGVDbGFzcygnZmEtY2hldnJvbi1kb3duJyk7XHJcbiAgICAgICAgaWJveC50b2dnbGVDbGFzcygnJykudG9nZ2xlQ2xhc3MoJ2JvcmRlci1ib3R0b20nKTtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWJveC5yZXNpemUoKTtcclxuICAgICAgICAgICAgaWJveC5maW5kKCdbaWRePW1hcC1dJykucmVzaXplKCk7XHJcbiAgICAgICAgfSwgNTApO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gQ2xvc2UgaWJveCBmdW5jdGlvblxyXG4gICAgJCgnLmNsb3NlLWxpbmsnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGNvbnRlbnQgPSAkKHRoaXMpLmNsb3Nlc3QoJ2Rpdi5pYm94Jyk7XHJcbiAgICAgICAgY29udGVudC5yZW1vdmUoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEZ1bGxzY3JlZW4gaWJveCBmdW5jdGlvblxyXG4gICAgJCgnLmZ1bGxzY3JlZW4tbGluaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaWJveCA9ICQodGhpcykuY2xvc2VzdCgnZGl2Lmlib3gnKTtcclxuICAgICAgICB2YXIgYnV0dG9uID0gJCh0aGlzKS5maW5kKCdpJyk7XHJcbiAgICAgICAgJCgnYm9keScpLnRvZ2dsZUNsYXNzKCdmdWxsc2NyZWVuLWlib3gtbW9kZScpO1xyXG4gICAgICAgIGJ1dHRvbi50b2dnbGVDbGFzcygnZmEtZXhwYW5kJykudG9nZ2xlQ2xhc3MoJ2ZhLWNvbXByZXNzJyk7XHJcbiAgICAgICAgaWJveC50b2dnbGVDbGFzcygnZnVsbHNjcmVlbicpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcigncmVzaXplJyk7XHJcbiAgICAgICAgfSwgMTAwKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFJ1biBtZW51IG9mIGNhbnZhc1xyXG4gICAgJCgnYm9keS5jYW52YXMtbWVudSAuc2lkZWJhci1jb2xsYXBzZScpLnNsaW1TY3JvbGwoe1xyXG4gICAgICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAgICAgIHJhaWxPcGFjaXR5OiAwLjlcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIE9wZW4gY2xvc2UgcmlnaHQgc2lkZWJhclxyXG4gICAgJCgnLnJpZ2h0LXNpZGViYXItdG9nZ2xlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJyNyaWdodC1zaWRlYmFyJykudG9nZ2xlQ2xhc3MoJ3NpZGViYXItb3BlbicpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gSW5pdGlhbGl6ZSBzbGltc2Nyb2xsIGZvciByaWdodCBzaWRlYmFyXHJcbiAgICAkKCcuc2lkZWJhci1jb250YWluZXInKS5zbGltU2Nyb2xsKHtcclxuICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgICAgICByYWlsT3BhY2l0eTogMC40LFxyXG4gICAgICAgIHdoZWVsU3RlcDogMTBcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIE9wZW4gY2xvc2Ugc21hbGwgY2hhdFxyXG4gICAgJCgnLm9wZW4tc21hbGwtY2hhdCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKHRoaXMpLmNoaWxkcmVuKCkudG9nZ2xlQ2xhc3MoJ2ZhLWNvbW1lbnRzJykudG9nZ2xlQ2xhc3MoJ2ZhLXJlbW92ZScpO1xyXG4gICAgICAgICQoJy5zbWFsbC1jaGF0LWJveCcpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEluaXRpYWxpemUgc2xpbXNjcm9sbCBmb3Igc21hbGwgY2hhdFxyXG4gICAgJCgnLnNtYWxsLWNoYXQtYm94IC5jb250ZW50Jykuc2xpbVNjcm9sbCh7XHJcbiAgICAgICAgaGVpZ2h0OiAnMjM0cHgnLFxyXG4gICAgICAgIHJhaWxPcGFjaXR5OiAwLjRcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFNtYWxsIHRvZG8gaGFuZGxlclxyXG4gICAgJCgnLmNoZWNrLWxpbmsnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGJ1dHRvbiA9ICQodGhpcykuZmluZCgnaScpO1xyXG4gICAgICAgIHZhciBsYWJlbCA9ICQodGhpcykubmV4dCgnc3BhbicpO1xyXG4gICAgICAgIGJ1dHRvbi50b2dnbGVDbGFzcygnZmEtY2hlY2stc3F1YXJlJykudG9nZ2xlQ2xhc3MoJ2ZhLXNxdWFyZS1vJyk7XHJcbiAgICAgICAgbGFiZWwudG9nZ2xlQ2xhc3MoJ3RvZG8tY29tcGxldGVkJyk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIC8vIE1pbmltYWxpemUgbWVudVxyXG4gICAgJCgnLm5hdmJhci1taW5pbWFsaXplJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoXCJib2R5XCIpLnRvZ2dsZUNsYXNzKFwibWluaS1uYXZiYXJcIik7XHJcbiAgICAgICAgU21vb3RobHlNZW51KCk7XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gVG9vbHRpcHMgZGVtb1xyXG4gICAgJCgnLnRvb2x0aXAtZGVtbycpLnRvb2x0aXAoe1xyXG4gICAgICAgIHNlbGVjdG9yOiBcIltkYXRhLXRvZ2dsZT10b29sdGlwXVwiLFxyXG4gICAgICAgIGNvbnRhaW5lcjogXCJib2R5XCJcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLyBGdWxsIGhlaWdodCBvZiBzaWRlYmFyXHJcbiAgICBmdW5jdGlvbiBmaXhfaGVpZ2h0KCkge1xyXG4gICAgICAgIHZhciBoZWlnaHRXaXRob3V0TmF2YmFyID0gJChcImJvZHkgPiAjd3JhcHBlclwiKS5oZWlnaHQoKSAtIDYxO1xyXG4gICAgICAgICQoXCIuc2lkZWJhcmQtcGFuZWxcIikuY3NzKFwibWluLWhlaWdodFwiLCBoZWlnaHRXaXRob3V0TmF2YmFyICsgXCJweFwiKTtcclxuXHJcbiAgICAgICAgdmFyIG5hdmJhckhlaWdoID0gJCgnbmF2Lm5hdmJhci1kZWZhdWx0JykuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHdyYXBwZXJIZWlnaCA9ICQoJyNwYWdlLXdyYXBwZXInKS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgaWYgKG5hdmJhckhlaWdoID4gd3JhcHBlckhlaWdoKSB7XHJcbiAgICAgICAgICAgICQoJyNwYWdlLXdyYXBwZXInKS5jc3MoXCJtaW4taGVpZ2h0XCIsIG5hdmJhckhlaWdoICsgXCJweFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChuYXZiYXJIZWlnaCA8IHdyYXBwZXJIZWlnaCkge1xyXG4gICAgICAgICAgICAkKCcjcGFnZS13cmFwcGVyJykuY3NzKFwibWluLWhlaWdodFwiLCAkKHdpbmRvdykuaGVpZ2h0KCkgKyBcInB4XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCQoJ2JvZHknKS5oYXNDbGFzcygnZml4ZWQtbmF2JykpIHtcclxuICAgICAgICAgICAgaWYgKG5hdmJhckhlaWdoID4gd3JhcHBlckhlaWdoKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcjcGFnZS13cmFwcGVyJykuY3NzKFwibWluLWhlaWdodFwiLCBuYXZiYXJIZWlnaCAtIDYwICsgXCJweFwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoJyNwYWdlLXdyYXBwZXInKS5jc3MoXCJtaW4taGVpZ2h0XCIsICQod2luZG93KS5oZWlnaHQoKSAtIDYwICsgXCJweFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZml4X2hlaWdodCgpO1xyXG5cclxuICAgIC8vIEZpeGVkIFNpZGViYXJcclxuICAgICQod2luZG93KS5iaW5kKFwibG9hZFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCQoXCJib2R5XCIpLmhhc0NsYXNzKCdmaXhlZC1zaWRlYmFyJykpIHtcclxuICAgICAgICAgICAgJCgnLnNpZGViYXItY29sbGFwc2UnKS5zbGltU2Nyb2xsKHtcclxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAgICAgICAgICAgICAgcmFpbE9wYWNpdHk6IDAuOVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBNb3ZlIHJpZ2h0IHNpZGViYXIgdG9wIGFmdGVyIHNjcm9sbFxyXG4gICAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCQod2luZG93KS5zY3JvbGxUb3AoKSA+IDAgJiYgISQoJ2JvZHknKS5oYXNDbGFzcygnZml4ZWQtbmF2JykpIHtcclxuICAgICAgICAgICAgJCgnI3JpZ2h0LXNpZGViYXInKS5hZGRDbGFzcygnc2lkZWJhci10b3AnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKCcjcmlnaHQtc2lkZWJhcicpLnJlbW92ZUNsYXNzKCdzaWRlYmFyLXRvcCcpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgICQod2luZG93KS5iaW5kKFwibG9hZCByZXNpemUgc2Nyb2xsXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoISQoXCJib2R5XCIpLmhhc0NsYXNzKCdib2R5LXNtYWxsJykpIHtcclxuICAgICAgICAgICAgZml4X2hlaWdodCgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgICQoXCJbZGF0YS10b2dnbGU9cG9wb3Zlcl1cIilcclxuICAgICAgICAucG9wb3ZlcigpO1xyXG5cclxuICAgIC8vIEFkZCBzbGltc2Nyb2xsIHRvIGVsZW1lbnRcclxuICAgICQoJy5mdWxsLWhlaWdodC1zY3JvbGwnKS5zbGltc2Nyb2xsKHtcclxuICAgICAgICBoZWlnaHQ6ICcxMDAlJ1xyXG4gICAgfSlcclxuXHJcbiAgICAkKCdhW2lnbm9yZS1jbGlja10nKS5jbGljayhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfSlcclxufSk7XHJcblxyXG5cclxuLy8gTWluaW1hbGl6ZSBtZW51IHdoZW4gc2NyZWVuIGlzIGxlc3MgdGhhbiA3NjhweFxyXG4kKHdpbmRvdykuYmluZCgncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKCQodGhpcykud2lkdGgoKSA8IDc2OSkge1xyXG4gICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnYm9keS1zbWFsbCcpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnYm9keS1zbWFsbCcpXHJcbiAgICB9XHJcbn0pO1xyXG5cclxuLy8gTG9jYWwgU3RvcmFnZSBmdW5jdGlvbnNcclxuLy8gU2V0IHByb3BlciBib2R5IGNsYXNzIGFuZCBwbHVnaW5zIGJhc2VkIG9uIHVzZXIgY29uZmlndXJhdGlvblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAobG9jYWxTdG9yYWdlU3VwcG9ydCgpKSB7XHJcblxyXG4gICAgICAgIHZhciBjb2xsYXBzZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiY29sbGFwc2VfbWVudVwiKTtcclxuICAgICAgICB2YXIgZml4ZWRzaWRlYmFyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJmaXhlZHNpZGViYXJcIik7XHJcbiAgICAgICAgdmFyIGZpeGVkbmF2YmFyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJmaXhlZG5hdmJhclwiKTtcclxuICAgICAgICB2YXIgYm94ZWRsYXlvdXQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImJveGVkbGF5b3V0XCIpO1xyXG4gICAgICAgIHZhciBmaXhlZGZvb3RlciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZml4ZWRmb290ZXJcIik7XHJcblxyXG4gICAgICAgIHZhciBib2R5ID0gJCgnYm9keScpO1xyXG5cclxuICAgICAgICBpZiAoZml4ZWRzaWRlYmFyID09ICdvbicpIHtcclxuICAgICAgICAgICAgYm9keS5hZGRDbGFzcygnZml4ZWQtc2lkZWJhcicpO1xyXG4gICAgICAgICAgICAkKCcuc2lkZWJhci1jb2xsYXBzZScpLnNsaW1TY3JvbGwoe1xyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgICAgICAgICAgICAgICByYWlsT3BhY2l0eTogMC45XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNvbGxhcHNlID09ICdvbicpIHtcclxuICAgICAgICAgICAgaWYgKGJvZHkuaGFzQ2xhc3MoJ2ZpeGVkLXNpZGViYXInKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFib2R5Lmhhc0NsYXNzKCdib2R5LXNtYWxsJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBib2R5LmFkZENsYXNzKCdtaW5pLW5hdmJhcicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFib2R5Lmhhc0NsYXNzKCdib2R5LXNtYWxsJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBib2R5LmFkZENsYXNzKCdtaW5pLW5hdmJhcicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGZpeGVkbmF2YmFyID09ICdvbicpIHtcclxuICAgICAgICAgICAgJChcIi5uYXZiYXItc3RhdGljLXRvcFwiKS5yZW1vdmVDbGFzcygnbmF2YmFyLXN0YXRpYy10b3AnKS5hZGRDbGFzcygnbmF2YmFyLWZpeGVkLXRvcCcpO1xyXG4gICAgICAgICAgICBib2R5LmFkZENsYXNzKCdmaXhlZC1uYXYnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChib3hlZGxheW91dCA9PSAnb24nKSB7XHJcbiAgICAgICAgICAgIGJvZHkuYWRkQ2xhc3MoJ2JveGVkLWxheW91dCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGZpeGVkZm9vdGVyID09ICdvbicpIHtcclxuICAgICAgICAgICAgJChcIi5mb290ZXJcIikuYWRkQ2xhc3MoJ2ZpeGVkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuXHJcbi8vIGNoZWNrIGlmIGJyb3dzZXIgc3VwcG9ydCBIVE1MNSBsb2NhbCBzdG9yYWdlXHJcbmZ1bmN0aW9uIGxvY2FsU3RvcmFnZVN1cHBvcnQoKSB7XHJcbiAgICByZXR1cm4gKCgnbG9jYWxTdG9yYWdlJyBpbiB3aW5kb3cpICYmIHdpbmRvd1snbG9jYWxTdG9yYWdlJ10gIT09IG51bGwpXHJcbn1cclxuXHJcbi8vIEZvciBkZW1vIHB1cnBvc2UgLSBhbmltYXRpb24gY3NzIHNjcmlwdFxyXG5mdW5jdGlvbiBhbmltYXRpb25Ib3ZlcihlbGVtZW50LCBhbmltYXRpb24pIHtcclxuICAgIGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xyXG4gICAgZWxlbWVudC5ob3ZlcihcclxuICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ2FuaW1hdGVkICcgKyBhbmltYXRpb24pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvL3dhaXQgZm9yIGFuaW1hdGlvbiB0byBmaW5pc2ggYmVmb3JlIHJlbW92aW5nIGNsYXNzZXNcclxuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcygnYW5pbWF0ZWQgJyArIGFuaW1hdGlvbik7XHJcbiAgICAgICAgICAgIH0sIDIwMDApO1xyXG4gICAgICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBTbW9vdGhseU1lbnUoKSB7XHJcbiAgICBpZiAoISQoJ2JvZHknKS5oYXNDbGFzcygnbWluaS1uYXZiYXInKSB8fCAkKCdib2R5JykuaGFzQ2xhc3MoJ2JvZHktc21hbGwnKSkge1xyXG4gICAgICAgIC8vIEhpZGUgbWVudSBpbiBvcmRlciB0byBzbW9vdGhseSB0dXJuIG9uIHdoZW4gbWF4aW1pemUgbWVudVxyXG4gICAgICAgICQoJyNzaWRlLW1lbnUnKS5oaWRlKCk7XHJcbiAgICAgICAgLy8gRm9yIHNtb290aGx5IHR1cm4gb24gbWVudVxyXG4gICAgICAgIHNldFRpbWVvdXQoXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICQoJyNzaWRlLW1lbnUnKS5mYWRlSW4oNDAwKTtcclxuICAgICAgICAgICAgfSwgMjAwKTtcclxuICAgIH0gZWxzZSBpZiAoJCgnYm9keScpLmhhc0NsYXNzKCdmaXhlZC1zaWRlYmFyJykpIHtcclxuICAgICAgICAkKCcjc2lkZS1tZW51JykuaGlkZSgpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICQoJyNzaWRlLW1lbnUnKS5mYWRlSW4oNDAwKTtcclxuICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gUmVtb3ZlIGFsbCBpbmxpbmUgc3R5bGUgZnJvbSBqcXVlcnkgZmFkZUluIGZ1bmN0aW9uIHRvIHJlc2V0IG1lbnUgc3RhdGVcclxuICAgICAgICAkKCcjc2lkZS1tZW51JykucmVtb3ZlQXR0cignc3R5bGUnKTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gRHJhZ2FibGUgcGFuZWxzXHJcbmZ1bmN0aW9uIFdpbk1vdmUoKSB7XHJcbiAgICB2YXIgZWxlbWVudCA9IFwiW2NsYXNzKj1jb2xdXCI7XHJcbiAgICB2YXIgaGFuZGxlID0gXCIuaWJveC10aXRsZVwiO1xyXG4gICAgdmFyIGNvbm5lY3QgPSBcIltjbGFzcyo9Y29sXVwiO1xyXG4gICAgJChlbGVtZW50KS5zb3J0YWJsZShcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGhhbmRsZTogaGFuZGxlLFxyXG4gICAgICAgICAgICBjb25uZWN0V2l0aDogY29ubmVjdCxcclxuICAgICAgICAgICAgdG9sZXJhbmNlOiAncG9pbnRlcicsXHJcbiAgICAgICAgICAgIGZvcmNlUGxhY2Vob2xkZXJTaXplOiB0cnVlLFxyXG4gICAgICAgICAgICBvcGFjaXR5OiAwLjhcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5kaXNhYmxlU2VsZWN0aW9uKCk7XHJcbn1cclxuXHJcblxyXG4iLCJhbmd1bGFyLm1vZHVsZSgnaW5zcGluaWEnLCBbXSk7XHJcblxyXG5cclxuXHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnaW5zcGluaWEnKS5ydW4oZnVuY3Rpb24oJHJvb3RTY29wZSwgJHRpbWVvdXQpIHtcclxuICAgICRyb290U2NvcGUuJG9uKCdmbGFzaE1lc3NhZ2UnLCBmdW5jdGlvbihldmVudCwgYXJncykge1xyXG4gICAgICAgICRyb290U2NvcGUuZmxhc2hNZXNzYWdlID0gYXJncztcclxuICAgICAgICAkcm9vdFNjb3BlLmZsYXNoTWVzc2FnZVNob3cgPSB0cnVlO1xyXG4gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLmZsYXNoTWVzc2FnZVNob3cgPSBmYWxzZTtcclxuICAgICAgICB9LCAzMDAwKTtcclxuICAgIH0pO1xyXG59KTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnaW5zcGluaWEnKVxyXG4gICAgLmRpcmVjdGl2ZSgnaW5zcFdyYXBwZXInLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IGlkPVwid3JhcHBlclwiIG5nLWNsb2FrIG5nLXRyYW5zY2x1ZGU+PC9kaXY+JyxcclxuICAgICAgICB9XHJcblxyXG4gICAgfSk7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnaW5zcGluaWEnKVxyXG4gICAgLmRpcmVjdGl2ZSgnaW5zcFNpZGVOYXZpZ2F0aW9uJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXHJcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPG5hdiBjbGFzcz1cIm5hdmJhci1kZWZhdWx0IG5hdmJhci1zdGF0aWMtc2lkZVwiIHJvbGU9XCJuYXZpZ2F0aW9uXCIgbmctY2xvYWs+JyArXHJcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInNpZGViYXItY29sbGFwc2VcIiBuZy10cmFuc2NsdWRlPicgK1xyXG4gICAgICAgICAgICAgICAgJzwvZGl2PjwvbmF2PidcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnaW5zcGluaWEnKVxyXG4gICAgLmRpcmVjdGl2ZSgnaW5zcFRvcE5hdmlnYXRpb24nLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwicm93XCI+JyArXHJcbiAgICAgICAgICAgICAgICAnPG5hdiBjbGFzcz1cIm5hdmJhciBuYXZiYXItc3RhdGljLXRvcFwiIHJvbGU9XCJuYXZpZ2F0aW9uXCIgbmctdHJhbnNjbHVkZT4nICtcclxuICAgICAgICAgICAgICAgICc8L25hdj48L2Rpdj4nLFxyXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbSwgYXR0cnMpIHtcclxuICAgICAgICAgICAgICAgIGVsZW0uZmluZCgnLm5hdmJhci1taW5pbWFsaXplJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcImJvZHlcIikudG9nZ2xlQ2xhc3MoXCJtaW5pLW5hdmJhclwiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2luc3BpbmlhJylcclxuICAgIC5kaXJlY3RpdmUoJ2luc3BQYWdlJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXHJcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGRpdiBpZD1cInBhZ2Utd3JhcHBlclwiIG5nLXRyYW5zY2x1ZGU+PC9kaXY+J1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdpbnNwaW5pYScpXHJcbiAgICAuZGlyZWN0aXZlKCdpbnNwSGVhZGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwicm93IHdyYXBwZXIgcGFnZS1oZWFkaW5nXCIgbmctdHJhbnNjbHVkZT48L2Rpdj4nXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnaW5zcGluaWEnKVxyXG4gICAgLmRpcmVjdGl2ZSgnaW5zcEhlYWRlclRpdGxlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8aDIgbmctdHJhbnNjbHVkZT48L2gyPidcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdpbnNwaW5pYScpXHJcbiAgICAuZGlyZWN0aXZlKCdpbnNwRm9vdGVyJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXHJcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImZvb3RlclwiIG5nLXRyYW5zY2x1ZGU+PC9kaXY+J1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnaW5zcGluaWEnKVxyXG4gICAgLmRpcmVjdGl2ZSgnaW5zcENvbnRlbnQnLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwid3JhcHBlciB3cmFwcGVyLWNvbnRlbnRcIiBuZy10cmFuc2NsdWRlPjwvZGl2PidcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnaW5zcGluaWEnKVxyXG4gICAgLmRpcmVjdGl2ZSgnbWV0aXNNZW51JywgZnVuY3Rpb24oJHRpbWVvdXQpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8dWwgY2xhc3M9XCJuYXYgbWV0aXNtZW51XCIgaWQ9XCJzaWRlLW1lbnVcIiBuZy10cmFuc2NsdWRlPjwvdWw+JyxcclxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQubWV0aXNNZW51KCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdpbnNwaW5pYScpXHJcbiAgICAuZGlyZWN0aXZlKCdtZXRpc0l0ZW0nLCBmdW5jdGlvbigkdGltZW91dCkge1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxsaSBuZy10cmFuc2NsdWRlPjwvbGk+J1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdpbnNwaW5pYScpXHJcbiAgICAuZGlyZWN0aXZlKCdpYm94JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwiaWJveFwiIG5nLXRyYW5zY2x1ZGU+IDwvZGl2PicsXHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2luc3BpbmlhJylcclxuICAgIC5kaXJlY3RpdmUoJ2lib3hIZWFkZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJpYm94LXRpdGxlXCIgbmctdHJhbnNjbHVkZT4gPC9kaXY+J1xyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdpbnNwaW5pYScpXHJcbiAgICAuZGlyZWN0aXZlKCdpYm94VGl0bGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxoNSBuZy10cmFuc2NsdWRlPiA8L2g1PidcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdpbnNwaW5pYScpXHJcbiAgICAuZGlyZWN0aXZlKCdpYm94Q29udGVudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXHJcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImlib3gtY29udGVudFwiIG5nLXRyYW5zY2x1ZGU+IDwvZGl2PidcclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnaW5zcGluaWEnKVxyXG4gICAgLmRpcmVjdGl2ZSgnaWJveFRvb2xzJywgZnVuY3Rpb24oJHRpbWVvdXQpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJpYm94LXRvb2xzXCIgbmctdHJhbnNjbHVkZT48L2Rpdj4nLFxyXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCBhdHRycykge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBjb2xsYXBzYWJsZSA9ICRzY29wZS4kZXZhbChhdHRycy5pYm94Q29sbGFwc2FibGUpIHx8IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNsb3NhYmxlID0gJHNjb3BlLiRldmFsKGF0dHJzLmlib3hDbG9zYWJsZSkgfHwgZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29sbGFwc2VkID0gJHNjb3BlLiRldmFsKGF0dHJzLmlib3hDb2xsYXBzZWQpIHx8IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbGxhcHNhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbGxhcHNlID0gYW5ndWxhci5lbGVtZW50KCc8YT48aSBjbGFzcz1cImZhIGZhLWNoZXZyb24tdXBcIj48L2k+PC9hPicpO1xyXG4gICAgICAgICAgICAgICAgICAgICRlbGVtZW50LmFwcGVuZChjb2xsYXBzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sbGFwc2UuYmluZCgnY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3Jlc2l6ZUNvbnRlbnQoMjAwLCA1MCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNsb3NhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNsb3NlID0gYW5ndWxhci5lbGVtZW50KCc8YT48aSBjbGFzcz1cImZhIGZhLXRpbWVzXCI+PC9pPjwvYT4nKTtcclxuICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5hcHBlbmQoY2xvc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlLmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpYm94ID0gJGVsZW1lbnQuY2xvc2VzdCgnZGl2Lmlib3gnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWJveC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY29sbGFwc2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9yZXNpemVDb250ZW50KDEwLCAxMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIF9yZXNpemVDb250ZW50ID0gZnVuY3Rpb24oc2xpZGVUb2dnbGUsIHRpbWVvdXQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaWJveCA9ICRlbGVtZW50LmNsb3Nlc3QoJ2Rpdi5pYm94Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGljb24gPSAkZWxlbWVudC5maW5kKCdpOmZpcnN0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBpYm94LmZpbmQoJ2Rpdi5pYm94LWNvbnRlbnQnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50LnNsaWRlVG9nZ2xlKHNsaWRlVG9nZ2xlKTtcclxuICAgICAgICAgICAgICAgICAgICBpY29uLnRvZ2dsZUNsYXNzKCdmYS1jaGV2cm9uLXVwJykudG9nZ2xlQ2xhc3MoJ2ZhLWNoZXZyb24tZG93bicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlib3gudG9nZ2xlQ2xhc3MoJycpLnRvZ2dsZUNsYXNzKCdib3JkZXItYm90dG9tJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlib3gucmVzaXplKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlib3guZmluZCgnW2lkXj1tYXAtXScpLnJlc2l6ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIHRpbWVvdXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdpbnNwaW5pYScpXHJcbiAgICAuZGlyZWN0aXZlKCdpYm94Rm9vdGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwiaWJveC1mb290ZXJcIiBuZy10cmFuc2NsdWRlPjwvZGl2PidcclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnaW5zcGluaWEnKVxyXG4gICAgLmRpcmVjdGl2ZSgnZmxhc2hNZXNzYWdlJywgZnVuY3Rpb24oJHJvb3RTY29wZSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGRpdiBpZD1cImZsYXNoLW1lc3NhZ2VcIiBuZy1zaG93PVwiJHJvb3QuZmxhc2hNZXNzYWdlU2hvd1wiIGNsYXNzPVwie3sgJHJvb3QuZmxhc2hNZXNzYWdlLnR5cGUgfX1cIj4nICtcclxuICAgICAgICAgICAgICAgICc8c3Bhbj57eyAkcm9vdC5mbGFzaE1lc3NhZ2UuY29udGVudCB9fTwvc3Bhbj4nICtcclxuICAgICAgICAgICAgICAgICc8YSBjbGFzcz1cImNsb3NlLWJ1dHRvblwiIG5nLWNsaWNrPVwiJHJvb3QuZmxhc2hNZXNzYWdlU2hvdyA9IGZhbHNlXCIgaHJlZj1cIlwiPiZ0aW1lczs8L2E+JyArXHJcbiAgICAgICAgICAgICAgICAnPC9kaXY+JyxcclxuICAgICAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgICAgIGZsYXNoTWVzc2FnZTogJz0nXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4vKipcclxuICogQG5nZG9jIGRpcmVjdGl2ZVxyXG4gKiBAbmFtZSBpbnNCcmVhZGNydW1cclxuICogQG1vZHVsZSBpbnNwaW5pYVxyXG4gKlxyXG4gKiBAZWxlbWVudCBBTllcclxuICogXHJcbiAqIEBkZXNjcmlwdGlvblxyXG4gKlxyXG4gKiBVc2UgdGhpcyBkaXJlY3RpdmUgdG8gY3JlYXRlIGEgQnJlYWRjcnVtLlxyXG4gKlxyXG4gKiBCcmVhZGNydW0gaXMgYSBwYXRoIGZvciBuYXZpZ2F0aW9uLiBUaGlzIGVsZW1lbnQgaGVscCB5b3UgdG8gbmF2aWdhdGUgYmV0dGVyLlxyXG4gKlxyXG4gKiBAZXhhbXBsZTpcclxuICogVGhpcyBleGFtcGxlIHNob3dzIGhvdyB0byB1c2UgYGJyZWFkY3J1bWAgdGFnLlxyXG4gICBgYGBodG1sXHJcbiAgICA8aW5zcC1icmVhZGNydW1iPlxyXG4gICAgICAgIDxpbnNwLWJyZWFkY3J1bWItaXRlbSB1aS1zcmVmPVwiaXRlbXMubGlzdFwiPkl0ZW1zPC9pbnNwLWJyZWFkY3J1bWItaXRlbT5cclxuICAgICAgICA8aW5zcC1icmVhZGNydW1iLWl0ZW0gaXRlbS1hY3RpdmU9XCJ0cnVlXCI+e3sgaXRlbS5uYW1lIH19PC9pbnNwLWJyZWFkY3J1bWItaXRlbT5cclxuICAgIDwvaW5zcC1icmVhZGNydW1iPlxyXG4gICBgYGBcclxuICpcclxuICovXHJcbmFuZ3VsYXIubW9kdWxlKCdpbnNwaW5pYScpXHJcbiAgICAuZGlyZWN0aXZlKCdpbnNwQnJlYWRjcnVtYicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXHJcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPG9sIGNsYXNzPVwiYnJlYWRjcnVtYlwiIG5nLXRyYW5zY2x1ZGU+PC9vbD4nXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIC5kaXJlY3RpdmUoJ2luc3BCcmVhZGNydW1iSXRlbScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXHJcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGxpPjxhIG5nLXRyYW5zY2x1ZGU+PC9hPjwvbGk+JyxcclxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYWN0aXZlID0gJGF0dHJzLml0ZW1BY3RpdmUgfHwgZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgkKCc8c3Ryb25nPjwvc3Ryb25nPicpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCRlbGVtZW50LmNoaWxkcmVuKCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4vKipcclxuKiBAbmdkb2MgZGlyZWN0aXZlXHJcbiogQG5hbWUgaW5zTW9kYWxcclxuKiBAbW9kdWxlIGluc3BpbmlhXHJcbipcclxuKiBAZWxlbWVudCBBTllcclxuKiBcclxuKiBAZGVzY3JpcHRpb25cclxuKlxyXG4qIFVzZSB0aGlzIGRpcmVjdGl2ZSB0byBjcmVhdGUgYSBNb2RhbCBQYW5lbFxyXG4qXHJcbipcclxuKiBAZXhhbXBsZTpcclxuICogVGhpcyBleGFtcGxlIHNob3dzIGhvdyB0byB1c2UgYG1vZGFsYCB0YWcuXHJcbiAgIGBgYGh0bWxcclxuICAgIDxidXR0b24gaW5zcC1tb2RhbC1vcGVuPVwiI215TW9kYWxcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPlJlbW92ZSBpdGVtPC9idXR0b24+XHJcbiAgICBcclxuICAgIC4uLlxyXG5cclxuICAgIDxpbnNwLW1vZGFsIGlkPVwibXlNb2RhbFwiLz5cclxuICAgICAgICA8aW5zcC1tb2RhbC1oZWFkZXI+UmVtb3ZlIGl0ZW08L2luc3AtbW9kYWwtaGVhZGVyPlxyXG4gICAgICAgIDxpbnNwLW1vZGFsLWJvZHk+QXJlIHlvdSBzdXJlIHRvIHJlbW92ZSBpdGVtPzwvaW5zcC1tb2RhbC1ib2R5PlxyXG4gICAgICAgIDxpbnNwLW1vZGFsLWZvb3RlciBjbGFzcz1cInRleHQtcmlnaHRcIj5cclxuICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+Tm88L2J1dHRvbj5cclxuICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIG5nLWNsaWNrPVwicmVtb3ZlSXRlbSgpXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj5ZZXM8L2J1dHRvbj5cclxuICAgICAgICA8L2luc3AtbW9kYWwtZm9vdGVyPlxyXG4gICAgPC9pbnNwLW1vZGFsPlxyXG4gICBgYGBcclxuICpcclxuICovXHJcbmFuZ3VsYXIubW9kdWxlKCdpbnNwaW5pYScpXHJcbiAgICAuZGlyZWN0aXZlKCdpbnNwTW9kYWwnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJtb2RhbFwiIHJvbGU9XCJkaWFsb2dcIj4nICtcclxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nXCI+JyArXHJcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIiBuZy10cmFuc2NsdWRlPicgK1xyXG4gICAgICAgICAgICAgICAgJzwvZGl2PjwvZGl2PjwvZGl2PicsXHJcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFuaW1hdGlvbiA9ICRhdHRycy5tb2RhbEFuaW1hdGlvbiB8fCAnZmFkZSc7XHJcbiAgICAgICAgICAgICAgICAkZWxlbWVudC5hZGRDbGFzcyhhbmltYXRpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbiAgICAuZGlyZWN0aXZlKCdpbnNwTW9kYWxIZWFkZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj48aDUgbmctdHJhbnNjbHVkZT48L2g1PjwvZGl2PidcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxuICAgIC5kaXJlY3RpdmUoJ2luc3BNb2RhbEJvZHknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCIgbmctdHJhbnNjbHVkZT48L2Rpdj4nXHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbiAgICAuZGlyZWN0aXZlKCdpbnNwTW9kYWxGb290ZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIiBuZy10cmFuc2NsdWRlPjwvZGl2PidcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxuICAgIC5kaXJlY3RpdmUoJ2luc3BNb2RhbE9wZW4nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBtb2RhbElkID0gJGF0dHJzLmluc3BNb2RhbE9wZW47XHJcbiAgICAgICAgICAgICAgICBpZiAobW9kYWxJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRlbGVtZW50LmF0dHIoXCJkYXRhLXRvZ2dsZVwiLCBcIm1vZGFsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRlbGVtZW50LmF0dHIoXCJkYXRhLXRhcmdldFwiLCBtb2RhbElkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxuIl19
