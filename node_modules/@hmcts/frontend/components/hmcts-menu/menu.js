HMCTSFrontend.Menu = function(params) {
	this.container = params.container;
	this.menu = this.container.find('.hmcts-menu__wrapper');
	if(params.menuClasses) {
		this.menu.addClass(params.menuClasses);
	}
	this.menu.attr('role', 'menu');
	this.mq = params.mq;
	this.buttonText = params.buttonText;
	this.buttonClasses = params.buttonClasses || '';
	this.keys = { esc: 27, up: 38, down: 40, tab: 9 };
	this.menu.on('keydown', '[role=menuitem]', $.proxy(this, 'onButtonKeydown'));
	this.createToggleButton();
	this.setupResponsiveChecks();
	$(document).on('click', $.proxy(this, 'onDocumentClick'));
};

HMCTSFrontend.Menu.prototype.onDocumentClick = function(e) {
	if(!$.contains(this.container[0], e.target)) {
	  this.hideMenu();
  }
};

HMCTSFrontend.Menu.prototype.createToggleButton = function() {
	this.menuButton = $('<button class="govuk-button hmcts-menu__toggle-button ' + this.buttonClasses + '" type="button" aria-haspopup="true" aria-expanded="false">'+this.buttonText+'</button>');
	this.menuButton.on('click', $.proxy(this, 'onMenuButtonClick'));
	this.menuButton.on('keydown', $.proxy(this, 'onMenuKeyDown'));
};

HMCTSFrontend.Menu.prototype.setupResponsiveChecks = function() {
	this.mql = window.matchMedia(this.mq);
	this.mql.addListener($.proxy(this, 'checkMode'));
	this.checkMode(this.mql);
};

HMCTSFrontend.Menu.prototype.checkMode = function(mql) {
	if(mql.matches) {
		this.enableBigMode();
	} else {
		this.enableSmallMode();
	}
};

HMCTSFrontend.Menu.prototype.enableSmallMode = function() {
	this.container.prepend(this.menuButton);
	this.hideMenu();
	this.removeButtonClasses();
	this.menu.attr('role', 'menu');
	this.container.find('.hmcts-menu__item').attr('role', 'menuitem');
};

HMCTSFrontend.Menu.prototype.enableBigMode = function() {
	this.menuButton.detach();
	this.showMenu();
	this.addButtonClasses();
	this.menu.removeAttr('role');
	this.container.find('.hmcts-menu__item').removeAttr('role');
};

HMCTSFrontend.Menu.prototype.removeButtonClasses = function() {
	this.menu.find('.hmcts-menu__item').each(function(index, el) {
		if($(el).hasClass('hmcts-button--secondary')) {
			$(el).attr('data-secondary', 'true');
			$(el).removeClass('hmcts-button--secondary');
		}
		$(el).removeClass('govuk-button');
	});
};

HMCTSFrontend.Menu.prototype.addButtonClasses = function() {
	this.menu.find('.hmcts-menu__item').each(function(index, el) {
		if($(el).attr('data-secondary') == 'true') {
			$(el).addClass('hmcts-button--secondary');
		}
		$(el).addClass('govuk-button');
	});
};

HMCTSFrontend.Menu.prototype.hideMenu = function() {
	this.menuButton.attr('aria-expanded', 'false');
};

HMCTSFrontend.Menu.prototype.showMenu = function() {
	this.menuButton.attr('aria-expanded', 'true');
};

HMCTSFrontend.Menu.prototype.onMenuButtonClick = function() {
	this.toggle();
};

HMCTSFrontend.Menu.prototype.toggle = function() {
	if(this.menuButton.attr('aria-expanded') == 'false') {
		this.showMenu();
		this.menu.find('[role=menuitem]').first().focus();
	} else {
		this.hideMenu();
		this.menuButton.focus();
	}
};

HMCTSFrontend.Menu.prototype.onMenuKeyDown = function(e) {
	switch (e.keyCode) {
		case this.keys.down:
			this.toggle();
			break;
	}
};

HMCTSFrontend.Menu.prototype.onButtonKeydown = function(e) {
	switch (e.keyCode) {
		case this.keys.up:
			e.preventDefault();
			this.focusPrevious(e.currentTarget);
			break;
		case this.keys.down:
			e.preventDefault();
			this.focusNext(e.currentTarget);
			break;
		case this.keys.esc:
			if(!this.mq.matches) {
				this.menuButton.focus();
				this.hideMenu();
			}
			break;
		case this.keys.tab:
			if(!this.mq.matches) {
				this.hideMenu();
			}
	}
};

HMCTSFrontend.Menu.prototype.focusNext = function(currentButton) {
	var next = $(currentButton).next();
	if(next[0]) {
		next.focus();
	} else {
		this.container.find('[role=menutiem]').first().focus();
	}
};

HMCTSFrontend.Menu.prototype.focusPrevious = function(currentButton) {
	var prev = $(currentButton).prev();
	if(prev[0]) {
		prev.focus();
	} else {
		this.container.find('[role=menutiem]').last().focus();
	}
};