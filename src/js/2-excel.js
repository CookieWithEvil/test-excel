//declare excel class
var Excel = React.createClass({
	displayName: 'Excel',
	mixins: [operations],
	getInitialState: function() {
		return {
			values: this.props.values,
			edit: null,
		};
	},
	_focusInput: function(event){
		this.setState({edit: {
			row: event.target.parentElement.parentElement.rowIndex,
			cell: event.target.parentElement.cellIndex,
		}});
	},
	_blurInput: function(event){
		event.preventDefault();
		var input = event.target;
		var data = this.state.values.slice();
		data[this.state.edit.row][this.state.edit.cell] = input.value;
		var res = this.identifyOperation(input.value);
		input.value = res;
		if(!this.noErrors){
			input.style.color = "red";
		}else{
			input.style.color = "black";
		}
		this.setState({
			edit: null,
			values: values,
			result: "",
		});


		console.log(this.props.values);
	},
	render: function(){
		return (
			React.DOM.table(null,
				React.DOM.thead(null,
					React.DOM.tr({id : "head-row"},
						this.props.horisontalHeaders.map(function(title, jColl){
							if(jColl === 0) return React.DOM.th({key: jColl}, "");
							else return React.DOM.th({key: jColl+1}, title);
						})
					)
				),
				React.DOM.tbody({onFocus: this._focusInput, onBlur: this._blurInput,
												 onKeyPress: this._enter},
					this.props.values.map(function(title, iRow){
						return React.DOM.tr({key: iRow},
							this.values[iRow].map(function(title, jColl){
								if(jColl === 0){
									return React.DOM.th({key: 0}, title);
								}else{
									return React.DOM.td({key: jColl},
											React.DOM.input({
												type: 'text',
											})
									);
								}
							})
						)
					})
				)
			)
		);
	}

});


////
ReactDOM.render(
	React.createElement(Excel, {
		horisontalHeaders: horisontalHeaders,
		values: values
	}),
	document.getElementById("app")
);
