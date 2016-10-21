var React = require('react');
var FileDrop = require("react-file-drop");
var dragDrop = require('drag-drop/buffer');

var Item = React.createClass({

    clicked: function() {

        Respeer.select(this.props.name);
    },
    render: function() {
        var UserName = (
            <b>{this.props.name}</b>
        );
        if (this.props.isuser) {
            UserName = (
                <b className='fz++'>[{this.props.name}]</b>
            )
        }
        var linked = this.props.linked
            ? (
                <i>linked</i>
            )
            : (
                <i>not linked</i>
            );
        return (

            <div className="grid-item 2/12">
                <div className="box" onClick={this.clicked}>
                    {UserName}<br/> {linked}<br/>
                    <br/>{this.props.content}</div>
            </div>

        );
    }
});

var ItemForm = React.createClass({
    getInitialState: function() {
        return {inputValue: '', imgsrc: ''};
    },
    delClicked: function() {

        Respeer.delItem(this.props.name);
        Respeer.select(null);
    },
    componentDidMount: function() {
        this.refs.itemInput.focus();
        var self = this;
        dragDrop('#currentBox', function(files) {
            files.forEach(function(file) {
                // file is actually a buffer!
                var t = (file.type).split('/')[0].toLowerCase();
                if (t == 'image') {
                    var src = "data:" + file.type + ";base64," + file.toString('base64');
                    Respeer.sendMsg(self.props.name, {
                        type: 'image',
                        content: src
                    });
                }
                // but it still has all the normal file properties!
                console.log(file.name)
                console.log(file.size)
                console.log(file.type)
                console.log(file.lastModifiedDate)
            })
        })
    },
    handleFileDrop: function(files, event) {
        console.log("DRAG");
        console.log(files, event);
    },

    onChangeInput: function(e) {
        this.setState({
            inputValue: e.target.value.substring(0, 64)
        });
    },
    handleSubmit: function(e) {
        e.preventDefault();
        e.stopPropagation();
        Respeer.sendMsg(this.props.name, {
            type: 'text',
            content: this.state.inputValue
        });
        this.setState({inputValue: ''});
        //Respeer.select(null);
        //this.props.onSubmit(this.state.inputValue.trim());
        //this.setState({inputValue: ''});
    },
    render: function() {
        var linked = this.props.linked
            ? (
                <i>linked</i>
            )
            : (
                <i>not linked</i>
            );
        return (

            <div className="grid-item 3/12">
                <img src={this.state.imgsrc}/>
                <div className="box" id="currentBox">
                    <span className="fr" onClick={this.delClicked}>{'\u274C'}</span>
                    <b>{this.props.name}</b><br/> {linked}<br/>
                    <br/>{this.props.content}<br/>
                    <div>
                        {this.props.messages.map(function(result, index) {
                            return (
                                <i key={index} className='db'>{result.content}</i>
                            )
                        }, this)}</div>

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
                    if (this.props.selected == result.name) {
                        return (<ItemForm key={result.id} isuser={result.name == this.props.user} name={result.name} content={result.content} messages={result.messages} linked={result.linked} index={index}/>);
                    } else {
                        return (<Item key={result.id} isuser={result.name == this.props.user} name={result.name} content={result.content} messages={result.messages} linked={result.linked} index={index}/>);
                    }
                }, this)}
            </div>

        );
    }

});
