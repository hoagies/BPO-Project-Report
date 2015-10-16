Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
	launch: function() {
		
		this.add({
			xtype: 'rallycombobox',
			width: 600,
			fieldLabel: 'Select Initiative:',
			// Display Template
			displayTpl: Ext.create('Ext.XTemplate','<tpl for=".">','{FormattedID} - {Name}','</tpl>'),
			// List Template
			tpl: Ext.create('Ext.XTemplate','<tpl for=".">','<div class="x-boundlist-item">{FormattedID} - {Name}</div>','</tpl>'),
			storeConfig: {
				autoLoad: true,
				model: 'PortfolioItem/Initiative',
				fetch: ['FormattedID', 'Name'],
				sorters: [
					{
						property: 'ObjectID',
						direction: 'ASC'
					}
				],
				remoteGroup: false,
				remoteSort: false,
				remoteFilter: false,
				limit: Infinity
			},
			// stateful: false,
			listeners: {
				select: this._onSelect,
				ready: this._onLoad,
				scope: this
			}
		});
	},
		
	_onLoad: function() {
		this.add({
			xtype: 'rallycardboard',
			width: '99%',
			types: ['PortfolioItem/Feature'],
			attribute: 'State',
			readOnly: true,
			context: this.getContext(),
			storeConfig: {
				filters: [this._getFilter()]
			},
			columnConfig: {
				plugins: [
					{ptype: 'rallycolumncardcounter'}
				]
			},
			cardConfig: {
				showIconsAndHighlightBorder: false,
				editable: false,
				fields: ['PercentDoneByStoryCount'],
				showAge: true
			}
			// rowConfig: {
				// field: 'Owner'
			// }
		});
	},
	
	_onSelect: function() {
		var board = this.down('rallycardboard');
		board.refresh({
			storeConfig: {
				filters: [this._getFilter()]
			}
		});
	},
		
	_getFilter: function() {
		var combo = this.down('rallycombobox');
		return {
			property: 'Parent.Parent',
			operator: '=',
			value: combo.getValue()
		};
	}

});