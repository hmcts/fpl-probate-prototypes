HMCTSFrontend.FilterToggleButton = function(options) {
  this.options = options;
  this.container = this.options.toggleButton.container;
  this.createToggleButton();
  this.setupResponsiveChecks();
  this.options.filter.container.attr('tabindex', '-1');
  if(this.options.startHidden) {
    this.hideMenu();
  }
};

HMCTSFrontend.FilterToggleButton.prototype.setupResponsiveChecks = function() {
  this.mq = window.matchMedia(this.options.bigModeMediaQuery);
  this.mq.addListener($.proxy(this, 'checkMode'));
  this.checkMode(this.mq);
};

HMCTSFrontend.FilterToggleButton.prototype.createToggleButton = function() {
  this.menuButton = $('<button class="govuk-button '+this.options.toggleButton.classes+'" type="button" aria-haspopup="true" aria-expanded="false">'+this.options.toggleButton.showText+'</button>');
  this.menuButton.on('click', $.proxy(this, 'onMenuButtonClick'));
  this.options.toggleButton.container.append(this.menuButton);
};

HMCTSFrontend.FilterToggleButton.prototype.checkMode = function(mq) {
  if(mq.matches) {
    this.enableBigMode();
  } else {
    this.enableSmallMode();
  }
};

HMCTSFrontend.FilterToggleButton.prototype.enableBigMode = function() {
  this.showMenu();
  this.removeCloseButton();
};

HMCTSFrontend.FilterToggleButton.prototype.enableSmallMode = function() {
  this.hideMenu();
  this.addCloseButton();
};

HMCTSFrontend.FilterToggleButton.prototype.addCloseButton = function() {
  if(this.options.closeButton) {
    this.closeButton = $('<button class="hmcts-filter__close" type="button">'+this.options.closeButton.text+'</button>');
    this.closeButton.on('click', $.proxy(this, 'onCloseClick'));
    this.options.closeButton.container.append(this.closeButton);
  }
};

HMCTSFrontend.FilterToggleButton.prototype.onCloseClick = function() {
  this.hideMenu();
  this.menuButton.focus();
};

HMCTSFrontend.FilterToggleButton.prototype.removeCloseButton = function() {
  if(this.closeButton) {
    this.closeButton.remove();
    this.closeButton = null;
  }
};

HMCTSFrontend.FilterToggleButton.prototype.hideMenu = function() {
  this.menuButton.attr('aria-expanded', 'false');
  this.options.filter.container.addClass('hmcts-hidden');
  this.menuButton.text(this.options.toggleButton.showText);
};

HMCTSFrontend.FilterToggleButton.prototype.showMenu = function() {
  this.menuButton.attr('aria-expanded', 'true');
  this.options.filter.container.removeClass('hmcts-hidden');
  this.menuButton.text(this.options.toggleButton.hideText);
};

HMCTSFrontend.FilterToggleButton.prototype.onMenuButtonClick = function() {
  this.toggle();
};

HMCTSFrontend.FilterToggleButton.prototype.toggle = function() {
  if(this.menuButton.attr('aria-expanded') == 'false') {
    this.showMenu();
    this.options.filter.container.focus();
  } else {
    this.hideMenu();
  }
};