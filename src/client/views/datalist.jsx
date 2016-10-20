var React = require('react');

var Item = React.createClass({

    clicked: function() {

        Respeer.select(this.props.index);
    },
    render: function() {
      var UserName=(<b>{this.props.name}</b>);
      if(this.props.isuser){UserName=(<b className='fz++'>[{this.props.name}]</b>)}
        return (

            <div className="grid-item 2/12">
                <div className="box" onClick={this.clicked}>
                    {UserName}<br/>
                    <i className='fz--'>{this.props.sid}</i><br/>{this.props.content}</div>
            </div>

        );
    }
});

var ItemForm = React.createClass({
    getInitialState: function() {
        return {inputValue: this.props.content};
    },
    delClicked: function() {

        Respeer.delItem(this.props.name);
        Respeer.select(null);
    },
    componentDidMount: function() {
        this.refs.itemInput.focus();
    },

    onChangeInput: function(e) {
        this.setState({
            inputValue: e.target.value.substring(0, 64)
        });
    },
    handleSubmit: function(e) {
        e.preventDefault();
        e.stopPropagation();
        Respeer.updateItem(this.props.name, {content: this.state.inputValue});
        Respeer.select(null);
        //this.props.onSubmit(this.state.inputValue.trim());
        //this.setState({inputValue: ''});
    },
    render: function() {
        return (

            <div className="grid-item 3/12">
                <div className="box">
                    <span className="fr" onClick={this.delClicked}>{'\u274C'}</span>
                    <b>{this.props.name}</b><br/>
                    <i className='fz--'>{this.props.sid}</i><br/>
                    <form action="" onSubmit={this.handleSubmit}>
                        <input className="form-input" ref="itemInput" type="text" value={this.state.inputValue} onChange={this.onChangeInput}></input>
                    </form>
                </div>
            </div>

        );
    }
});

module.exports = React.createClass({
    getInitialState: function() {
        return {locked: false};
    },

    render: function() {
        return (

            <div id="datalist" className="bord">
                {this.props.items.map(function(result, index) {
                    if (this.props.selected === index) {
                        return (<ItemForm key={result.id} isuser={result.name==this.props.user} name={result.name} sid={result.sid} content={result.content} index={index}/>);
                    } else {
                        return (<Item key={result.id} isuser={result.name==this.props.user} name={result.name} sid={result.sid} content={result.content} index={index}/>);
                    }
                }, this)}
            </div>

        );
    }

});
